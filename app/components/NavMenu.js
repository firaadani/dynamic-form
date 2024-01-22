"use client";
import React, { useState, useEffect } from "react";

import Link from "next/link";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import SideMenu from "./SideMenu";
import { usePathname, useRouter } from "next/navigation";
import { titleCase } from "@/lib/helpers";
import axios from "axios";
import { isDarkModeEnabled } from "@/lib/helpersClient";

function AuthButton() {
  const { data: session, update, status } = useSession();
  const router = useRouter();

  const [currentSession, setCurrentSession] = useState({ exp: session?.exp });
  // const [darkMode, setDarkMode] = useState(isDarkModeEnabled());

  // console.log("darkMode :", { darkMode });

  const [error, setError] = useState(false);

  useEffect(() => {
    let a = async () => {
      const cSession = await getSession();
      setCurrentSession(cSession);
    };

    a();
    if (!session) {
      router.push(`/api/auth/signin`);
    }

    return () => {};
  }, []);

  useEffect(() => {
    const refreshSession = async () => {
      try {
        // Get the current session to check the expiration time

        // Check if the session is about to expire (e.g., within the next 5 minutes)
        const isSessionAboutToExpire =
          currentSession &&
          currentSession.exp &&
          Date.now() / 1000 + 60 * 60 > currentSession.exp;

        if (isSessionAboutToExpire) {
          // Perform the token refresh logic (e.g., call your API to refresh the token)
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

          setCurrentSession({
            ...session,
            user: {
              ...session?.user,
              token: refreshedSession?.data?.data?.token,
              accessToken: refreshedSession?.data?.data?.token,
            },
            accessToken: refreshedSession?.data?.data?.token,
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
          });

          // Update the session with the refreshed session data
          // mutate('/api/auth/session', refreshedSession);
        }
      } catch (error) {
        console.error("Error refreshing session:", error);
        // signOut();
      }
    };

    // Refresh the session periodically (e.g., every 5 minutes)
    console.log("session :", { session });
    const refreshInterval = setInterval(refreshSession, 10 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [session]);

  const pathname = usePathname();

  return (
    <div className="w-full flex justify-between p-4 bg-white drop-shadow-lg ">
      <div className="flex gap-6">
        <SideMenu />
        <p className="text-lg text-black">
          Dynamic Form &nbsp;
          <span className="text-gray-500 text-sm">
            {pathname === "/"
              ? null
              : titleCase(
                  pathname?.replaceAll("-", " ")?.replaceAll("/", " / ")
                )}
          </span>
        </p>
      </div>
      <div className="flex justify-end gap-6">
        {session ? session?.user?.name : null}
        <button
          onClick={session ? signOut : signIn}
          className="bg-indigo-500 px-4 rounded-md text-white drop-shadow-md"
        >
          {session ? "Sign Out" : "Sign In"}
        </button>
      </div>
    </div>
  );
}

export default function NavMenu() {
  return (
    <div>
      <AuthButton />
    </div>
  );
}
