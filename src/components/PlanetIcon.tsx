export function PlanetIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="24" r="13" fill="url(#planetGradient)" />
      <ellipse
        cx="22"
        cy="24"
        rx="21"
        ry="6"
        stroke="var(--color-accent-2)"
        strokeOpacity="0.8"
        strokeWidth="1.5"
        transform="rotate(-18 22 24)"
      />
      <circle cx="38" cy="10" r="1.6" fill="var(--color-accent-2)" />
      <circle cx="8" cy="38" r="1.2" fill="#ffffff" />
      <defs>
        <linearGradient id="planetGradient" x1="9" y1="11" x2="35" y2="37" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-accent-2)" />
          <stop offset="1" stopColor="var(--color-accent)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
