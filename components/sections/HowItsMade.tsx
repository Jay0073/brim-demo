import { asset } from "@/lib/asset";

export function HowItsMade() {
  return (
    <section className="bg-white px-5 py-14 text-ink sm:px-8 sm:py-20" aria-label="The BRIM burger process">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <video className="block w-full" autoPlay muted loop playsInline preload="metadata" aria-label="The BRIM burger process animation">
          <source src={asset("/brim-process.mp4")} type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
