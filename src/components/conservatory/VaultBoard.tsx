"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Asset = { id: string; url: string; alt: string | null; filename: string };

export function VaultBoard({ assets }: { assets: Asset[] }) {
  const router = useRouter();
  const [status, setStatus] = useState("");

  async function upload(file: File) {
    const body = new FormData();
    body.append("file", file);
    body.append("alt", file.name);
    const response = await fetch("/api/media", { method: "POST", body });
    setStatus(response.ok ? "Image in the vault." : "Upload failed.");
    router.refresh();
  }

  return (
    <div className="mt-10">
      <label className="block cursor-pointer rounded-2xl border border-dashed border-aqua/40 p-8 text-center">
        <span className="text-sm text-sand/70">Drop or choose a laboratory image</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file);
          }}
        />
      </label>
      {status && <p className="mt-3 text-sm text-aqua">{status}</p>}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <figure key={asset.id} className="overflow-hidden rounded-2xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset.url} alt={asset.alt || asset.filename} className="h-48 w-full object-cover" />
            <figcaption className="p-3 text-xs text-sand/60">{asset.url}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
