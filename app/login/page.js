"use client";
import React from "react";
import { Button, Form, Input, InputNumber } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { PushNavigateTo } from "@/lib/helpersClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doLogin } from "@/lib/services";

/* eslint-disable no-template-curly-in-string */

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};
/* eslint-enable no-template-curly-in-string */

const LoginPage = () => {
  const onFinish = async (values) => {
    console.log(values);
    try {
      let params = {
        email: values?.user?.name,
        password: values?.user?.password,
      };
      let res = await doLogin(values?.user?.name, values?.user?.password);
      console.log("res login : res", { res });
    } catch (error) {}
  };
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="bg-white rounded-2xl drop-shadow-md p-4 min-w-[500px] ">
        <p className="text-center mb-10 font-bold text-xl text-blue-700">
          Login
        </p>
        <Form
          className="form"
          layout="vertical"
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item name={["user", "name"]} label="Name">
            <Input />
          </Form.Item>
          <Form.Item name={["user", "password"]} label="Password">
            <Input.Password
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <div className="flex flex-row justify-center gap-4">
            <Form.Item>
              <Link href="/signup">Daftar</Link>
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit">Submit</Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
