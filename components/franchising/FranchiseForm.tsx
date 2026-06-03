"use client";

// Franchise enquiry form. Client-side validation + a polished success state.
// No backend yet: submit is simulated. To wire it up, POST `values` to an API
// route (app/api/franchise/route.ts) or a form service inside handleSubmit.
import { useState } from "react";

type Field = "name" | "email" | "phone" | "location" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const EMPTY: Values = { name: "", email: "", phone: "", location: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\d][\d\s().-]{6,}$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Tell us your name.";
  if (!v.email.trim()) e.email = "We need an email to reply.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "That email looks off.";
  if (v.phone.trim() && !PHONE_RE.test(v.phone.trim()))
    e.phone = "That phone number looks off.";
  if (v.message.trim().length < 10)
    e.message = "A line or two about you helps (10+ characters).";
  return e;
}

export function FranchiseForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (field: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setStatus("sending");
    // Simulated send — swap for a real POST when the backend exists.
    setTimeout(() => setStatus("sent"), 800);
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-br from-ink-soft to-ink p-8 text-center shadow-2xl shadow-black/30 ring-1 ring-white/10">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-paper text-2xl text-ink">
          ✓
        </span>
        <h3 className="font-display text-3xl uppercase text-paper">Enquiry sent</h3>
        <p className="max-w-sm text-paper/60">
          Thanks, {values.name.split(" ")[0] || "there"}. Our franchise team will
          be in touch within <strong className="text-paper">2 working days</strong>.
        </p>
        <button
          onClick={() => {
            setValues(EMPTY);
            setStatus("idle");
          }}
          className="mt-2 rounded-full border border-paper px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-paper hover:text-ink"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl bg-gradient-to-br from-ink-soft to-ink p-6 shadow-2xl shadow-black/30 ring-1 ring-white/10 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label="Name"
          required
          value={values.name}
          onChange={set("name")}
          error={errors.name}
          autoComplete="name"
        />
        <Field
          id="email"
          label="Email"
          type="email"
          required
          value={values.email}
          onChange={set("email")}
          error={errors.email}
          autoComplete="email"
        />
        <Field
          id="phone"
          label="Phone"
          type="tel"
          value={values.phone}
          onChange={set("phone")}
          error={errors.phone}
          autoComplete="tel"
        />
        <Field
          id="location"
          label="City / region of interest"
          value={values.location}
          onChange={set("location")}
          error={errors.location}
          autoComplete="address-level2"
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="message"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-paper/60"
        >
          Message <span className="text-paper/40">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          value={values.message}
          onChange={set("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-err" : undefined}
          placeholder="Tell us a little about you, your location and your experience…"
          className={`w-full resize-y rounded-xl border bg-white/5 px-4 py-3 text-paper outline-none transition-colors placeholder:text-paper/35 ${
            errors.message
              ? "border-red-500 focus:border-red-500"
              : "border-white/15 focus:border-white/50"
          }`}
        />
        {errors.message && (
          <p id="message-err" className="mt-1.5 text-xs text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-xs text-paper/45">
          We reply to every serious enquiry within 2 working days.
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-full bg-paper px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-white disabled:opacity-60 sm:w-auto"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

// Single labelled text input with inline error.
function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  required,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-paper/60"
      >
        {label} {required && <span className="text-paper/40">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-paper outline-none transition-colors placeholder:text-paper/35 ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-white/15 focus:border-white/50"
        }`}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
