"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
  Tooltip,
  message,
  notification,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { userColumns } from "../components/columns/userColumns";
import TableComponent from "../components/table/TableComponent";
import { showError, showSuccess } from "@/lib/helpersClient";
import { useRouter } from "next/navigation";
import useAxiosAuth from "../../lib/hooks/useAxiosAuth";

const UserManagementPage = () => {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [form] = Form.useForm();
  const url = process.env.NEXT_PUBLIC_BE_URL;
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const [selectedData, setSelectedData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const confirm = (e) => {
    deleteUser();
  };
  const cancel = (e) => {
    showError("Gagal", "Gagal hapus user");
  };

  useEffect(() => {
    console.log(selectedData);

    return () => {};
  }, [selectedData]);

  useEffect(() => {
    if (isEdit) {
      form.setFields([
        {
          name: "name",
          value: selectedData?.name,
        },
        {
          name: "email",
          value: selectedData?.email,
        },
        {
          name: "username",
          value: selectedData?.username,
        },
        {
          name: "role",
          value: selectedData?.role,
        },
      ]);
    }

    return () => {};
  }, [isEdit]);

  const columns = [
    ...userColumns,
    {
      title: "Action",
      key: "action",
      render: (value, item) => {
        return (
          <div className="flex gap-2 items-center justify-center">
            <EditOutlined
              onClick={() => {
                setIsEdit(true);
                setSelectedData(item);
                setIsModalOpen(true);
              }}
            />
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
                <DeleteOutlined
                  onClick={() => {
                    setSelectedData(item);
                  }}
                />
              </Tooltip>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const deleteUser = async () => {
    try {
      let res = await axiosAuth.delete(
        `${url}api/dashboard/users/${selectedData?.id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      console.log("res :", { res });
      if (res?.status === 200) {
        showSuccess("Berhasil", "Berhasil menghapus User");
        setRefresh((prev) => !prev);
      }
    } catch (error) {
      console.log("error :", { error });
    }
  };

  const getUsers = async ({ page, pageSize, setData }) => {
    try {
      let params = {
        page: page,
        row: pageSize,
      };
      let res = await axiosAuth.get(`api/dashboard/users`, { params });
      console.log("res :", { res });
      if (res.status === 200 || res?.data?.meta?.status === true) {
        setData(res?.data?.data);
      }
    } catch (error) {
      console.log("error :", { error });
    }
  };

  const modalAddUser = () => {
    const onFinish = async (values) => {
      try {
        let formData = new FormData();
        formData.append("name", values?.name);
        formData.append("email", values?.email);
        formData.append("username", values?.username);
        formData.append("role", values?.role);
        formData.append("password", isEdit ? "123456" : values?.password);
        formData.append(
          "password_confirmation",
          isEdit ? "123456" : values?.password_confirmation
        );
        if (isEdit) {
          formData.append("_method", "PATCH");
        }

        console.log("formData :", { formData });
        const newUser = "api/dashboard/users";
        const editUser = `api/dashboard/users/${selectedData?.id}`;
        let res = await axiosAuth.post(
          `${url}${isEdit ? editUser : newUser}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );
        console.log("res :", { res });
        if (res?.status === 201) {
          showSuccess("Berhasil", "Berhasil menambahkan User");
          form.resetFields();
          setIsModalOpen(false);
          setRefresh((prev) => !prev);
          setIsEdit(false);
        }
      } catch (error) {
        console.log("error :", { error });
      }
      // Handle successful form submission logic here
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
      // Handle form submission failure logic here
    };
    return (
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
          setIsEdit(false);
        }}
        okButtonProps={{ className: "bg-indigo-500" }}
      >
        <p className="text-center text-lg">{isEdit ? "Edit" : "Add"} User</p>
        <Form
          form={form}
          layout="vertical"
          className="my-10"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="name"
            label="Nama"
            rules={[
              {
                required: true,
                message: "Wajib Diisi!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
              {
                required: true,
                message: "Wajib Diisi!",
              },
            ]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: "Wajib Diisi!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[
              {
                required: true,
                message: "Wajib Diisi!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: isEdit ? false : true,
                message: "Wajib Diisi!",
              },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Konfirmasi Password"
            name="password_confirmation"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: isEdit ? false : true,
                message: "Wajib Diisi!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Password tidak sama!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Konfirmasi Password" />
          </Form.Item>
          <div className="flex justify-center gap-4">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="bg-indigo-500 text-white" htmlType="submit">
              {isEdit ? "Edit" : "Add"} User
            </Button>
          </div>
        </Form>
      </Modal>
    );
  };

  if (role === "SuperAdmin") {
    return (
      <div className="m-4 p-10 bg-white rounded-xl drop-shadow-sm flex flex-col gap-4">
        {modalAddUser()}
        <div className="flex justify-between">
          <p className="text-2xl">Users</p>
          <button
            className="bg-indigo-500 rounded-md drop-shadow-sm text-white px-4"
            onClick={setIsModalOpen}
          >
            Add User
          </button>
        </div>
        <TableComponent
          session={session}
          fetch={getUsers}
          columns={columns}
          refresh={refresh}
        />
      </div>
    );
  } else {
    router.push(`/dashboard`);
  }
};

export default UserManagementPage;
