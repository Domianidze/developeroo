import type { Octokit } from "@octokit/rest";
import { Code2, FolderGit, GitPullRequest } from "lucide-react";
import { Button, Skeleton } from "@/components/ui";

interface OverviewMarkupProps {
  data?: {
    totalRepos?: number;
    totalContributionRepos?: number;
    totalSkills?: number;
    totalContributions?: number;
  };
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

function StatCard({
  icon: Icon,
  label,
  value,
  skeletonClassName,
}: {
  icon: typeof Code2;
  label: string;
  value?: number;
  skeletonClassName?: string;
}) {
  if (typeof value === "number" && !value) {
    return;
  }

  return (
    <Button variant="outline" size="sm" className="justify-start" disabled>
      <Icon className="size-4 text-muted-foreground" />
      <span className="text-muted-foreground">{label}:</span>
      {typeof value === "number" ? (
        <span>{formatNumber(value)}</span>
      ) : (
        <Skeleton className={skeletonClassName ?? "h-4 w-16"} />
      )}
    </Button>
  );
}

export function OverviewMarkup({ data }: OverviewMarkupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <StatCard
        icon={Code2}
        label="Skills"
        value={data?.totalSkills}
        skeletonClassName="h-4 w-6"
      />
      <StatCard
        icon={FolderGit}
        label="Repositories"
        value={data?.totalRepos}
        skeletonClassName="h-4 w-6"
      />
      <StatCard
        icon={GitPullRequest}
        label="Contributions (Open source)"
        value={data?.totalContributionRepos}
        skeletonClassName="h-4 w-6"
      />
      <StatCard
        icon={GitPullRequest}
        label="Contributions (12mo)"
        value={data?.totalContributions}
        skeletonClassName="h-4 w-16"
      />
    </div>
  );
}

interface OverviewQueryData {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
      };
      pullRequestContributionsByRepository: {
        contributions: {
          totalCount: number;
        };
      }[];
    };
    repositories: {
      totalCount: number;
      nodes: {
        languages: {
          edges: {
            node: {
              name: string;
            };
          }[];
        };
      }[];
    };
  } | null;
}

interface OverviewProps {
  login: string;
  octokit: Octokit;
}

export async function Overview({ login, octokit }: OverviewProps) {
  const response: OverviewQueryData = await octokit.graphql(
    `
      {
        user(login: "${login}") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
            }
            pullRequestContributionsByRepository(maxRepositories: 100) {
              contributions(first: 1) {
                totalCount
              }
            }
          }
          repositories(
            first: 100
            ownerAffiliations: OWNER
            isFork: false
            orderBy: { field: PUSHED_AT, direction: DESC }
          ) {
            totalCount
            nodes {
              languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `,
  );

  const repositories = response.user?.repositories.nodes ?? [];
  const skills = new Set<string>();

  for (const repository of repositories) {
    for (const edge of repository.languages.edges) {
      skills.add(edge.node.name);
    }
  }

  const contributionRepos =
    response.user?.contributionsCollection.pullRequestContributionsByRepository.filter(
      ({ contributions }) => contributions.totalCount > 0,
    ).length ?? 0;

  const data = {
    totalRepos: response.user?.repositories.totalCount ?? repositories.length,
    totalContributionRepos: contributionRepos,
    totalSkills: skills.size,
    totalContributions:
      response.user?.contributionsCollection.contributionCalendar
        .totalContributions ?? 0,
  };

  return <OverviewMarkup data={data} />;
}
