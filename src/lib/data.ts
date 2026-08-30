import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getSettings = cache(async () => {
  return prisma.setting.findUnique({ where: { id: "house" } });
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
  return prisma.category.findMany({
    where: { published: true, parentId: null },
    orderBy: { sortOrder: "asc" },
    include: categoryTree,
  });
});

export const getCategoryBySlug = cache(async (slug: string) => {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      ...categoryTree,
      parent: true,
      seo: true,
    },
  });
});

export const getServiceBySlug = cache(async (slug: string) => {
  return prisma.service.findUnique({
    where: { slug },
    include: { category: true, seo: true },
  });
});

export const getBanners = cache(async () => {
  return prisma.banner.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
});

export const getFaqs = cache(async () => {
  return prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });
});

export const getPageBySlug = cache(async (slug: string) => {
  return prisma.page.findUnique({
    where: { slug },
    include: { seo: true },
  });
});

export const getPublishedIndustries = cache(async () => {
  return prisma.industry.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { insights: { where: { published: true } } } },
    },
  });
});

export const getPublishedInsights = cache(async (industrySlug?: string) => {
  return prisma.insight.findMany({
    where: {
      published: true,
      ...(industrySlug ? { industry: { slug: industrySlug, published: true } } : {}),
    },
    orderBy: { publishedAt: "desc" },
    include: { seo: true, industry: true },
  });
});

export const getInsightBySlug = cache(async (slug: string) => {
  return prisma.insight.findUnique({
    where: { slug },
    include: { seo: true, industry: true },
  });
});

export const getSeoByPath = cache(async (path: string) => {
  return prisma.seoRecord.findUnique({ where: { path } });
});

export const getPublishedTestimonials = cache(async () => {
  return prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
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
