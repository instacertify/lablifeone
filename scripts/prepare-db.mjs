import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:./")) {
  process.env.DATABASE_URL = `file:${join(process.cwd(), "prisma", "dev.db")}`;
}

execFileSync("npx", ["prisma", "db", "push", "--skip-generate"], {
  stdio: "inherit",
  env: process.env,
});

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const house = await prisma.setting.findUnique({ where: { id: "house" } });
if (!house) {
  execFileSync("npx", ["tsx", "prisma/seed.ts"], {
    stdio: "inherit",
    env: process.env,
  });
}
await prisma.$disconnect();
