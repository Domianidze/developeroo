import "server-only";

import { api } from "@convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { Octokit } from "@octokit/rest";
import { fetchQuery } from "convex/nextjs";
import { cache } from "react";

export type GitHubAuthMode = "owner" | "viewer";

const getAccessToken = cache(async (authMode: GitHubAuthMode) => {
  if (authMode === "viewer") {
    return process.env.GITHUB_TOKEN;
  }

  const token = await convexAuthNextjsToken();

  const accessToken = await fetchQuery(
    api.users.currentAccessToken,
    {},
    { token },
  );

  return accessToken ?? undefined;
});

export async function getGitHubClient(authMode: GitHubAuthMode) {
  const auth = await getAccessToken(authMode);

  return new Octokit({ auth });
}
