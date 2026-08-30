import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConservatorySession } from "@/lib/auth";
import { privacyRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = privacyRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete name, email, the request type, and a short note." }, { status: 400 });
  }
  const record = await prisma.privacyRequest.create({ data: parsed.data });
  return NextResponse.json({ id: record.id });
}

export async function GET() {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const records = await prisma.privacyRequest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(records);
}
