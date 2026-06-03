"use client";

// Interactive "make it yours" builder. Tap toppings (max 4) and sauces (max 2)
// — the limits lock the remaining chips when full. A live SVG burger stacks
// higher with each pick, colour-coded per ingredient (the brand FRAME stays
// monochrome; the food is full-colour, same as the product photos).
import { useState } from "react";
import { BUILD_YOUR_OWN } from "@/lib/menu";

const MAX_TOPPINGS = 4;
const MAX_SAUCES = 2;
const LAYER_H = 15;
const RASHER_COLOR = "#b5532e";

// Representative colour per ingredient so the live burger reflects the picks.
function layerColor(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("lettuce")) return "#74b35a";
  if (n.includes("jalape")) return "#4f9b3a";
  if (n.includes("gherkin")) return "#8aae42";
  if (n.includes("caramelised onion")) return "#b9762f";
  if (n.includes("grilled onion")) return "#cf9a4e";
  if (n.includes("onion ring")) return "#d9a441";
  if (n.includes("hash brown")) return "#c79a55";
  if (n.includes("pineapple")) return "#f3cf4b";
  if (n.includes("chilli jam")) return "#c0392b";
  if (n.includes("tomato")) return "#d8473a";
  if (n.includes("fried egg")) return "#f6e6a8";
  if (n.includes("mushroom")) return "#a9805a";
  if (n.includes("cheese")) return "#f4b53a";
  return "#e3dfd6";
}

function BurgerStack({ colors, sauced }: { colors: string[]; sauced: boolean }) {
  const count = colors.length;
  const shift = -count * LAYER_H; // top bun rises as the stack grows
  const sesame = [
    [78, 130], [108, 125], [93, 137], [68, 141], [124, 133], [140, 143], [55, 140],
  ];
  return (
    <svg
      viewBox="0 0 200 212"
      className="h-full w-full"
      role="img"
      aria-label={`Your burger — ${count} ${count === 1 ? "layer" : "layers"}`}
    >
      <ellipse cx="100" cy="203" rx="60" ry="7" fill="rgba(0,0,0,0.4)" />
      {/* bottom bun */}
      <path d="M38 168 L162 168 L162 172 Q162 197 100 197 Q38 197 38 172 Z" fill="#e3b067" />
      {/* patty (always there — the base of every Brim) */}
      <rect x="34" y="150" width="132" height="18" rx="7" fill="#6e4527" />
      {/* stacked toppings (+ rasher) */}
      {colors.map((c, i) => (
        <rect
          key={i}
          x="36"
          width="128"
          y={150 - (i + 1) * LAYER_H}
          height={LAYER_H + 2}
          rx="6"
          fill={c}
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="1"
        />
      ))}
      {/* top assembly — drizzle + bun + sesame, rises with the stack */}
      <g transform={`translate(0 ${shift})`}>
        {sauced && (
          <path
            d="M48 147 q13 -10 26 0 t26 0 t26 0"
            fill="none"
            stroke="#ff5a1f"
            strokeWidth="5"
            strokeLinecap="round"
          />
        )}
        <path d="M30 150 C30 108 170 108 170 150 Z" fill="#e7b56b" />
        {sesame.map(([x, y], i) => (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="3"
            ry="1.7"
            fill="#f7eccf"
            transform={`rotate(${(i * 47) % 360} ${x} ${y})`}
          />
        ))}
      </g>
    </svg>
  );
}

function Chip({
  label,
  on,
  locked,
  onClick,
}: {
  label: string;
  on: boolean;
  locked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked}
      aria-pressed={on}
      className={`rounded-full px-3 py-1 text-sm transition-colors ${
        on
          ? "bg-brim font-semibold text-ink"
          : locked
          ? "cursor-not-allowed bg-white/[0.04] text-paper/25"
          : "bg-white/10 text-paper/85 hover:bg-white/20"
      }`}
    >
      {on ? "✓ " : ""}
      {label}
    </button>
  );
}

