import { Link } from '@/i18n/routing'
import type { Service } from '@/lib/types'
import { ImageFrame } from './ImageFrame'
import { Arrow } from './Button'

const icons: Record<string, JSX.Element> = {
  tesarstvi: (
    <path d="M4 30 16 6l12 24M9 30l7-14 7 14M16 6v24" />
  ),
  pokryvacstvi: (
    <path d="M2 18 16 6l14 12M6 16v0M2 18l4 2v8h20v-8l4-2M10 28v-6h12v6" />
  ),
  klempirstvi: (
    <path d="M6 6v10a4 4 0 0 0 4 4h2v8M6 6h8M22 8h6M25 8v18M22 26h6" />
  ),
  'cisteni-strech': (
    <path d="M4 20 16 8l12 12M9 24l2-3M16 27l2-3M23 24l2-3M8 20v2M16 20v2M24 20v2" />
  ),
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group relative flex h-full w-[85vw] max-w-[440px] shrink-0 flex-col justify-between overflow-hidden rounded-sm border border-cream/10 bg-wood-medium p-8 md:w-[42vw] md:p-10 xl:w-[21vw] xl:max-w-none xl:p-8">
      {/* Fotka odhalená pod texturou při hoveru */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-craft group-hover:opacity-100">
        <ImageFrame
          src={service.heroImage}
          alt={`Realizace — ${service.title}`}
          aspect="3/4"
          aged={false}
          rounded={false}
          className="!absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wood-dark via-wood-dark/70 to-wood-dark/30" />
      </div>

      {/* Dřevěná textura, která se „odhrne" */}
      <div
        className="pointer-events-none absolute inset-0 transition-[clip-path] duration-700 ease-craft [clip-path:inset(0_0_0_0)] group-hover:[clip-path:inset(0_0_100%_0)]"
        style={{
          backgroundColor: '#efe7d6',
          backgroundImage:
            'repeating-linear-gradient(92deg, rgba(45,43,40,0.06) 0 2px, transparent 2px 26px), repeating-linear-gradient(0deg, rgba(160,125,51,0.08) 0 1px, transparent 1px 9px)',
          backgroundBlendMode: 'multiply',
        }}
      />

      <div className="relative">
        <span className="eyebrow">Služba</span>
        <svg
          width="44"
          height="36"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="mt-6 text-wood-amber"
        >
          {icons[service.slug]}
        </svg>
        <h3 className="mt-6 font-display text-5xl italic leading-[0.95] text-cream md:text-6xl">
          {service.title}
        </h3>
        <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-cream/70">
          {service.shortDescription}
        </p>
      </div>

      <Link
        href={`/sluzby/${service.slug}`}
        className="relative mt-8 inline-flex items-center gap-3 font-body text-xs uppercase tracking-widest text-wood-amber transition-colors hover:text-wood-warm"
      >
        Více o službě {service.title}
        <Arrow className="transition-transform duration-500 ease-craft group-hover:translate-x-1" />
      </Link>
    </article>
  )
}
