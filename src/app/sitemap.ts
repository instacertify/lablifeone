import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["/", "/about", "/disciplines", "/insights", "/contact", "/privacy", "/cookies"];
  const staticEntries = staticPaths.map((path) => ({
    url: siteUrl(path),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  try {
    const [categories, services, insights] = await Promise.all([
      prisma.category.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.service.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.insight.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);

    return [
      ...staticEntries,
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
  } catch {
    return staticEntries;
  }
}
