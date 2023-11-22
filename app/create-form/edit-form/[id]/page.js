"use client";

import React, { useState, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Select, Space, Typography } from "antd";

import dynamic from "next/dynamic";
import _, { isEmpty } from "lodash";
import axios from "axios";
import { useSession } from "next-auth/react";

// ==================== USEWATCH ====================

// Use client-side rendering for CKEditor component
const CKEditor = dynamic(
  () => import("@/app/components/CKEditor").then((e) => e.default),
  {
    ssr: false,
  }
);
const EditForm = ({ params }) => {
  const [form] = Form.useForm();

  // ==================== useWatch ====================
  const formDescValues = Form.useWatch("formDescription", form);
  const sectionValues = Form.useWatch("sections", form);
  console.log("sectionValues :", {
    sectionValues,
    check: sectionValues?.[0]?.questions?.[0]?.description,
  });

  const { data: session } = useSession();
  const { id } = params;

  console.log("session :", { session });
  const url = process.env.NEXT_PUBLIC_BE_URL;

  const [dataForm, setDataForm] = useState({});

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
        form.setFieldValue("formTitle", res?.data?.data?.title);
        form.setFieldValue("formDescription", res?.data?.data?.description);
      }
    } catch (error) {
      console.log("error :", { error });
    }
  };

  const postForm = async ({ name, data }) => {
    try {
      let values = form.getFieldsValue();
      let params = {
        ...dataForm,
        title: values?.formTitle,
        description: data ?? values?.formDescription,
        _method: "PATCH",
      };
      let res = await axios.post(
        `${url}api/dashboard/forms/${dataForm?.id}`,
        params,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            // Add any other headers as needed
          },
        }
      );
      console.log("res :", { res });
    } catch (error) {
      console.log("error :", { error });
    }
  };

  const postSection = async ({ name, data }) => {
    const index = name?.split("-")?.[1];
    const newItem = _.isEmpty(dataForm?.sections?.[index]) ? true : false;
    console.log("newItem :", { newItem: dataForm?.sections });
    try {
      let values = form.getFieldsValue();
      let params = {
        ...dataForm?.sections?.[index],
        title: values?.sections?.[index]?.sectionName,
        description: data ?? values?.sections?.[index]?.sectionDescription,
        form_id: dataForm?.id,
        _method: newItem ? null : "PATCH",
      };
      let postURL = newItem
        ? `${url}api/dashboard/sections/`
        : `${url}api/dashboard/sections/${dataForm?.sections?.[index]?.id}`;
      let res = await axios.post(postURL, params, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          // Add any other headers as needed
        },
      });
      getFormById();
      console.log("res :", { res });
    } catch (error) {
      console.log("error :", { error });
    }
  };

  const postQuestion = async ({ name, data }) => {
    console.log("postQuestion called", { name });
    const sectionIndex = name?.split("-")?.[1];
    const questionIndex = name?.split("-")?.[2];
    const newItem = _.isEmpty(
      dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex]
    )
      ? true
      : false;
    try {
      let values = form.getFieldsValue();
      console.log("values :", {
        data,
        values,
        newItem,
        sectionIndex,
        questionIndex,
        check:
          values?.sections?.[sectionIndex]?.questions?.[questionIndex]
            ?.answer_key,
      });
      let params = {
        ...dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex],
        question:
          values?.sections?.[sectionIndex]?.questions?.[questionIndex]
            ?.question,
        description:
          data ??
          values?.sections?.[sectionIndex]?.questions?.[questionIndex]
            ?.description,
        type: values?.sections?.[sectionIndex]?.questions?.[questionIndex]
          ?.type,
        option:
          values?.sections?.[sectionIndex]?.questions?.[questionIndex]?.options,
        answer_key:
          values?.sections?.[sectionIndex]?.questions?.[questionIndex]
            ?.answer_keys,
        score:
          values?.sections?.[sectionIndex]?.questions?.[questionIndex]?.score,
        parent_id:
          values?.sections?.[sectionIndex]?.questions?.[questionIndex]
            ?.parent_id,
        section_id: dataForm?.sections?.[sectionIndex]?.id,
        form_id: dataForm?.id,
        _method: newItem ? null : "PATCH",
      };
      let postURL = newItem
        ? `${url}api/dashboard/questions/`
        : `${url}api/dashboard/questions/${dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex]?.id}`;
      let res = await axios.post(postURL, params, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          // Add any other headers as needed
        },
      });
      getFormById();
      console.log("res :", { res });
    } catch (error) {
      console.log("error :", { error });
    }
  };

  const handleBlur = ({ e, name, wsiwygdata }) => {
    // console.log("check:e.target.name :", { check: e.target.name });
    if (
      e?.target?.name === "formTitle" ||
      name === "formTitle" ||
      e?.target?.name === "formDescription" ||
      name === "formDescription"
    ) {
      postForm({ name, data: wsiwygdata });
    }
    if (
      e?.target?.name?.includes("sectionName") ||
      name?.includes("sectionName") ||
      e?.target?.name?.includes("sectionDescription") ||
      name?.includes("sectionDescription")
    ) {
      postSection({ name: name, data: wsiwygdata });
    }
    if (e?.target?.name?.includes("question")) {
      postQuestion({ name: e?.target?.name });
    }
    if (name?.includes("question")) {
      postQuestion({ name, data: wsiwygdata });
    }
  };

  // ==================== EFFECTS ====================
  useEffect(() => {
    getFormById();

    return () => {};
  }, []);

  useEffect(() => {
    if (!_.isEmpty(dataForm)) {
      console.log("dataForm :", { dataForm });
      dataForm?.sections?.forEach((item, index) => {
        form.setFields([
          {
            name: ["sections", index, "sectionName"],
            value: item?.title,
          },
          {
            name: ["sections", index, "sectionDescription"],
            value: item?.description,
          },
        ]);
        item?.questions?.forEach((q, qIndex) => {
          // console.log("q :", { q });
          form.setFields([
            {
              name: ["sections", index, "questions", qIndex, "question"],
              value: q?.question,
            },
            {
              name: ["sections", index, "questions", qIndex, "description"],
              value: q?.description,
            },
            {
              name: ["sections", index, "questions", qIndex, "type"],
              value: q?.type,
            },
          ]);
          if (!_.isEmpty(q?.option)) {
            JSON.parse(q?.option)?.forEach((o, oIndex) => {
              // console.log("o :", { o });
              form.setFields([
                {
                  name: [
                    "sections",
                    index,
                    "questions",
                    qIndex,
                    "options",
                    oIndex,
                    "option",
                  ],
                  value: o?.option,
                },
              ]);
            });
          }
          if (!_.isEmpty(q?.answer_key)) {
            JSON.parse(q?.answer_key)?.forEach((o, oIndex) => {
              console.log("o :", { o });
              form.setFields([
                {
                  name: [
                    "sections",
                    index,
                    "questions",
                    qIndex,
                    "answer_keys",
                    oIndex,
                    "answer_key",
                  ],
                  value: o?.answer_key,
                },
              ]);
            });
          }
        });
      });
    }
    return () => {};
  }, [dataForm]);

  const questionComponent = ({ sectionField }) => {
    return (
      <Form.List name={[sectionField.name, "questions"]}>
        {(fields, { add, remove }) => (
          <div
            style={{
              display: "flex",
              rowGap: 16,
              flexDirection: "column",
            }}
          >
            {fields.map((field) => (
              <Card
                bodyStyle={{ backgroundColor: "#DEEBE1" }}
                headStyle={{ backgroundColor: "#BEB5AB" }}
                size="small"
                title={`Question ${field.name + 1}`}
                key={field.key}
                extra={
                  <CloseOutlined
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                }
              >
                {/* <Form.Item label="Question Type" name={[field.name, "qType"]}>
                  <Select
                    options={[
                      {
                        label: "Simple Question",
                        value: "Simple Question",
                      },
                      { label: "WSIWYG", value: "WSIWYG" },
                    ]}
                  />
                </Form.Item> */}
                {/* {sectionValues?.[sectionField.name]?.questions?.[field.name]
                  ?.qType === "Simple Question" ? ( */}
                <Form.Item label="Question" name={[field.name, "question"]}>
                  <Input
                    name={`questionQuestion-${sectionField.name}-${field.name}`}
                    onBlur={(e) => handleBlur({ e: e })}
                  />
                </Form.Item>
                {/* ) : sectionValues?.[sectionField.name]?.questions?.[field.name]
                    ?.qType === "WSIWYG" ? ( */}
                <Form.Item
                  label="Description"
                  name={[field.name, "description"]}
                >
                  <CKEditor
                    name={`questionDescription-${sectionField.name}-${field.name}`}
                    onBlur={handleBlur}
                    initVal={
                      sectionValues?.[sectionField.name]?.questions?.[
                        field.name
                      ]?.description
                    }
                  />
                </Form.Item>
                {/* ) : null} */}

                <Form.Item label="Type" name={[field.name, "type"]}>
                  <Select
                    name={`questionType-${sectionField.name}-${field.name}`}
                    onBlur={(e) =>
                      handleBlur({
                        e: e,
                        name: `questionType-${sectionField.name}-${field.name}`,
                      })
                    }
                    options={[
                      {
                        label: "Short Answer",
                        value: "Short Answer",
                      },
                      {
                        label: "Paragraph",
                        value: "Paragraph",
                      },
                      {
                        label: "Multiple Choice",
                        value: "Multiple Choice",
                      },
                      {
                        label: "Checkboxes",
                        value: "Checkboxes",
                      },
                      {
                        label: "File Upload",
                        value: "File Upload",
                      },
                      { label: "Date", value: "Date" },
                      { label: "Time", value: "Time" },
                    ]}
                  />
                </Form.Item>

                {/* Nest Form.List */}
                {["Multiple Choice", "Checkboxes"]?.includes(
                  sectionValues?.[sectionField.name]?.questions?.[field.name]
                    ?.type
                ) ? (
                  <Form.Item label="Options">
                    <Form.List name={[field.name, "options"]}>
                      {(subFields, subOpt) => (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 16,
                          }}
                        >
                          {subFields.map((subField) => (
                            <div
                              key={subField.key}
                              className="w-full flex gap-4"
                            >
                              <Form.Item
                                noStyle
                                name={[subField.name, "option"]}
                              >
                                <Input
                                  name={`questionOptions-${sectionField.name}-${field.name}-${subField.name}`}
                                  onBlur={(e) => handleBlur({ e: e })}
                                  placeholder={`Input option #${
                                    subField.key + 1
                                  } `}
                                />
                              </Form.Item>
                              <CloseOutlined
                                onClick={() => {
                                  subOpt.remove(subField.name);
                                }}
                              />
                            </div>
                          ))}
                          <Button
                            type="dashed"
                            onClick={() => subOpt.add()}
                            block
                          >
                            + Add Options
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </Form.Item>
                ) : null}

                <Form.Item label="Answer Key">
                  <Form.List name={[field.name, "answer_keys"]}>
                    {(subFields, subOpt) => (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 16,
                        }}
                      >
                        {subFields.map((subField) => (
                          <div key={subField.key} className="w-full flex gap-4">
                            <Form.Item
                              noStyle
                              name={[subField.name, "answer_key"]}
                              help={`Jika ada lebih dari 1 jawaban, tambahkan menggunakan tombol "Tambah Answer Key". Pastikan huruf kecil/kapital sesuai dengan opsi`}
                            >
                              <Input
                                name={`questionAnswer_keys-${sectionField.name}-${field.name}-${subField.name}`}
                                onBlur={(e) => handleBlur({ e: e })}
                                placeholder={`Input answer key #${
                                  subField.key + 1
                                } `}
                              />
                            </Form.Item>
                            <CloseOutlined
                              onClick={() => {
                                subOpt.remove(subField.name);
                              }}
                            />
                          </div>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => subOpt.add()}
                          block
                        >
                          + Add Answer Key
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </Form.Item>
                {/* <Form.Item
                  label="Answer Key"
                  name={[field.name, "answer_key"]}
                  help="Jika ada lebih dari 1 jawaban, maka pisahkan dengan koma. Pastikan huruf kecil/kapital sesuai dengan opsi"
                >
                  <Input
                    name={`questionKey-${sectionField.name}-${field.name}`}
                    onBlur={(e) => handleBlur({ e: e })}
                  />
                </Form.Item> */}
              </Card>
            ))}

            <Button type="dashed" onClick={() => add()} block>
              + Add Question
            </Button>
          </div>
        )}
      </Form.List>
    );
  };

  return (
    <div className="bg-white m-20 p-10 rounded-2xl drop-shadow-sm flex flex-col h-[750px] overflow-y-hidden">
      {/* <Button
        className="bg-indigo-500 text-white rounded-md w-[100px] mx-auto"
        onClick={postForm}
      >
        Save Form
      </Button> */}
      <p className="mx-auto my-4 text-2xl font-semibold text-indigo-600">
        {dataForm?.title}
      </p>
      <div className="overflow-y-auto">
        <Form
          className="w-full mx-auto px-10"
          layout="vertical"
          form={form}
          name="dynamic_form_complex"
          autoComplete="off"
          initialValues={{
            items: [{}],
          }}
        >
          <Form.Item label="Form Title" name={"formTitle"}>
            <Input name={"formTitle"} onBlur={(e) => handleBlur({ e: e })} />
          </Form.Item>
          <Form.Item label="Form Description" name={"formDescription"}>
            <CKEditor
              name={`formDescription`}
              onBlur={handleBlur}
              initVal={formDescValues}
            />
          </Form.Item>
          <Form.List name="sections">
            {(sectionFields, { add: addSection, remove: removeSection }) => (
              <div
                style={{
                  display: "flex",
                  rowGap: 16,
                  flexDirection: "column",
                }}
              >
                {sectionFields.map((field) => (
                  <Card
                    bodyStyle={{ backgroundColor: "#D3E0DA" }}
                    headStyle={{ backgroundColor: "#BEC6BA" }}
                    size="small"
                    title={`Section ${field.name + 1}`}
                    key={field.key}
                    extra={
                      <CloseOutlined
                        onClick={() => {
                          removeSection(field.name);
                        }}
                      />
                    }
                  >
                    <Form.Item
                      label="Section Name"
                      name={[field.name, "sectionName"]}
                    >
                      <Input
                        name={`sectionName-${field.name}`}
                        onBlur={(e) => handleBlur({ e: e })}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Section Description"
                      name={"sectionDescription"}
                    >
                      <CKEditor
                        name={`sectionDescription-${field.name}`}
                        onBlur={handleBlur}
                        initVal={
                          sectionValues?.[field.name]?.sectionDescription
                        }
                      />
                    </Form.Item>
                    {questionComponent({ sectionField: field })}
                  </Card>
                ))}
                <Button type="dashed" onClick={() => addSection()} block>
                  + Add Section
                </Button>
              </div>
            )}
          </Form.List>

          <Form.Item noStyle shouldUpdate>
            {() => (
              <Typography>
                <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
              </Typography>
            )}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default EditForm;
