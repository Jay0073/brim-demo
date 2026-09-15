import type { Metadata } from "next";
import { FranchiseForm } from "@/components/franchising/FranchiseForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: `Franchising — ${SITE.name}`, description: "Get in touch with the BRIM franchise team." };

export default function FranchisingPage() {
  return (
    <div className="min-h-dvh bg-paper pt-[4.5rem] text-ink [color-scheme:light]">
      <header className="bg-black px-6 py-16 text-center text-paper sm:py-20"><h1 className="font-display text-5xl uppercase leading-none sm:text-7xl">Franchising</h1></header>
      <main className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:px-10 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div><h2 className="font-display text-4xl uppercase leading-none sm:text-5xl">Join the BRIM family.</h2><p className="mt-5 max-w-md text-base leading-relaxed text-ink/60">Interested in becoming a BRIM franchisee? Tell us a little about yourself and our team will get in touch.</p><p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-ink/45">Office phone</p><a href={`tel:${SITE.contact.phone.replace(/\s/g, "")}`} className="mt-2 block text-xl font-semibold">{SITE.contact.phone}</a></div>
        <FranchiseForm />
      </main>
    </div>
  );
}
