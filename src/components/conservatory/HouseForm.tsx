"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Setting } from "@prisma/client";

export function HouseForm({ settings }: { settings: Setting }) {
  const router = useRouter();
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setStatus(response.ok ? "The house is updated." : "Could not save the house.");
    router.refresh();
  }

  const field = "w-full rounded-xl border border-white/10 bg-[#102226] px-3 py-2 text-sm";

  return (
    <form onSubmit={onSubmit} className="mt-10 grid gap-4 sm:grid-cols-2">
      {(
        [
          ["companyName", "Company name"],
          ["tagline", "Tagline"],
          ["email", "Email"],
          ["phone", "Telephone"],
          ["addressLine", "Address line"],
          ["city", "City"],
          ["region", "Region"],
          ["postalCode", "Postal code"],
          ["country", "Country"],
          ["hours", "Hours"],
          ["linkedin", "LinkedIn"],
          ["mapEmbed", "Map embed URL"],
        ] as const
      ).map(([name, label]) => (
        <label key={name} className="text-xs text-sand/60">
          {label}
          <input name={name} defaultValue={String(settings[name] ?? "")} className={`mt-1 ${field}`} />
        </label>
      ))}
      <label className="text-xs text-sand/60 sm:col-span-2">
        About excerpt
        <textarea name="aboutExcerpt" defaultValue={settings.aboutExcerpt} rows={3} className={`mt-1 ${field}`} />
      </label>
      <label className="text-xs text-sand/60 sm:col-span-2">
        Footer note
        <textarea name="footerNote" defaultValue={settings.footerNote} rows={3} className={`mt-1 ${field}`} />
      </label>
      <button className="justify-self-start rounded-full bg-aqua px-6 py-2 text-[12px] tracking-[0.16em] text-ink uppercase">
        Save the house
      </button>
      {status && <p className="self-center text-sm text-sand/70">{status}</p>}
    </form>
  );
}
