"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolioEditor } from "@/components/editor/FolioEditor";
import { SeoSidecar } from "@/components/conservatory/SeoSidecar";
import type { SeoInput } from "@/lib/seo";

type Service = {
  id: string;
  name: string;
  slug: string;
  excerpt: string;
  description: string;
};

type Props = {
  category: {
    id: string;
    name: string;
    slug: string;
    excerpt: string;
    description: string;
    image: string | null;
    accent: string;
    published: boolean;
    seo: (SeoInput & { path?: string; robots?: string }) | null;
    services: Service[];
  };
};

export function CategoryEditor({ category }: Props) {
  const router = useRouter();
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [excerpt, setExcerpt] = useState(category.excerpt);
  const [description, setDescription] = useState(category.description);
  const [image, setImage] = useState(category.image || "");
  const [accent, setAccent] = useState(category.accent);
  const [seo, setSeo] = useState<SeoInput & { path?: string; robots?: string }>(
    category.seo || {
      path: `/disciplines/${category.slug}`,
      title: `${category.name} | Metrra Lab`,
      description: category.excerpt,
    },
  );
  const [status, setStatus] = useState("");
  const [serviceName, setServiceName] = useState("");

  async function save() {
    setStatus("Saving…");
    const response = await fetch(`/api/categories/${category.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, excerpt, description, image, accent, published: true }),
    });
    await fetch("/api/seo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: seo.path || `/disciplines/${slug}`,
        title: seo.title || `${name} | Metrra Lab`,
        description: seo.description || excerpt,
        keywords: seo.keywords || "",
        ogTitle: seo.ogTitle || seo.title,
        ogDescription: seo.ogDescription || seo.description,
        ogImage: seo.ogImage || image,
        canonical: seo.canonical || `https://www.metrra.com/disciplines/${slug}`,
        robots: seo.robots || "index,follow",
        focusKeyword: seo.focusKeyword || name.toLowerCase(),
      }),
    });
    setStatus(response.ok ? "Discipline updated." : "Could not save.");
    router.refresh();
  }

  async function addService() {
    if (!serviceName.trim()) return;
    const serviceSlug = serviceName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: serviceName,
        slug: serviceSlug,
        excerpt: `An assay within ${name}.`,
        description: `<p>Commission the ${serviceName} protocol from Metrra.</p>`,
        categoryId: category.id,
        image,
      }),
    });
    setServiceName("");
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-aqua uppercase">Atelier</p>
          <h1 className="display mt-2 text-4xl">Edit discipline</h1>
        </div>
        <button onClick={save} className="rounded-full bg-aqua px-5 py-2 text-[12px] tracking-[0.16em] text-ink uppercase">
          Save wing
        </button>
      </div>
      {status && <p className="mt-3 text-sm text-sand/70">{status}</p>}
      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0A1F44] px-4 py-3 display text-3xl" />
          <div className="grid gap-3 sm:grid-cols-3">
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2 text-sm" />
            <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image" className="rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2 text-sm" />
            <select value={accent} onChange={(e) => setAccent(e.target.value)} className="rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2 text-sm">
              <option value="aqua">Aqua</option>
              <option value="iris">Iris</option>
              <option value="bronze">Bronze</option>
              <option value="jade">Jade</option>
            </select>
          </div>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2 text-sm" />
          <FolioEditor value={description} onChange={setDescription} />
          <div className="rounded-2xl border border-white/10 p-4">
            <h3 className="display text-2xl">Services in this wing</h3>
            <ul className="mt-3 space-y-2 text-sm text-sand/80">
              {category.services.map((service) => (
                <li key={service.id}>{service.name}</li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <input
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="New assay name"
                className="flex-1 rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2 text-sm"
              />
              <button type="button" onClick={addService} className="rounded-full bg-iris px-4 text-[11px] tracking-[0.14em] uppercase">
                Add
              </button>
            </div>
          </div>
        </div>
        <SeoSidecar value={{ ...seo, content: description }} onChange={setSeo} />
      </div>
    </div>
  );
}
