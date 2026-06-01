import type { SpiceLevel } from "@/lib/menu";

const LABELS = ["", "Mild heat", "Got a kick", "Full fire"] as const;

// A 3-step chilli meter. Filled chillies = current level; rest are dimmed.
export function SpiceMeter({
  level,
  className = "",
}: {
  level: SpiceLevel;
  className?: string;
}) {
  if (!level) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${className}`}
      title={LABELS[level]}
    >
      <span className="inline-flex gap-0.5 text-sm leading-none">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={i <= level ? "opacity-100" : "opacity-25 grayscale"}
          >
            🌶
          </span>
        ))}
      </span>
      <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-brim">
        {LABELS[level]}
      </span>
    </span>
  );
}
