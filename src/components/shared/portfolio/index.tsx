import { Octokit } from "@octokit/rest";
import type { Session } from "next-auth";
import { Contributions } from "./contributions";

interface PortfolioProps {
  login: string;
  session: Session;
}

export async function Portfolio({ login, session }: PortfolioProps) {
  const octokit = new Octokit({
    auth: session?.accessToken,
  });

  return (
    <div className="py-20 mx-auto w-4xl max-w-full px-5">
      <Contributions login={login} octokit={octokit} />
    </div>
  );
}
