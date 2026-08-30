import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConservatorySession } from "@/lib/auth";
import { testimonialSchema } from "@/lib/validators";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const parsed = testimonialSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "A voice needs a name and a quote." }, { status: 400 });
  }
  const voice = await prisma.testimonial.update({
    where: { id },
    data: {
      ...parsed.data,
      role: parsed.data.role || null,
      company: parsed.data.company || null,
      image: parsed.data.image || null,
    },
  });
  return NextResponse.json(voice);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
