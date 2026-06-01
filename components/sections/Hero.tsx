// ─────────────────────────────────────────────────────────────────────────
//  HERO — PLACEHOLDER (owned by [friend])
//  Your friend is building the real interactive/cinematic hero (mousemove
//  parallax stripes, sizzling live burger, GSAP float). This is just a
//  full-viewport stand-in so the page flows + the section structure is fixed.
//  Replace the inner content; keep the <section id="hero"> wrapper so the
//  landing page composition and scroll math stay intact.
// ─────────────────────────────────────────────────────────────────────────
export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex h-dvh items-center justify-center overflow-hidden"
    >
      {/* Signature bold B/W diagonal strips, softly out of focus so the
          (future) food reads sharp against them. */}
      <div
        className="brim-stripes absolute inset-0 scale-105 blur-[2px]"
        aria-hidden
      />
      {/* Edge vignette + a soft dark glow pooled in the center to seat the
          burger and keep the white type legible over white stripes. */}
      <div className="brim-vignette absolute inset-0" aria-hidden />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[62vh] w-[82vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/55 blur-3xl"
      />

      {/* Giant statement type sitting behind the (future) burger. */}
      <h1 className="pointer-events-none absolute z-10 text-center font-display text-[16vw] uppercase leading-[0.85] text-paper [text-shadow:0_4px_40px_rgba(0,0,0,0.6)] sm:text-[13vw]">
        THEY ARE
        <br />
        JUICY
      </h1>

      {/* Placeholder for the live burger subject. */}
      <div className="relative z-20 flex flex-col items-center gap-3">
        <div className="grid h-44 w-44 place-items-center rounded-full border border-dashed border-white/25 bg-black/30 text-xs uppercase tracking-widest text-ash backdrop-blur-sm sm:h-56 sm:w-56">
          Hero burger
        </div>
        <span className="rounded-full bg-brim px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink">
          Friend&apos;s section
        </span>
      </div>

      {/* Scroll cue into "How It's Made". */}
      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-ash">
        Scroll
      </div>
    </section>
  );
}
