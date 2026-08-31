"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Banner } from "@prisma/client";

export function CinemaBoard({ banners }: { banners: Banner[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState("/images/labs/hero-1.jpg");

  async function addBanner() {
    await fetch("/api/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        subtitle,
        image,
        ctaLabel: "Request a quote",
        ctaHref: "/contact",
        sortOrder: banners.length,
        active: true,
      }),
    });
    setTitle("");
    setSubtitle("");
    router.refresh();
  }

  async function remove(id: string) {
    await fetch("/api/banners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <div className="mt-10 space-y-4">
      {banners.map((banner) => (
        <div key={banner.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/10 p-4">
          <div>
            <p className="display text-2xl">{banner.title}</p>
            <p className="text-sm text-ink/60">{banner.image}</p>
          </div>
          <button onClick={() => remove(banner.id)} className="text-xs tracking-[0.14em] text-violet uppercase">
            Retire
          </button>
        </div>
      ))}
      <div className="grid gap-3 rounded-2xl border border-dashed border-aqua/30 p-5">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="rounded-xl border border-ink/15 bg-white px-3 py-2" />
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtitle" className="rounded-xl border border-ink/15 bg-white px-3 py-2" />
        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image path" className="rounded-xl border border-ink/15 bg-white px-3 py-2" />
        <button onClick={addBanner} className="justify-self-start rounded-full bg-ink px-5 py-2 text-[12px] tracking-[0.16em] text-white uppercase">
          Add running frame
        </button>
      </div>
    </div>
  );
}
