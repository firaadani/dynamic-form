"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axiosAuth from "../axios";
import axios from "axios";
import { useRefreshToken } from "./useRefreshToken";

const useAxiosAuth = () => {
  const { data: session } = useSession();
  const refreshToken = useRefreshToken();

  // console.log("Global Axios interceptors:", axios.interceptors);
  const requestIntercept = axiosAuth.interceptors.request.use(
    function (config) {
      console.log("config :", { config });
      if (!config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${session.accessToken}`;
      }
      return config;
    },
    function (error) {
      // Do something with request error
      console.log("error request intercept:", { error });
      return Promise.reject(error);
    }
  );

  const responseIntercept = axiosAuth.interceptors.response.use(
    (response) => response,
    async (error) => {
      const prevRequest = error.config;
      console.log("response intercept runs :", {
        error,
        prevRequest: prevRequest,
      });
      if (error.response.status === 401 && !prevRequest.sent) {
        prevRequest.sent = true;
        await refreshToken();
        console.log("session inside response intercept :", { session });
        prevRequest.headers["Authorization"] = `Bearer ${session.accessToken}`;
        return axiosAuth(prevRequest);
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    console.log("useEffect runs :", {});

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [session]);

  return axiosAuth;
};

export default useAxiosAuth;
