"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Industry = { id: string; name: string };

export default function NewInsightPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [industries, setIndustries] = useState<Industry[]>([]);

  useEffect(() => {
    fetch("/api/industries")
      .then((response) => response.json())
      .then((payload) => {
        if (Array.isArray(payload)) setIndustries(payload);
      })
      .catch(() => undefined);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "");
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const response = await fetch("/api/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        excerpt: form.get("excerpt"),
        content: `<p>${form.get("excerpt")}</p>`,
        image: "/images/labs/instruments.jpg",
        industryId: form.get("industryId") || "",
        writerName: form.get("writerName") || "",
        writerRole: form.get("writerRole") || "",
        identityLine: form.get("identityLine") || "",
        published: true,
      }),
    });
    if (!response.ok) {
      setError("Could not open the note.");
      return;
    }
    const insight = await response.json();
    router.push(`/conservatory/folio/insight/${insight.id}`);
  }

  return (
    <div className="min-h-screen bg-[#061433] px-6 py-16 text-ivory">
      <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-4">
        <h1 className="display text-4xl">New industry note</h1>
        <input name="title" required placeholder="Title" className="w-full rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2" />
        <select name="industryId" className="w-full rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2">
          <option value="">Choose industry</option>
          {industries.map((industry) => (
            <option key={industry.id} value={industry.id}>
              {industry.name}
            </option>
          ))}
        </select>
        <input name="writerName" placeholder="Writer name" className="w-full rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2" />
        <input name="writerRole" placeholder="Writer role" className="w-full rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2" />
        <input name="identityLine" placeholder="Written identity (e.g. A global laboratory with global solutions)" className="w-full rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2" />
        <textarea name="excerpt" required placeholder="Excerpt" className="w-full rounded-xl border border-white/10 bg-[#0A1F44] px-3 py-2" />
        {error && <p className="text-sm text-violet">{error}</p>}
        <button className="rounded-full bg-aqua px-5 py-2 text-[12px] tracking-[0.16em] text-ink uppercase">
          Create
        </button>
      </form>
    </div>
  );
}
