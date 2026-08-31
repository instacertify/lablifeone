if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = "metrra-build-placeholder-secret-change-me";
}
