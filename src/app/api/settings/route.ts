import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConservatorySession } from "@/lib/auth";
import { settingsSchema } from "@/lib/validators";

export async function PUT(request: Request) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = settingsSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the house fields." }, { status: 400 });
  }
  const settings = await prisma.setting.upsert({
    where: { id: "house" },
    update: parsed.data,
    create: { id: "house", ...parsed.data },
  });
  return NextResponse.json(settings);
}
