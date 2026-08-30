export function Logo({ className = "h-9" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 36 36" className="h-full w-auto" aria-hidden>
        <rect width="36" height="36" rx="4" fill="#0A2428" />
        <path
          d="M8 26V10h4.2l5.8 10.4L23.8 10H28v16h-3.4V15.2L20.1 24h-4.2l-4.5-8.8V26H8z"
          fill="#3DDCBF"
        />
        <circle cx="28.2" cy="8.2" r="2.1" fill="#6E56CF" />
      </svg>
      <span className="display text-[1.55rem] leading-none tracking-[0.18em] text-ink">
        METTRA
      </span>
    </span>
  );
}

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden>
      <rect width="36" height="36" rx="4" fill="#3DDCBF" />
      <path
        d="M8 26V10h4.2l5.8 10.4L23.8 10H28v16h-3.4V15.2L20.1 24h-4.2l-4.5-8.8V26H8z"
        fill="#06141A"
      />
    </svg>
  );
}
