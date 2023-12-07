import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "@/lib/axios";

export const authOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Email/Username",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Username or Email",
          type: "text",
          placeholder: "jsmith",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // console.log("credentials, req :", { credentials, req });
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await axios.post("api/dashboard/login", {
          email: credentials.email,
          password: credentials.password,
        });
        const data = res?.data;

        // If no error and we have user data, return it
        if (res.status === 200 && data) {
          return { ...data?.data?.user, token: data?.data?.token };
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      token.exp = Math.floor(Date.now() / 1000) + 60 * 60; // 1 minute

      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      await token;
      // console.log("session,token,user :", { session, token, user });

      session.user &&
        (session.accessToken = token.token) &&
        (session.user.accessToken = token.token) &&
        (session.user.role = token.role) &&
        (session.exp = token.exp);
      // console.log("session :", { session });
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
