import { ensureDatabase } from "../src/lib/ensure-db";
import { prisma } from "../src/lib/prisma";

async function main() {
  await ensureDatabase();
  const house = await prisma.setting.findUnique({ where: { id: "house" } });
  const categories = await prisma.category.count();
  const seo = await prisma.seoRecord.findUnique({ where: { path: "/" } });
  if (!house || categories < 1 || !seo) {
    throw new Error(
      `Bootstrap failed: house=${house?.companyName} categories=${categories} seo=${seo?.title}`,
    );
  }
  console.log(
    JSON.stringify(
      {
        company: house.companyName,
        categories,
        homeSeo: seo.title,
        url: process.env.DATABASE_URL,
      },
      null,
      2,
    ),
  );
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
