"use client";

import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Select, Space, Typography } from "antd";

import dynamic from "next/dynamic";
import _, { isEmpty } from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

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

  const url = process.env.NEXT_PUBLIC_BE_URL;

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
      router.push(`/forms/create-form/edit-form/${res?.data?.data?.id}`);
    } catch (error) {
      console.log("error :", { error });
    }
  };

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
