import type { Octokit } from "@octokit/rest";
import { FolderGit } from "lucide-react";
import { Button, Skeleton } from "@/components/ui";

interface RepositoriesProps {
  login: string;
  octokit: Octokit;
}

interface RepositoriesData {
  user: {
    repositories: {
      nodes: {
        id: string;
        name: string;
        url: string;
        defaultBranchRef: {
          target: {
            history: {
              totalCount: number;
            };
          } | null;
        } | null;
      }[];
    };
  } | null;
}

export async function Repositories({ login, octokit }: RepositoriesProps) {
  const data: RepositoriesData = await octokit.graphql(
    `
      {
        user(login: "${login}") {
          repositories(
            first: 100
            ownerAffiliations: OWNER
            isFork: false
            orderBy: { field: PUSHED_AT, direction: DESC }
          ) {
            nodes {
              id
              name
              url
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(first: 1) {
                      totalCount
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
  );

  const repositories = data.user?.repositories.nodes ?? [];

  const sortedRepositories = repositories
    .map(({ id, name, url, defaultBranchRef }) => ({
      id,
      name,
      url,
      commits_count: defaultBranchRef?.target?.history.totalCount ?? 0,
    }))
    .sort(({ commits_count: a }, { commits_count: b }) => b - a)
    .slice(0, 6);

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <FolderGit />
        <h3>Repositories</h3>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        {sortedRepositories.length > 0 ? (
          sortedRepositories.map(({ id, url, name, commits_count }) => (
            <Button key={id} variant="outline" size="app" asChild>
              <a href={url} target="_blank" rel="noreferrer">
                <div>
                  <h4>{name}</h4>
                  <p>{commits_count} commits</p>
                </div>
              </a>
            </Button>
          ))
        ) : (
          <p>No repositories found.</p>
        )}
      </div>
    </div>
  );
}

export function RepositoriesSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <FolderGit />
        <h3>Repositories</h3>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Button
            key={`repositories-fallback-${index + 1}`}
            variant="outline"
            size="app"
            disabled
            className="pointer-events-none"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
