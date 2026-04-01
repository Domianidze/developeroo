import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Portfolio, RequireAuth } from "@/components/server";
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

  return (
    <RequireAuth>
      {({ user }) => {
        if (user.login !== login) {
          redirect(`/${user.login}/edit`);
        }

        return <Portfolio login={login} authMode="owner" email={user.email} />;
      }}
    </RequireAuth>
  );
}
