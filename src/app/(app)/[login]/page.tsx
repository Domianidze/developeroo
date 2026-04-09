import { api } from "@convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Portfolio } from "@/components/server";
import { title } from "@/lib";

interface PortfolioViewProps {
  params: Promise<{ login: string }>;
}

export async function generateMetadata({
  params,
}: PortfolioViewProps): Promise<Metadata> {
  const { login } = await params;

  return {
    title: title(login),
    description: `View ${login}'s developer portfolio`,
  };
}

export default async function PortfolioView({ params }: PortfolioViewProps) {
  const { login } = await params;

  const token = await convexAuthNextjsToken();

  if (token) {
    const currentUser = await fetchQuery(api.users.current, {}, { token });

    if (currentUser?.login === login) {
      redirect(`/${login}/edit`);
    }
  }

  const user = await fetchQuery(api.users.byLogin, { login });

  if (!user?.published) {
    redirect("/");
  }

  return <Portfolio login={login} authMode="viewer" email={user.email} />;
}
