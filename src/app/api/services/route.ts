import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConservatorySession } from "@/lib/auth";
import { serviceSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = serviceSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "A service needs a name, slug, and folio." }, { status: 400 });
  }
  const service = await prisma.service.create({
    data: { ...parsed.data, image: parsed.data.image || null },
  });
  return NextResponse.json(service);
}
