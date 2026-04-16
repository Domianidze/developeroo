import type { Octokit } from "@octokit/rest";
import { GitPullRequest, Star } from "lucide-react";
import Image from "next/image";
import { Button, Skeleton } from "@/components/ui";
import { SectionWrapper } from "./section-wrapper";

interface ContributionsMarkupProps {
  data?: {
    id: string;
    name?: string;
    url?: string;
    avatarUrl?: string;
    totalCount?: number;
    starsCount?: number;
  }[];
}

export function ContributionsMarkup({ data }: ContributionsMarkupProps) {
  const markupData =
    data ??
    Array.from({ length: 6 }, (_, index) => ({
      id: `contributions-fallback-${index + 1}`,
      name: undefined,
      url: undefined,
      avatarUrl: undefined,
      totalCount: undefined,
      starsCount: undefined,
    }));

  return (
    <SectionWrapper icon={GitPullRequest} title="Contributions">
      <div className="grid gap-4 lg:grid-cols-3">
        {markupData.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            className="relative h-18 justify-start gap-4 rounded-lg px-4 text-left [&_img]:rounded-md"
            disabled={!item.url}
            nativeButton={false}
            render={<a href={item.url} target="_blank" rel="noreferrer" />}
          >
            {typeof item.starsCount === "number" && item.starsCount > 0 ? (
              <div
                className="absolute top-2 right-2 flex items-center gap-1 text-muted-foreground text-xs"
                title={`${item.starsCount} stars`}
              >
                <Star className="size-4 fill-yellow-500/20 text-yellow-500" />
                <span>{item.starsCount}</span>
              </div>
            ) : null}
            {item.avatarUrl ? (
              <Image
                src={item.avatarUrl}
                alt={item.name ?? "repository"}
                width={40}
                height={40}
              />
            ) : (
              <Skeleton className="h-10 w-10 rounded-md" />
            )}
            <div>
              {item.name ? (
                <h4>{item.name}</h4>
              ) : (
                <Skeleton className="my-1 h-4 w-28" />
              )}
              {typeof item.totalCount === "number" ? (
                <p>{item.totalCount} contributions</p>
              ) : (
                <Skeleton className="my-1 h-4 w-24" />
              )}
            </div>
          </Button>
        ))}
      </div>
    </SectionWrapper>
  );
}

interface ContributionsQueryData {
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
  const response: ContributionsQueryData = await octokit.graphql(
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
    response.user.contributionsCollection.pullRequestContributionsByRepository;

  const data = repositories
    .sort(
      ({ repository: a }, { repository: b }) =>
        b.stargazers.totalCount - a.stargazers.totalCount,
    )
    .map(({ repository, contributions }) => ({
      id: repository.name,
      name: repository.name,
      url: repository.url,
      avatarUrl: repository.owner.avatarUrl,
      totalCount: contributions.totalCount,
      starsCount: repository.stargazers.totalCount,
    }));

  if (!data.length) {
    return;
  }

  return <ContributionsMarkup data={data} />;
}
