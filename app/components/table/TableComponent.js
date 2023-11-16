"use client";
import { Table } from "antd";
import React, { useState, useEffect } from "react";

const TableComponent = (props) => {
  const { fetch, session, columns } = props;

  // ==================== TABLE STATES ====================
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // console.log("data :", { data });

  useEffect(() => {
    if (session?.accessToken || session?.user?.token) {
      fetch({ page, pageSize, setData });
    }

    return () => {};
  }, [session]);

  useEffect(() => {
    fetch({ page, pageSize, setData });
    // console.log("page, pageSize :", { page, pageSize });

    return () => {};
  }, [page, pageSize]);

  return (
    <Table
      columns={columns}
      dataSource={data?.data?.map((item, index) => ({ ...item, key: index }))}
      pagination={{
        position: "bottomCenter",
        showSizeChanger: true,
        total: data?.total,
        current: data?.current_page,
        onChange: (a, b) => {
          setPage(a);
          setPageSize(b);
        },
      }}
    />
  );
};

export default TableComponent;
