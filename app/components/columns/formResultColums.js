import React from "react";

export const formResultColumns = [
  {
    title: "No",
    dataIndex: "key",
    key: "key",
    render: (value) => {
      return value + 1;
    },
  },
  {
    title: "Form Name",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Access",
    dataIndex: "access",
    key: "access",
  },
];

export const formResultByIdColumns = [
  {
    title: "No",
    dataIndex: "key",
    key: "key",
    render: (value) => {
      return value + 1;
    },
  },
  {
    title: "Username",
    dataIndex: "users",
    key: "users",
    render: (value, item) => <p>{value?.name}</p>,
  },
];
