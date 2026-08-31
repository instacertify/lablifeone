"use client";

import Link from "next/link";
import { useState } from "react";

type Item = { name: string; slug: string; children?: { name: string; slug: string }[] };

export function DisciplinesMenu({ categories }: { categories: Item[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/disciplines"
        className="text-ink/70 transition hover:text-ink"
        onClick={() => setOpen(false)}
      >
        Disciplines
      </Link>
      {open && (
        <div className="absolute top-full left-1/2 z-50 mt-3 w-[34rem] -translate-x-1/2 rounded-2xl border border-ink/10 bg-white p-5 shadow-xl">
          <p className="mb-3 text-[10px] tracking-[0.2em] text-ink/40 uppercase">
            All under Disciplines
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {categories.map((category) => (
              <div key={category.slug}>
                <Link
                  href={`/disciplines/${category.slug}`}
                  className="display text-xl text-ink hover:underline"
                  onClick={() => setOpen(false)}
                >
                  {category.name}
                </Link>
                {category.children && category.children.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-ink/55">
                    {category.children.map((child) => (
                      <li key={child.slug}>
                        <Link
                          href={`/disciplines/${child.slug}`}
                          className="hover:text-ink"
                          onClick={() => setOpen(false)}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
