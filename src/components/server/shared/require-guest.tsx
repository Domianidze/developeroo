import { api } from "@convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

export async function RequireGuest({ children }: PropsWithChildren) {
  const token = await convexAuthNextjsToken();

  if (token) {
    const user = await fetchQuery(api.users.current, {}, { token });

    if (user?.login) {
      redirect(`/${user.login}/edit`);
    }
  }

  return children;
}
