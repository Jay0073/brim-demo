import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = { title: `Contact — ${SITE.name}`, description: "Contact BRIM Burgers." };

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-paper pt-[4.5rem] text-ink [color-scheme:light]">
      <main className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-10 sm:py-24 lg:grid-cols-[0.85fr_1.15fr]">
        <section><h1 className="font-display text-5xl uppercase leading-none sm:text-7xl">Get in touch</h1><p className="mt-5 max-w-md text-lg leading-relaxed text-ink/60">Get in touch with Brim Burgers for questions, feedback, or support. Our team will be happy to help.</p><dl className="mt-12 divide-y divide-ink/15 border-y border-ink/15"><ContactItem term="Email" value={SITE.contact.email} href={`mailto:${SITE.contact.email}`} /><ContactItem term="Phone" value={SITE.contact.phone} href={`tel:${SITE.contact.phone.replace(/\s/g, "")}`} /><ContactItem term="Address" value={SITE.contact.address} /></dl></section>
        <ContactForm />
      </main>
    </div>
  );
}

function ContactItem({ term, value, href }: { term: string; value: string; href?: string }) { return <div className="py-5"><dt className="text-xs font-bold uppercase tracking-[0.18em] text-ink/45">{term}</dt><dd className="mt-2 break-words text-base">{href ? <a href={href} className="hover:underline">{value}</a> : value}</dd></div>; }
