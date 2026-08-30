"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolioEditor } from "@/components/editor/FolioEditor";
import { SeoSidecar } from "@/components/conservatory/SeoSidecar";
import type { SeoInput } from "@/lib/seo";

type Insight = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string | null;
  writerName: string | null;
  writerRole: string | null;
  identityLine: string | null;
  industryId: string | null;
  seo: (SeoInput & { path?: string; robots?: string }) | null;
};

type Industry = { id: string; name: string };

export function InsightEditor({
  insight,
  industries,
}: {
  insight: Insight;
  industries: Industry[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(insight.title);
  const [slug, setSlug] = useState(insight.slug);
  const [excerpt, setExcerpt] = useState(insight.excerpt);
  const [content, setContent] = useState(insight.content);
  const [image, setImage] = useState(insight.image || "");
  const [industryId, setIndustryId] = useState(insight.industryId || "");
  const [writerName, setWriterName] = useState(insight.writerName || "");
  const [writerRole, setWriterRole] = useState(insight.writerRole || "");
  const [identityLine, setIdentityLine] = useState(insight.identityLine || "");
  const [seo, setSeo] = useState<SeoInput & { path?: string; robots?: string }>(
    insight.seo || {
      path: `/insights/${insight.slug}`,
      title: insight.title,
      description: insight.excerpt,
    },
  );
  const [status, setStatus] = useState("");

  async function save() {
    await fetch(`/api/insights/${insight.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        excerpt,
        content,
        image,
        industryId,
        writerName,
        writerRole,
        identityLine,
        published: true,
      }),
    });
    await fetch("/api/seo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: seo.path || `/insights/${slug}`,
        title: seo.title || title,
        description: seo.description || excerpt,
        keywords: seo.keywords || "",
        ogTitle: seo.ogTitle || title,
        ogDescription: seo.ogDescription || excerpt,
        ogImage: seo.ogImage || image,
        canonical: seo.canonical || `https://www.metrra.com/insights/${slug}`,
        robots: seo.robots || "index,follow",
        focusKeyword: seo.focusKeyword || "",
      }),
    });
    setStatus("Industry note published.");
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h1 className="display text-4xl">Compose industry note</h1>
        <button onClick={save} className="rounded-full bg-aqua px-5 py-2 text-[12px] tracking-[0.16em] text-ink uppercase">
          Save
        </button>
      </div>
      {status && <p className="mt-3 text-sm text-sand/70">{status}</p>}
      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0A1F44] px-4 py-3 display text-3xl" />
          <div className="grid gap-3 sm:grid-cols-3">
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2 text-sm" />
            <input value={image} onChange={(e) => setImage(e.target.value)} className="rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2 text-sm" />
            <select
              value={industryId}
              onChange={(e) => setIndustryId(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2 text-sm"
            >
              <option value="">Choose industry</option>
              {industries.map((industry) => (
                <option key={industry.id} value={industry.id}>
                  {industry.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              value={writerName}
              onChange={(e) => setWriterName(e.target.value)}
              placeholder="Writer name"
              className="rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2 text-sm"
            />
            <input
              value={writerRole}
              onChange={(e) => setWriterRole(e.target.value)}
              placeholder="Writer role"
              className="rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2 text-sm"
            />
            <input
              value={identityLine}
              onChange={(e) => setIdentityLine(e.target.value)}
              placeholder="Written identity"
              className="rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2 text-sm"
            />
          </div>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2 text-sm" />
          <FolioEditor value={content} onChange={setContent} />
        </div>
        <SeoSidecar value={{ ...seo, content }} onChange={setSeo} />
      </div>
    </div>
  );
}
