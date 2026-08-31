"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-paper px-5 text-center">
      <p className="text-[11px] tracking-[0.24em] text-jade uppercase">The house paused</p>
      <h1 className="display mt-4 text-5xl">This page could not finish loading.</h1>
      <p className="mt-4 max-w-md text-sm text-ink/60">
        The laboratory is still here. Try again, or write to contact@metrra.com.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-full bg-ink px-6 py-3 text-[12px] tracking-[0.16em] text-ivory uppercase"
      >
        Reload
      </button>
    </div>
  );
}
