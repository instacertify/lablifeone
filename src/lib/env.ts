import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";

export const HOUSE_SQLITE = join(process.cwd(), "prisma", "house.sqlite");

function sqlitePathFromUrl(fileUrl: string) {
  let path = fileUrl.slice("file:".length);
  if (
    (path.startsWith("'") && path.endsWith("'")) ||
    (path.startsWith('"') && path.endsWith('"'))
  ) {
    path = path.slice(1, -1);
  }
  return path;
}

function isLegacyEmptyDefault(path: string) {
  return (
    path === "./dev.db" ||
    path === "dev.db" ||
    path === "./prisma/dev.db" ||
    path === "prisma/dev.db"
  );
}

function resolveSqliteFile(fileUrl: string) {
  const path = sqlitePathFromUrl(fileUrl);
  if (isLegacyEmptyDefault(path)) {
    const legacy = join(process.cwd(), "prisma", "dev.db");
    if (existsSync(legacy) && statSync(legacy).size >= 20_000) {
      return legacy;
    }
    return HOUSE_SQLITE;
  }
  if (isAbsolute(path)) return path;
  if (path.startsWith("./")) return join(process.cwd(), path.slice(2));
  return join(process.cwd(), path);
}

export function installBundledDatabase(dest: string) {
  if (!existsSync(HOUSE_SQLITE) || dest === HOUSE_SQLITE) return;
  const destReady = existsSync(dest) && statSync(dest).size >= 20_000;
  if (destReady) return;
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(HOUSE_SQLITE, dest);
}

function resolveDatabaseUrl() {
  const current = process.env.DATABASE_URL?.trim();
  if (current && !current.startsWith("file:")) return;

  const dest = current ? resolveSqliteFile(current) : HOUSE_SQLITE;
  try {
    installBundledDatabase(dest);
  } catch (error) {
    console.error("Metrra could not copy the shipped house database.", error);
  }

  if (existsSync(dest)) {
    process.env.DATABASE_URL = `file:${dest}`;
    return;
  }
  if (existsSync(HOUSE_SQLITE)) {
    process.env.DATABASE_URL = `file:${HOUSE_SQLITE}`;
    return;
  }
  process.env.DATABASE_URL = `file:${dest}`;
}

resolveDatabaseUrl();

if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = "metrra-build-placeholder-secret-change-me";
}
