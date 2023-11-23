"use client";
import React from "react";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import SideMenu from "./SideMenu";
import { usePathname } from "next/navigation";
import { titleCase } from "@/lib/helpers";

function AuthButton() {
  const { data: session, status } = useSession();
  // console.log("session :", { session, status });
  const pathname = usePathname();

  return (
    <div className="w-full flex justify-between p-4 bg-white drop-shadow-lg ">
      <div className="flex gap-6">
        <SideMenu />
        <p className="text-lg">
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
