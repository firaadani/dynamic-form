import React from "react";

import "./globals.css";

import { getServerSession } from "next-auth";

import SessionProvider from "./components/SessionProvider";
import _, { get } from "lodash";
import NavMenu from "./components/NavMenu";
import SideMenu from "./components/SideMenu";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function RootLayout({ children, pageProps }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#fff" />
      </head>
      <body>
        <div className="w-full min-h-screen overflow-y-auto">
          <SessionProvider session={session}>
            <NavMenu />
            {children}
          </SessionProvider>
        </div>
      </body>
    </html>
    // <html lang="en">
    //   <body className={inter.className}>{children}</body>
    // </html>
  );
}
