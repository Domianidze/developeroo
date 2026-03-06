import { Octokit } from "@octokit/rest";
import { Contributions } from "./contributions";
import { Profile } from "./profile";

interface PortfolioProps {
  login: string;
  accessToken: string;
}

export async function Portfolio({ login, accessToken }: PortfolioProps) {
  const octokit = new Octokit({
    auth: accessToken,
  });

  return (
    <div className="py-10 lg:py-20 mx-auto flex flex-col gap-10 w-4xl max-w-full px-5">
      <Profile login={login} octokit={octokit} />
      <Contributions login={login} octokit={octokit} />
    </div>
  );
}
