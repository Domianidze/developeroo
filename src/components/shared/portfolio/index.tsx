import { Octokit } from "@octokit/rest";
import { Suspense } from "react";
import { Contact, ContactMarkup } from "./contact";
import { Contributions, ContributionsMarkup } from "./contributions";
import { Profile, ProfileMarkup } from "./profile";
import { Repositories, RepositoriesMarkup } from "./repositories";

interface PortfolioProps {
  login: string;
  accessToken?: string;
  email?: string;
}

export function Portfolio({ login, accessToken, email }: PortfolioProps) {
  const octokit = new Octokit({
    auth: accessToken,
  });

  return (
    <div className="py-10 lg:py-20 mx-auto flex flex-col gap-10 w-4xl max-w-full px-5">
      <Suspense fallback={<ProfileMarkup />}>
        <Profile login={login} octokit={octokit} />
      </Suspense>
      <Suspense fallback={<RepositoriesMarkup />}>
        <Repositories login={login} octokit={octokit} />
      </Suspense>
      <Suspense fallback={<ContributionsMarkup />}>
        <Contributions login={login} octokit={octokit} />
      </Suspense>
      <Suspense fallback={<ContactMarkup />}>
        <Contact login={login} email={email} octokit={octokit} />
      </Suspense>
    </div>
  );
}
