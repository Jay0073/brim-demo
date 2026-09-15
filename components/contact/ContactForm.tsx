"use client";

import { useState } from "react";
import { submitToSheets } from "@/components/forms/submitToSheets";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    try {
      await submitToSheets("contact", new FormData(event.currentTarget));
      event.currentTarget.reset();
      setStatus("sent");
    } catch { setStatus("error"); }
  }
  return <form onSubmit={submit} className="rounded-xl border border-ink/15 bg-white p-5 sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><Field label="Name" name="name" /><Field label="Email" name="email" type="email" /></div><div className="mt-5"><Field label="Phone" name="phone" type="tel" /></div><label className="mt-5 block text-sm font-bold uppercase tracking-wide">Message<textarea name="message" required rows={8} className="mt-2 w-full rounded-lg border border-ink/20 px-4 py-3 text-base font-normal normal-case tracking-normal outline-none focus:border-ink" /></label><button disabled={status === "sending"} type="submit" className="mt-6 rounded-xl bg-ink px-7 py-4 text-sm font-extrabold uppercase tracking-wide text-paper disabled:opacity-60">{status === "sending" ? "Sending…" : "Send enquiry"}</button>{status === "sent" && <p className="mt-4 text-sm text-emerald-700" role="status">Thank you. Your enquiry has been sent.</p>}{status === "error" && <p className="mt-4 text-sm text-red-700" role="alert">The enquiry service is not configured yet. Please try again later.</p>}</form>;
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) { return <label className="block text-sm font-bold uppercase tracking-wide">{label}<input name={name} type={type} required className="mt-2 w-full rounded-lg border border-ink/20 px-4 py-3 text-base font-normal normal-case tracking-normal outline-none focus:border-ink" /></label>; }
