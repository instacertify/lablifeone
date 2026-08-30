"use client";

import { FormEvent, useState } from "react";

type Props = {
  sourcePage?: string;
  categories?: string[];
  compact?: boolean;
  dark?: boolean;
  replyTo?: string;
};

export function LeadForm({
  sourcePage = "/",
  categories = [],
  compact = false,
  dark = false,
  replyTo = "contact@metrra.com",
}: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, sourcePage }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error || "The folio could not be received.");
      setStatus("error");
      return;
    }
    form.reset();
    setStatus("ok");
  }

  const field = dark
    ? "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-ivory placeholder:text-sand/40 focus:border-aqua focus:outline-none"
    : compact
      ? "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-ivory placeholder:text-sand/40 focus:border-aqua focus:outline-none"
      : "w-full rounded-xl border border-ink/10 bg-white px-3.5 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-jade focus:outline-none";

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-2.5" : "grid gap-3 sm:grid-cols-2"}>
      <input name="name" required placeholder="Name" className={field} />
      <input name="email" required type="email" placeholder="Work email" className={field} />
      {!compact && (
        <>
          <input name="company" placeholder="House / company" className={field} />
          <select name="category" className={field} defaultValue="">
            <option value="">Discipline</option>
            {categories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
            <option value="New category">A new category</option>
          </select>
        </>
      )}
      <textarea
        name="message"
        required
        placeholder="What must be proven?"
        rows={compact ? 3 : 4}
        className={`${field} ${compact ? "" : "sm:col-span-2"}`}
      />
      <label
        className={`flex items-start gap-2 text-[11px] leading-5 ${
          compact || dark ? "text-sand/70" : "text-ink/60 sm:col-span-2"
        }`}
      >
        <input name="privacyAccepted" type="checkbox" required value="true" className="mt-0.5" />
        <span>
          I agree that Metrra Lab may use these details to reply to this brief. See{" "}
          <a href="/privacy" className="underline">
            Privacy
          </a>
          .
        </span>
      </label>
      <button
        disabled={status === "sending"}
        className={`rounded-full px-5 py-2.5 text-[12px] tracking-[0.16em] uppercase transition ${
          compact || dark
            ? "bg-aqua text-ink hover:bg-white"
            : "bg-ink text-ivory hover:bg-forest"
        } ${compact ? "w-full" : "sm:col-span-2"}`}
      >
        {status === "sending" ? "Sending…" : status === "ok" ? "Received" : "Request a quote"}
      </button>
      {status === "ok" && (
        <p className={`text-xs ${compact || dark ? "text-aqua" : "text-jade sm:col-span-2"}`}>
          The house has your brief. We reply from {replyTo}.
        </p>
      )}
      {status === "error" && (
        <p className="text-xs text-violet sm:col-span-2">{error}</p>
      )}
    </form>
  );
}
