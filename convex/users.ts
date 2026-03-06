import { getAuthUserId } from "@convex-dev/auth/server";
import type { GenericId } from "convex/values";
import { query } from "./_generated/server";

export interface CurrentUser {
  id: GenericId<"users">;
  name: string | null;
  image: string | null;
  email: string | null;
  login: string | null;
  accessToken: string | null;
}

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      return null;
    }

    const currentUser: CurrentUser = {
      id: user._id,
      name: user.name ?? null,
      image: user.image ?? null,
      email: user.email ?? null,
      login: user.login ?? null,
      accessToken: user.accessToken ?? null,
    };

    return currentUser;
  },
});
