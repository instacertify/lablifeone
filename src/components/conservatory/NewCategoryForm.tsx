"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function NewCategoryForm() {
  const router = useRouter();
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug,
        excerpt: form.get("excerpt"),
        description: `<p>${form.get("excerpt")}</p>`,
        accent: form.get("accent") || "aqua",
        image: form.get("image") || "/images/labs/discipline.jpg",
      }),
    });
    setStatus(response.ok ? "Wing opened." : "Could not open the wing.");
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-12 rounded-3xl border border-dashed border-aqua/30 p-6">
      <h2 className="display text-3xl">Open a new category</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="e.g. Toys & Juvenile" className="rounded-xl border border-white/10 bg-[#102226] px-3 py-2" />
        <select name="accent" className="rounded-xl border border-white/10 bg-[#102226] px-3 py-2">
          <option value="aqua">Aqua</option>
          <option value="iris">Iris</option>
          <option value="bronze">Bronze</option>
          <option value="jade">Jade</option>
        </select>
        <input name="image" placeholder="Image path or Vault URL" className="rounded-xl border border-white/10 bg-[#102226] px-3 py-2 sm:col-span-2" />
        <textarea name="excerpt" required placeholder="Short excerpt" className="rounded-xl border border-white/10 bg-[#102226] px-3 py-2 sm:col-span-2" />
      </div>
      <button className="mt-4 rounded-full bg-aqua px-5 py-2 text-[12px] tracking-[0.16em] text-ink uppercase">
        Add discipline
      </button>
      {status && <p className="mt-3 text-sm text-sand/60">{status}</p>}
    </form>
  );
}
