import type { Octokit } from "@octokit/rest";
import { GitPullRequest } from "lucide-react";
import Image from "next/image";
import { Button, Skeleton } from "@/components/ui";

interface ContributionData {
  user: {
    contributionsCollection: {
      pullRequestContributionsByRepository: {
        contributions: {
          nodes: {
            pullRequest: {
              title: string;
              body: string;
            };
          }[];
          totalCount: number;
        };
        repository: {
          name: string;
          url: string;
          stargazers: {
            totalCount: number;
          };
          owner: {
            avatarUrl: string;
          };
        };
      }[];
    };
  };
}

interface ContributionsProps {
  login: string;
  octokit: Octokit;
}

export async function Contributions({ login, octokit }: ContributionsProps) {
  const data: ContributionData = await octokit.graphql(
    `
        {
          user(login: "${login}") {
            contributionsCollection {
              pullRequestContributionsByRepository(maxRepositories: 100) {
                contributions(first: 100) {
                  nodes {
                    pullRequest {
                      title
                      body
                    }
                  }
                  totalCount
                }
                repository {
                  name
                  url
                  stargazers {
                    totalCount
                  }
                  owner {
                    avatarUrl
                  }
                }
              }
            }
          }
        }
    `,
  );

  const repositories =
    data.user.contributionsCollection.pullRequestContributionsByRepository;

  const sortedRepositories = repositories.sort(
    ({ repository: a }, { repository: b }) =>
      b.stargazers.totalCount - a.stargazers.totalCount,
  );

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <GitPullRequest />
        <h3>Contributions</h3>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        {sortedRepositories.map(({ repository, contributions }) => (
          <Button key={repository.name} variant="outline" size="app" asChild>
            <a href={repository.url} target="_blank">
              <Image
                src={repository.owner.avatarUrl}
                alt={repository.name}
                width={40}
                height={40}
              />
              <div>
                <h4>{repository.name}</h4>
                <p>{contributions.totalCount} contributions</p>
              </div>
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}

export function ContributionsSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <GitPullRequest />
        <h3>Contributions</h3>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Button
            key={`contributions-fallback-${index + 1}`}
            variant="outline"
            size="app"
            disabled
            className="pointer-events-none"
          >
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
