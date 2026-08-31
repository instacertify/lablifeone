import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";

const house = join(process.cwd(), "prisma", "house.sqlite");
const current = process.env.DATABASE_URL?.trim();
let dest = house;

if (current?.startsWith("file:")) {
  const path = current.slice(5).replace(/^['"]|['"]$/g, "");
  const legacy = path === "./dev.db" || path === "dev.db" || path === "./prisma/dev.db" || path === "prisma/dev.db";
  if (legacy) {
    dest = house;
  } else if (path.startsWith("/")) {
    dest = path;
  } else {
    dest = join(process.cwd(), path.replace(/^\.\//, ""));
  }
}

if (existsSync(house) && dest !== house) {
  const destReady = existsSync(dest) && statSync(dest).size >= 20_000;
  if (!destReady) {
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(house, dest);
  }
}

process.env.DATABASE_URL = `file:${existsSync(dest) ? dest : house}`;
