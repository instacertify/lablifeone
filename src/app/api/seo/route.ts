import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConservatorySession } from "@/lib/auth";
import { seoSchema } from "@/lib/validators";

export async function PUT(request: Request) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = seoSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
  }
  const seo = await prisma.seoRecord.upsert({
    where: { path: parsed.data.path },
    update: parsed.data,
    create: parsed.data,
  });
  return NextResponse.json(seo);
}
