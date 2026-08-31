export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;
  const { ensureDatabase } = await import("@/lib/ensure-db");
  await ensureDatabase();
}
