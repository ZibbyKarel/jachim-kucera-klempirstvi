'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { houseLabels, SITE } from '@/lib/constants'
import { HouseSection } from './HouseSection'
import { useHouseRotation } from './useHouseRotation'

/* -- Vygenerované izometrické cesty (viz lib generátor) -- */
const PATHS = {
  foundation: [
    'M320 279.4 L500.1 383.4 L365 461.4 L184.9 357.4 Z',
    'M320 279.4 L320 270',
    'M500.1 383.4 L500.1 374',
    'M365 461.4 L365 452',
    'M320 270 L500.1 374 L365 452 L184.9 348 Z',
  ],
  walls: [
    'M320 270 L500.1 374 L500.1 218 L320 114 Z',
    'M500.1 374 L365 452 L365 296 L500.1 218 Z',
    'M320 192 L500.1 296',
    'M500.1 296 L365 374',
    'M500.1 374 L500.1 218',
  ],
  roof: [
    'M320 114 L500.1 218 L432.6 173.8 L252.5 69.8 Z',
    'M252.5 69.8 L432.6 173.8',
    'M252.5 69.8 L432.6 173.8 L365 296 L184.9 192 Z',
    'M500.1 218 L365 296 L432.6 173.8 Z',
    'M320 114 L311.9 115.6',
    'M500.1 218 L508.2 219.6',
  ],
  truss: [
    'M500.1 218 L365 296',
    'M500.1 218 L432.6 173.8',
    'M365 296 L432.6 173.8',
    'M432.6 257 L432.6 173.8',
    'M466.4 237.5 L432.6 215.4',
    'M398.8 276.5 L432.6 215.4',
    'M461.9 211.5 L403.3 245.3',
    'M365 140 L297.5 95.8',
    'M410.1 166 L342.5 121.8',
    'M455.1 192 L387.5 147.8',
  ],
  gutters: [
    'M322.3 116.9 L502.4 220.9',
    'M322.3 124.1 L502.4 228.1',
    'M505.1 226.1 L505.1 374.3',
  ],
  chimney: [
    'M306.5 102.7 L326.8 114.4 L326.8 50.3 L306.5 38.6 Z',
    'M326.8 114.4 L306.5 101.2 L306.5 62 L326.8 50.3 Z',
    'M306.5 38.6 L326.8 50.3 L306.5 62 L286.2 50.3 Z',
    'M306.5 35.5 L332.2 50.3 L306.5 65.1 L280.8 50.3 Z',
  ],
  windows: [
    'M338 257 L365 272.6 L365 236.2 L338 220.6 Z',
    'M437.1 314.2 L464.1 329.8 L464.1 293.4 L437.1 277.8 Z',
    'M338 184.2 L365 199.8 L365 160.8 L338 145.2 Z',
    'M387.5 212.8 L414.6 228.4 L414.6 189.4 L387.5 173.8 Z',
    'M437.1 241.4 L464.1 257 L464.1 218 L437.1 202.4 Z',
    'M448.3 307.7 L416.8 325.9 L416.8 289.5 L448.3 271.3 Z',
  ],
  door: [
    'M389.8 310.3 L421.3 328.5 L421.3 250.5 L389.8 232.3 Z',
    'M394.3 307.7 L416.8 320.7 L416.8 253.1 L394.3 240.1 Z',
    'M412.3 285.9 L412.3 278.6',
    'M385.3 307.7 L425.8 331.1',
  ],
}

/* Neviditelné hit-area polygony pro snadný klik na tenké tahy. */
const HIT = {
  truss: 'M500.1 218 L365 296 L432.6 173.8 Z',
  roof: 'M320 114 L500.1 218 L432.6 173.8 L252.5 69.8 Z',
  gutters: 'M320 110 L500.1 214 L506 232 L326 128 Z',
  chimney: 'M286 50 L332 50 L327 114 L306 103 Z',
  door: 'M389.8 310.3 L421.3 328.5 L421.3 250.5 L389.8 232.3 Z',
}

function DrawPaths({ d }: { d: string[] }) {
  return (
    <>
      {d.map((path) => (
        <path
          key={path}
          d={path}
          className="draw-path"
          fill="none"
          vectorEffect="non-scaling-stroke"
          style={{ pointerEvents: 'none' }}
        />
      ))}
    </>
  )
}

