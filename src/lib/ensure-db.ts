import { prisma } from "@/lib/prisma";
import { HOUSE_SCHEMA_SQL } from "@/lib/schema-sql";

let preparing: Promise<void> | null = null;

function isSqlite() {
  return (process.env.DATABASE_URL ?? "").startsWith("file:");
}

async function settingTableExists() {
  if (!isSqlite()) {
    await prisma.setting.findUnique({ where: { id: "house" } });
    return true;
  }
  const rows = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='Setting'`,
  );
  return rows.length > 0;
}

async function applySchema() {
  await prisma.$executeRawUnsafe("PRAGMA foreign_keys = ON");
  for (const statement of HOUSE_SCHEMA_SQL) {
    await prisma.$executeRawUnsafe(statement);
  }
}

async function seedIfEmpty() {
  const house = await prisma.setting.findUnique({ where: { id: "house" } });
  if (house) return;
  const { seedHouse } = await import("../../prisma/seed");
  await seedHouse(prisma);
}

async function prepare() {
  try {
    const ready = await settingTableExists();
    if (!ready) {
      await applySchema();
    }
    await seedIfEmpty();
  } catch (error) {
    try {
      if (isSqlite()) {
        await applySchema();
        await seedIfEmpty();
        return;
      }
    } catch (fallbackError) {
      console.error("Metrra could not prepare the database.", fallbackError);
      return;
    }
    console.error("Metrra could not prepare the database.", error);
  }
}

export function ensureDatabase() {
  if (!preparing) {
    preparing = prepare();
  }
  return preparing;
}
