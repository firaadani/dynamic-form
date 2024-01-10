import React, { useState, useEffect } from "react";
import { Checkbox } from "antd";
import _ from "lodash";

const CheckboxWithLeveling = ({
  options,
  form,
  parent_id,
  self,
  postAnswer,
}) => {
  const [selectedLabel, setSelectedLabel] = useState([]);
  const [firstRender, setFirstRender] = useState(true);
  const [secondRender, setSecondRender] = useState(false);
  const [value, setValue] = useState(
    typeof form.getFieldsValue(`question-${parent_id}-${self?.id}`) ===
      "object" &&
      _.isEmpty(form.getFieldsValue(`question-${parent_id}-${self?.id}`))
      ? []
      : form.getFieldsValue(`question-${parent_id}-${self?.id}`)?.[
          `question-${parent_id}-${self?.id}`
        ]
  );
  console.log("check value :", {
    value,
  });
  const [checkboxOptions, setCheckboxOptions] = useState(
    options?.map((item, index) => ({
      ...item,
      label: item?.option,
      value: index,
      name: item?.option,
      disabled:
        index === 0
          ? false
          : _.isEmpty(value)
          ? true
          : value?.includes(index - 1)
          ? false
          : true,
    }))
  );

  const handleChange = (e) => {
    if (value?.includes(e?.target?.value)) {
      setValue((prev) =>
        prev.filter((item) => {
          if (item === e.target.value || item > e.target.value) return false;
          else return true;
        })
      );
    } else {
      setValue((prev) => [...prev, e.target.value]);
    }
  };

  useEffect(() => {
    if (firstRender) {
      console.log("first render value", value);
      setFirstRender(false);
      setSecondRender(true);
    }
    if (secondRender) {
      setValue(
        typeof form.getFieldsValue(`question-${parent_id}-${self?.id}`) ===
          "object" &&
          _.isEmpty(form.getFieldsValue(`question-${parent_id}-${self?.id}`))
          ? []
          : form.getFieldsValue(`question-${parent_id}-${self?.id}`)?.[
              `question-${parent_id}-${self?.id}`
            ]
      );
      setSecondRender(false);
    }

    return () => {};
  }, [form.getFieldsValue(`question-${parent_id}-${self?.id}`)]);

  useEffect(() => {
    console.log("useEffect triggered", { value });
    if (!_.isEmpty(value)) {
      let newObj = options?.map((item, index) => ({
        ...item,
        label: item?.option,
        value: index,
        name: item?.option,
        disabled:
          index === 0
            ? false
            : _.isEmpty(value)
            ? true
            : value?.includes(index - 1)
            ? false
            : true,
      }));
      setCheckboxOptions(newObj);
      if (
        value !==
        form.getFieldsValue(`question-${parent_id}-${self?.id}`)?.[
          `question-${parent_id}-${self?.id}`
        ]
      ) {
        postAnswer({ answer: JSON.stringify(value), id: self?.id });
      }
    } else {
      if (
        !firstRender &&
        !secondRender &&
        value !==
          form.getFieldsValue(`question-${parent_id}-${self?.id}`)?.[
            `question-${parent_id}-${self?.id}`
          ]
      ) {
        let newObj = options?.map((item, index) => ({
          ...item,
          label: item?.option,
          value: index,
          name: item?.option,
          disabled:
            index === 0
              ? false
              : _.isEmpty(value)
              ? true
              : value?.includes(index - 1)
              ? false
              : true,
        }));
        setCheckboxOptions(newObj);
        postAnswer({ answer: JSON.stringify(value), id: self?.id });
      }
    }

    return () => {};
  }, [value]);

  // return <Checkbox.Group options={checkboxOptions} onChange={handleChange} />;
  return (
    <>
      {checkboxOptions?.map((item, index) => {
        return (
          <Checkbox
            key={index}
            value={item?.value}
            disabled={item?.disabled}
            checked={value?.includes(index) ? true : false}
            onChange={handleChange}
          >
            {item?.label}
          </Checkbox>
        );
      })}
    </>
  );
};

export default CheckboxWithLeveling;
