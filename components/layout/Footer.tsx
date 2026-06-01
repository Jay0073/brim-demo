// Simple, grounded footer — deliberately calm to contrast the animated sections
// above. Server component (no interactivity).
import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative bg-ink px-6 pb-10 pt-16">
      {/* Signature stripe band across the top edge. */}
      <div
        aria-hidden
        className="brim-stripes-fine absolute inset-x-0 top-0 h-2.5 opacity-90"
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-display text-6xl leading-none tracking-tight text-paper sm:text-8xl"
        >
          {SITE.shortName}
        </Link>

        <div className="grid gap-8 sm:grid-cols-3">
          {/* Nav */}
          <nav className="flex flex-col gap-2">
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-ash">
              Explore
            </h2>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm text-paper/80 transition-colors hover:text-brim"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-ash">
              Visit & Contact
            </h2>
            <p className="text-sm text-paper/80">{SITE.contact.address}</p>
            <a
              href={`mailto:${SITE.contact.email}`}
              className="w-fit text-sm text-paper/80 transition-colors hover:text-brim"
            >
              {SITE.contact.email}
            </a>
          </div>

          {/* Halal badge */}
          <div className="flex flex-col gap-2 sm:items-end">
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest text-paper">
              <span aria-hidden className="text-brim">
                ●
              </span>
              Halal Certified
            </span>
            <p className="text-xs text-ash sm:text-right">
              100% grass-fed beef · UK &amp; Pakistan
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-white/10 pt-6 text-xs text-ash sm:flex-row sm:justify-between">
          <p>
            © {/* static year is fine for a pitch demo */}
            2026 {SITE.name}. All rights reserved.
          </p>
          <p>{SITE.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
