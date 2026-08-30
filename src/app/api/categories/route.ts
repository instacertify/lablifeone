import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConservatorySession } from "@/lib/auth";
import { categorySchema } from "@/lib/validators";

export async function POST(request: Request) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = categorySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "A category needs a name, slug, and folio." }, { status: 400 });
  }
  const category = await prisma.category.create({
    data: {
      ...parsed.data,
      image: parsed.data.image || null,
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
  return NextResponse.json(category);
}
