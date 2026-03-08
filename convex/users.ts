import { getAuthUserId } from "@convex-dev/auth/server";
import type { GenericId } from "convex/values";
import { query } from "./_generated/server";

export interface CurrentUser {
  id: GenericId<"users">;
  name?: string;
  image?: string;
  email?: string;
  login?: string;
  accessToken?: string;
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
      name: user.name,
      image: user.image,
      email: user.email,
      login: user.login,
      accessToken: user.accessToken,
    };

    return currentUser;
  },
});
