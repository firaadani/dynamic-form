"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Popconfirm, Table, Tooltip, message, notification } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { userColumns } from "../components/columns/userColumns";
import TableComponent from "../components/table/TableComponent";
import { showError, showSuccess } from "@/lib/helpersClient";

const UserManagementPage = () => {
  const { data: session } = useSession();

  const [selectedData, setSelectedData] = useState({});

  const confirm = (e) => {
    showSuccess("Sukses", "Berhasil hapus user");
  };
  const cancel = (e) => {
    showError("Gagal", "Gagal hapus user");
  };

  useEffect(() => {
    console.log(selectedData);

    return () => {};
  }, [selectedData]);

  const columns = [
    ...userColumns,
    {
      title: "Action",
      key: "action",
      render: (value, item) => {
        return (
          <div className="flex gap-2 items-center justify-center">
            <Popconfirm
              title="Delete this user"
              description="Are you sure you want to delete this user?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              okButtonProps={{
                className: "bg-blue-500 text-white",
              }}
              cancelText="No"
            >
              <Tooltip title="Delete" className="cursor-pointer">
                <DeleteOutlined onClick={() => setSelectedData(item)} />
              </Tooltip>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const getUsers = async ({ page, pageSize, setData }) => {
    try {
      let params = {
        page: page,
        row: pageSize,
      };
      let res = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}api/dashboard/users`,
        {
          params: params,
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            // Add any other headers as needed
          },
        }
      );
      console.log("res :", { res });
      if (res.status === 200 || res?.data?.meta?.status === true) {
        setData(res?.data?.data);
      }
    } catch (error) {
      console.log("error :", { error });
    }
  };

  return (
    <div className="m-4 p-10 bg-white rounded-xl drop-shadow-sm flex flex-col gap-4">
      <p className="text-2xl">Users</p>
      <TableComponent session={session} fetch={getUsers} columns={columns} />
    </div>
  );
};

export default UserManagementPage;
