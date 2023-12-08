"use client";

import axios from "axios";
import { useSession } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session, update } = useSession();

  const refreshToken = async () => {
    const refreshedSession = await axios.get(
      `${process.env.NEXT_PUBLIC_BE_URL}api/dashboard/refresh`,
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    console.log("refreshedSession :", { refreshedSession });

    await update({
      ...session,
      user: {
        ...session?.user,
        token: refreshedSession?.data?.data?.token,
        accessToken: refreshedSession?.data?.data?.token,
      },
      accessToken: refreshedSession?.data?.data?.token,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    });
    return refreshedSession;
  };

  return { refreshToken };
};
