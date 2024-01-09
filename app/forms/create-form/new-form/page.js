"use client";

import React, { useState, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Select, Space, Typography } from "antd";

import dynamic from "next/dynamic";
import _, { isEmpty } from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { showSuccess } from "@/lib/helpersClient";

// Use client-side rendering for CKEditor component
const CKEditor = dynamic(
  () => import("@/app/components/CKEditor").then((e) => e.default),
  {
    ssr: false,
  }
);
const App = () => {
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const role = session?.user?.role;
  const access = Form.useWatch("access", form);
  const type = Form.useWatch("type", form);

  // console.log("appraiser :", { appraiser });

  const [users, setUsers] = useState([]);
  console.log("users :", { users });

  const url = process.env.NEXT_PUBLIC_BE_URL;

  const getUsers = async () => {
    try {
      let res = await axiosAuth.get(`api/dashboard/users`);
      let a = res?.data?.data?.data?.map((user) => ({
        ...user,
        label: user?.name,
        value: user?.id,
      }));
      console.log("check a", a, res);
      setUsers(a);
    } catch (error) {}
  };

  const postAppraisers = async ({ userId, formId }) => {
    try {
      let params = {
        user_id: userId,
        form_id: formId,
      };
      let res = await axiosAuth.post(`api/dashboard/appraisers`, params);
      if (res?.status === 201) {
        // showSuccess("Berhasil", "Berhasil menambah appraiser");
      }
    } catch (error) {
      console.log("error :", { error });
    }
  };
  const postAppraisee = async ({ userId, formId }) => {
    try {
      let params = {
        user_id: userId,
        form_id: formId,
      };
      let res = await axiosAuth.post(`api/dashboard/appraiseds`, params);
      if (res?.status === 201) {
        // showSuccess("Berhasil", "Berhasil menambah appraisees");
      }
    } catch (error) {
      console.log("error :", { error });
    }
  };

  const postForm = async () => {
    try {
      let values = form.getFieldsValue();
      let params = {
        title: values?.title,
        access: values?.access,
      };
      let res = await axiosAuth.post(`${url}api/dashboard/forms`, params, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          // Add any other headers as needed
        },
      });
      console.log("res :", { res });
      if (res?.status === 201) {
        form
          .getFieldValue("appraiser")
          ?.map((item) =>
            postAppraisers({ formId: res?.data?.data?.id, userId: item })
          );
        form
          .getFieldValue("appraisee")
          ?.map((item) =>
            postAppraisee({ formId: res?.data?.data?.id, userId: item })
          );
        router.push(`/forms/create-form/edit-form/${res?.data?.data?.id}`);
      }
    } catch (error) {
      console.log("error :", { error });
    }
  };

  // ==================== EFFECTS ====================
  useEffect(() => {
    getUsers();

    return () => {};
  }, []);

  if (role === "User") {
    router.push(`/dashboard`);
  }
  return (
    <div className="bg-white m-20 p-10 rounded-2xl drop-shadow-sm flex flex-col overflow-y-hidden">
      <div className="overflow-y-auto">
        <Form
          className="w-full mx-auto"
          layout="vertical"
          form={form}
          name="dynamic_form_complex"
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
          initialValues={{
            items: [{}],
          }}
        >
          <Form.Item label="Form Title" name={"title"}>
            <Input />
          </Form.Item>
          <Form.Item label="Access" name={"access"}>
            <Select
              options={[
                {
                  label: "Public",
                  value: "Public",
                },
                {
                  label: "Private",
                  value: "Private",
                },
              ]}
            />
          </Form.Item>
          {access === "Private" ? (
            <Form.Item label="Type" name={"type"}>
              <Select
                options={[
                  {
                    label: "Survey",
                    value: "Survey",
                  },
                  {
                    label: "Test",
                    value: "Test",
                  },
                  {
                    label: "Appraisal",
                    value: "Appraisal",
                  },
                ]}
              />
            </Form.Item>
          ) : null}
          {type === "Appraisal" ? (
            <>
              <Form.Item label="Appraiser" name={"appraiser"}>
                <Select options={users} mode="multiple" />
              </Form.Item>
              <Form.Item label="Appraisee" name={"appraisee"}>
                <Select options={users} mode="multiple" />
              </Form.Item>
            </>
          ) : null}
          <Button
            className="bg-indigo-500 text-white rounded-md w-[100px]"
            onClick={postForm}
          >
            Next
          </Button>
        </Form>
      </div>
    </div>
  );
};
export default App;
