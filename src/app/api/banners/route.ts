import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConservatorySession } from "@/lib/auth";
import { bannerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = bannerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "A banner needs a title and image." }, { status: 400 });
  }
  const banner = await prisma.banner.create({ data: parsed.data });
  return NextResponse.json(banner);
}

export async function PUT(request: Request) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const banner = await prisma.banner.update({
    where: { id: body.id },
    data: {
      title: body.title,
      subtitle: body.subtitle,
      image: body.image,
      ctaLabel: body.ctaLabel,
      ctaHref: body.ctaHref,
      sortOrder: body.sortOrder,
      active: body.active,
    },
  });
  return NextResponse.json(banner);
}

export async function DELETE(request: Request) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  await prisma.banner.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
