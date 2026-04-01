import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";
import { encrypt } from "./lib/crypto";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub({
      async profile(profile, tokens) {
        const accessToken = tokens.access_token
          ? await encrypt(tokens.access_token)
          : undefined;

        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          login: profile.login,
          accessToken,
        };
      },
    }),
  ],
});
