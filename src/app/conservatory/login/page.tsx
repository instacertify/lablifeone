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
        defaultValue="conservatory@metrra.com"
        className="house-field"
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        required
        className="house-field"
        placeholder="Key"
      />
      {error && <p className="text-sm text-iris">{error}</p>}
      <button
        disabled={pending}
        className="w-full rounded-full bg-ink py-3 text-[12px] tracking-[0.2em] text-white uppercase"
      >
        {pending ? "Opening…" : "Enter the Conservatory"}
      </button>
    </form>
  );
}

export default function ConservatoryLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-5 text-ink">
      <div className="w-full max-w-md rounded-3xl border border-ink/10 bg-white p-8 shadow-xl">
        <Logo className="h-8" name="Metrra Lab" src="/images/metrra-lab-logo.png" />
        <p className="mt-8 text-[11px] tracking-[0.24em] text-jade uppercase">Backstage</p>
        <h1 className="display mt-2 text-4xl">The Conservatory</h1>
        <p className="mt-3 text-sm text-ink/65">
          The editorial house for Metrra Lab — folio, cinema, voices, chamber.
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
