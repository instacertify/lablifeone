"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "@/components/site/Logo";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error || "The house is closed.");
      setPending(false);
      return;
    }
    router.push(params.get("next") || "/conservatory");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <input
        name="email"
        type="email"
        required
        defaultValue="conservatory@mettra.com"
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-ivory"
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        required
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-ivory"
        placeholder="Key"
      />
      {error && <p className="text-sm text-violet">{error}</p>}
      <button
        disabled={pending}
        className="w-full rounded-full bg-aqua py-3 text-[12px] tracking-[0.2em] text-ink uppercase"
      >
        {pending ? "Opening…" : "Enter the Conservatory"}
      </button>
    </form>
  );
}

export default function ConservatoryLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#071316] px-5 text-ivory">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#102226] p-8">
        <Logo className="h-8 [&_span]:text-ivory" />
        <p className="mt-8 text-[11px] tracking-[0.24em] text-aqua uppercase">Backstage</p>
        <h1 className="display mt-2 text-4xl">The Conservatory</h1>
        <p className="mt-3 text-sm text-sand/70">
          The editorial house for Mettra — folio, cinema, compass, chamber.
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
