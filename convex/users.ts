import { getAuthUserId } from "@convex-dev/auth/server";
import type { GenericId } from "convex/values";
import { query } from "./_generated/server";
import { decrypt } from "./lib/crypto";

export interface CurrentUser {
  id: GenericId<"users">;
  name?: string;
  image?: string;
  email?: string;
  login?: string;
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
    };

    return currentUser;
  },
});

export const currentAccessToken = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);

    if (!user?.accessToken) {
      return null;
    }

    return await decrypt(user.accessToken);
  },
});
