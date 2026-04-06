import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";

const proxy = convexAuthNextjsMiddleware();

export default proxy;

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
