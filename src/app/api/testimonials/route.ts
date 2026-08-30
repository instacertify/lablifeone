import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConservatorySession } from "@/lib/auth";
import { testimonialSchema } from "@/lib/validators";

export async function GET() {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const voices = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(voices);
}

export async function POST(request: Request) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = testimonialSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "A voice needs a name and a quote." }, { status: 400 });
  }
  const voice = await prisma.testimonial.create({
    data: {
      ...parsed.data,
      role: parsed.data.role || null,
      company: parsed.data.company || null,
      image: parsed.data.image || null,
    },
  });
  return NextResponse.json(voice);
}
