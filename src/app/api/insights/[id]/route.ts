import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConservatorySession } from "@/lib/auth";
import { insightSchema } from "@/lib/validators";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const parsed = insightSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "An insight needs a title and folio." }, { status: 400 });
  }
  const insight = await prisma.insight.update({
    where: { id },
    data: { ...parsed.data, image: parsed.data.image || null },
  });
  return NextResponse.json(insight);
}
