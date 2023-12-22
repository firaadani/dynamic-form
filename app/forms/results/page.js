"use client";
import React, { useState, useEffect } from "react";
import { EyeOutlined } from "@ant-design/icons";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import _ from "lodash";
import TableComponent from "@/app/components/table/TableComponent";
import { formResultColumns } from "@/app/components/columns/formResultColums";
import { Popconfirm, Tooltip } from "antd";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

const ResultsPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const role = session?.user?.role;

  const [selectedData, setSelectedData] = useState({});

  const confirm = (e) => {
    showSuccess("Sukses", "Berhasil hapus user");
  };
  const cancel = (e) => {
    showError("Gagal", "Gagal hapus user");
  };

  const columns = [
    ...formResultColumns,
    {
      title: "Action",
      key: "action",
      render: (value, item) => {
        return (
          <div className="flex gap-2 items-center justify-center">
            {/* <Popconfirm
              title="Delete this user"
              description="Are you sure you want to delete this user?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              okButtonProps={{
                className: "bg-blue-500 text-white",
              }}
              cancelText="No"
            > */}
            <Tooltip title="View Form" className="cursor-pointer">
              <EyeOutlined
                onClick={() => {
                  if (role === "User") {
                    router.push(
                      `/forms/results/${item?.form_id}/view/${item?.user_id}`
                    );
                  } else {
                    router.push(`/forms/results/${item?.form_id}`);
                  }
                }}
              />
            </Tooltip>
            {/* </Popconfirm> */}
          </div>
        );
      },
    },
  ];

  const [formData, setFormData] = useState([]);

  const getForms = async ({ page, pageSize, setData }) => {
    try {
      let params = {
        page: page,
        row: pageSize,
        include: "forms",
      };
      let res = await axiosAuth.get(`api/dashboard/results`, {
        params,
      });
      // console.log("res :", { res });
      if (res.status === 200 || res?.data?.meta?.status === true) {
        setData(res?.data?.data);
        // console.log("data :", { res: res?.data?.data, withResults });
      }
    } catch (error) {
      console.log("error :", { error });
    }
  };

  return (
    <div className="m-4 p-10 bg-white rounded-xl drop-shadow-sm flex flex-col gap-4">
      <TableComponent session={session} fetch={getForms} columns={columns} />
    </div>
  );
};

export default ResultsPage;
