import type { Testimonial } from "@prisma/client";

export function TestimonialLibrary({ voices }: { voices: Testimonial[] }) {
  if (voices.length === 0) return null;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.24em] text-jade uppercase">Library of voices</p>
            <h2 className="display mt-3 text-5xl text-ink">What the house is told</h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-ink/60">
            A living library of client testimony. New voices are added from The Conservatory.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {voices.map((voice) => (
            <figure
              key={voice.id}
              className="flex flex-col justify-between rounded-3xl border border-ink/8 bg-mist p-7"
            >
              <blockquote className="display text-2xl leading-snug text-ink">
                “{voice.quote}”
              </blockquote>
              <figcaption className="mt-8 border-t border-ink/8 pt-5">
                <p className="text-sm font-medium text-ink">{voice.name}</p>
                <p className="mt-1 text-xs tracking-[0.12em] text-jade uppercase">
                  {[voice.role, voice.company].filter(Boolean).join(" · ")}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
