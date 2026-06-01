// Brand hamburger line-icon. `layers` controls the number of fillings so the
// same glyph renders the 4oz / 8oz / 12oz size ladder (mirrors the real site).
export function BurgerGlyph({
  layers = 2,
  className,
}: {
  layers?: number;
  className?: string;
}) {
  const gap = 11;
  const startY = 36;
  const lastY = startY + layers * gap;

  return (
    <svg
      viewBox="0 0 100 96"
      fill="none"
      stroke="currentColor"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* top bun */}
      <path d="M12 32 C12 10 88 10 88 32" />
      <line x1="12" y1="32" x2="88" y2="32" />
      {/* fillings (one per size layer) */}
      {Array.from({ length: layers }).map((_, i) => (
        <line key={i} x1="16" y1={startY + i * gap} x2="84" y2={startY + i * gap} />
      ))}
      {/* bottom bun */}
      <path d={`M12 ${lastY} C12 ${lastY + 16} 88 ${lastY + 16} 88 ${lastY}`} />
    </svg>
  );
}
