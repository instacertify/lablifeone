import { join } from "node:path";

function resolveDatabaseUrl() {
  const current = process.env.DATABASE_URL?.trim();
  const relative = current && current.startsWith("file:") ? current.slice(5) : "";
  const looksRelative =
    !current ||
    current === "file:./dev.db" ||
    current === "file:dev.db" ||
    relative.startsWith("./") ||
    relative.startsWith("prisma/");

  if (!current || looksRelative) {
    const file = join(process.cwd(), "prisma", "dev.db");
    process.env.DATABASE_URL = `file:${file}`;
    return;
  }
}

resolveDatabaseUrl();

if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = "metrra-build-placeholder-secret-change-me";
}
