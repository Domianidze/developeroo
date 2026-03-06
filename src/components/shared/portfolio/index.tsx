import { Octokit } from "@octokit/rest";
import { Suspense } from "react";
import { Contributions, ContributionsSkeleton } from "./contributions";
import { Profile, ProfileSkeleton } from "./profile";
import { Repositories, RepositoriesSkeleton } from "./repositories";

interface PortfolioProps {
  login: string;
  accessToken: string;
}

export function Portfolio({ login, accessToken }: PortfolioProps) {
  const octokit = new Octokit({
    auth: accessToken,
  });

  return (
    <div className="py-10 lg:py-20 mx-auto flex flex-col gap-10 w-4xl max-w-full px-5">
      <Suspense fallback={<ProfileSkeleton />}>
        <Profile login={login} octokit={octokit} />
      </Suspense>
      <Suspense fallback={<RepositoriesSkeleton />}>
        <Repositories login={login} octokit={octokit} />
      </Suspense>
      <Suspense fallback={<ContributionsSkeleton />}>
        <Contributions login={login} octokit={octokit} />
      </Suspense>
    </div>
  );
}
