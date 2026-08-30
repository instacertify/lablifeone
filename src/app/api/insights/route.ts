import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConservatorySession } from "@/lib/auth";
import { insightSchema } from "@/lib/validators";
import { emptyToNull } from "@/lib/records";

export async function POST(request: Request) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = insightSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "An industry note needs a title and folio." }, { status: 400 });
  }
  const insight = await prisma.insight.create({
    data: {
      ...parsed.data,
      image: parsed.data.image || null,
      industryId: emptyToNull(parsed.data.industryId),
      publishedAt: parsed.data.published === false ? null : new Date(),
    },
  });
  return NextResponse.json(insight);
}
