import { api } from "@convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/landing";
import { title } from "@/lib";

export const metadata: Metadata = {
  title: title("Portfolio in an Instant"),
  description:
    "Generate a developer portfolio from your Github profile with a click of a button",
};

export default async function Landing() {
  const token = await convexAuthNextjsToken();

  if (token !== undefined) {
    const user = await fetchQuery(api.users.current, {}, { token });

    if (user?.login) {
      redirect(`/${user.login}/edit`);
    }
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-3">
      <SignInButton />
    </div>
  );
}
