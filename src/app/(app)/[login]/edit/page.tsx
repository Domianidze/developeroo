import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EditSidebar } from "@/components";
import { Portfolio, RequireAuth } from "@/components/server";
import { title } from "@/lib";
import { getRequestBaseUrl } from "@/lib/server";

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

  const baseUrl = await getRequestBaseUrl();

  return (
    <RequireAuth>
      {({ user }) => {
        if (user.login !== login) {
          redirect(`/${user.login}/edit`);
        }

        return (
          <EditSidebar
            baseUrl={baseUrl}
            login={login}
            published={user.published}
          >
            <Portfolio login={login} authMode="owner" email={user.email} />
          </EditSidebar>
        );
      }}
    </RequireAuth>
  );
}
