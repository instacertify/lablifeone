import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConservatorySession } from "@/lib/auth";
import { parseCsv, slugify } from "@/lib/csv";
import { bulkCsvSchema } from "@/lib/validators";

async function uniqueServiceSlug(base: string) {
  let slug = base;
  let index = 2;
  while (await prisma.service.findUnique({ where: { slug } })) {
    slug = `${base}-${index}`;
    index += 1;
  }
  return slug;
}

export async function POST(request: Request) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = bulkCsvSchema.safeParse(await request.json());
  if (!parsed.success || !parsed.data.categoryId) {
    return NextResponse.json({ error: "Choose a category before uploading tests." }, { status: 400 });
  }

  const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
  if (!category) return NextResponse.json({ error: "Category not found." }, { status: 404 });

  const rows = parsed.data.rows?.length
    ? parsed.data.rows
    : parseCsv(parsed.data.csv || "");
  if (!rows.length) {
    return NextResponse.json({ error: "No test rows found in the upload." }, { status: 400 });
  }

  const created = [];
  const existingCount = await prisma.service.count({ where: { categoryId: category.id } });
  for (const [index, row] of rows.entries()) {
    const name = row.name || row.test || "";
    if (!name) continue;
    const slug = await uniqueServiceSlug(slugify(row.slug || name, `test-${index + 1}`));
    const excerpt =
      row.excerpt ||
      `${name} — ${row.standard || "commissioned standard"}, ${row.timeline || "timeline on request"}.`;
    const description =
      row.description ||
      `<p>${name} is commissioned from Metrra Lab against ${row.standard || "the named standard"} with a typical timeline of ${row.timeline || "the Conservatory timeline"}.</p>`;
    const service = await prisma.service.create({
      data: {
        name,
        slug,
        excerpt,
        description,
        standard: row.standard || null,
        timeline: row.timeline || null,
        method: row.method || null,
        sample: row.sample || null,
        notes: row.notes || null,
        image: row.image || category.image,
        published: row.published ? row.published !== "false" : true,
        sortOrder: existingCount + index,
        categoryId: category.id,
      },
    });
    await prisma.seoRecord.create({
      data: {
        path: `/services/${service.slug}`,
        title: `${service.name} | Metrra Lab`,
        description: service.excerpt,
        focusKeyword: service.name.toLowerCase(),
        canonical: `https://www.metrra.com/services/${service.slug}`,
        serviceId: service.id,
      },
    });
    created.push(service);
  }

  return NextResponse.json({ created: created.length, services: created });
}
