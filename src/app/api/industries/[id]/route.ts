import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConservatorySession } from "@/lib/auth";
import { industrySchema } from "@/lib/validators";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const parsed = industrySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "An industry needs a name." }, { status: 400 });
  }
  const industry = await prisma.industry.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json(industry);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.industry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
