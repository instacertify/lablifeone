"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Industry = { id: string; name: string; slug: string };

export function IndustryBoard({ industries }: { industries: Industry[] }) {
  const router = useRouter();
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const response = await fetch("/api/industries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    setStatus(response.ok ? "Industry opened." : "Could not open the industry.");
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  async function remove(id: string) {
    await fetch(`/api/industries/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <section className="mt-14">
      <h2 className="display text-3xl">Industries</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink/60">
        These filters appear on Industry Insights. Add Cosmetic Industry, Food and Beverage,
        Plastics, or any vertical the house needs next.
      </p>
      <ul className="mt-5 space-y-2">
        {industries.map((industry) => (
          <li key={industry.id} className="flex items-center justify-between rounded-xl border border-ink/10 px-4 py-3 text-sm">
            <span>
              {industry.name}
              <span className="ml-2 text-[11px] text-ink/40">{industry.slug}</span>
            </span>
            <button type="button" onClick={() => remove(industry.id)} className="text-[11px] tracking-[0.14em] text-ink/50 uppercase">
              Remove
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={onSubmit} className="mt-4 flex flex-wrap gap-2">
        <input
          name="name"
          required
          placeholder="e.g. Textile Industry"
          className="min-w-64 flex-1 rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm"
        />
        <button className="rounded-full bg-ink px-4 py-2 text-[11px] tracking-[0.14em] text-white uppercase">
          Add industry
        </button>
      </form>
      {status && <p className="mt-2 text-sm text-ink/60">{status}</p>}
    </section>
  );
}
