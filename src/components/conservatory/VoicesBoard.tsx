"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Testimonial } from "@prisma/client";

export function VoicesBoard({ voices }: { voices: Testimonial[] }) {
  const router = useRouter();
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        role: form.get("role"),
        company: form.get("company"),
        quote: form.get("quote"),
        published: true,
        sortOrder: voices.length,
      }),
    });
    setStatus(response.ok ? "Voice added to the library." : "Could not add the voice.");
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  async function retire(id: string) {
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="mt-10 space-y-8">
      <div className="grid gap-4">
        {voices.map((voice) => (
          <article key={voice.id} className="rounded-2xl border border-ink/10 p-5">
            <p className="display text-2xl text-ink">“{voice.quote}”</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink/70">
                {voice.name}
                {voice.role ? ` · ${voice.role}` : ""}
                {voice.company ? ` · ${voice.company}` : ""}
              </p>
              <button
                type="button"
                onClick={() => retire(voice.id)}
                className="text-[11px] tracking-[0.14em] text-ink/45 uppercase hover:text-ink"
              >
                Retire
              </button>
            </div>
          </article>
        ))}
      </div>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-3xl border border-dashed border-ink/20 p-6">
        <h2 className="display text-3xl">Add a voice</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <input name="name" required placeholder="Name" className="rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm" />
          <input name="role" placeholder="Role" className="rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm" />
          <input name="company" placeholder="Company" className="rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm" />
        </div>
        <textarea name="quote" required placeholder="What they said" rows={3} className="rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm" />
        <button className="justify-self-start rounded-full bg-ink px-5 py-2 text-[12px] tracking-[0.16em] text-white uppercase">
          Add to library
        </button>
        {status && <p className="text-sm text-ink/70">{status}</p>}
      </form>
    </div>
  );
}
