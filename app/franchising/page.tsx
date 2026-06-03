import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { FranchiseForm } from "@/components/franchising/FranchiseForm";

export const metadata: Metadata = {
  title: `Franchising — ${SITE.name}`,
  description:
    "Bring Brim to your city. Join the Family — enquire about a Brim Burgers franchise across the UK & Pakistan.",
};

const WHY_BRIM = [
  {
    n: "01",
    title: "A brand with a queue",
    copy: "People line up for Brim. You open with a following — not from scratch.",
  },
  {
    n: "02",
    title: "Grass-fed & 100% Halal",
    copy: "A premium, strictly-Halal menu that stands apart on every high street.",
  },
  {
    n: "03",
    title: "UK & Pakistan — and growing",
    copy: "Proven across two markets, with fresh territories opening now.",
  },
  {
    n: "04",
    title: "Backed end to end",
    copy: "Site, kitchen, training and launch — our team is with you the whole way.",
  },
];

const telHref = `tel:${SITE.contact.phone.replace(/\s/g, "")}`;

export default function FranchisingPage() {
  return (
    <div className="bg-paper text-ink">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-black px-6 pb-16 pt-36">
        {/* Signature bold pure black & white diagonal stripes. */}
        <div className="brim-stripes absolute inset-0" aria-hidden />
        {/* Dark wash so the white copy stays legible while the stripes read as
            pure black & white toward the right. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent"
        />
        <div className="relative mx-auto w-full max-w-5xl text-paper">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-paper/55">
            Franchising · UK &amp; Pakistan
          </p>
          <h1 className="mt-5 font-display text-6xl uppercase leading-[0.82] [text-shadow:0_4px_40px_rgba(0,0,0,0.6)] sm:text-8xl">
            Join the
            <br />
            Family
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70">
            Interested in joining the Brim Burger family as a franchisee? Grass-fed,
            Halal and impossible to forget — let&apos;s bring Brim to your city.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#enquire"
              className="rounded-full bg-paper px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-ink transition-transform hover:scale-[1.03]"
            >
              Start your enquiry
            </a>
            <a
              href={telHref}
              className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-paper transition-colors hover:border-white/60"
            >
              Call the team
            </a>
          </div>
        </div>
      </section>

      {/* ── Why Brim + quote (split pane) ────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid overflow-hidden rounded-3xl ring-1 ring-ink/10 lg:grid-cols-2">
          {/* Quote pane — signature striped backdrop with a frosted glass panel
              so the quote holds focus instead of being out-shouted by the
              bright Why-Brim side. */}
          <div className="relative isolate flex flex-col justify-center overflow-hidden bg-black p-8 text-white sm:p-12">
            {/* Brand stripes give the pane texture and identity. */}
            <div
              aria-hidden
              className="brim-stripes brim-stripes-drift absolute inset-0 -z-20 opacity-90"
            />
            {/* Dark wash keeps the white quote fully legible over the stripes. */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-gradient-to-br from-black/85 via-black/70 to-black/85"
            />
            <blockquote className="glass-dark relative rounded-2xl p-7 shadow-2xl shadow-black/50 sm:p-9">
              {/* Oversized quotation mark as a soft brand flourish behind the copy. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-6 left-3 select-none font-display text-8xl leading-none text-white/10"
              >
                “
              </span>
              <p className="relative font-display text-3xl uppercase leading-[1.05] sm:text-5xl">
                “We didn&apos;t just build a burger. We built a following.”
              </p>
              <footer className="mt-6 text-xs uppercase tracking-[0.3em] text-white/55">
                — The Brim Burgers Team
              </footer>
            </blockquote>
          </div>

          {/* Why-Brim points (light) */}
          <div className="divide-y divide-ink/10 bg-paper">
            {WHY_BRIM.map((w) => (
              <div key={w.n} className="flex gap-5 p-6 sm:p-8">
                <span className="font-display text-2xl text-ink/25">{w.n}</span>
                <div>
                  <h3 className="font-display text-xl uppercase leading-tight text-ink">
                    {w.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                    {w.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact + form ───────────────────────────────────────────────── */}
      <section id="enquire" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Contact methods */}
          <div className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-ink/50">
              Let&apos;s talk
            </p>
            <h2 className="mt-3 font-display text-5xl uppercase leading-[0.9] text-ink">
              Reach out
            </h2>
            <p className="mt-4 max-w-sm text-ink/60">
              Pick whatever&apos;s easiest — drop us a line below, or get in touch
              directly. Every serious enquiry gets a reply.
            </p>

            <ul className="mt-8 space-y-5">
              <ContactRow
                label={`Office phone · ${SITE.contact.phoneHours}`}
                value={SITE.contact.phone}
                href={telHref}
                icon="phone"
              />
              <ContactRow
                label="Franchise email"
                value={SITE.contact.franchiseEmail}
                href={`mailto:${SITE.contact.franchiseEmail}`}
                icon="mail"
              />
              <ContactRow
                label="Registered address"
                value={SITE.contact.address}
                icon="pin"
              />
            </ul>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <FranchiseForm />
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactRow({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href?: string;
  icon: "phone" | "mail" | "pin";
}) {
  const paths: Record<typeof icon, React.ReactNode> = {
    phone: <path d="M5 4h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  };

  const inner = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {paths[icon]}
        </svg>
      </span>
      <span className="flex flex-col">
        <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink/45">
          {label}
        </span>
        <span className="font-medium text-ink">{value}</span>
      </span>
    </>
  );

  return (
    <li>
      {href ? (
        <a href={href} className="group flex items-center gap-4">
          {inner}
        </a>
      ) : (
        <div className="flex items-start gap-4">{inner}</div>
      )}
    </li>
  );
}
