"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Radio,
  Steps,
  TimePicker,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import _ from "lodash";

const AnswerFormPage = ({ params }) => {
  const url = process.env.NEXT_PUBLIC_BE_URL;
  const { data: session } = useSession();
  const { id } = params;
  const [form] = Form.useForm();

  // ==================== STATES ====================
  const [dataForm, setDataForm] = useState({});
  const [current, setCurrent] = useState(0);
  const [steps, setSteps] = useState([]);

  const props = {
    name: "file",
    multiple: true,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
  };

  const [checkedOptions, setCheckedOptions] = useState([]);

  const handleCheckboxChange = (checkedValues) => {
    setCheckedOptions(checkedValues);
  };

  const getFormById = async () => {
    try {
      let res = await axios.get(
        `${url}api/dashboard/forms/${id}?include=sections.questions.answers,sections.questions.subQuestion.answers,sections.questions.subQuestion.subQuestion.answers,sections.questions.subQuestion.subQuestion.subQuestion.answers,sections.questions.subQuestion.subQuestion.subQuestion.subQuestion.answers`,
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

  const postAnswer = async ({ answer, id }) => {
    try {
      let values = form.getFieldsValue();
      let params = {
        answer: answer,
        question_id: id,
      };
      let res = await axios.post(`${url}api/dashboard/answers`, params, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (res?.status > 200 && res?.status < 400) {
        getFormById();
      }
    } catch (error) {
      console.log("err :", { error });
    }
  };

  function isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

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

  useEffect(() => {
    if (!_.isEmpty(dataForm)) {
      console.log("dataForm :", { dataForm });
      dataForm?.sections?.map((item, index) => {
        item?.questions?.map((q, qIndex) => {
          form.setFields([
            {
              name: `question-${item?.id}-${q?.id}`,
              value: q?.answers?.[0]?.answer,
            },
          ]);
          if (!_.isEmpty(q?.sub_question)) {
            q?.sub_question?.map((qq) => {
              const answer = qq?.answers?.[0]?.answer;
              form.setFields([
                {
                  name: `question-${item?.id}-${q?.id}-${qq?.id}`,
                  value:
                    isJsonString(answer) && _.isArray(JSON.parse(answer))
                      ? JSON.parse(answer)?.map((item) => item.option)
                      : isJsonString(answer)
                      ? JSON.parse(answer)?.option
                      : answer,
                },
              ]);
            });
          }
        });
      });
    }

    return () => {};
  }, [dataForm]);

  const renderQuestion = ({ parent_id, parent, self, index }) => {
    return (
      <Form.Item
        label={self?.question}
        // pola nama : question + section.id + question.id
        name={`question-${parent_id}-${self?.id}`}
        key={self?.id}
        className={
          current === index ? `border border-1 rounded-2xl p-4` : `hidden`
        }
      >
        {self?.type === "Section" ? (
          <>
            {self?.sub_question?.map((child) => {
              // console.log("child :", { parent, self, child });
              return (
                <>
                  {renderQuestion({
                    parent_id: `${parent_id}-${self.id}`,
                    parent: self,
                    self: child,
                    index: index,
                  })}
                </>
              );
            })}
          </>
        ) : null}
        {self?.type === "Short Answer" ? (
          <Input
            onBlur={(e) => postAnswer({ answer: e.target.value, id: self.id })}
          />
        ) : null}
        {self?.type === "Paragraph" ? (
          <TextArea
            onBlur={(e) => postAnswer({ answer: e.target.value, id: self.id })}
          />
        ) : null}
        {self?.type === "Multiple Choice" ? (
          <Radio.Group>
            {self?.option &&
              JSON.parse(self?.option)?.map((item) => {
                return (
                  <Radio
                    onBlur={(e) => {
                      let answer = { option: e?.target?.value };
                      postAnswer({
                        answer: JSON.stringify(answer),
                        id: self.id,
                      });
                      console.log("blur :", { e: e?.target?.value });
                    }}
                    value={item?.option}
                  >
                    {item?.option}
                  </Radio>
                );
              })}
          </Radio.Group>
        ) : null}
        {self?.type === "Checkboxes" ? (
          <Checkbox.Group
            options={JSON?.parse(self?.option)?.map((item) => {
              return {
                label: item?.option,
                value: item?.option,
              };
            })}
            onChange={handleCheckboxChange}
            onBlur={(e) => {
              let answer = checkedOptions?.map((item) => ({ option: item }));
              postAnswer({
                answer: JSON.stringify(answer),
                id: self.id,
              });
              console.log("blur :", {
                e,
              });
            }}
          />
        ) : null}
        {self?.type === "File Upload" ? (
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p>
          </Dragger>
        ) : null}
        {self?.type === "Date" ? <DatePicker /> : null}
        {self?.type === "Time" ? <TimePicker /> : null}
      </Form.Item>
    );
  };

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
              return renderQuestion({
                parent_id: item?.id,
                self: q,
                parent: item,
                index: index,
              });
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
