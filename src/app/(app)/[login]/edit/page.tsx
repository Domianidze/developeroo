import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Portfolio } from "@/components";
import { title } from "@/lib";

interface PortfolioEditProps {
  params: Promise<{ login: string }>;
}

export async function generateMetadata({
  params,
}: PortfolioEditProps): Promise<Metadata> {
  const { login } = await params;

  return {
    title: title(login),
    description: "Edit your developer portfolio",
  };
}

export default async function PortfolioEdit({ params }: PortfolioEditProps) {
  const { login } = await params;

  const session = await auth();

  if (login !== session?.user.login) {
    redirect("/");
  }

  return <Portfolio login={login} session={session} />;
}
