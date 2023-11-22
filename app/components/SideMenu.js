"use client";

import React, { useState } from "react";
import { Button, Drawer, Radio, Space } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
const SideMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  // console.log("pathname :", { pathname });

  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen((prev) => !prev);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MenuOutlined onClick={toggle} />
      <Drawer
        title="Menu"
        placement={"left"}
        width={300}
        onClose={onClose}
        open={open}
      >
        <div className={`flex flex-col gap-4`}>
          <Link
            href={`/dashboard`}
            className={pathname.includes("/dashboard") ? "text-indigo-500" : ""}
          >
            Dashboard
          </Link>
          <Link
            href={`/user-management`}
            className={
              pathname.includes("/user-management") ? "text-indigo-500" : ""
            }
          >
            User Management
          </Link>
          <Link
            href={`/create-form`}
            className={
              pathname.includes("/create-form") ? "text-indigo-500" : ""
            }
          >
            Create Form
          </Link>
          <Link
            href={`/answer-form`}
            className={
              pathname.includes("/answer-form") ? "text-indigo-500" : ""
            }
          >
            Answer Form
          </Link>
        </div>
      </Drawer>
    </>
  );
};
export default SideMenu;
