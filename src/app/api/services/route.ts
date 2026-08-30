import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConservatorySession } from "@/lib/auth";
import { serviceSchema } from "@/lib/validators";
import { normalizeService } from "@/lib/records";

export async function POST(request: Request) {
  const session = await getConservatorySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = serviceSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "A service needs a name, slug, and folio." }, { status: 400 });
  }
  const service = await prisma.service.create({
    data: normalizeService(parsed.data),
  });
  await prisma.seoRecord.create({
    data: {
      path: `/services/${service.slug}`,
      title: `${service.name} | Metrra Lab`,
      description: service.excerpt,
      focusKeyword: service.name.toLowerCase(),
      canonical: `https://www.metrra.com/services/${service.slug}`,
      serviceId: service.id,
    },
  });
  return NextResponse.json(service);
}
