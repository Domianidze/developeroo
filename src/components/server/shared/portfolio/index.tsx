import type { Octokit } from "@octokit/rest";
import { Suspense } from "react";
import { cn } from "@/lib";
import { type GitHubAuthMode, getGitHubClient } from "@/lib/server";
import { Contact, ContactMarkup } from "./contact";
import { Contributions, ContributionsMarkup } from "./contributions";
import { Footer } from "./footer";
import { Overview, OverviewMarkup } from "./overview";
import { Profile, ProfileMarkup } from "./profile";
import { Repositories, RepositoriesMarkup } from "./repositories";
import { Skills, SkillsMarkup } from "./skills";

interface PortfolioProps {
  login: string;
  authMode: GitHubAuthMode;
  email?: string;
}

export async function Portfolio({ login, authMode, email }: PortfolioProps) {
  const octokit: Octokit = await getGitHubClient(authMode);

  return (
    <div
      className={cn(
        "py-10 lg:py-20 mx-auto flex flex-col gap-10 w-4xl max-w-full px-5",
        authMode === "owner" && "py-15",
      )}
    >
      <div className="flex flex-col gap-4">
        <Suspense fallback={<ProfileMarkup />}>
          <Profile login={login} octokit={octokit} />
        </Suspense>
        <Suspense fallback={<OverviewMarkup />}>
          <Overview login={login} octokit={octokit} />
        </Suspense>
      </div>
      <Suspense fallback={<SkillsMarkup />}>
        <Skills login={login} octokit={octokit} />
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
      <Footer />
    </div>
  );
}
