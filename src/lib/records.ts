import type { z } from "zod";
import type { categorySchema, serviceSchema } from "@/lib/validators";

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
