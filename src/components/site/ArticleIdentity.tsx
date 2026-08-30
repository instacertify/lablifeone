export function ArticleIdentity({
  writerName,
  writerRole,
  identityLine,
  publishedAt,
  tone = "ink",
}: {
  writerName?: string | null;
  writerRole?: string | null;
  identityLine?: string | null;
  publishedAt?: Date | string | null;
  tone?: "ink" | "ivory";
}) {
  const name = writerName || "Metrra Lab";
  const role = writerRole || "Editorial folio";
  const identity = identityLine || "A global laboratory with global solutions";
  const date = publishedAt ? new Date(publishedAt) : null;
  const muted = tone === "ivory" ? "text-sand/75" : "text-ink/55";
  const strong = tone === "ivory" ? "text-ivory" : "text-ink";

  return (
    <div className={`text-sm leading-6 ${muted}`}>
      <p className={`text-[11px] tracking-[0.18em] uppercase ${tone === "ivory" ? "text-aqua" : "text-jade"}`}>
        {identity}
      </p>
      <p className={`mt-1 ${strong}`}>
        Written by {name}
        {role ? <span className={muted}> · {role}</span> : null}
      </p>
      {date && !Number.isNaN(date.getTime()) && (
        <p className="mt-0.5 text-xs">
          {date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      )}
    </div>
  );
}
