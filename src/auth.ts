import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session, token }) {
      session.accessToken = token.accessToken;

      return session;
    },
    jwt({ token, account }) {
      if (account?.provider === "github") {
        return { ...token, accessToken: account.access_token };
      }

      return token;
    },
  },
});
