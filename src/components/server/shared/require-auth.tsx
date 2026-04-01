import { api } from "@convex/_generated/api";
import type { CurrentUser } from "@convex/users";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

interface RequireAuthProps {
  children: ((props: { user: CurrentUser }) => ReactNode) | ReactNode;
}

export async function RequireAuth({ children }: RequireAuthProps) {
  const token = await convexAuthNextjsToken();

  const user = await fetchQuery(api.users.current, {}, { token });

  if (!user) {
    redirect("/");
  }

  return typeof children === "function" ? children({ user }) : children;
}
