"use client";

// Full-width white header bar: the BRIM wordmark knocked out of a solid black
// block on the left, heavy uppercase links on the right. It is identical on
// every page — no per-route theming — and stays fixed to the top on scroll.
//
// To let it scroll away with the page instead, swap the `fixed inset-x-0 top-0`
// on <header> for `relative`, and drop the matching top padding on the pages
// (they currently clear a fixed bar).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/site";

// The bar leads with an explicit Home link, so the wordmark is branding rather
// than the only way back.
const LINKS = [{ label: "Home", href: "/" }, ...NAV_LINKS];

// next.config sets trailingSlash, so usePathname() hands back "/menu/" — strip
// it before matching or the active state never lands.
const normalize = (path: string) =>
  path.length > 1 ? path.replace(/\/+$/, "") : path;

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = normalize(pathname);

  const isActive = (href: string) =>
    href === "/" ? current === "/" : current === href || current.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-paper">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        {/* Wordmark — white letters knocked out of a solid ink block. */}
        <Link
          href="/"
          aria-label={`${SITE.name} home`}
          onClick={() => setOpen(false)}
          className="bg-ink px-3.5 py-2 font-display text-2xl uppercase leading-none tracking-tight text-paper transition-opacity hover:opacity-80 sm:text-[1.75rem]"
        >
          {SITE.shortName}
        </Link>

        {/* Desktop links */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className="relative block py-1 text-sm font-extrabold uppercase tracking-[0.12em] text-ink transition-opacity hover:opacity-55"
                  >
                    {link.label}
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-x-0 -bottom-1 h-0.5 bg-ink"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.06] lg:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            {open ? (
              <>
                <path d="m6 6 12 12" />
                <path d="m18 6-12 12" />
              </>
            ) : (
              <>
                <path d="M4 8h16" />
                <path d="M4 16h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav aria-label="Primary" className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-ink/10 bg-paper lg:hidden">
          <ul className="mx-auto w-full max-w-7xl px-5 py-2 sm:px-8">
            {LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-ink ${
                      active ? "underline underline-offset-4" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
