"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolioEditor } from "@/components/editor/FolioEditor";
import { SeoSidecar } from "@/components/conservatory/SeoSidecar";
import type { SeoInput } from "@/lib/seo";

type SeoState = SeoInput & { path?: string; schemaJson?: string; robots?: string };

export function PageEditor(props: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  seo: SeoState;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(props.title);
  const [slug, setSlug] = useState(props.slug);
  const [excerpt, setExcerpt] = useState(props.excerpt);
  const [content, setContent] = useState(props.content);
  const [seo, setSeo] = useState<SeoState>(props.seo);
  const [status, setStatus] = useState("");

  async function save() {
    setStatus("Saving…");
    const pageRes = await fetch(`/api/pages/${props.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, excerpt, content, kind: "custom" }),
    });
    const seoRes = await fetch("/api/seo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: seo.path || `/${slug}`,
        title: seo.title || title,
        description: seo.description || excerpt || title,
        keywords: seo.keywords || "",
        ogTitle: seo.ogTitle || seo.title || title,
        ogDescription: seo.ogDescription || seo.description || excerpt,
        ogImage: seo.ogImage || "",
        canonical: seo.canonical || `https://www.mettra.com/${slug === "home" ? "" : slug}`,
        robots: seo.robots || "index,follow",
        schemaJson: seo.schemaJson || "",
        focusKeyword: seo.focusKeyword || "",
      }),
    });
    setStatus(pageRes.ok && seoRes.ok ? "Published to the house." : "The folio could not save.");
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-aqua uppercase">Folio</p>
          <h1 className="display mt-2 text-4xl">Compose</h1>
        </div>
        <button onClick={save} className="rounded-full bg-aqua px-5 py-2 text-[12px] tracking-[0.16em] text-ink uppercase">
          Save manuscript
        </button>
      </div>
      {status && <p className="mt-3 text-sm text-sand/70">{status}</p>}
      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#102226] px-4 py-3 display text-3xl text-ivory"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              className="rounded-xl border border-white/10 bg-[#102226] px-3 py-2 text-sm"
            />
            <input
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="Excerpt"
              className="rounded-xl border border-white/10 bg-[#102226] px-3 py-2 text-sm"
            />
          </div>
          <FolioEditor value={content} onChange={setContent} />
        </div>
        <SeoSidecar value={{ ...seo, content }} onChange={setSeo} />
      </div>
    </div>
  );
}