export function IsometricHouse() {
  const t = useTranslations()
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const rotateRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(null)

  const { enableGyro } = useHouseRotation(rotateRef)

  const navigate = (href: string) => router.push(href)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const labels = gsap.utils.toArray<HTMLElement>('.house-label')

      if (prefersReducedMotion()) {
        gsap.set('.draw-path', { drawSVG: '100%', opacity: 1 })
        gsap.set('.house-labels', { opacity: 1 })
        gsap.set(labels, { opacity: 0.5, y: 0 })
        return
      }

      gsap.set('.house-labels', { opacity: 1 })
      const order = [
        'foundation',
        'walls',
        'roof',
        'truss',
        'gutters',
        'chimney',
        'windows',
        'door',
      ]
      const durations: Record<string, number> = {
        foundation: 0.4,
        walls: 0.6,
        roof: 0.5,
        truss: 0.7,
        gutters: 0.5,
        chimney: 0.45,
        windows: 0.5,
        door: 0.45,
      }

      const tl = gsap.timeline({ delay: 0.3 })
      order.forEach((group, i) => {
        tl.from(
          `#g-${group} .draw-path`,
          {
            drawSVG: '0%',
            duration: durations[group],
            stagger: 0.05,
            ease: 'power2.inOut',
          },
          i === 0 ? 0 : '-=0.15'
        )
      })
      tl.from(
        labels,
        { opacity: 0, y: 14, stagger: 0.1, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      ).set(labels, { opacity: 0.5 })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative h-[100dvh] w-full select-none"
      style={{ perspective: '1200px', perspectiveOrigin: '50% 40%' }}
    >
      {/* Rotující vrstva */}
      <div
        ref={rotateRef}
        className="absolute inset-0 flex items-center justify-center will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <svg
          viewBox="150 -10 380 500"
          className="h-[78%] max-h-[680px] w-auto max-w-[92vw] overflow-visible"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Interaktivní izometrická skica domu — rozcestník služeb"
          role="img"
        >
          {/* jemný odlesk podlahy */}
          <ellipse
            cx="343"
            cy="466"
            rx="150"
            ry="26"
            fill="url(#house-shadow)"
            opacity="0.5"
          />
          <defs>
            <radialGradient id="house-shadow">
              <stop offset="0%" stopColor="#000" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Neinteraktivní vizuál */}
          <g id="g-foundation" stroke="#8B5E3C" strokeWidth="0.9" opacity="0.55">
            <DrawPaths d={PATHS.foundation} />
          </g>
          <g id="g-walls" stroke="#F5ECD7" strokeWidth="1" opacity="0.85">
            <DrawPaths d={PATHS.walls} />
          </g>
          <g id="g-windows" stroke="#C4955A" strokeWidth="0.9" opacity="0.8">
            <DrawPaths d={PATHS.windows} />
          </g>

          {/* Interaktivní skupiny */}
          <InteractiveGroup
            id="g-roof"
            label={`Pokrývačství — ${t('common.moreAbout')}`}
            active={active === 'g-roof'}
            onActivate={() => navigate('/sluzby/pokryvacstvi')}
            onHover={setActive}
            paths={PATHS.roof}
            hit={HIT.roof}
            strokeWidth={1}
          />
          <InteractiveGroup
            id="g-truss"
            label={`Tesařství — ${t('common.moreAbout')}`}
            active={active === 'g-truss'}
            onActivate={() => navigate('/sluzby/tesarstvi')}
            onHover={setActive}
            paths={PATHS.truss}
            hit={HIT.truss}
            strokeWidth={0.9}
          />
          <InteractiveGroup
            id="g-gutters"
            label={`Klempířství — ${t('common.moreAbout')}`}
            active={active === 'g-gutters'}
            onActivate={() => navigate('/sluzby/klempirstvi')}
            onHover={setActive}
            paths={PATHS.gutters}
            hit={HIT.gutters}
            strokeWidth={1.1}
          />
          <InteractiveGroup
            id="g-chimney"
            label="O nás"
            active={active === 'g-chimney'}
            onActivate={() => navigate('/o-nas')}
            onHover={setActive}
            paths={PATHS.chimney}
            hit={HIT.chimney}
            strokeWidth={1}
          />
          <InteractiveGroup
            id="g-door"
            label="Kontakt"
            active={active === 'g-door'}
            onActivate={() => navigate('/kontakt')}
            onHover={setActive}
            paths={PATHS.door}
            hit={HIT.door}
            strokeWidth={1}
          />
        </svg>
      </div>

      {/* HTML overlay labely */}
      <div
        className="house-labels pointer-events-none absolute inset-0 opacity-0"
        aria-hidden="true"
      >
        {houseLabels.map((label) => (
          <div
            key={label.id}
            className="house-label absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: label.position.x,
              top: label.position.y,
              opacity: 0.5,
              color:
                active === label.groupId
                  ? 'var(--wood-amber)'
                  : 'var(--cream)',
              transition: 'color 0.3s ease, opacity 0.3s ease',
              ...(active === label.groupId ? { opacity: 1 } : null),
            }}
          >
            <div className="flex items-center gap-2">
              <span className="block h-px w-8 bg-current opacity-60" />
              <div className="whitespace-nowrap">
                <span className="block font-display text-lg italic leading-none">
                  {label.text}
                </span>
                <span className="block font-body text-[0.6rem] uppercase tracking-widest opacity-70">
                  {label.subtext}
                </span>
              </div>
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path
                  d="M2 8 L8 2 M8 2 H4 M8 2 V6"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Nápověda + gyro toggle */}
      <div className="pointer-events-none absolute inset-x-0 bottom-28 flex justify-center md:bottom-24">
        <p className="font-body text-xs uppercase tracking-widest text-cream/40">
          {t('home.hint')}
        </p>
      </div>
      <button
        type="button"
        onClick={enableGyro}
        className="pointer-events-auto absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full border border-cream/20 px-4 py-1.5 font-body text-[0.65rem] uppercase tracking-widest text-cream/50 transition-colors hover:text-cream md:hidden"
      >
        Naklonit telefonem
      </button>
    </div>
  )
}

function InteractiveGroup({
  id,
  label,
  active,
  onActivate,
  onHover,
  paths,
  hit,
  strokeWidth,
}: {
  id: string
  label: string
  active: boolean
  onActivate: () => void
  onHover: (g: string | null) => void
  paths: string[]
  hit: string
  strokeWidth: number
}) {
  return (
    <HouseSection
      id={id}
      ariaLabel={label}
      active={active}
      onActivate={onActivate}
      onHover={onHover}
    >
      <g strokeWidth={strokeWidth}>
        {paths.map((d) => (
          <path
            key={d}
            d={d}
            className="draw-path"
            fill="none"
            style={{ pointerEvents: 'none' }}
          />
        ))}
      </g>
      <path
        d={hit}
        fill="transparent"
        stroke="transparent"
        strokeWidth={10}
        style={{ pointerEvents: 'all' }}
      />
    </HouseSection>
  )
}
