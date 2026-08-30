import Link from "next/link";

type Industry = {
  name: string;
  slug: string;
  _count?: { insights: number };
};

export function IndustryFilter({
  industries,
  active,
}: {
  industries: Industry[];
  active?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/insights"
        className={`rounded-full px-4 py-2 text-[11px] tracking-[0.16em] uppercase ${
          !active ? "bg-ink text-ivory" : "border border-ink/15 text-ink/70 hover:border-jade"
        }`}
      >
        All industries
      </Link>
      {industries.map((industry) => (
        <Link
          key={industry.slug}
          href={`/insights?industry=${industry.slug}`}
          className={`rounded-full px-4 py-2 text-[11px] tracking-[0.16em] uppercase ${
            active === industry.slug
              ? "bg-ink text-ivory"
              : "border border-ink/15 text-ink/70 hover:border-jade"
          }`}
        >
          {industry.name}
          {typeof industry._count?.insights === "number" && (
            <span className={`ml-2 ${active === industry.slug ? "text-white/55" : "text-ink/40"}`}>
              {industry._count.insights}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
