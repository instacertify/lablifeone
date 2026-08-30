import type { z } from "zod";
import type { categorySchema, insightSchema, serviceSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";

export function emptyToNull(value?: string | null) {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

export function normalizeCategory(data: z.infer<typeof categorySchema>) {
  return {
    ...data,
    image: emptyToNull(data.image),
    parentId: emptyToNull(data.parentId),
    published: data.published ?? true,
    sortOrder: data.sortOrder ?? 0,
    accent: data.accent || "aqua",
  };
}

export function normalizeService(data: z.infer<typeof serviceSchema>) {
  return {
    ...data,
    image: emptyToNull(data.image),
    standard: emptyToNull(data.standard),
    timeline: emptyToNull(data.timeline),
    method: emptyToNull(data.method),
    sample: emptyToNull(data.sample),
    notes: emptyToNull(data.notes),
    published: data.published ?? true,
    sortOrder: data.sortOrder ?? 0,
  };
}

export async function normalizeInsight(data: z.infer<typeof insightSchema>) {
  const house = await prisma.setting.findUnique({ where: { id: "house" } });
  return {
    ...data,
    image: emptyToNull(data.image),
    industryId: emptyToNull(data.industryId),
    writerName: emptyToNull(data.writerName) || house?.companyName || "Metrra Lab",
    writerRole: emptyToNull(data.writerRole) || "Editorial folio",
    identityLine:
      emptyToNull(data.identityLine) ||
      house?.identityLine ||
      "A global laboratory with global solutions",
    published: data.published ?? true,
  };
}
