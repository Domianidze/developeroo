import type { Octokit } from "@octokit/rest";
import { FolderGit, Pin } from "lucide-react";
import { Button, Skeleton } from "@/components/ui";
import { SectionWrapper } from "./section-wrapper";

interface RepositoriesMarkupProps {
  data?: {
    id: string;
    name?: string;
    url?: string;
    commitsCount?: number;
    isPinned?: boolean;
  }[];
}

export function RepositoriesMarkup({ data }: RepositoriesMarkupProps) {
  const markupData =
    data ??
    Array.from({ length: 6 }, (_, index) => ({
      id: `repositories-fallback-${index + 1}`,
      name: undefined,
      url: undefined,
      commitsCount: undefined,
      isPinned: undefined,
    }));

  return (
    <SectionWrapper icon={FolderGit} title="Repositories">
      <div className="grid lg:grid-cols-3 gap-4">
        {markupData.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            size="app"
            asChild
            className="relative"
            disabled={!item.url}
          >
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.isPinned ? (
                <Pin
                  className="absolute top-2 right-2 size-4 text-muted-foreground"
                  aria-label="Pinned repository"
                />
              ) : null}
              <div>
                {item.name ? (
                  <h4>{item.name}</h4>
                ) : (
                  <Skeleton className="my-1 h-4 w-28" />
                )}
                {typeof item.commitsCount === "number" ? (
                  <p>{item.commitsCount} commits</p>
                ) : (
                  <Skeleton className="my-1 h-4 w-20" />
                )}
              </div>
            </a>
          </Button>
        ))}
      </div>
    </SectionWrapper>
  );
}

interface RepositoriesQueryData {
  user: {
    pinnedItems: {
      nodes: {
        id: string;
        name: string;
        url: string;
        owner: {
          login: string;
        };
        isFork: boolean;
        defaultBranchRef: {
          target: {
            history: {
              totalCount: number;
            };
          } | null;
        } | null;
      }[];
    };
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

interface RepositoriesProps {
  login: string;
  octokit: Octokit;
}

export async function Repositories({ login, octokit }: RepositoriesProps) {
  const response: RepositoriesQueryData = await octokit.graphql(
    `
      {
        user(login: "${login}") {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                id
                name
                url
                owner {
                  login
                }
                isFork
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

  const repositories = response.user?.repositories.nodes ?? [];
  const pinnedRepositories = (response.user?.pinnedItems.nodes ?? [])
    .filter(({ owner, isFork }) => owner.login === login && !isFork)
    .sort(
      ({ defaultBranchRef: a }, { defaultBranchRef: b }) =>
        (b?.target?.history.totalCount ?? 0) -
        (a?.target?.history.totalCount ?? 0),
    );

  const pinnedIds = new Set(pinnedRepositories.map(({ id }) => id));
  const remainingRepositories = repositories
    .filter(({ id }) => !pinnedIds.has(id))
    .sort(
      ({ defaultBranchRef: a }, { defaultBranchRef: b }) =>
        (b?.target?.history.totalCount ?? 0) -
        (a?.target?.history.totalCount ?? 0),
    );

  const data = [...pinnedRepositories, ...remainingRepositories]
    .map(({ id, name, url, defaultBranchRef }) => ({
      id,
      name,
      url,
      commitsCount: defaultBranchRef?.target?.history.totalCount ?? 0,
      isPinned: pinnedIds.has(id),
    }))
    .slice(0, 6);

  return <RepositoriesMarkup data={data} />;
}
