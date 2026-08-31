"use client";

import { useRouter } from "next/navigation";

export function LeadStatus({ id, status }: { id: string; status: string }) {
  const router = useRouter();

  return (
    <select
      defaultValue={status}
      onChange={async (event) => {
        await fetch("/api/leads", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: event.target.value }),
        });
        router.refresh();
      }}
      className="rounded-full border border-ink/15 bg-white px-3 py-1 text-[11px] tracking-[0.14em] uppercase"
    >
      <option value="new">New</option>
      <option value="opened">Opened</option>
      <option value="won">Won</option>
      <option value="closed">Closed</option>
    </select>
  );
}
