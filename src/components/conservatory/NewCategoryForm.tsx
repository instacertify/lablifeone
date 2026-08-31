"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Parent = { id: string; name: string };

export function NewCategoryForm({ parents = [] }: { parents?: Parent[] }) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [csv, setCsv] = useState("");
  const [bulkParentId, setBulkParentId] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const names = String(form.get("name") || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (!names.length) return;
    let opened = 0;
    for (const name of names) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          excerpt: form.get("excerpt") || `A Metrra Lab discipline for ${name}.`,
          description: `<p>${form.get("excerpt") || `A Metrra Lab discipline for ${name}.`}</p>`,
          accent: form.get("accent") || "aqua",
          image: form.get("image") || "/images/labs/discipline.jpg",
          parentId: form.get("parentId") || "",
        }),
      });
      if (response.ok) opened += 1;
    }
    setStatus(opened ? `${opened} categor${opened === 1 ? "y" : "ies"} opened.` : "Could not open the wing.");
    if (opened) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  async function uploadBulk() {
    if (!csv.trim()) return;
    const response = await fetch("/api/categories/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv, parentId: bulkParentId }),
    });
    const payload = await response.json().catch(() => ({}));
    setStatus(response.ok ? `Uploaded ${payload.created || 0} categories.` : payload.error || "Upload failed.");
    if (response.ok) {
      setCsv("");
      router.refresh();
    }
  }

  return (
    <div className="mt-12 space-y-8">
      <form onSubmit={onSubmit} className="rounded-3xl border border-dashed border-aqua/30 p-6">
        <h2 className="display text-3xl">Open categories</h2>
        <p className="mt-2 text-sm text-ink/60">
          One name per line to create multiple disciplines at once. Leave parent empty to place them
          under the Disciplines menu.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <textarea
            name="name"
            required
            placeholder={"Food & Nutrition\nMetals & Alloy\nPlastics & Polymer"}
            rows={4}
            className="rounded-xl border border-ink/15 bg-white px-3 py-2 sm:col-span-2"
          />
          <select name="parentId" className="rounded-xl border border-ink/15 bg-white px-3 py-2">
            <option value="">Top-level under Disciplines</option>
            {parents.map((parent) => (
              <option key={parent.id} value={parent.id}>
                Under {parent.name}
              </option>
            ))}
          </select>
          <select name="accent" className="rounded-xl border border-ink/15 bg-white px-3 py-2">
            <option value="aqua">Aqua</option>
            <option value="iris">Iris</option>
            <option value="bronze">Bronze</option>
            <option value="jade">Jade</option>
          </select>
          <input name="image" placeholder="Image path or Vault URL" className="rounded-xl border border-ink/15 bg-white px-3 py-2 sm:col-span-2" />
          <textarea name="excerpt" placeholder="Shared excerpt (optional)" className="rounded-xl border border-ink/15 bg-white px-3 py-2 sm:col-span-2" />
        </div>
        <button className="mt-4 rounded-full bg-ink px-5 py-2 text-[12px] tracking-[0.16em] text-white uppercase">
          Add categories
        </button>
      </form>

      <div className="rounded-3xl border border-ink/10 p-6">
        <h2 className="display text-3xl">Bulk upload categories</h2>
        <p className="mt-2 text-sm text-ink/60">
          CSV columns: name, slug, excerpt, accent, parentSlug. Or attach every row under one parent.
        </p>
        <select
          value={bulkParentId}
          onChange={(event) => setBulkParentId(event.target.value)}
          className="mt-4 rounded-xl border border-ink/15 bg-white px-3 py-2"
        >
          <option value="">Use parentSlug column or top-level</option>
          {parents.map((parent) => (
            <option key={parent.id} value={parent.id}>
              Attach all under {parent.name}
            </option>
          ))}
        </select>
        <textarea
          value={csv}
          onChange={(event) => setCsv(event.target.value)}
          rows={5}
          placeholder="name,slug,excerpt,accent,parentSlug"
          className="mt-3 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 font-mono text-xs"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-full border border-ink/20 px-4 py-1.5 text-[11px] tracking-[0.14em] uppercase">
            Choose CSV
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (file) setCsv(await file.text());
              }}
            />
          </label>
          <a href="/templates/categories-bulk.csv" className="text-[11px] text-aqua underline">
            Download template
          </a>
          <button type="button" onClick={uploadBulk} className="rounded-full bg-white px-4 py-1.5 text-[11px] tracking-[0.14em] text-ink uppercase">
            Upload categories
          </button>
        </div>
      </div>
      {status && <p className="text-sm text-ink/60">{status}</p>}
    </div>
  );
}
