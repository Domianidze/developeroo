import type { Octokit } from "@octokit/rest";
import { FolderGit } from "lucide-react";
import { Button, Skeleton } from "@/components/ui";
import { SectionWrapper } from "./section-wrapper";

interface RepositoriesMarkupProps {
  data?: {
    id: string;
    name?: string;
    url?: string;
    commitsCount?: number;
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
            disabled={!item.url}
          >
            <a href={item.url} target="_blank" rel="noreferrer">
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

  const data = repositories
    .sort(
      ({ defaultBranchRef: a }, { defaultBranchRef: b }) =>
        (b?.target?.history.totalCount ?? 0) -
        (a?.target?.history.totalCount ?? 0),
    )
    .map(({ id, name, url, defaultBranchRef }) => ({
      id,
      name,
      url,
      commitsCount: defaultBranchRef?.target?.history.totalCount ?? 0,
    }))
    .slice(0, 6);

  return <RepositoriesMarkup data={data} />;
}
