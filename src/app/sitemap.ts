import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, services, insights] = await Promise.all([
    prisma.category.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.service.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.insight.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticPaths = ["/", "/about", "/disciplines", "/accreditations", "/insights", "/contact", "/privacy"];

  return [
    ...staticPaths.map((path) => ({ url: siteUrl(path), changeFrequency: "weekly" as const, priority: path === "/" ? 1 : 0.7 })),
    ...categories.map((item) => ({
      url: siteUrl(`/disciplines/${item.slug}`),
      lastModified: item.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...services.map((item) => ({
      url: siteUrl(`/services/${item.slug}`),
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...insights.map((item) => ({
      url: siteUrl(`/insights/${item.slug}`),
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
