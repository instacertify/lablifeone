import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { prisma } from "@/lib/prisma";

const exec = promisify(execFile);

let preparing: Promise<void> | null = null;

async function databaseReady() {
  await prisma.setting.findUnique({ where: { id: "house" } });
}

async function pushAndSeed() {
  const env = { ...process.env, PRISMA_HIDE_UPDATE_MESSAGE: "1" };
  await exec("npx", ["prisma", "db", "push", "--skip-generate"], {
    cwd: process.cwd(),
    env,
  });
  const house = await prisma.setting.findUnique({ where: { id: "house" } });
  if (!house) {
    await exec("npx", ["tsx", "prisma/seed.ts"], {
      cwd: process.cwd(),
      env,
    });
  }
}

export function ensureDatabase() {
  if (!preparing) {
    preparing = (async () => {
      try {
        await databaseReady();
      } catch {
        try {
          await pushAndSeed();
        } catch (error) {
          console.error("Metrra could not prepare the database.", error);
        }
      }
    })();
  }
  return preparing;
}
