"use client"; // If used in Pages Router, is no need to add this line

import React from "react";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function App() {
  const router = useRouter();
  const { data: session } = useSession();
  if (session) {
    router.push(`/dashboard`);
  } else {
    router.push(`/api/auth/signin`);
  }
  return <></>;
}
