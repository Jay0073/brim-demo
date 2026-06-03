"use client";

// Floating, glassy, pill-shaped nav pinned top-center. Inline links on desktop;
// collapses to a logo + hamburger with a dropdown on mobile so the pill never
// overflows narrow screens.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/site";
import { CartButton } from "@/components/cart/CartButton";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="glass-dark pointer-events-auto w-full max-w-xs overflow-hidden rounded-2xl shadow-xl shadow-black/40 ring-1 ring-white/5 sm:w-auto sm:max-w-none sm:rounded-full">
        <div className="flex items-center justify-between gap-1 p-1.5 sm:pr-2">
          {/* Logo → home */}
          <Link
            href="/"
            aria-label={`${SITE.name} home`}
            onClick={() => setOpen(false)}
            className="rounded-full px-4 py-2 font-display text-lg leading-none tracking-wide text-paper transition-opacity hover:opacity-70"
          >
            {SITE.shortName}
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 sm:flex">
            <span aria-hidden className="mx-1 h-5 w-px bg-white/10" />
            <ul className="flex items-center gap-0.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-paper text-ink"
                        : "text-paper/80 hover:bg-white/10 hover:text-paper"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cart — always visible (desktop + mobile); opens the drawer */}
          <CartButton className="grid h-10 w-10 place-items-center rounded-full text-paper transition-colors hover:bg-white/10" />

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full text-paper transition-colors hover:bg-white/10 sm:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
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
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <ul className="flex flex-col gap-0.5 border-t border-white/10 p-2 sm:hidden">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-paper text-ink"
                      : "text-paper/80 hover:bg-white/10 hover:text-paper"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
