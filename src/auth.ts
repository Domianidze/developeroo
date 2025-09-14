import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib";

declare module "next-auth" {
  interface Profile {
    login?: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      login?: string;
    } & DefaultSession["user"];
  }
}

import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    login?: string;
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
      session.user.login = token.login;

      return session;
    },
    jwt({ token, account, profile }) {
      if (account?.provider === "github" && profile) {
        return {
          ...token,
          accessToken: account.access_token,
          login: profile.login,
        };
      }

      return token;
    },
  },
});
