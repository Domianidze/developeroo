import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { Button } from "@/components";
import { title } from "@/lib";

export const metadata: Metadata = {
  title: title("Portfolio in an Instant"),
  description:
    "Generate a developer portfolio from your Github profile with a click of a button",
};

export default async function Landing() {
  const session = await auth();

  if (session) {
    redirect(`/${session.user.login}/edit`);
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-3">
      <Button
        variant="outline"
        onClick={async () => {
          "use server";

          await signIn("github");
        }}
      >
        Portfolio in an Instant
      </Button>
    </div>
  );
}
