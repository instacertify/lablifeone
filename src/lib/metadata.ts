import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

type SeoLike = {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  canonical?: string | null;
  robots?: string | null;
};

export async function safeMetadata(
  load: () => Promise<SeoLike | null | undefined>,
  fallback: { title: string; description: string; path: string },
): Promise<Metadata> {
  try {
    return buildMetadata(await load(), fallback);
  } catch {
    return buildMetadata(null, fallback);
  }
}

export function buildMetadata(
  seo: SeoLike | null | undefined,
  fallback: { title: string; description: string; path: string },
): Metadata {
  const title = seo?.title || fallback.title;
  const description = seo?.description || fallback.description;
  const canonical = seo?.canonical || siteUrl(fallback.path);
  const ogImage = seo?.ogImage || "/images/labs/hero-3.jpg";
  const robots = seo?.robots || "index,follow";

  return {
    title,
    description,
    keywords: seo?.keywords?.split(",").map((item) => item.trim()).filter(Boolean),
    alternates: { canonical },
    robots: robots.includes("noindex")
      ? { index: false, follow: robots.includes("follow") }
      : { index: true, follow: true },
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url: canonical,
      siteName: "Metrra Lab",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      images: [ogImage],
    },
  };
}
