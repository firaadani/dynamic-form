"use client";

import React, { useState } from "react";
import { Button, Drawer, Radio, Space } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MenuComponent from "./Menu";
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
      <MenuOutlined onClick={toggle} className="text-black" />
      <Drawer
        title="Menu"
        placement={"left"}
        width={300}
        onClose={onClose}
        open={open}
      >
        <MenuComponent />
      </Drawer>
    </>
  );
};
export default SideMenu;
