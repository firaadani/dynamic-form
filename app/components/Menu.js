"use client";
import React, { useState, useEffect } from "react";
import {
  AppstoreOutlined,
  UserOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem("Dashboard", "/dashboard", <AppstoreOutlined />, null, null),
  getItem("User Management", "/user-management", <UserOutlined />, null, null),
  // {
  //   type: "divider",
  // },
  getItem("Forms", "sub4", <FormOutlined />, [
    getItem("Create Form", "/forms/create-form", null, null, null),
    getItem("Answer Form", "/forms/answer-form", null, null, null),
    getItem("Form Results", "/forms/results", null, null, null),
  ]),
];
const MenuComponent = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedKeys, setSelectedKeys] = useState([]);

  const onClick = (e) => {
    console.log("click ", e);
    router.push(e.key);
  };

  useEffect(() => {
    console.log("pathname :", { pathname });

    setSelectedKeys(pathname);

    return () => {};
  }, [pathname]);

  return (
    <Menu
      onClick={onClick}
      style={{
        width: 256,
      }}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      items={items}
      selectedKeys={selectedKeys}
    />
  );
};
export default MenuComponent;
