"use client";
import React, { useState, useEffect } from "react";
import { EyeOutlined } from "@ant-design/icons";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import _ from "lodash";
import TableComponent from "@/app/components/table/TableComponent";
import { formResultByIdColumns } from "@/app/components/columns/formResultColums";
import { Popconfirm, Tooltip } from "antd";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

const ResultsByIdPage = ({ params }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { form_id } = params;
  const axiosAuth = useAxiosAuth();

  const [selectedData, setSelectedData] = useState({});

  const confirm = (e) => {
    showSuccess("Sukses", "Berhasil hapus user");
  };
  const cancel = (e) => {
    showError("Gagal", "Gagal hapus user");
  };

  const columns = [
    ...formResultByIdColumns,
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
            <Tooltip title="View Answers" className="cursor-pointer">
              <EyeOutlined
                onClick={() =>
                  router.push(
                    `/forms/results/${form_id}/view/${item?.users?.id}`
                  )
                }
              />
            </Tooltip>
            {/* </Popconfirm> */}
          </div>
        );
      },
    },
  ];

  const getForms = async ({ page, pageSize, setData }) => {
    try {
      let params = {
        page: page,
        row: pageSize,
        include: "users",
        filter: { form_id: form_id },
      };
      let res = await axiosAuth.get(
        `${process.env.NEXT_PUBLIC_BE_URL}api/dashboard/results/`,
        {
          params,
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            // Add any other headers as needed
          },
        }
      );
      // console.log("res :", { res });
      if (res.status === 200 || res?.data?.meta?.status === true) {
        setData(res?.data?.data);
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

export default ResultsByIdPage;
