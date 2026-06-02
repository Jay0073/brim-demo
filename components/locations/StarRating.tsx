// Crisp, fractional star rating. Two SVG layers per star: a faint empty star and
// a brim-orange filled star clipped to the fractional width — so 4.7 reads as
// four-and-most-of-a-fifth, not a rounded blob.

function Star({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="block shrink-0"
    >
      <path d="M12 2.2l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.27l-5.9 3.1 1.13-6.57L2.45 9.14l6.6-.96L12 2.2z" />
    </svg>
  );
}

export function StarRating({
  rating,
  size = 16,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span
            key={i}
            className="relative text-white/15"
            style={{ width: size, height: size }}
          >
            <Star size={size} />
            <span
              className="absolute inset-0 overflow-hidden text-brim"
              style={{ width: `${fill * 100}%` }}
            >
              <Star size={size} />
            </span>
          </span>
        );
      })}
    </span>
  );
}
