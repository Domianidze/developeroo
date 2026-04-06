import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";

const key = randomBytes(32).toString("base64");

const result = spawnSync(
  "npx",
  ["convex", "env", "set", "ENCRYPTION_KEY", key],
  {
    stdio: "inherit",
    shell: process.platform === "win32",
  },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log("Generated and set ENCRYPTION_KEY in Convex env");
