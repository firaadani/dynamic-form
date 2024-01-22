"use client";
// ini helpers khusus untuk browser jgn pake fungsi server disini
import { notification } from "antd";
import { router } from "next/navigation";

export const PushNavigateTo = async (routes) => {
  console.log(
    "%c Navigating To : " + routes,
    "background: #222; color: #bada55"
  );
  router.push(routes);
};

export const ReplaceNavigateTo = async (routes) => {
  console.log(
    "%c Navigating To : " + routes,
    "background: #222; color: #bada55"
  );
  router.replace(routes);
};

export const showError = (status, message) => {
  notification["error"]({
    message: status,
    description: message ?? "getting data failed",
  });
};

export const showSuccess = (status, message) => {
  notification["success"]({
    message: status,
    description: message ?? "getting data success",
  });
};

export const isBrowser = () => {
  if (typeof window !== "undefined") {
    return true;
  } else return false;
};

export const isDarkModeEnabled = () => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
};
