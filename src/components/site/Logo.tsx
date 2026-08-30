import Image from "next/image";

type LogoProps = {
  className?: string;
  inverted?: boolean;
  src?: string | null;
  name?: string;
};

export function Logo({
  className = "h-9",
  inverted = false,
  src,
  name = "Metrra Lab",
}: LogoProps) {
  const word = name.replace(/ lab$/i, "").toUpperCase();

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={name}
          width={36}
          height={36}
          className="h-full w-auto rounded-md object-contain"
        />
      ) : (
        <LogoMark className="h-full w-auto" />
      )}
      <span className="flex flex-col leading-none">
        <span
          className={`display text-[1.45rem] tracking-[0.18em] ${inverted ? "text-ivory" : "text-ink"}`}
        >
          {word}
        </span>
        <span
          className={`mt-0.5 text-[9px] tracking-[0.32em] uppercase ${inverted ? "text-white/70" : "text-jade"}`}
        >
          Lab
        </span>
      </span>
    </span>
  );
}

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="12" fill="#061433" />
      <path
        d="M16 46V18h11.2c6.4 0 10.4 3.4 10.4 8.7 0 3.6-2 6.3-5.4 7.5L39.8 46h-8.2l-6.6-10.6H24V46H16zm8-20.2v5.8h2.9c2.6 0 4.1-1.2 4.1-3 0-1.8-1.5-2.8-4.1-2.8H24z"
        fill="#FFFFFF"
      />
      <path
        d="M36.2 46V18h11.2c6.4 0 10.4 3.4 10.4 8.7 0 3.6-2 6.3-5.4 7.5L60 46h-8.2l-6.6-10.6H44.2V46h-8zm8-20.2v5.8h2.9c2.6 0 4.1-1.2 4.1-3 0-1.8-1.5-2.8-4.1-2.8h-2.9z"
        fill="#FFFFFF"
        opacity=".92"
      />
    </svg>
  );
}
