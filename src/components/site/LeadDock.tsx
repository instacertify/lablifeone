"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { LeadForm } from "@/components/site/LeadForm";

export function LeadDock({
  categories,
  sourcePage,
}: {
  categories: string[];
  sourcePage?: string;
}) {
  const pathname = usePathname();
  const origin = sourcePage || pathname || "/";
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-4 z-50 rounded-full bg-iris px-5 py-3 text-[11px] tracking-[0.2em] text-white uppercase shadow-xl shadow-iris/30 transition hover:bg-violet md:right-7 md:bottom-7"
      >
        Capture a lead
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-ink/50 p-4 backdrop-blur-sm md:p-8">
          <div className="w-full max-w-md rounded-3xl bg-paper p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] tracking-[0.2em] text-jade uppercase">
                  Every page, a door
                </p>
                <h2 className="display mt-1 text-3xl text-ink">Leave a brief</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs tracking-[0.16em] uppercase text-ink/50 hover:text-ink"
              >
                Close
              </button>
            </div>
            <LeadForm sourcePage={origin} categories={categories} />
          </div>
        </div>
      )}
    </>
  );
}
