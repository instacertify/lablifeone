"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Setting } from "@prisma/client";

export function HouseForm({ settings }: { settings: Setting }) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || "");
  const [uploading, setUploading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.logoUrl = logoUrl;
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setStatus(response.ok ? "The house is updated." : "Could not save the house.");
    router.refresh();
  }

  async function uploadLogo(file: File) {
    const type = file.type.toLowerCase();
    if (!["image/png", "image/webp"].includes(type)) {
      setStatus("Logo must be PNG or WebP.");
      return;
    }
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    body.append("alt", "Metrra Lab logo");
    body.append("kind", "logo");
    const response = await fetch("/api/media", { method: "POST", body });
    const payload = await response.json();
    setUploading(false);
    if (!response.ok) {
      setStatus(payload.error || "Logo upload failed.");
      return;
    }
    setLogoUrl(payload.url);
    setStatus("Logo uploaded. Save the house to publish it.");
  }

  const field = "w-full rounded-xl border border-white/10 bg-ink px-3 py-2 text-sm";

  return (
    <form onSubmit={onSubmit} className="mt-10 grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-white/10 p-5 sm:col-span-2">
        <p className="text-[11px] tracking-[0.18em] text-white/60 uppercase">House mark</p>
        <p className="mt-2 text-sm text-white/70">
          The Double R — measured twice. Upload a PNG or WebP to replace the default navy mark.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-5">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Current logo" className="h-16 w-16 rounded-lg bg-white object-contain p-1" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white text-xs text-ink">
              RR
            </div>
          )}
          <label className="cursor-pointer rounded-full bg-white px-4 py-2 text-[11px] tracking-[0.16em] text-ink uppercase">
            {uploading ? "Uploading…" : "Upload PNG / WebP"}
            <input
              type="file"
              accept="image/png,image/webp"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) uploadLogo(file);
              }}
            />
          </label>
        </div>
      </div>
      <p className="text-xs text-white/50 sm:col-span-2">
        Identity line is the public voice (for example “A global laboratory with global solutions”).
        The address below is a facility, not the brand identity.
      </p>
      {(
        [
          ["companyName", "Company name"],
          ["tagline", "Tagline"],
          ["identityLine", "Identity line"],
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
        <label key={name} className="text-xs text-white/60">
          {label}
          <input name={name} defaultValue={String(settings[name] ?? "")} className={`mt-1 ${field}`} />
        </label>
      ))}
      <label className="text-xs text-white/60 sm:col-span-2">
        About excerpt
        <textarea name="aboutExcerpt" defaultValue={settings.aboutExcerpt} rows={3} className={`mt-1 ${field}`} />
      </label>
      <label className="text-xs text-white/60 sm:col-span-2">
        Footer note
        <textarea name="footerNote" defaultValue={settings.footerNote} rows={3} className={`mt-1 ${field}`} />
      </label>
      <button className="justify-self-start rounded-full bg-white px-6 py-2 text-[12px] tracking-[0.16em] text-ink uppercase">
        Save the house
      </button>
      {status && <p className="self-center text-sm text-white/70">{status}</p>}
    </form>
  );
}
