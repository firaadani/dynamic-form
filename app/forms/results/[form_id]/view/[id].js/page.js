"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { RightOutlined, CheckOutlined } from "@ant-design/icons";
import _ from "lodash";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

const ViewResultsPage = ({ params }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const form_id = pathname?.split("/")?.[3];
  const { id } = params;
  // console.log("id :", { id, pathname:  });
  const url = process.env.NEXT_PUBLIC_BE_URL;
  const axiosAuth = useAxiosAuth();

  // ==================== STATES ====================
  const [data, setData] = useState(null);

  // ==================== FUNCTIONS ====================

  const getAnswersById = async () => {
    try {
      let params = {
        include: "results.users",
        user_id: pathname?.split("view/")?.[1],
      };
      let res = await axiosAuth.get(`${url}api/dashboard/forms/${form_id}`, {
        params,
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      console.log("res :", { res });
      if (res?.status === 200) {
        setData(res?.data?.data);
      }
    } catch (error) {}
  };

  function isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  // ==================== EFFECTS ====================
  useEffect(() => {
    getAnswersById();

    return () => {};
  }, []);

  // ==================== COMPONENTS ====================
  const renderQuestion = ({ parent, self, index }) => {
    if (self?.type === "Section") {
      return (
        <div key={index}>
          <p className="my-2">
            <RightOutlined className="mr-2" />
            {self?.question}
          </p>
          <div className="p-4 ml-4 border border-1 border-indigo-500 rounded-2xl">
            {self?.sub_question?.map((child, index) => {
              return (
                <div key={index}>
                  {renderQuestion({
                    self: child,
                    index: index,
                  })}
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      let answer = self.answers?.[0]?.answer;
      // console.log("answer :", { answer });

      if (["Multiple Choice", "Checkboxes"]?.includes(self?.type)) {
        return (
          <div key={index}>
            <p className="my-2">{self?.question}</p>
            <div className="bg-indigo-300 w-full rounded-md px-3 py-1 flex gap-4">
              {!_.isEmpty(answer) && _.isArray(JSON.parse(answer)) ? (
                JSON.parse(self.option)?.map((item, index) => {
                  const includes = _.map(JSON.parse(answer), "option").includes(
                    item?.option
                  );

                  return (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="bg-white rounded-md w-[20px] h-[20px] border-1 flex items-center justify-center">
                        <CheckOutlined className={includes ? "" : "hidden"} />
                      </div>
                      <p>{item?.option}</p>
                    </div>
                  );
                })
              ) : (
                <>
                  {JSON.parse(self.option)?.map((item, index) => {
                    const includes = JSON.parse(answer)?.option?.includes(
                      item?.option
                    );

                    return (
                      <div key={index} className="flex gap-2 items-center">
                        <div className="bg-white rounded-full w-[20px] h-[20px] border-1 flex items-center justify-center">
                          <div
                            className={
                              includes
                                ? "bg-black rounded-full w-[12px] h-[12px]"
                                : ""
                            }
                          />
                        </div>
                        <p>{item?.option}</p>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        );
      } else if (self?.type === "File Upload") {
        return (
          <div key={index}>
            <p className="my-2">{self?.question}</p>
            <div className="bg-indigo-300 w-full rounded-md px-3 py-1">
              <a
                className="text-indigo-700 underline"
                href={url + answer?.replace("public", "storage")}
                target="__blank"
              >
                view answer
              </a>
            </div>
          </div>
        );
      } else if (self?.type === "Paragraph") {
        return (
          <div key={index}>
            <p className="my-2">{self?.question}</p>
            <div
              className="bg-indigo-300 w-full rounded-md px-3 py-1"
              dangerouslySetInnerHTML={{ __html: answer }}
            ></div>
          </div>
        );
      } else {
        return (
          <div key={index}>
            <p className="my-2">{self?.question}</p>
            <div className="bg-indigo-300 w-full rounded-md px-3 py-1">
              {answer}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="m-4 p-10 bg-white rounded-xl drop-shadow-sm flex flex-col gap-4">
      <p>Form {data?.title}</p>
      <p className="mb-10">
        Answered by: {data?.results?.[0]?.users?.name} (
        {data?.results?.[0]?.users?.username})
      </p>

      {data?.sections?.map((item, index) => {
        return (
          <div key={index} className="border-1 rounded-2xl border-indigo-500">
            <p>{item?.title}</p>

            {item?.questions?.map((q, qIndex) => {
              return (
                <div key={qIndex} className="p-4 m-4 bg-indigo-200 rounded-2xl">
                  {renderQuestion({ self: q, index: qIndex })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ViewResultsPage;

// "use client";
// import React, { useState, useEffect } from "react";
// import axiosAuth from "axiosAuth";
// import { useSession } from "next-auth/react";
// import {
//   Button,
//   Checkbox,
//   DatePicker,
//   Form,
//   Input,
//   Modal,
//   Radio,
//   Steps,
//   TimePicker,
//   message,
// } from "antd";
// import TextArea from "antd/es/input/TextArea";
// import Dragger from "antd/es/upload/Dragger";
// import { InboxOutlined } from "@ant-design/icons";
// import _ from "lodash";
// import moment from "moment";
// import { showError, showSuccess } from "@/lib/helpersClient";
// import { usePathname, useRouter } from "next/navigation";

// const ViewResultsPage = ({ params }) => {
//   const url = process.env.NEXT_PUBLIC_BE_URL;
//   const { data: session } = useSession();
//   const pathname = usePathname();
//   const form_id = pathname?.split("/")?.[3];
//   const { id } = params;
//   const [form] = Form.useForm();
//   const router = useRouter();

//   // ==================== STATES ====================
//   const [dataForm, setDataForm] = useState({});
//   const [current, setCurrent] = useState(0);
//   const [steps, setSteps] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const props = {
//     name: "file",
//     multiple: false,
//     showUploadList: false,
//     onChange(info) {
//       const { status } = info.file;
//       if (status !== "uploading") {
//         console.log(info.file, info.fileList);
//       }
//       if (status === "done") {
//         message.success(`${info.file.name} file uploaded successfully.`);
//       } else if (status === "error") {
//         message.error(`${info.file.name} file upload failed.`);
//       }
//     },
//     onDrop(e) {
//       console.log("Dropped files", e.dataTransfer.files);
//     },
//     // beforeUpload: (file) => {
//     //   setFileList([...fileList, file]);
//     //   return false;
//     // },
//   };

//   const customRequest = async ({ file, qId }) => {
//     console.log("file, onSuccess, onError :", {
//       file,
//       qId,
//     });
//     // You can customize the payload here
//     const formData = new FormData();
//     formData.append("answer", file?.file);
//     formData.append("question_id", qId);

//     // Replace the URL with your actual server endpoint
//     try {
//       let res = await axiosAuth.post(`${url}api/dashboard/answers`, formData, {
//         headers: {
//           Authorization: `Bearer ${session?.accessToken}`,
//         },
//       });
//       if (res?.status === 200 || res?.status === 201) {
//         message.success("Berhasil upload file");
//         getFormById();
//       }
//     } catch (error) {
//       message.error(`Gagal upload file ${error.message}`);
//     }
//   };

//   const [checkedOptions, setCheckedOptions] = useState([]);

//   const handleCheckboxChange = (checkedValues) => {
//     setCheckedOptions(checkedValues);
//   };

//   function isDateValid(dateString) {
//     const timestamp = Date.parse(dateString);
//     return !isNaN(timestamp) && isFinite(timestamp);
//   }

//   function isValidTime(timeString) {
//     const date = new Date("2000-01-01 " + timeString);
//     return !isNaN(date.getTime());
//   }

//   const getFormById = async () => {
//     try {
//       let params = {
//         include:
//           "sections.questions.answers,sections.questions.subQuestion.answers,sections.questions.subQuestion.subQuestion.answers,sections.questions.subQuestion.subQuestion.subQuestion.answers,sections.questions.subQuestion.subQuestion.subQuestion.subQuestion.answers,users",
//         user_id: id,
//       };
//       let res = await axiosAuth.get(`${url}api/dashboard/forms/${form_id}`, {
//         params,
//         headers: {
//           Authorization: `Bearer ${session?.accessToken}`,
//         },
//       });
//       if (res?.status === 200) {
//         setDataForm(res?.data?.data);
//         setSteps(res?.data?.data?.sections);
//       }
//     } catch (error) {
//       console.log("error :", { error });
//     }
//   };

//   const submitForm = async () => {
//     try {
//       let params = { form_id: id };
//       let res = await axiosAuth.post(`${url}api/dashboard/results`, params, {
//         headers: {
//           Authorization: `Bearer ${session?.accessToken}`,
//         },
//       });
//       console.log("res :", { res });
//       if (res?.status === 200 || res?.status === 201) {
//         showSuccess("Berhasil", "Berhasil submit form");
//         router.push(`/forms/answer-form`);
//       }
//     } catch (error) {
//       console.log("error :", { error });
//       showError("Gagal submit form", `${error.message}`);
//     }
//   };

//   const modalKonfirmasi = () => {
//     return (
//       <Modal
//         title="Basic Modal"
//         open={isModalOpen}
//         onOk={submitForm}
//         okType="default"
//         okButtonProps={{ className: "bg-indigo-500 text-white" }}
//         onCancel={() => setIsModalOpen(false)}
//       >
//         <p>Pastikan Anda telah selesai mengisi form sebelum submit</p>
//       </Modal>
//     );
//   };

//   function isJsonString(str) {
//     try {
//       JSON.parse(str);
//     } catch (e) {
//       return false;
//     }
//     return true;
//   }

//   const next = () => {
//     setCurrent(current + 1);
//   };
//   const prev = () => {
//     setCurrent(current - 1);
//   };
//   const items = steps.map((item, index) => ({
//     key: item.index,
//     title: item.title,
//   }));

//   useEffect(() => {
//     getFormById();

//     return () => {};
//   }, []);

//   useEffect(() => {
//     if (!_.isEmpty(dataForm)) {
//       console.log("dataForm :", { dataForm });
//       dataForm?.sections?.map((item, index) => {
//         item?.questions?.map((q, qIndex) => {
//           console.log("q :", { q });
//           let answer = q?.answers?.[0]?.answer;
//           if (
//             isDateValid(q?.answers?.[0]?.answer) ||
//             isValidTime(q?.answers?.[0]?.answer)
//           ) {
//             form.setFields([
//               {
//                 name: `question-${item?.id}-${q?.id}`,
//                 value: moment(q?.answers?.[0]?.answer),
//               },
//             ]);
//           } else {
//             form.setFields([
//               {
//                 name: `question-${item?.id}-${q?.id}`,
//                 value:
//                   isJsonString(answer) && _.isArray(JSON.parse(answer))
//                     ? JSON.parse(answer)?.map((item) => item.option)
//                     : isJsonString(answer)
//                     ? JSON.parse(answer)?.option
//                     : answer,
//               },
//             ]);
//           }
//           if (!_.isEmpty(q?.sub_question)) {
//             q?.sub_question?.map((qq) => {
//               const answer = qq?.answers?.[0]?.answer;
//               if (isDateValid(answer)) {
//                 form.setFields([
//                   {
//                     name: `question-${item?.id}-${q?.id}-${qq?.id}`,
//                     value: moment(answer),
//                   },
//                 ]);
//               } else if (isValidTime(answer)) {
//                 form.setFields([
//                   {
//                     name: `question-${item?.id}-${q?.id}-${qq?.id}`,
//                     value: moment(answer, "HH:mm:ss"),
//                   },
//                 ]);
//               } else {
//                 form.setFields([
//                   {
//                     name: `question-${item?.id}-${q?.id}-${qq?.id}`,
//                     value:
//                       isJsonString(answer) && _.isArray(JSON.parse(answer))
//                         ? JSON.parse(answer)?.map((item) => item.option)
//                         : isJsonString(answer)
//                         ? JSON.parse(answer)?.option
//                         : answer,
//                   },
//                 ]);
//               }
//               if (!_.isEmpty(qq?.sub_question)) {
//                 qq?.sub_question?.map((qqq) => {
//                   const answer = qqq?.answers?.[0]?.answer;
//                   if (isDateValid(answer)) {
//                     form.setFields([
//                       {
//                         name: `question-${item?.id}-${q?.id}-${qq?.id}-${qqq?.id}`,
//                         value: moment(answer),
//                       },
//                     ]);
//                   } else if (isValidTime(answer)) {
//                     form.setFields([
//                       {
//                         name: `question-${item?.id}-${q?.id}-${qq?.id}-${qqq?.id}`,
//                         value: moment(answer, "HH:mm:ss"),
//                       },
//                     ]);
//                   } else {
//                     form.setFields([
//                       {
//                         name: `question-${item?.id}-${q?.id}-${qq?.id}-${qqq?.id}`,
//                         value:
//                           isJsonString(answer) && _.isArray(JSON.parse(answer))
//                             ? JSON.parse(answer)?.map((item) => item.option)
//                             : isJsonString(answer)
//                             ? JSON.parse(answer)?.option
//                             : answer,
//                       },
//                     ]);
//                   }
//                   if (!_.isEmpty(qqq?.sub_question)) {
//                     qqq?.sub_question?.map((qqqq) => {
//                       const answer = qqqq?.answers?.[0]?.answer;
//                       if (isDateValid(answer)) {
//                         form.setFields([
//                           {
//                             name: `question-${item?.id}-${q?.id}-${qq?.id}-${qqq?.id}-${qqqq?.id}`,
//                             value: moment(answer),
//                           },
//                         ]);
//                       } else if (isValidTime(answer)) {
//                         form.setFields([
//                           {
//                             name: `question-${item?.id}-${q?.id}-${qq?.id}-${qqq?.id}-${qqqq?.id}`,
//                             value: moment(answer, "HH:mm:ss"),
//                           },
//                         ]);
//                       } else {
//                         form.setFields([
//                           {
//                             name: `question-${item?.id}-${q?.id}-${qq?.id}-${qqq?.id}-${qqqq?.id}`,
//                             value:
//                               isJsonString(answer) &&
//                               _.isArray(JSON.parse(answer))
//                                 ? JSON.parse(answer)?.map((item) => item.option)
//                                 : isJsonString(answer)
//                                 ? JSON.parse(answer)?.option
//                                 : answer,
//                           },
//                         ]);
//                       }
//                     });
//                   }
//                 });
//               }
//             });
//           }
//         });
//       });
//     }

//     return () => {};
//   }, [dataForm]);

//   const renderQuestion = ({ parent_id, parent, self, index }) => {
//     return (
//       <Form.Item
//         label={self?.question}
//         // pola nama : question + section.id + question.id
//         name={`question-${parent_id}-${self?.id}`}
//         key={self?.id}
//         className={
//           current === index ? `border border-1 rounded-2xl p-4` : `hidden`
//         }
//       >
//         {self?.type === "Section" ? (
//           <>
//             {self?.sub_question?.map((child) => {
//               // console.log("child :", { parent, self, child });
//               return (
//                 <>
//                   {renderQuestion({
//                     parent_id: `${parent_id}-${self.id}`,
//                     parent: self,
//                     self: child,
//                     index: index,
//                   })}
//                 </>
//               );
//             })}
//           </>
//         ) : null}
//         {self?.type === "Short Answer" ? (
//           <Input
//             className="disabled:bg-indigo-200 disabled:text-black"
//             disabled={true}
//           />
//         ) : null}
//         {self?.type === "Paragraph" ? (
//           <TextArea
//             className="disabled:bg-indigo-200 disabled:text-black"
//             disabled={true}
//           />
//         ) : null}
//         {self?.type === "Multiple Choice" ? (
//           <Radio.Group>
//             {self?.option &&
//               JSON.parse(self?.option)?.map((item) => {
//                 return (
//                   <Radio disabled={true} value={item?.option}>
//                     {item?.option}
//                   </Radio>
//                 );
//               })}
//           </Radio.Group>
//         ) : null}
//         {self?.type === "Checkboxes" ? (
//           <Checkbox.Group
//             options={JSON?.parse(self?.option)?.map((item) => {
//               return {
//                 label: item?.option,
//                 value: item?.option,
//               };
//             })}
//             onChange={handleCheckboxChange}
//             disabled={true}
//           />
//         ) : null}
//         {self?.type === "File Upload" ? (
//           <div className="bg-indigo-200 rounded-md py-1 px-3">
//             {!_.isEmpty(self?.answers?.[0]?.answer) ? (
//               <a
//                 href={
//                   url + self?.answers?.[0]?.answer?.replace("public", "storage")
//                 }
//                 target="__blank"
//               >
//                 {self.question}'s answer
//               </a>
//             ) : null}
//           </div>
//         ) : null}
//         {self?.type === "Date" ? (
//           <DatePicker
//             className="disabled:bg-indigo-200 disabled:text-black"
//             disabled={true}
//           />
//         ) : null}
//         {self?.type === "Time" ? (
//           <TimePicker
//             className="disabled:bg-indigo-200 disabled:text-black"
//             disabled={true}
//           />
//         ) : null}
//       </Form.Item>
//     );
//   };

//   if (dataForm) {
//     return (
//       <div className="m-10 bg-white rounded-2xl drop-shadow-sm p-10">
//         {modalKonfirmasi()}
//         <p>{dataForm?.title}</p>
//         <p className="flex gap-2">
//           Deskripsi:
//           <span dangerouslySetInnerHTML={{ __html: dataForm?.description }} />
//         </p>

//         <Steps className="my-10" current={current} items={items} />

//         <Form form={form} layout="vertical">
//           {steps?.map((item, index) => {
//             return item?.questions?.map((q, qIndex) => {
//               return renderQuestion({
//                 parent_id: item?.id,
//                 self: q,
//                 parent: item,
//                 index: index,
//               });
//             });
//           })}
//         </Form>
//       </div>
//     );
//   } else {
//     return <p>Loading...</p>;
//   }
// };

// export default ViewResultsPage;
