"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewInsightPage() {
  const router = useRouter();
  const [error, setError] = useState("");

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
        published: true,
      }),
    });
    if (!response.ok) {
      setError("Could not open the insight.");
      return;
    }
    const insight = await response.json();
    router.push(`/conservatory/folio/insight/${insight.id}`);
  }

  return (
    <div className="min-h-screen bg-[#071316] px-6 py-16 text-ivory">
      <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-4">
        <h1 className="display text-4xl">New insight</h1>
        <input name="title" required placeholder="Title" className="w-full rounded-xl border border-white/10 bg-[#102226] px-3 py-2" />
        <textarea name="excerpt" required placeholder="Excerpt" className="w-full rounded-xl border border-white/10 bg-[#102226] px-3 py-2" />
        {error && <p className="text-sm text-violet">{error}</p>}
        <button className="rounded-full bg-aqua px-5 py-2 text-[12px] tracking-[0.16em] text-ink uppercase">
          Create
        </button>
      </form>
    </div>
  );
}
