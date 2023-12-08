"use client";
import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import _ from "lodash";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

const FormPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const axiosAuth = useAxiosAuth();

  const [formData, setFormData] = useState([]);

  const getForms = async () => {
    try {
      let res = await axiosAuth.get(`api/dashboard/forms?row=all`);
      // console.log("res :", { res });
      if (res.status === 200 || res?.data?.meta?.status === true) {
        setFormData(res?.data);
      }
    } catch (error) {
      console.log("error createFormPage :", { error });
    }
  };

  console.log("formData :", { formData });

  useEffect(() => {
    getForms();

    return () => {};
  }, []);

  if (role === "User") {
    router.push(`/dashboard`);
  }
  return (
    <div className="w-full  p-10 flex gap-4 flex-wrap">
      <div
        className="border-2 border-dashed border-slate-400 h-48 w-32 flex flex-col gap-4 justify-center items-center text-slate-600 rounded-md cursor-pointer"
        onClick={() => router.push(`/forms/create-form/new-form`)}
      >
        <PlusOutlined />
        <p>New Form</p>
      </div>
      {_.isEmpty(formData?.data)
        ? null
        : formData?.data?.map((item, index) => {
            return (
              <div
                key={index}
                className="border-2 border-solid border-indigo-500 bg-white border-slate-400 h-48 w-32 flex flex-col gap-4 justify-center items-center text-slate-600 rounded-md cursor-pointer text-center text-sm px-2"
                onClick={() =>
                  router.push(`/forms/create-form/edit-form/${item?.id}`)
                }
              >
                <p>{item?.title}</p>
              </div>
            );
          })}
    </div>
  );
};

export default FormPage;
