import { randomBytes } from "node:crypto";

const key = randomBytes(32).toString("base64");

process.stdout.write(`ENCRYPTION_KEY=${key}`);
process.stdout.write("\n");
