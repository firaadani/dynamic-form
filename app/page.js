"use client"; // If used in Pages Router, is no need to add this line

import React from "react";
import { Button } from "antd";
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter();
  router.push(`/api/auth/signin`);
  return <></>;
}
