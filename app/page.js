"use client"; // If used in Pages Router, is no need to add this line

import React from "react";
import { Button } from "antd";

export default function App() {
  return (
    <div className="App max-w-md flex justify-center items-start">
      <Button type="primary bg-indigo-500">Button</Button>
    </div>
  );
}
