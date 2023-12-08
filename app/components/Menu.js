"use client";
import React, { useState, useEffect } from "react";
import {
  AppstoreOutlined,
  UserOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const itemsSuperadmin = [
  getItem("Dashboard", "/dashboard", <AppstoreOutlined />, null, null),
  getItem("User Management", "/user-management", <UserOutlined />, null, null),
  getItem("Forms", "/forms", <FormOutlined />, [
    getItem("Create Form", "/forms/create-form", null, null, null),
    getItem("Form Results", "/forms/results", null, null, null),
  ]),
];
const itemsAdmin = [
  getItem("Dashboard", "/dashboard", <AppstoreOutlined />, null, null),
  getItem("Forms", "/forms", <FormOutlined />, [
    getItem("Create Form", "/forms/create-form", null, null, null),
    getItem("Form Results", "/forms/results", null, null, null),
  ]),
];
const itemsUser = [
  getItem("Dashboard", "/dashboard", <AppstoreOutlined />, null, null),
  getItem("Forms", "/forms", <FormOutlined />, [
    getItem("Answer Form", "/forms/answer-form", null, null, null),
    getItem("Form Results", "/forms/results", null, null, null),
  ]),
];

const getItemsForRole = (role) => {
  switch (role) {
    case "SuperAdmin":
      return itemsSuperadmin;
    case "Admin":
      return itemsAdmin;
    case "User":
      return itemsUser;
    // Add more cases as needed
    default:
      return [];
  }
};

const MenuComponent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  // console.log("session :", { session });

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
      items={getItemsForRole(session?.user?.role)}
      selectedKeys={selectedKeys}
    />
  );
};
export default MenuComponent;
