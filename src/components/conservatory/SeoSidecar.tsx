"use client";

import { evaluateSeo, type SeoInput } from "@/lib/seo";

export function SeoSidecar({
  value,
  onChange,
}: {
  value: SeoInput & { path?: string; schemaJson?: string; robots?: string };
  onChange: (next: SeoInput & { path?: string; schemaJson?: string; robots?: string }) => void;
}) {
  const score = evaluateSeo(value);

  function set<K extends keyof typeof value>(key: K, next: (typeof value)[K]) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-[#102226] p-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] tracking-[0.2em] text-aqua uppercase">Compass</p>
          <h3 className="display text-3xl">SEO atelier</h3>
        </div>
        <div className="text-right">
          <p className="display text-4xl text-aqua">{score.score}</p>
          <p className="text-[11px] tracking-[0.16em] uppercase">Grade {score.grade}</p>
        </div>
      </div>
      <label className="block text-xs text-sand/70">
        Public path
        <input
          value={value.path || ""}
          onChange={(event) => set("path", event.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-ink/40 px-3 py-2 text-sm text-ivory"
        />
      </label>
      <label className="block text-xs text-sand/70">
        Title · {value.title?.length || 0} chars
        <input
          value={value.title || ""}
          onChange={(event) => set("title", event.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-ink/40 px-3 py-2 text-sm text-ivory"
        />
      </label>
      <label className="block text-xs text-sand/70">
        Meta description · {value.description?.length || 0} chars
        <textarea
          value={value.description || ""}
          onChange={(event) => set("description", event.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-white/10 bg-ink/40 px-3 py-2 text-sm text-ivory"
        />
      </label>
      <label className="block text-xs text-sand/70">
        Focus keyword
        <input
          value={value.focusKeyword || ""}
          onChange={(event) => set("focusKeyword", event.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-ink/40 px-3 py-2 text-sm text-ivory"
        />
      </label>
      <label className="block text-xs text-sand/70">
        Supporting keywords
        <input
          value={value.keywords || ""}
          onChange={(event) => set("keywords", event.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-ink/40 px-3 py-2 text-sm text-ivory"
        />
      </label>
      <label className="block text-xs text-sand/70">
        Canonical URL
        <input
          value={value.canonical || ""}
          onChange={(event) => set("canonical", event.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-ink/40 px-3 py-2 text-sm text-ivory"
        />
      </label>
      <label className="block text-xs text-sand/70">
        OG image path
        <input
          value={value.ogImage || ""}
          onChange={(event) => set("ogImage", event.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-ink/40 px-3 py-2 text-sm text-ivory"
        />
      </label>
      <label className="block text-xs text-sand/70">
        Robots
        <select
          value={value.robots || "index,follow"}
          onChange={(event) => set("robots", event.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-ink/40 px-3 py-2 text-sm text-ivory"
        >
          <option value="index,follow">index,follow</option>
          <option value="noindex,follow">noindex,follow</option>
          <option value="noindex,nofollow">noindex,nofollow</option>
        </select>
      </label>
      <div className="rounded-xl bg-ink/50 p-3">
        <p className="text-[10px] tracking-[0.18em] text-sand/50 uppercase">SERP preview</p>
        <p className="mt-2 text-[#8ab4f8]">{value.title || "Untitled folio"}</p>
        <p className="text-xs text-[#3ddcbf]">{value.canonical || "https://www.mettra.com"}</p>
        <p className="mt-1 text-sm text-sand/70">{value.description}</p>
      </div>
      <ul className="space-y-2">
        {score.checks.map((check) => (
          <li key={check.id} className="flex gap-3 text-xs">
            <span className={check.pass ? "text-aqua" : "text-violet"}>{check.pass ? "●" : "○"}</span>
            <span>
              <strong className="text-ivory">{check.label}</strong>
              <span className="block text-sand/50">{check.hint}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
