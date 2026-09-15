import Link from "next/link";
import { SITE } from "@/lib/site";

const SITE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Franchising", href: "/franchising" },
  { label: "Contact", href: "/contact" },
  { label: "Join us", href: "/contact" },
];
const MENU_LINKS = ["Burgers", "Fries", "Sides", "Drinks"];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#050505] px-6 py-12 text-paper sm:px-10 sm:py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(ellipse_at_15%_95%,transparent_0_25%,rgba(255,255,255,0.12)_26%,transparent_27%),radial-gradient(ellipse_at_82%_90%,transparent_0_30%,rgba(255,255,255,0.1)_31%,transparent_32%)]" />
      <div className="relative mx-auto max-w-6xl">
        <Link href="/" className="mx-auto block w-fit font-display text-3xl uppercase leading-none tracking-tight sm:text-4xl">BRIM</Link>
        <div className="mt-12 grid gap-10 border-t border-white/15 pt-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-7">
          <FooterColumn title="Site Links" links={SITE_LINKS} />
          <FooterColumn title="Explore Menu" links={MENU_LINKS.map((label) => ({ label, href: "/menu" }))} />
          <FooterColumn title="Useful Links" links={[{ label: "Terms and Conditions", href: "/terms" }, { label: "Privacy Policy", href: "/privacy" }]} />
          <div>
            <h2 className="text-sm font-bold">Contact Us</h2>
            <address className="mt-4 space-y-2 text-xs not-italic leading-relaxed text-paper/70">
              <a href={`mailto:${SITE.contact.email}`} className="block hover:text-white">{SITE.contact.email}</a>
              <a href={`tel:${SITE.contact.phone.replace(/\s/g, "")}`} className="block hover:text-white">{SITE.contact.phone}</a>
              <p>{SITE.contact.address}</p>
            </address>
          </div>
          <div>
            <h2 className="text-sm font-bold">Business hours</h2>
            <p className="mt-4 text-xs leading-relaxed text-paper/70">Office: Monday–Friday<br />9:00 AM to 5:00 PM</p>
            <Link href="/locations" className="mt-3 inline-block text-xs text-paper/70 underline-offset-4 hover:text-white hover:underline">Restaurant hours by location</Link>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-4 text-[0.65rem] text-paper/40">© 2026 {SITE.name}. All rights reserved.</div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: ReadonlyArray<{ label: string; href: string }> }) {
  return <nav><h2 className="text-sm font-bold">{title}</h2><ul className="mt-4 space-y-2">{links.map((link) => <li key={link.label}><Link href={link.href} className="text-xs text-paper/70 transition-colors hover:text-white">{link.label}</Link></li>)}</ul></nav>;
}
