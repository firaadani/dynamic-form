import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { Form, Input, Select } from "antd";
import React, { useEffect, useState } from "react";

const FormLinear = ({ question_id, oldData }) => {
  const [formLinear] = Form.useForm();
  const from = Form.useWatch("from", formLinear);
  const to = Form.useWatch("to", formLinear);
  const axiosAuth = useAxiosAuth();

  const [fromLabel, setFromLabel] = useState("");
  const [toLabel, setToLabel] = useState("");

  function createAscendingArray(first, last) {
    let result = [];
    for (let i = first; i <= last; i++) {
      result.push(i);
    }
    return result;
  }

  let a = createAscendingArray(from, to)?.map((item) => ({ option: item }));

  let options = {
    from: from,
    to: to,
    options: a,
    fromLabel: fromLabel,
    toLabel: toLabel,
  };

  useEffect(() => {
    if (oldData?.option) {
      console.log("oldData?.option :", { option: JSON.parse(oldData?.option) });
      let parsed = JSON.parse(oldData?.option);
      formLinear.setFields([
        {
          name: "from",
          value: parsed?.from,
        },
        {
          name: "to",
          value: parsed?.to,
        },
      ]);
      setFromLabel(parsed?.fromLabel);
      setToLabel(parsed?.toLabel);
    }

    return () => {};
  }, [oldData]);

  const postOptions = async ({ from_label, to_label }) => {
    console.log("postOptions called :", { from_label, to_label });
    try {
      let params = {
        ...oldData,
        option: options,
        _method: "PATCH",
      };

      if (from_label) {
        params.option.fromLabel = from_label;
      }
      if (to_label) {
        params.option.toLabel = to_label;
      }
      let res = await axiosAuth.post(
        `api/dashboard/questions/${question_id}`,
        params
      );
      console.log("res :", { res });
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log("options :", {
    options: JSON.stringify(options),
    question_id,
    oldData,
  });

  return (
    <Form form={formLinear} initialValues={{ from: 1, to: 5 }}>
      <div className="flex flex-row items-center gap-2">
        <Form.Item name="from">
          <Select
            options={[
              {
                label: 0,
                value: 0,
              },
              {
                label: 1,
                value: 1,
              },
            ]}
            onBlur={postOptions}
          />
        </Form.Item>
        <p>to</p>
        <Form.Item name="to">
          <Select
            onBlur={postOptions}
            options={[
              {
                label: 2,
                value: 2,
              },
              {
                label: 3,
                value: 3,
              },
              {
                label: 4,
                value: 4,
              },
              {
                label: 5,
                value: 5,
              },
              {
                label: 6,
                value: 6,
              },
              {
                label: 7,
                value: 7,
              },
              {
                label: 8,
                value: 8,
              },
              {
                label: 9,
                value: 9,
              },
              {
                label: 10,
                value: 10,
              },
            ]}
          />
        </Form.Item>
      </div>
      <div className="flex flex-row items-center gap-2 mt-4 my-2 ">
        <p>{from ?? "1"}</p>{" "}
        <Input
          value={fromLabel}
          onChange={(e) => setFromLabel(e?.target?.value)}
          placeholder="Label (optional)"
          onBlur={(e) => {
            setFromLabel(e?.target?.value);
            postOptions({ from_label: e?.target?.value });
          }}
        />
      </div>
      <div className="flex flex-row items-center gap-2 my-2 ">
        <p>{to ?? "5"}</p>{" "}
        <Input
          value={toLabel}
          onChange={(e) => setToLabel(e?.target?.value)}
          placeholder="Label (optional)"
          onBlur={(e) => {
            setToLabel(e?.target?.value);
            postOptions({ to_label: e?.target?.value });
          }}
        />
      </div>
    </Form>
  );
};

export default FormLinear;
