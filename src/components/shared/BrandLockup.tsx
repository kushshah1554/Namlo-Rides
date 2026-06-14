interface BrandLockupProps {
  subtitle?: string;
}

export default function BrandLockup({
  subtitle = "Real-time ride sharing across Kathmandu",
}: BrandLockupProps) {
  return (
    <div className="mb-8 text-center">
      <div className="inline-flex items-center gap-2 mb-2">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
          <circle cx="14" cy="12" r="5" fill="#f59e0b" />
          <path
            d="M14 17c0 0-7 5.5-7 10h14c0-4.5-7-10-7-10z"
            fill="#f59e0b"
            opacity="0.4"
          />
        </svg>
        <span className="text-2xl font-bold tracking-tight text-white">
          Namlo<span className="text-amber-400">Rides</span>
        </span>
      </div>
      <p className="text-sm text-zinc-400">{subtitle}</p>
    </div>
  );
}