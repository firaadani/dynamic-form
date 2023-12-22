"use client";

import React, { useState, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
  Typography,
  message,
} from "antd";

import dynamic from "next/dynamic";
import _ from "lodash";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useRouter } from "next/navigation";
import FormLinear from "@/app/components/FormLinear";

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

  const axiosAuth = useAxiosAuth();
  const router = useRouter();

  // ==================== useWatch ====================
  const formDescValues = Form.useWatch("formDescription", form);
  const sectionValues = Form.useWatch("sections", form);
  // console.log("sectionValues :", {
  //   sectionValues,
  //   check: {},
  // });

  const { data: session } = useSession();
  const role = session?.user?.role;
  const { id } = params;

  const url = process.env.NEXT_PUBLIC_BE_URL;

  const [dataForm, setDataForm] = useState({});

  const getFormById = async () => {
    try {
      let res = await axiosAuth.get(
        `${url}api/dashboard/forms/${id}?include=sections.questions.subQuestion.subQuestion.subQuestion.subQuestion,sections.questions.answers,sectionsCount`,
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
      let res = await axiosAuth.post(
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
    // console.log("name :", { name });
    const index = name?.split("-")?.[1];
    const newItem = _.isEmpty(dataForm?.sections?.[index]) ? true : false;
    // console.log("newItem :", { newItem: dataForm?.sections });
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
      let res = await axiosAuth.post(postURL, params, {
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

  const deleteSection = async (index) => {
    const sectionId = dataForm?.sections?.[index]?.id;
    try {
      let res = await axiosAuth.delete(
        `${url}api/dashboard/sections/${sectionId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            // Add any other headers as needed
          },
        }
      );
      console.log("res :", { res });
      if (res?.status === 200) {
        message.success("section deleted");
      }
    } catch (error) {
      console.log("error :", { error });
    }
  };

  const postQuestion = async ({ name, data }) => {
    const sectionIndex = name?.split("-")?.[1];
    const questionIndex = name?.split("-")?.[2];
    const subquestionIndex = name?.split("-")?.[3];
    const subSubquestionIndex = name?.split("-")?.[4];
    const subSubSubquestionIndex = name?.split("-")?.[5];

    const newQuestion = _.isEmpty(
      dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex]
    )
      ? true
      : false;
    const newSubquestion =
      subquestionIndex &&
      _.isEmpty(
        dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex]
          ?.sub_question?.[subquestionIndex]
      )
        ? true
        : false;
    const newSubSubquestion =
      subSubquestionIndex &&
      _.isEmpty(
        dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex]
          ?.sub_question?.[subquestionIndex]?.sub_question?.[
          subSubquestionIndex
        ]
      )
        ? true
        : false;
    const newSubSubSubquestion =
      subSubSubquestionIndex &&
      _.isEmpty(
        dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex]
          ?.sub_question?.[subquestionIndex]?.sub_question?.[
          subSubquestionIndex
        ]?.sub_question?.[subSubSubquestionIndex]
      )
        ? true
        : false;
    const newItem = subSubSubquestionIndex
      ? newSubSubSubquestion
      : subSubquestionIndex
      ? newSubSubquestion
      : subquestionIndex
      ? newSubquestion
      : newQuestion;

    // console.log("postQuestion called", {
    //   name,
    //   split: name?.split("-"),
    //   sectionIndex,
    //   questionIndex,
    //   subquestionIndex,
    //   subSubquestionIndex,
    //   subSubSubquestionIndex,
    //   dataForm,
    //   data,
    //   newQuestion,
    //   newSubquestion,
    //   newSubSubquestion,
    //   newSubSubSubquestion,
    //   newItem,
    // });

    try {
      let values = form.getFieldsValue();
      let questionValues =
        values?.sections?.[sectionIndex]?.questions?.[questionIndex];
      let subQuestionValues =
        values?.sections?.[sectionIndex]?.questions?.[questionIndex]
          ?.questions?.[subquestionIndex];
      let subSubQuestionValues =
        values?.sections?.[sectionIndex]?.questions?.[questionIndex]
          ?.questions?.[subquestionIndex]?.questions?.[subSubquestionIndex];
      let subSubSubQuestionValues =
        values?.sections?.[sectionIndex]?.questions?.[questionIndex]
          ?.questions?.[subquestionIndex]?.questions?.[subSubquestionIndex]
          ?.questions?.[subSubSubquestionIndex];

      let dataFormQuestion =
        dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex];
      let dataFormSubQuestion =
        dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex]
          ?.sub_question?.[subquestionIndex];
      let dataFormSubSubQuestion =
        dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex]
          ?.sub_question?.[subquestionIndex]?.sub_question?.[
          subSubquestionIndex
        ];
      let dataFormSubSubSubQuestion =
        dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex]
          ?.sub_question?.[subquestionIndex]?.sub_question?.[
          subSubquestionIndex
        ]?.sub_question?.[subSubSubquestionIndex];
      let oldData = subSubSubquestionIndex
        ? dataFormSubSubQuestion
        : subSubquestionIndex
        ? dataFormSubSubQuestion
        : subquestionIndex
        ? dataFormSubQuestion
        : dataFormQuestion;
      let params = {
        ...oldData,
        question: subSubSubquestionIndex
          ? subSubSubQuestionValues?.question
          : subSubquestionIndex
          ? subSubQuestionValues?.question
          : subquestionIndex
          ? subQuestionValues?.question
          : questionValues?.question,
        description: data
          ? data
          : subSubSubquestionIndex
          ? subSubSubQuestionValues?.description
          : subSubquestionIndex
          ? subSubQuestionValues?.description
          : subquestionIndex
          ? subQuestionValues?.description
          : questionValues?.description,
        type: subSubSubquestionIndex
          ? subSubSubQuestionValues?.type
          : subSubquestionIndex
          ? subSubQuestionValues?.type
          : subquestionIndex
          ? subQuestionValues?.type
          : questionValues?.type,
        option: subSubSubquestionIndex
          ? subSubSubQuestionValues?.options
          : subSubquestionIndex
          ? subSubQuestionValues?.options
          : subquestionIndex
          ? subQuestionValues?.options
          : questionValues?.options,
        answer_key: subSubSubquestionIndex
          ? subSubSubQuestionValues?.answer_keys
          : subSubquestionIndex
          ? subSubQuestionValues?.answer_keys
          : subquestionIndex
          ? subQuestionValues?.answer_keys
          : questionValues?.answer_keys,
        score: subSubSubquestionIndex
          ? subSubSubQuestionValues?.score
          : subSubquestionIndex
          ? subSubQuestionValues?.score
          : subquestionIndex
          ? subQuestionValues?.score
          : questionValues?.score,
        parent_id: subSubSubquestionIndex
          ? dataFormSubSubQuestion?.id
          : subSubquestionIndex
          ? dataFormSubQuestion?.id
          : subquestionIndex
          ? dataFormQuestion?.id
          : null,
        // subSubSubquestionIndex
        //   ? dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex]
        //       ?.questions?.[subquestionIndex]?.questions?.[subSubquestionIndex]
        //       ?.id
        //   : subSubquestionIndex
        //   ? dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex]
        //       ?.questions?.[subquestionIndex]?.id
        //   : subquestionIndex
        //   ? dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex]?.id
        //   : null,
        section_id: dataForm?.sections?.[sectionIndex]?.id,
        form_id: dataForm?.id,
        _method: newItem ? null : "PATCH",
      };
      let postURL = newItem
        ? `${url}api/dashboard/questions/`
        : `${url}api/dashboard/questions/${
            subSubSubquestionIndex
              ? dataFormSubSubSubQuestion?.id
              : subSubquestionIndex
              ? dataFormSubSubQuestion?.id
              : subquestionIndex
              ? dataFormSubQuestion?.id
              : dataFormQuestion?.id
          }`;
      let res = await axiosAuth.post(postURL, params, {
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

  const deleteQuestion = async (index) => {
    const sectionIndex = index?.split("-")?.[0];
    const questionIndex = index?.split("-")?.[1];
    const subquestionIndex = index?.split("-")?.[2];
    const subSubquestionIndex = index?.split("-")?.[3];
    const subSubSubquestionIndex = index?.split("-")?.[4];

    // console.log(
    //   "sectionIndex,questionIndex,subquestionIndex, subSubquestionIndex, subSubSubquestionIndex :",
    //   {
    //     sectionIndex,
    //     questionIndex,
    //     subquestionIndex,
    //     subSubquestionIndex,
    //     subSubSubquestionIndex,
    //     dataForm: dataForm?.sections?.[sectionIndex],
    //   }
    // );

    const questionId = subSubSubquestionIndex
      ? dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex]
          ?.sub_question?.[subquestionIndex]?.sub_question?.[
          subSubquestionIndex
        ]?.sub_question?.[subSubSubquestionIndex]?.id
      : subSubquestionIndex
      ? dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex]
          ?.sub_question?.[subquestionIndex]?.sub_question?.[
          subSubquestionIndex
        ]?.id
      : subquestionIndex
      ? dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex]
          ?.sub_question?.[subquestionIndex]?.id
      : dataForm?.sections?.[sectionIndex]?.questions?.[questionIndex]?.id;
    try {
      let res = await axiosAuth.delete(
        `${url}api/dashboard/questions/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            // Add any other headers as needed
          },
        }
      );
      console.log("res :", { res });
      if (res?.status === 200) {
        message.success("question deleted");
      }
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
      postSection({ name: e?.target?.name ?? name, data: wsiwygdata });
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
      // console.log("dataForm :", { dataForm });
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

          if (q?.type !== "Linear Scale" && !_.isEmpty(q?.option)) {
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
              // console.log("o :", { o });
              form.setFields([
                {
                  name: [
                    "sections",
                    index,
                    "questions",
                    qIndex,
                    "answer_keys",
                    oIndex,
                    "option",
                  ],
                  value: o?.option,
                },
              ]);
            });
          }
          if (!_.isEmpty(q?.sub_question)) {
            q?.sub_question?.forEach((qq, qqIndex) => {
              // console.log("qq :", { qq });
              form.setFields([
                {
                  name: [
                    "sections",
                    index,
                    "questions",
                    qIndex,
                    "questions",
                    qqIndex,
                    "question",
                  ],
                  value: qq?.question,
                },

                {
                  name: [
                    "sections",
                    index,
                    "questions",
                    qIndex,
                    "questions",
                    qqIndex,
                    "description",
                  ],
                  value: qq?.description,
                },
                {
                  name: [
                    "sections",
                    index,
                    "questions",
                    qIndex,
                    "questions",
                    qqIndex,
                    "type",
                  ],
                  value: qq?.type,
                },
              ]);
              if (!_.isEmpty(qq?.option)) {
                JSON.parse(qq?.option)?.forEach((o, oIndex) => {
                  // console.log("o :", { o });
                  form.setFields([
                    {
                      name: [
                        "sections",
                        index,
                        "questions",
                        qIndex,
                        "questions",
                        qqIndex,
                        "options",
                        oIndex,
                        "option",
                      ],
                      value: o?.option,
                    },
                  ]);
                });
              }
              if (!_.isEmpty(qq?.answer_key)) {
                JSON.parse(qq?.answer_key)?.forEach((o, oIndex) => {
                  // console.log("o :", { o });
                  form.setFields([
                    {
                      name: [
                        "sections",
                        index,
                        "questions",
                        qIndex,
                        "questions",
                        qqIndex,
                        "answer_keys",
                        oIndex,
                        "option",
                      ],
                      value: o?.option,
                    },
                  ]);
                });
              }
              if (!_.isEmpty(qq?.sub_question)) {
                qq?.sub_question?.forEach((qqq, qqqIndex) => {
                  form.setFields([
                    {
                      name: [
                        "sections",
                        index,
                        "questions",
                        qIndex,
                        "questions",
                        qqIndex,
                        "questions",
                        qqqIndex,
                        "question",
                      ],
                      value: qqq?.question,
                    },

                    {
                      name: [
                        "sections",
                        index,
                        "questions",
                        qIndex,
                        "questions",
                        qqIndex,
                        "questions",
                        qqqIndex,
                        "description",
                      ],
                      value: qqq?.description,
                    },
                    {
                      name: [
                        "sections",
                        index,
                        "questions",
                        qIndex,
                        "questions",
                        qqIndex,
                        "questions",
                        qqqIndex,
                        "type",
                      ],
                      value: qqq?.type,
                    },
                  ]);
                  if (!_.isEmpty(qqq?.sub_question)) {
                    qqq?.sub_question?.forEach((qqqq, qqqqIndex) => {
                      form.setFields([
                        {
                          name: [
                            "sections",
                            index,
                            "questions",
                            qIndex,
                            "questions",
                            qqIndex,
                            "questions",
                            qqqIndex,
                            "questions",
                            qqqqIndex,
                            "question",
                          ],
                          value: qqqq?.question,
                        },

                        {
                          name: [
                            "sections",
                            index,
                            "questions",
                            qIndex,
                            "questions",
                            qqIndex,
                            "questions",
                            qqqIndex,
                            "questions",
                            qqqqIndex,
                            "description",
                          ],
                          value: qqqq?.description,
                        },
                        {
                          name: [
                            "sections",
                            index,
                            "questions",
                            qIndex,
                            "questions",
                            qqIndex,
                            "questions",
                            qqqIndex,
                            "questions",
                            qqqqIndex,
                            "type",
                          ],
                          value: qqqq?.type,
                        },
                      ]);
                      if (!_.isEmpty(qqq?.option)) {
                        JSON.parse(qqq?.option)?.forEach((o, oIndex) => {
                          // console.log("o :", { o });
                          form.setFields([
                            {
                              name: [
                                "sections",
                                index,
                                "questions",
                                qIndex,
                                "questions",
                                qqIndex,
                                "questions",
                                qqqIndex,
                                "options",
                                oIndex,
                                "option",
                              ],
                              value: o?.option,
                            },
                          ]);
                        });
                      }
                      if (!_.isEmpty(qqq?.answer_key)) {
                        JSON.parse(qqq?.answer_key)?.forEach((o, oIndex) => {
                          // console.log("o :", { o });
                          form.setFields([
                            {
                              name: [
                                "sections",
                                index,
                                "questions",
                                qIndex,
                                "questions",
                                qqIndex,
                                "questions",
                                qqqIndex,
                                "answer_keys",
                                oIndex,
                                "option",
                              ],
                              value: o?.option,
                            },
                          ]);
                        });
                      }
                      if (!_.isEmpty(qqq?.sub_question)) {
                        qqq?.sub_question?.forEach((qqqq, qqqqIndex) => {
                          form.setFields([
                            {
                              name: [
                                "sections",
                                index,
                                "questions",
                                qIndex,
                                "questions",
                                qqIndex,
                                "questions",
                                qqqIndex,
                                "questions",
                                qqqqIndex,
                                "question",
                              ],
                              value: qqqq?.question,
                            },
                            {
                              name: [
                                "sections",
                                index,
                                "questions",
                                qIndex,
                                "questions",
                                qqIndex,
                                "questions",
                                qqqIndex,
                                "questions",
                                qqqqIndex,
                                "description",
                              ],
                              value: qqqq?.description,
                            },
                            {
                              name: [
                                "sections",
                                index,
                                "questions",
                                qIndex,
                                "questions",
                                qqIndex,
                                "questions",
                                qqqIndex,
                                "questions",
                                qqqqIndex,
                                "type",
                              ],
                              value: qqqq?.type,
                            },
                          ]);
                          if (!_.isEmpty(qqqq?.option)) {
                            JSON.parse(qqqq?.option)?.forEach((o, oIndex) => {
                              // console.log("o :", { o });
                              form.setFields([
                                {
                                  name: [
                                    "sections",
                                    index,
                                    "questions",
                                    qIndex,
                                    "questions",
                                    qqIndex,
                                    "questions",
                                    qqqIndex,
                                    "questions",
                                    qqqqIndex,
                                    "options",
                                    oIndex,
                                    "option",
                                  ],
                                  value: o?.option,
                                },
                              ]);
                            });
                          }
                          if (!_.isEmpty(qqqq?.answer_key)) {
                            JSON.parse(qqqq?.answer_key)?.forEach(
                              (o, oIndex) => {
                                // console.log("o :", { o });
                                form.setFields([
                                  {
                                    name: [
                                      "sections",
                                      index,
                                      "questions",
                                      qIndex,
                                      "questions",
                                      qqIndex,
                                      "questions",
                                      qqqIndex,
                                      "questions",
                                      qqqqIndex,
                                      "answer_keys",
                                      oIndex,
                                      "option",
                                    ],
                                    value: o?.option,
                                  },
                                ]);
                              }
                            );
                          }
                        });
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

  const questionComponent = ({ sectionField, parent_id }) => {
    const splitted =
      parent_id.toString()?.indexOf("-") === -1 ? null : parent_id?.split("-");
    // console.log("splitted :", {
    //   splitted,
    //   sectionField,
    //   parent_id,
    //   sectionValues:
    //     sectionValues?.[sectionField?.name]?.questions?.[parent_id]
    //       ?.description,
    // });
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
                      deleteQuestion(`${parent_id}-${field.name}`);
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
                    name={`questionQuestion-${parent_id}-${field.name}`}
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
                    name={`questionDescription-${parent_id}-${field.name}`}
                    onBlur={handleBlur}
                    initVal={
                      splitted?.length === 4
                        ? sectionValues?.[splitted[0]]?.questions?.[splitted[1]]
                            ?.questions?.[splitted[2]]?.questions?.[splitted[3]]
                            ?.questions?.[field.name]?.description ?? ""
                        : splitted?.length === 3
                        ? sectionValues?.[splitted[0]]?.questions?.[splitted[1]]
                            ?.questions?.[splitted[2]]?.questions?.[field.name]
                            ?.description ?? ""
                        : splitted?.length === 2
                        ? sectionValues?.[splitted[0]]?.questions?.[splitted[1]]
                            ?.questions?.[field.name]?.description ?? ""
                        : splitted?.length === 1
                        ? sectionValues?.[splitted[0]]?.questions?.[field.name]
                            ?.description ?? ""
                        : splitted === null
                        ? sectionValues?.[parent_id]?.questions?.[field.name]
                            ?.description ?? ""
                        : ""
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
                        name: `questionType-${parent_id}-${field.name}`,
                      })
                    }
                    options={[
                      {
                        label: "Section",
                        value: "Section",
                        disabled: splitted?.length > 3,
                      },
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
                        label: "Checkboxes with Leveling",
                        value: "Checkboxes with Leveling",
                      },
                      {
                        label: "File Upload",
                        value: "File Upload",
                      },
                      { label: "Date", value: "Date" },
                      { label: "Time", value: "Time" },
                      { label: "Linear Scale", value: "Linear Scale" },
                    ]}
                  />
                </Form.Item>

                {/* Nest Form.List */}
                {/* {["Multiple Choice", "Checkboxes"]?.includes(
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
                ) : null} */}

                {/* SHOW ADD OPTIONS BUTTON IF TYPE: MULTIPLE CHOICE OR CHECKBOXES IS SELECTED */}
                {splitted === null &&
                ["Multiple Choice", "Checkboxes"]?.includes(
                  sectionValues?.[sectionField.name]?.questions?.[field.name]
                    ?.type
                ) ? (
                  <>
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
                                    name={`questionOptions-${parent_id}-${field.name}`}
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
                              <div
                                key={subField.key}
                                className="w-full flex gap-4"
                              >
                                <Form.Item
                                  noStyle
                                  name={[subField.name, "option"]}
                                  help={`Jika ada lebih dari 1 jawaban, tambahkan menggunakan tombol "Tambah Answer Key". Pastikan huruf kecil/kapital sesuai dengan opsi`}
                                >
                                  <Input
                                    name={`questionAnswer_keys-${parent_id}-${field.name}`}
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
                              disabled={
                                sectionValues?.[sectionField.name]?.questions?.[
                                  field.name
                                ]?.type === "Multiple Choice" &&
                                subFields.length > 0
                                  ? true
                                  : false
                              }
                            >
                              + Add Answer Key
                            </Button>
                          </div>
                        )}
                      </Form.List>
                    </Form.Item>
                  </>
                ) : null}
                {splitted?.length === 2 &&
                ["Multiple Choice", "Checkboxes"]?.includes(
                  sectionValues?.[splitted[0]]?.questions?.[splitted[1]]
                    ?.questions?.[field.name]?.type
                ) ? (
                  <>
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
                                    name={`questionOptions-${parent_id}-${field.name}`}
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
                              <div
                                key={subField.key}
                                className="w-full flex gap-4"
                              >
                                <Form.Item
                                  noStyle
                                  name={[subField.name, "option"]}
                                  help={`Jika ada lebih dari 1 jawaban, tambahkan menggunakan tombol "Tambah Answer Key". Pastikan huruf kecil/kapital sesuai dengan opsi`}
                                >
                                  <Input
                                    name={`questionAnswer_keys-${parent_id}-${field.name}`}
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
                              disabled={
                                sectionValues?.[splitted[0]]?.questions?.[
                                  splitted[1]
                                ]?.questions?.[field.name]?.type ===
                                  "Multiple Choice" && subFields.length > 0
                                  ? true
                                  : false
                              }
                            >
                              + Add Answer Key
                            </Button>
                          </div>
                        )}
                      </Form.List>
                    </Form.Item>
                  </>
                ) : null}
                {splitted?.length === 3 &&
                ["Multiple Choice", "Checkboxes"]?.includes(
                  sectionValues?.[splitted[0]]?.questions?.[splitted[1]]
                    ?.questions?.[splitted[2]]?.questions?.[field.name]?.type
                ) ? (
                  <>
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
                              <div
                                key={subField.key}
                                className="w-full flex gap-4"
                              >
                                <Form.Item
                                  noStyle
                                  name={[subField.name, "option"]}
                                  help={`Jika ada lebih dari 1 jawaban, tambahkan menggunakan tombol "Tambah Answer Key". Pastikan huruf kecil/kapital sesuai dengan opsi`}
                                >
                                  <Input
                                    name={`questionAnswer_keys-${parent_id}-${field.name}`}
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
                              disabled={
                                sectionValues?.[splitted[0]]?.questions?.[
                                  splitted[1]
                                ]?.questions?.[splitted[2]]?.questions?.[
                                  field.name
                                ]?.type === "Multiple Choice" &&
                                subFields.length > 0
                                  ? true
                                  : false
                              }
                            >
                              + Add Answer Key
                            </Button>
                          </div>
                        )}
                      </Form.List>
                    </Form.Item>
                  </>
                ) : null}
                {splitted?.length === 4 &&
                ["Multiple Choice", "Checkboxes"]?.includes(
                  sectionValues?.[splitted[0]]?.questions?.[splitted[1]]
                    ?.questions?.[splitted[2]]?.questions?.[splitted[3]]
                    ?.questions?.[field.name]?.type
                ) ? (
                  <>
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
                                    name={`questionOptions-${parent_id}-${field.name}`}
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
                              <div
                                key={subField.key}
                                className="w-full flex gap-4"
                              >
                                <Form.Item
                                  noStyle
                                  name={[subField.name, "option"]}
                                  help={`Jika ada lebih dari 1 jawaban, tambahkan menggunakan tombol "Tambah Answer Key". Pastikan huruf kecil/kapital sesuai dengan opsi`}
                                >
                                  <Input
                                    name={`questionAnswer_keys-${parent_id}-${field.name}`}
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
                              disabled={
                                sectionValues?.[splitted[0]]?.questions?.[
                                  splitted[1]
                                ]?.questions?.[splitted[2]]?.questions?.[
                                  splitted[3]
                                ]?.questions?.[field.name]?.type ===
                                  "Multiple Choice" && subFields.length > 0
                                  ? true
                                  : false
                              }
                            >
                              + Add Answer Key
                            </Button>
                          </div>
                        )}
                      </Form.List>
                    </Form.Item>
                  </>
                ) : null}

                {/* SHOW ADD QUESTION BUTTON IF TYPE: SECTION IS SELECTED */}
                {splitted === null &&
                sectionValues?.[sectionField.name]?.questions?.[field.name]
                  ?.type === `Section`
                  ? questionComponent({
                      sectionField: field,
                      parent_id: `${parent_id}-${field.name}`,
                    })
                  : null}
                {splitted?.length === 2 &&
                sectionValues?.[splitted[0]]?.questions?.[splitted[1]]
                  ?.questions?.[field.name]?.type === `Section`
                  ? questionComponent({
                      sectionField: field,
                      parent_id: `${parent_id}-${field.name}`,
                    })
                  : null}
                {splitted?.length === 3 &&
                sectionValues?.[splitted[0]]?.questions?.[splitted[1]]
                  ?.questions?.[splitted[2]]?.questions?.[field.name]?.type ===
                  `Section`
                  ? questionComponent({
                      sectionField: field,
                      parent_id: `${parent_id}-${field.name}`,
                    })
                  : null}
                {splitted?.length === 4 &&
                sectionValues?.[splitted[0]]?.questions?.[splitted[1]]
                  ?.questions?.[splitted[2]]?.questions?.[splitted[3]]
                  ?.questions?.[field.name]?.type === `Section`
                  ? questionComponent({
                      sectionField: field,
                      parent_id: `${parent_id}-${field.name}`,
                    })
                  : null}

                {splitted === null &&
                sectionValues?.[sectionField.name]?.questions?.[field.name]
                  ?.type === `Linear Scale` ? (
                  <FormLinear
                    question_id={
                      dataForm?.sections?.[sectionField?.name]?.questions?.[
                        field.name
                      ]?.id
                    }
                    oldData={
                      dataForm?.sections?.[sectionField?.name]?.questions?.[
                        field.name
                      ]
                    }
                  />
                ) : null}

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

            <Button
              onClick={() =>
                console.log("formLinear ", formLinear.getFieldsValue())
              }
            >
              check
            </Button>

            <Button type="dashed" onClick={() => add()} block>
              + Add Question
            </Button>
          </div>
        )}
      </Form.List>
    );
  };

  if (role === "User") {
    router.push(`/dashboard`);
  }
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
              initVal={formDescValues ?? ""}
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
                          deleteSection(field.name);
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
                          sectionValues?.[field.name]?.sectionDescription ?? ""
                        }
                      />
                    </Form.Item>
                    {questionComponent({
                      sectionField: field,
                      parent_id: field.name,
                    })}
                  </Card>
                ))}
                <Button type="dashed" onClick={() => addSection()} block>
                  + Add Section
                </Button>
              </div>
            )}
          </Form.List>

          <Button
            type="dashed"
            onClick={() => console.log(form.getFieldsValue())}
            block
          >
            Check
          </Button>

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
