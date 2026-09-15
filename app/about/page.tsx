import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { HalalPromise } from "@/components/sections/HalalPromise";

export const metadata: Metadata = {
  title: `About BRIM — ${SITE.name}`,
  description:
    "Meet BRIM founder Amadul Hassan and discover the story, standards and ambition behind BRIM Burgers.",
};

const PRINCIPLES = [
  ["01", "Made with intent", "Grass-fed beef, artisan-baked buns and signature sauces—chosen to make every burger unmistakably BRIM."],
  ["02", "Halal without compromise", "A fully Halal, alcohol-free food experience where trust is part of the product, never a footnote."],
  ["03", "Smashed to order", "Fresh preparation, high heat and disciplined technique create the crust, texture and theatre behind every serve."],
  ["04", "Built to travel", "A bold British-born concept with the systems and cultural relevance to connect across the UK."],
] as const;

export default function AboutPage() {
  return (
    <div className="bg-paper text-ink [color-scheme:light]">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="px-6 pb-20 pt-32 sm:pb-24 sm:pt-36">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.42em] text-ink/45">Hemel Hempstead · Since 2021</p>

          <div className="mt-6 grid items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h1 className="font-display text-[15vw] uppercase leading-[0.74] tracking-[-0.055em] sm:text-[7.5rem] lg:text-[9rem]">
                Big idea.<br />Juicy future.
              </h1>
            </div>
            <p className="max-w-sm border-l border-ink/20 pl-5 text-sm leading-relaxed text-ink/60 lg:col-span-4 lg:justify-self-end">
              BRIM began with a simple conviction: Halal burgers could be bigger, bolder and better—without compromising the details.
            </p>
          </div>

          {/* The storefront is now a contained image card rather than a
              full-bleed black-overlaid band, so the page reads as one white
              surface with photography set into it. */}
          <div className="relative mt-10 min-h-[24rem] overflow-hidden rounded-3xl bg-ink ring-1 ring-ink/10 sm:min-h-[32rem] lg:min-h-[38rem]">
            <Image
              src="/franchising/brim-storefront.jpg"
              alt="BRIM Burgers restaurant"
              fill
              priority
              sizes="(min-width: 1024px) 1152px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Founder ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-6xl border-t border-ink/10 pt-16 sm:pt-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="relative overflow-hidden rounded-3xl bg-ink ring-1 ring-ink/10 lg:col-span-5">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/team/amadul-hassan.jpg"
                  alt="Amadul Hassan, founder of BRIM Burgers"
                  fill
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="object-cover"
                />
                {/* Kept dark: the caption sits on the photograph. */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 p-7 text-paper">
                  <p className="font-display text-3xl uppercase leading-none">Amadul Hassan</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.3em] text-paper/60">Founder · BRIM Burgers</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-ink/45">The founder</p>
              <h2 className="mt-5 font-display text-5xl uppercase leading-[0.86] sm:text-7xl">A setback became the starting point.</h2>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/65">
                <p>
                  When the pandemic forced the closure of the Hassan family’s Hemel Hempstead restaurant, Amadul Hassan did not step away from hospitality. He used the moment to rethink what a modern Halal burger brand could be.
                </p>
                <p>
                  Together with his brother Jawad, he launched BRIM in 2021: a focused smash-burger concept built around bold flavour, premium ingredients and a sharp monochrome identity. The first store became proof that customers were ready for a more ambitious Halal burger experience.
                </p>
                <p>
                  The founding idea remains rooted in the details—food quality, store standards and partnerships capable of protecting the BRIM experience as the brand grows.
                </p>
              </div>
              <blockquote className="mt-9 border-l-2 border-ink/20 pl-6">
                <p className="font-display text-2xl uppercase leading-tight sm:text-3xl">“Build something people can recognise before they even see the name.”</p>
                <footer className="mt-3 text-xs uppercase tracking-[0.25em] text-ink/40">The BRIM approach</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── Principles ───────────────────────────────────────────────── */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-6xl border-t border-ink/10 pt-16 sm:pt-20">
          <div className="grid gap-8 border-b border-ink/10 pb-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-ink/45">What makes BRIM, BRIM</p>
              <h2 className="mt-5 font-display text-5xl uppercase leading-[0.86] sm:text-7xl">The standard behind the smash.</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-ink/60 lg:col-span-4 lg:col-start-9">
              The brand is expressive. The operating philosophy is disciplined. Every detail has to earn its place—from the first ingredient to the final handover.
            </p>
          </div>

          <div className="grid md:grid-cols-2">
            {PRINCIPLES.map(([number, title, copy]) => (
              <article key={number} className="group border-b border-ink/10 py-9 md:odd:border-r md:odd:pr-10 md:even:pl-10">
                <div className="flex gap-6">
                  <span className="font-display text-xl text-ink/30 transition-colors duration-300 group-hover:text-ink">{number}</span>
                  <div>
                    <h3 className="font-display text-3xl uppercase leading-none">{title}</h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/55">{copy}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── One team, two markets ────────────────────────────────────── */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-6xl border-t border-ink/10 pt-16 sm:pt-20">
          <div className="grid gap-3 lg:grid-cols-12">
            <div className="relative min-h-[28rem] overflow-hidden rounded-3xl bg-ink ring-1 ring-ink/10 lg:col-span-8">
              <Image
                src="/hero/franchise-team-hero.png"
                alt="The BRIM team"
                fill
                sizes="(min-width: 1024px) 768px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-between rounded-3xl bg-white p-7 ring-1 ring-ink/10 sm:p-9 lg:col-span-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-ink/45">One team · Two markets</p>
                <h2 className="mt-5 font-display text-5xl uppercase leading-[0.86]">Born in Britain. Growing beyond.</h2>
                <p className="mt-6 text-sm leading-relaxed text-ink/60">
                  From Hemel Hempstead to stores across the UK, BRIM grows through local teams, carefully selected sites and one shared operating standard.
                </p>
              </div>
              <div className="mt-10 grid grid-cols-2 border-t border-ink/10 pt-6">
                <div><strong className="font-display text-4xl">UK</strong><span className="mt-1 block text-[0.65rem] uppercase tracking-wider text-ink/45">Home market</span></div>
                <div className="border-l border-ink/10 pl-6"><strong className="font-display text-4xl">UK</strong><span className="mt-1 block text-[0.65rem] uppercase tracking-wider text-ink/45">Our home market</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-4xl border-t border-ink/10 pt-16 text-center sm:pt-20">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-ink/45">The next chapter</p>
          <h2 className="mt-5 font-display text-5xl uppercase leading-[0.86] sm:text-8xl">Come hungry.<br />Leave part of the story.</h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/locations" className="rounded-full bg-ink px-7 py-4 text-sm font-bold uppercase tracking-wide text-paper transition-transform duration-300 hover:scale-[1.03]">Find a BRIM</Link>
            <Link href="/franchising" className="rounded-full border border-ink/20 px-7 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-[transform,border-color] duration-300 hover:scale-[1.03] hover:border-ink/45">Build with BRIM</Link>
          </div>
        </div>
      </section>

      <HalalPromise variant="about" />
    </div>
  );
}
