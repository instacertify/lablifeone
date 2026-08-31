import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { ensureDatabase } from "@/lib/ensure-db";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    await ensureDatabase();
    return await fn();
  } catch (error) {
    console.error(error);
    return fallback;
  }
}

export const getSettings = cache(async () => {
  return safe(() => prisma.setting.findUnique({ where: { id: "house" } }), null);
});

const categoryTree = {
  services: {
    where: { published: true },
    orderBy: { sortOrder: "asc" as const },
  },
  children: {
    where: { published: true },
    orderBy: { sortOrder: "asc" as const },
    include: {
      services: {
        where: { published: true },
        orderBy: { sortOrder: "asc" as const },
      },
    },
  },
};

export const getPublishedCategories = cache(async () => {
  return safe(
    () =>
      prisma.category.findMany({
        where: { published: true, parentId: null },
        orderBy: { sortOrder: "asc" },
        include: categoryTree,
      }),
    [],
  );
});

export const getCategoryBySlug = cache(async (slug: string) => {
  return safe(
    () =>
      prisma.category.findUnique({
        where: { slug },
        include: {
          ...categoryTree,
          parent: true,
          seo: true,
        },
      }),
    null,
  );
});

export const getServiceBySlug = cache(async (slug: string) => {
  return safe(
    () => prisma.service.findUnique({ where: { slug }, include: { category: true, seo: true } }),
    null,
  );
});

export const getBanners = cache(async () => {
  return safe(
    () => prisma.banner.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    [],
  );
});

export const getFaqs = cache(async () => {
  return safe(() => prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }), []);
});

export const getPageBySlug = cache(async (slug: string) => {
  return safe(() => prisma.page.findUnique({ where: { slug }, include: { seo: true } }), null);
});

export const getPublishedIndustries = cache(async () => {
  return safe(
    () =>
      prisma.industry.findMany({
        where: { published: true },
        orderBy: { sortOrder: "asc" },
        include: {
          _count: { select: { insights: { where: { published: true } } } },
        },
      }),
    [],
  );
});

export const getPublishedInsights = cache(async (industrySlug?: string) => {
  return safe(
    () =>
      prisma.insight.findMany({
        where: {
          published: true,
          ...(industrySlug ? { industry: { slug: industrySlug, published: true } } : {}),
        },
        orderBy: { publishedAt: "desc" },
        include: { seo: true, industry: true },
      }),
    [],
  );
});

export const getInsightBySlug = cache(async (slug: string) => {
  return safe(
    () => prisma.insight.findUnique({ where: { slug }, include: { seo: true, industry: true } }),
    null,
  );
});

export const getSeoByPath = cache(async (path: string) => {
  return safe(() => prisma.seoRecord.findUnique({ where: { path } }), null);
});

export const getPublishedTestimonials = cache(async () => {
  return safe(
    () =>
      prisma.testimonial.findMany({
        where: { published: true },
        orderBy: { sortOrder: "asc" },
      }),
    [],
  );
});

export function flattenCategoryNames(
  categories: { name: string; children?: { name: string }[] }[],
) {
  return categories.flatMap((category) => [
    category.name,
    ...(category.children?.map((child) => child.name) ?? []),
  ]);
}

export function formatAddress(settings: {
  addressLine: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}) {
  return `${settings.addressLine}, ${settings.city}, ${settings.region} ${settings.postalCode}, ${settings.country}`;
}
