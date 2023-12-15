"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Steps,
  TimePicker,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import _ from "lodash";
import moment from "moment";
import { showError, showSuccess } from "@/lib/helpersClient";
import { useRouter } from "next/navigation";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

import dynamic from "next/dynamic";

const CKEditor = dynamic(
  () => import("@/app/components/CKEditor").then((e) => e.default),
  {
    ssr: false,
  }
);

const AnswerFormPage = ({ params }) => {
  const url = process.env.NEXT_PUBLIC_BE_URL;
  const { data: session } = useSession();
  const { id } = params;
  const [form] = Form.useForm();
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  // ==================== STATES ====================
  const [dataForm, setDataForm] = useState({});
  const [current, setCurrent] = useState(0);
  const [steps, setSteps] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const props = {
    name: "file",
    multiple: false,
    showUploadList: false,
    onChange(info) {
      const { status } = info.file;
      console.log("info: info.file :", { info: info.file });
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
    // beforeUpload: (file) => {
    //   setFileList([...fileList, file]);
    //   // return false;
    // },
  };

  const customRequest = async ({ file, qId }) => {
    console.log("file, onSuccess, onError :", {
      file: typeof file,
      qId,
    });
    // You can customize the payload here
    const formData = new FormData();
    formData.append("answer", file?.file);
    formData.append("question_id", qId);

    // Replace the URL with your actual server endpoint
    try {
      let res = await axiosAuth.post(`${url}api/dashboard/answers`, formData, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (res?.status === 200 || res?.status === 201) {
        message.success("Berhasil upload file");
        getFormById();
      }
    } catch (error) {
      message.error(`Gagal upload file ${error.message}`);
    }
  };

  const [checkedOptions, setCheckedOptions] = useState([]);

  const handleCheckboxChange = (checkedValues) => {
    setCheckedOptions(checkedValues);
  };

  function isDateValid(dateString) {
    const timestamp = Date.parse(dateString);
    return !isNaN(timestamp) && isFinite(timestamp);
  }

  function isValidTime(timeString) {
    const date = new Date("2000-01-01 " + timeString);
    return !isNaN(date.getTime());
  }

  const getFormById = async () => {
    try {
      let res = await axiosAuth.get(
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
      let formData = new FormData();
      formData.append("answer", answer);
      formData.append("question_id", id);

      let res = await axiosAuth.post(`${url}api/dashboard/answers`, formData, {
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

  const submitForm = async () => {
    try {
      let params = { form_id: id };
      let res = await axiosAuth.post(`${url}api/dashboard/results`, params, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      console.log("res :", { res });
      if (res?.status === 200 || res?.status === 201) {
        showSuccess("Berhasil", "Berhasil submit form");
        router.push(`/forms/answer-form`);
      }
    } catch (error) {
      console.log("error :", { error });
      showError("Gagal submit form", `${error.message}`);
    }
  };

  const modalKonfirmasi = () => {
    return (
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={submitForm}
        okType="default"
        okButtonProps={{ className: "bg-indigo-500 text-white" }}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>Pastikan Anda telah selesai mengisi form sebelum submit</p>
      </Modal>
    );
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
      // console.log("dataForm :", { dataForm });
      dataForm?.sections?.map((item, index) => {
        // // console.log("dataform sections item :", { item });
        item?.questions?.map((q, qIndex) => {
          // console.log("dataform sections item q :", {
          //   q,
          //   answer: q?.answers?.[0]?.answer,
          //   name: `question-${item?.id}-${q?.id}`,
          // });
          if (
            isDateValid(q?.answers?.[0]?.answer) ||
            isValidTime(q?.answers?.[0]?.answer)
          ) {
            form.setFields([
              {
                name: `question-${item?.id}-${q?.id}`,
                value: isValidTime(q?.answers?.[0]?.answer)
                  ? moment(q?.answers?.[0]?.answer, "HH:mm:ss")
                  : moment(q?.answers?.[0]?.answer),
              },
            ]);
          } else {
            form.setFields([
              {
                name: `question-${item?.id}-${q?.id}`,
                value: q?.answers?.[0]?.answer,
              },
            ]);
          }
          if (!_.isEmpty(q?.sub_question)) {
            q?.sub_question?.map((qq) => {
              const answer = qq?.answers?.[0]?.answer;
              if (isDateValid(answer)) {
                form.setFields([
                  {
                    name: `question-${item?.id}-${q?.id}-${qq?.id}`,
                    value: moment(answer),
                  },
                ]);
              } else if (isValidTime(answer)) {
                form.setFields([
                  {
                    name: `question-${item?.id}-${q?.id}-${qq?.id}`,
                    value: moment(answer, "HH:mm:ss"),
                  },
                ]);
              } else {
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
              }
              if (!_.isEmpty(qq?.sub_question)) {
                qq?.sub_question?.map((qqq) => {
                  const answer = qqq?.answers?.[0]?.answer;
                  if (isDateValid(answer)) {
                    form.setFields([
                      {
                        name: `question-${item?.id}-${q?.id}-${qq?.id}-${qqq?.id}`,
                        value: moment(answer),
                      },
                    ]);
                  } else if (isValidTime(answer)) {
                    form.setFields([
                      {
                        name: `question-${item?.id}-${q?.id}-${qq?.id}-${qqq?.id}`,
                        value: moment(answer, "HH:mm:ss"),
                      },
                    ]);
                  } else {
                    form.setFields([
                      {
                        name: `question-${item?.id}-${q?.id}-${qq?.id}-${qqq?.id}`,
                        value:
                          isJsonString(answer) && _.isArray(JSON.parse(answer))
                            ? JSON.parse(answer)?.map((item) => item.option)
                            : isJsonString(answer)
                            ? JSON.parse(answer)?.option
                            : answer,
                      },
                    ]);
                  }
                  if (!_.isEmpty(qqq?.sub_question)) {
                    qqq?.sub_question?.map((qqqq) => {
                      const answer = qqqq?.answers?.[0]?.answer;
                      if (isDateValid(answer)) {
                        form.setFields([
                          {
                            name: `question-${item?.id}-${q?.id}-${qq?.id}-${qqq?.id}-${qqqq?.id}`,
                            value: moment(answer),
                          },
                        ]);
                      } else if (isValidTime(answer)) {
                        form.setFields([
                          {
                            name: `question-${item?.id}-${q?.id}-${qq?.id}-${qqq?.id}-${qqqq?.id}`,
                            value: moment(answer, "HH:mm:ss"),
                          },
                        ]);
                      } else {
                        form.setFields([
                          {
                            name: `question-${item?.id}-${q?.id}-${qq?.id}-${qqq?.id}-${qqqq?.id}`,
                            value:
                              isJsonString(answer) &&
                              _.isArray(JSON.parse(answer))
                                ? JSON.parse(answer)?.map((item) => item.option)
                                : isJsonString(answer)
                                ? JSON.parse(answer)?.option
                                : answer,
                          },
                        ]);
                      }
                    });
                  }
                });
              }
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
        label={
          <div>
            {self?.question}
            {self?.description && (
              <div
                className="text-xs text-slate-700 mt-1"
                dangerouslySetInnerHTML={{ __html: self?.description ?? "" }}
              />
            )}
          </div>
        }
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
          <CKEditor
            name={`formDescription`}
            onBlur={postAnswer}
            caller={`answer-${self.id}`}
            initVal={self?.answers?.[0]?.answer ?? ""}
          />
        ) : // <TextArea
        //   onBlur={(e) => postAnswer({ answer: e.target.value, id: self.id })}
        // />
        null}
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
          <>
            <Dragger
              {...props}
              customRequest={(file, onError, onSuccess) =>
                customRequest({ file, onError, onSuccess, qId: self.id })
              }
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">Single file upload only</p>
            </Dragger>
            {!_.isEmpty(self?.answers?.[0]?.answer) ? (
              <a
                className="text-indigo-500 underline"
                href={
                  url + self?.answers?.[0]?.answer?.replace("public", "storage")
                }
                target="__blank"
              >
                {self.question}'s answer
              </a>
            ) : null}
          </>
        ) : null}
        {self?.type === "Date" ? (
          <DatePicker
            onBlur={(e) => postAnswer({ answer: e.target.value, id: self.id })}
          />
        ) : null}
        {self?.type === "Time" ? (
          <TimePicker
            onBlur={(e) => postAnswer({ answer: answer, id: self.id })}
          />
        ) : null}
      </Form.Item>
    );
  };

  if (dataForm) {
    return (
      <div className="m-10 bg-white rounded-2xl drop-shadow-sm p-10">
        {modalKonfirmasi()}
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
        <div className="flex justify-between mt-10">
          <Button onClick={() => prev()} disabled={current <= 0}>
            Previous
          </Button>
          <Button disabled={current >= steps.length - 1} onClick={() => next()}>
            Next
          </Button>

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

        {current === steps.length - 1 && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="mt-10 w-full bg-indigo-500 text-white"
          >
            Submit
          </Button>
        )}
      </div>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default AnswerFormPage;
