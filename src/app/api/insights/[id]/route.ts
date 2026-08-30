import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConservatorySession } from "@/lib/auth";
import { insightSchema } from "@/lib/validators";
import { normalizeInsight } from "@/lib/records";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const parsed = insightSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "An industry note needs a title and folio." }, { status: 400 });
  }
  const insight = await prisma.insight.update({
    where: { id },
    data: await normalizeInsight(parsed.data),
  });
  return NextResponse.json(insight);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.insight.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
