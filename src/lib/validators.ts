import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().or(z.literal("")),
  company: z.string().max(160).optional().or(z.literal("")),
  category: z.string().max(120).optional().or(z.literal("")),
  message: z.string().min(8).max(4000),
  sourcePage: z.string().max(240).optional().or(z.literal("")),
  privacyAccepted: z.preprocess(
    (value) => value === true || value === "on" || value === "true",
    z.literal(true),
  ),
});

export const privacyRequestSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  kind: z.enum(["access", "erasure", "rectification", "objection", "portability", "other"]),
  message: z.string().min(8).max(4000),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().min(8),
  description: z.string().min(8),
  image: z.string().optional().or(z.literal("")),
  accent: z.string().optional(),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
  parentId: z.string().optional().or(z.literal("")),
});

export const serviceSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().min(8),
  description: z.string().min(8),
  image: z.string().optional().or(z.literal("")),
  categoryId: z.string().min(1),
  standard: z.string().optional().or(z.literal("")),
  timeline: z.string().optional().or(z.literal("")),
  method: z.string().optional().or(z.literal("")),
  sample: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
});

export const pageSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().optional().or(z.literal("")),
  content: z.string().min(8),
  kind: z.string().optional(),
  published: z.boolean().optional(),
});

export const insightSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().min(8),
  content: z.string().min(8),
  image: z.string().optional().or(z.literal("")),
  writerName: z.string().optional().or(z.literal("")),
  writerRole: z.string().optional().or(z.literal("")),
  identityLine: z.string().optional().or(z.literal("")),
  industryId: z.string().optional().or(z.literal("")),
  published: z.boolean().optional(),
});

export const industrySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
});

export const bannerSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional().or(z.literal("")),
  image: z.string().min(2),
  ctaLabel: z.string().optional().or(z.literal("")),
  ctaHref: z.string().optional().or(z.literal("")),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

export const seoSchema = z.object({
  path: z.string().min(1),
  title: z.string().min(8),
  description: z.string().min(20),
  keywords: z.string().optional().or(z.literal("")),
  ogTitle: z.string().optional().or(z.literal("")),
  ogDescription: z.string().optional().or(z.literal("")),
  ogImage: z.string().optional().or(z.literal("")),
  canonical: z.string().optional().or(z.literal("")),
  robots: z.string().optional(),
  schemaJson: z.string().optional().or(z.literal("")),
  focusKeyword: z.string().optional().or(z.literal("")),
});

export const settingsSchema = z.object({
  companyName: z.string().min(2),
  tagline: z.string().min(4),
  email: z.string().email(),
  phone: z.string().min(6),
  addressLine: z.string().min(4),
  city: z.string().min(2),
  region: z.string().min(2),
  postalCode: z.string().min(4),
  country: z.string().min(2),
  hours: z.string().min(4),
  mapEmbed: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  aboutExcerpt: z.string().min(20),
  footerNote: z.string().min(8),
  logoUrl: z.string().optional().or(z.literal("")),
  identityLine: z.string().min(4),
});

export const bulkCsvSchema = z.object({
  csv: z.string().optional(),
  rows: z.array(z.record(z.string(), z.string())).optional(),
  parentId: z.string().optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
});

export const testimonialSchema = z.object({
  quote: z.string().min(12),
  name: z.string().min(2),
  role: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  image: z.string().optional().or(z.literal("")),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});