export function BuildYourOwn() {
  const [toppings, setToppings] = useState<string[]>([]);
  const [sauces, setSauces] = useState<string[]>([]);
  const [rashers, setRashers] = useState(false);

  const toggleTopping = (t: string) =>
    setToppings((p) =>
      p.includes(t) ? p.filter((x) => x !== t) : p.length < MAX_TOPPINGS ? [...p, t] : p
    );
  const toggleSauce = (s: string) =>
    setSauces((p) =>
      p.includes(s) ? p.filter((x) => x !== s) : p.length < MAX_SAUCES ? [...p, s] : p
    );
  const reset = () => {
    setToppings([]);
    setSauces([]);
    setRashers(false);
  };

  const layerColors = [...toppings.map(layerColor), ...(rashers ? [RASHER_COLOR] : [])];
  const chosen = [...toppings, ...sauces, ...(rashers ? ["Turkey rashers"] : [])];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-ink p-6 text-paper sm:p-8">
      <div className="brim-stripes-fine absolute inset-0 opacity-[0.06]" aria-hidden />
      <div className="relative">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-brim">
          Make it yours
        </span>
        <h3 className="mt-2 font-display text-3xl uppercase sm:text-4xl">Build your own</h3>
        <p className="mt-2 max-w-md text-sm text-paper/70">{BUILD_YOUR_OWN.rule}</p>

        <div className="mt-7 grid gap-7 lg:grid-cols-5 lg:gap-8">
          {/* ── Live burger ─────────────────────────────────────────────── */}
          <div className="flex flex-col items-center justify-end rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10 lg:col-span-2">
            <div className="aspect-[4/5] w-full max-w-[240px]">
              <BurgerStack colors={layerColors} sauced={sauces.length > 0} />
            </div>
            <p className="mt-1 text-center text-xs uppercase tracking-[0.2em] text-paper/50">
              {chosen.length
                ? `${toppings.length} topping${toppings.length === 1 ? "" : "s"} · ${
                    sauces.length
                  } sauce${sauces.length === 1 ? "" : "s"}${rashers ? " · rashers" : ""}`
                : "Your burger, your rules"}
            </p>
          </div>

          {/* ── Controls ────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5 lg:col-span-3">
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/50">
                  Toppings — pick {MAX_TOPPINGS}
                </h4>
                <span
                  className={`text-xs font-bold tabular-nums ${
                    toppings.length === MAX_TOPPINGS ? "text-brim" : "text-paper/40"
                  }`}
                >
                  {toppings.length}/{MAX_TOPPINGS}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {BUILD_YOUR_OWN.toppings.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    on={toppings.includes(t)}
                    locked={!toppings.includes(t) && toppings.length >= MAX_TOPPINGS}
                    onClick={() => toggleTopping(t)}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/50">
                  Sauces — pick {MAX_SAUCES}
                </h4>
                <span
                  className={`text-xs font-bold tabular-nums ${
                    sauces.length === MAX_SAUCES ? "text-brim" : "text-paper/40"
                  }`}
                >
                  {sauces.length}/{MAX_SAUCES}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {BUILD_YOUR_OWN.sauces.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    on={sauces.includes(s)}
                    locked={!sauces.includes(s) && sauces.length >= MAX_SAUCES}
                    onClick={() => toggleSauce(s)}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setRashers((v) => !v)}
                aria-pressed={rashers}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  rashers
                    ? "bg-brim font-semibold text-ink"
                    : "bg-white/10 text-paper/85 hover:bg-white/20"
                }`}
              >
                {rashers ? "✓ " : "+ "}
                Add turkey rashers
              </button>
              {chosen.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs font-semibold uppercase tracking-wide text-paper/55 underline-offset-2 hover:text-paper hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-paper/45">
                Your build
              </p>
              <p className="mt-1.5 text-sm text-paper/85">
                {chosen.length
                  ? chosen.join(" · ")
                  : "Tap toppings and sauces to stack your Brim →"}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-5 text-xs uppercase tracking-wider text-brim/90">
          + {BUILD_YOUR_OWN.extra}
        </p>
      </div>
    </div>
  );
}
