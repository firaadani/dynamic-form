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
    dataIndex: "forms",
    key: "title",
    render: (value) => {
      return <p>{value?.title}</p>;
    },
  },
  {
    title: "Access",
    dataIndex: "forms",
    key: "access",
    render: (value) => {
      return <p>{value?.access}</p>;
    },
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
