"use client";
import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import _ from "lodash";

const FormPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  console.log("session :", { session });

  const [formData, setFormData] = useState([]);

  const getForms = async () => {
    try {
      let res = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}api/dashboard/forms?include=results`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            // Add any other headers as needed
          },
        }
      );
      // console.log("res :", { res });
      if (res.status === 200 || res?.data?.meta?.status === true) {
        setFormData(res?.data?.data);
      }
    } catch (error) {
      console.log("error :", { error });
    }
  };

  console.log("formData :", { formData });

  useEffect(() => {
    getForms();

    return () => {};
  }, []);

  return (
    <div className="w-full  p-10 flex gap-4 flex-wrap">
      {_.isEmpty(formData?.data)
        ? null
        : formData?.data?.map((item, index) => {
            if (_.isEmpty(item?.results)) {
              return (
                <div
                  key={index}
                  className="border-2 border-solid bg-white border-indigo-500 h-48 w-32 flex flex-col gap-4 justify-center items-center text-slate-600 rounded-md cursor-pointer text-center text-sm px-2"
                  onClick={() => router.push(`/forms/answer-form/${item?.id}`)}
                >
                  <p>{item?.title}</p>
                </div>
              );
            } else {
              return null;
            }
          })}
    </div>
  );
};

export default FormPage;
