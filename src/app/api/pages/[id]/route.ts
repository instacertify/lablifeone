import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConservatorySession } from "@/lib/auth";
import { pageSchema } from "@/lib/validators";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const parsed = pageSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "The folio needs a title and body." }, { status: 400 });
  }
  const page = await prisma.page.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json(page);
}

export async function POST(request: Request) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = pageSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "The folio needs a title and body." }, { status: 400 });
  }
  const page = await prisma.page.create({ data: parsed.data });
  return NextResponse.json(page);
}
