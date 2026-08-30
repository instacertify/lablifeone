"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@prisma/client";

export function HeroCinema({ banners }: { banners: Banner[] }) {
  const slides = banners.length
    ? banners
    : [
        {
          id: "fallback",
          title: "Be testing. Be unstoppable.",
          subtitle: "A Noida house of measurement.",
          image: "/images/labs/hero-1.jpg",
          ctaLabel: "Request a quote",
          ctaHref: "/contact",
        },
      ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const slide = slides[index];

  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-ink text-ivory">
      {slides.map((item, slideIndex) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            slideIndex === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            priority={slideIndex === 0}
            className={`object-cover ${slideIndex === index ? "ken" : ""}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/35" />
          <div className="absolute inset-0 grain" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-16 lg:px-8 lg:pb-20">
        <p className="text-[11px] tracking-[0.32em] text-aqua uppercase">
          Sector 62 · Noida · Institutional Area
        </p>
        <h1 className="display mt-4 max-w-4xl text-5xl leading-[0.9] sm:text-7xl lg:text-8xl">
          Be testing
          <span className="block text-aqua">Be unstoppable</span>
        </h1>
        <p className="fade-slide mt-6 max-w-xl text-lg leading-8 text-sand/90">
          {slide.subtitle ||
            "A European-mannered testing house for food, cosmetics, electronics, and every category the market invents next."}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={slide.ctaHref || "/contact"}
            className="rounded-full bg-aqua px-6 py-3 text-[12px] tracking-[0.18em] text-ink uppercase"
          >
            {slide.ctaLabel || "Request a quote"}
          </Link>
          <Link
            href="/disciplines"
            className="rounded-full border border-white/20 px-6 py-3 text-[12px] tracking-[0.18em] uppercase hover:border-aqua"
          >
            Open the disciplines
          </Link>
        </div>
        <div className="mt-10 flex gap-2">
          {slides.map((item, slideIndex) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(slideIndex)}
              className={`h-1.5 rounded-full transition-all ${
                slideIndex === index ? "w-10 bg-aqua" : "w-4 bg-white/30"
              }`}
              aria-label={`Show banner ${slideIndex + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
