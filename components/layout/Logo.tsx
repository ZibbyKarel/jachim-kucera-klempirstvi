import { Link } from '@/i18n/routing'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Jáchim & Kučera — domů"
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      {/* Stylizovaný štít domu z tenkých tahů — ladí s SVG domem. */}
      <svg
        width="34"
        height="30"
        viewBox="0 0 34 30"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M2 16 17 3l15 13"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-wood-amber"
        />
        <path
          d="M5 14v13h24V14M17 7 6.5 15.5M17 7l10.5 8.5"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-cream/70 transition-colors duration-500 group-hover:text-cream"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg italic tracking-wide text-cream">
          Jáchim&nbsp;&amp;&nbsp;Kučera
        </span>
        <span className="font-body text-[0.6rem] uppercase tracking-widest text-wood-light">
          Tesařství&nbsp;·&nbsp;Plzeňský kraj
        </span>
      </span>
    </Link>
  )
}
