"use client";

// Floating, glassy, pill-shaped nav pinned top-center (Awwwards-style).
// Client component because it reads the active route for link highlighting.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE } from "@/lib/site";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        className="glass-dark pointer-events-auto flex items-center gap-1 rounded-full p-1.5 pr-2
                   shadow-xl shadow-black/40 ring-1 ring-white/5"
      >
        {/* Logo → home */}
        <Link
          href="/"
          aria-label={`${SITE.name} home`}
          className="rounded-full px-4 py-2 font-display text-lg leading-none tracking-wide text-paper
                     transition-colors hover:text-brim"
        >
          {SITE.shortName}
        </Link>

        <span aria-hidden className="mx-1 h-5 w-px bg-white/10" />

        {/* Page links */}
        <ul className="flex items-center gap-0.5">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-paper text-ink"
                      : "text-paper/80 hover:bg-white/10 hover:text-paper"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
