import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConservatorySession } from "@/lib/auth";
import { industrySchema } from "@/lib/validators";
import { slugify } from "@/lib/csv";

export async function GET() {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const industries = await prisma.industry.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(industries);
}

export async function POST(request: Request) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const parsed = industrySchema.safeParse({
    ...body,
    slug: body.slug || slugify(body.name || "", "industry"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "An industry needs a name." }, { status: 400 });
  }
  const count = await prisma.industry.count();
  const industry = await prisma.industry.create({
    data: {
      ...parsed.data,
      sortOrder: parsed.data.sortOrder ?? count,
      published: parsed.data.published ?? true,
    },
  });
  return NextResponse.json(industry);
}
