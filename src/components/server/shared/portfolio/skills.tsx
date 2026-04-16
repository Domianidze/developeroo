import type { Octokit } from "@octokit/rest";
import { Code2 } from "lucide-react";
import { Button, Skeleton } from "@/components/ui";
import { SectionWrapper } from "./section-wrapper";

interface SkillItem {
  id: string;
  name?: string;
  url?: string;
  color?: string;
  percentage?: number;
  reposCount?: number;
}

interface SkillsMarkupProps {
  data?: SkillItem[];
}

function formatPercentage(value: number): string {
  return `${Math.round(value * 10) / 10}%`;
}

export function SkillsMarkup({ data }: SkillsMarkupProps) {
  const markupData =
    data ??
    Array.from({ length: 6 }, (_, index) => ({
      id: `skills-fallback-${index + 1}`,
      name: undefined,
      url: undefined,
      color: undefined,
      percentage: undefined,
      reposCount: undefined,
    }));

  return (
    <SectionWrapper icon={Code2} title="Skills">
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
            {item.color && item.name ? (
              <div
                className="absolute top-2 right-2 size-3 rounded-full border border-background"
                style={{ backgroundColor: item.color }}
                aria-hidden
              />
            ) : (
              <Skeleton className="absolute top-2 right-2 size-3 rounded-full" />
            )}
            <div>
              {item.name ? (
                <h4>{item.name}</h4>
              ) : (
                <Skeleton className="my-1 h-4 w-20" />
              )}
              {typeof item.percentage === "number" ? (
                <p>
                  {formatPercentage(item.percentage)} usage in{" "}
                  {item.reposCount ?? 0} repos
                </p>
              ) : (
                <Skeleton className="my-1 h-4 w-32" />
              )}
            </div>
          </Button>
        ))}
      </div>
    </SectionWrapper>
  );
}

interface SkillsQueryData {
  user: {
    repositories: {
      nodes: {
        name: string;
        languages: {
          edges: {
            size: number;
            node: {
              name: string;
              color: string | null;
            };
          }[];
        };
      }[];
    };
  } | null;
}

interface SkillsProps {
  login: string;
  octokit: Octokit;
}

export async function Skills({ login, octokit }: SkillsProps) {
  const response: SkillsQueryData = await octokit.graphql(
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
              name
              languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
                edges {
                  size
                  node {
                    name
                    color
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
  const languageUsage = new Map<
    string,
    { bytes: number; color?: string; repos: Set<string> }
  >();

  for (const repository of repositories) {
    for (const edge of repository.languages.edges) {
      const name = edge.node.name;
      const current = languageUsage.get(name) ?? {
        bytes: 0,
        color: edge.node.color ?? undefined,
        repos: new Set<string>(),
      };

      current.bytes += edge.size;
      current.repos.add(repository.name);
      if (!current.color && edge.node.color) {
        current.color = edge.node.color;
      }

      languageUsage.set(name, current);
    }
  }

  const totalBytes = Array.from(languageUsage.values()).reduce(
    (sum, entry) => sum + entry.bytes,
    0,
  );

  const data = Array.from(languageUsage.entries())
    .map(([name, entry]) => ({
      id: name,
      name,
      color: entry.color,
      url: `https://github.com/search?q=user%3A${encodeURIComponent(
        login,
      )}+language%3A${encodeURIComponent(name)}&type=repositories`,
      percentage: totalBytes > 0 ? (entry.bytes / totalBytes) * 100 : 0,
      reposCount: entry.repos.size,
    }))
    .sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0))
    .slice(0, 6);

  if (!data.length) {
    return;
  }

  return <SkillsMarkup data={data} />;
}
