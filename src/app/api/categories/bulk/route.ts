import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConservatorySession } from "@/lib/auth";
import { parseCsv, slugify } from "@/lib/csv";
import { bulkCsvSchema } from "@/lib/validators";
import { emptyToNull } from "@/lib/records";

async function uniqueCategorySlug(base: string) {
  let slug = base;
  let index = 2;
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${base}-${index}`;
    index += 1;
  }
  return slug;
}

export async function POST(request: Request) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = bulkCsvSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "The category upload could not be read." }, { status: 400 });
  }

  const fallbackParentId = emptyToNull(parsed.data.parentId);
  const rows = parsed.data.rows?.length
    ? parsed.data.rows
    : parseCsv(parsed.data.csv || "");
  if (!rows.length) {
    return NextResponse.json({ error: "No category rows found in the upload." }, { status: 400 });
  }

  const created = [];
  const existingCount = await prisma.category.count({
    where: { parentId: fallbackParentId },
  });

  for (const [index, row] of rows.entries()) {
    const name = row.name || "";
    if (!name) continue;
    let parentId = fallbackParentId;
    if (row.parentslug) {
      const parent = await prisma.category.findUnique({ where: { slug: row.parentslug } });
      if (parent) parentId = parent.id;
    }
    const slug = await uniqueCategorySlug(slugify(row.slug || name, `category-${index + 1}`));
    const excerpt = row.excerpt || `A Metrra Lab discipline for ${name}.`;
    const description = row.description || `<p>${excerpt}</p>`;
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        excerpt,
        description,
        image: row.image || "/images/labs/discipline.jpg",
        accent: row.accent || "aqua",
        published: row.published ? row.published !== "false" : true,
        sortOrder: existingCount + index,
        parentId,
      },
    });
    await prisma.seoRecord.create({
      data: {
        path: `/disciplines/${category.slug}`,
        title: `${category.name} | Metrra Lab`,
        description: category.excerpt,
        focusKeyword: category.name.toLowerCase(),
        canonical: `https://www.metrra.com/disciplines/${category.slug}`,
        categoryId: category.id,
      },
    });
    created.push(category);
  }

  return NextResponse.json({ created: created.length, categories: created });
}
