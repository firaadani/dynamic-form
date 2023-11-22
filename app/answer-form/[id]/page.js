"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Button, Form, Steps } from "antd";

const AnswerFormPage = ({ params }) => {
  const url = process.env.NEXT_PUBLIC_BE_URL;
  const { data: session } = useSession();
  const { id } = params;
  const [form] = Form.useForm();

  // ==================== STATES ====================
  const [dataForm, setDataForm] = useState({});
  const [current, setCurrent] = useState(0);
  const [steps, setSteps] = useState([]);

  const getFormById = async () => {
    try {
      let res = await axios.get(
        `${url}api/dashboard/forms/${id}?include=sections,sections.questions`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      if (res?.status === 200) {
        setDataForm(res?.data?.data);
        setSteps(res?.data?.data?.sections);
      }
    } catch (error) {
      console.log("error :", { error });
    }
  };

  console.log("dataForm :", { dataForm });

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item, index) => ({
    key: item.index,
    title: item.title,
  }));

  useEffect(() => {
    getFormById();

    return () => {};
  }, []);

  if (dataForm) {
    return (
      <div className="m-10 bg-white rounded-2xl drop-shadow-sm p-10">
        <p>{dataForm?.title}</p>
        <p className="flex gap-2">
          Deskripsi:
          <span dangerouslySetInnerHTML={{ __html: dataForm?.description }} />
        </p>

        <Steps className="my-10" current={current} items={items} />

        <Form form={form} layout="vertical">
          {steps?.map((item, index) => {
            return item?.questions?.map((q, qIndex) => {
              return (
                <Form.Item
                  label={q?.question}
                  // pola nama : question + section.id + question.id
                  name={`question-${item?.id}-${q?.id}`}
                  key={q?.id}
                  className={current === index ? `` : `hidden`}
                >
                  {q?.type === "Simple"}
                </Form.Item>
              );
            });
          })}
        </Form>
        <div className="flex gap-4 mt-10">
          {current < steps.length - 1 && (
            <Button onClick={() => next()}>Next</Button>
          )}
          {current === steps.length - 1 && (
            <Button onClick={() => message.success("Processing complete!")}>
              Done
            </Button>
          )}
          {current > 0 && (
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
          <Button
            onClick={() =>
              console.log("form: form.getFieldsValue() :", {
                form: form.getFieldsValue(),
              })
            }
          >
            Check Form
          </Button>
        </div>
      </div>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default AnswerFormPage;
