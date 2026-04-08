import "server-only";

import { headers } from "next/headers";

export async function getRequestBaseUrl() {
  const requestHeaders = await headers();

  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  return host ? `${protocol}://${host}` : "";
}
