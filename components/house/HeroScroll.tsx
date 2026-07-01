'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { Button, Arrow } from '@/components/ui/Button'
import { HeroHouse } from './HeroHouse'

/* -------------------------------------------------------------------------- */
/*  HeroScroll — dům „na papíře" se scroll choreografií                         */
/*                                                                              */
/*  Panel drží 100dvh a je STICKY uvnitř delší dráhy (runway). Sticky (ne GSAP  */
/*  pin) = žádné přerodičování do .pin-spacer → App Router při navigaci nespadne */
/*  na removeChild. Dům zůstává v klidu (žádné „usazení"). Při scrollu dráhou:   */
/*   • nadpis/CTA odplují vzhůru a pulzující šipka se vytratí (uvolní pohled),   */
/*   • sticky panel se na konci odlepí a navazující sekce (z-10, −mt) ho         */
/*     plynule překryje — jediná animace, kterou tu chceme.                     */
/* -------------------------------------------------------------------------- */

/* Jemná zrnitost papíru (grayscale fractal noise jako data-URI SVG). */
const PAPER_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

export function HeroScroll() {
  const t = useTranslations('home')
  const runwayRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const runway = runwayRef.current
    if (!runway) return

    const ctx = gsap.context(() => {
      // Při omezeném pohybu necháme vše viditelné (žádný scrub).
      if (prefersReducedMotion()) return

      // Nadpis/CTA odplují vzhůru hned v první třetině dráhy.
      gsap.to(headerRef.current, {
        opacity: 0,
        y: -28,
        ease: 'none',
        scrollTrigger: { trigger: runway, start: 'top top', end: '35% top', scrub: true },
      })

      // Pulzující šipka mizí ještě dřív (jakmile uživatel pochopí pobídku).
      gsap.to(cueRef.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: runway, start: 'top top', end: '20% top', scrub: true },
      })
    }, runwayRef)

    return () => ctx.revert()
  }, [])

  return (
    // Dráha = panel (100dvh) + PŘESNĚ 100vh rezervy. Po těch 100vh panel „lepí" a
    // navazující Služby (−100vh náběh, viz StackCover) přes něj vyjedou a zakryjí
    // ho — stejná dráha jako u ostatních sekcí (sticky = bez GSAP pinu, App safe).
    <div ref={runwayRef} className="relative h-[calc(100dvh_+_100vh)] motion-reduce:h-[100dvh]">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#f4efe3]">
        {/* zrnitost papíru (nepohybuje se s domem) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-multiply"
          style={{ backgroundImage: PAPER_GRAIN, backgroundSize: '180px 180px' }}
        />
        {/* jemná vinětace listu */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: 'inset 0 0 90px rgba(74,64,46,0.12)' }}
        />

        {/* interaktivní dům (statický, klidová animace) */}
        <HeroHouse />

        {/* hero nadpis + CTA v uvolněném horním pruhu. Na mobilu odsazeno tak, aby
            nezasahoval fixní top bar (logo / jazyk / hamburger). */}
        <div
          ref={headerRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center px-6 pt-[5.5rem] text-center md:pt-[clamp(1.5rem,6vh,4rem)]"
        >
          <span className="eyebrow text-charcoal/70">{t('heroEyebrow')}</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl italic leading-[1.05] text-charcoal sm:text-5xl md:text-6xl">
            {t('heroTitle')}
          </h1>
          <Button href="/kontakt" size="md" className="pointer-events-auto mt-6">
            {t('heroCta')}
          </Button>
        </div>

        {/* pobídka ke scrollu — pulzující šipka dole uprostřed */}
        <div
          ref={cueRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-7 z-10 flex flex-col items-center gap-2 text-charcoal/70"
        >
          <span className="font-body text-[0.6rem] font-semibold uppercase tracking-[0.2em]">
            {t('scrollCue')}
          </span>
          {/* Rotace JE na samotné šipce; pulz (translateY) na obalu — jinak by
              transform z keyframu přepsal rotaci a šipka by mířila doprava. */}
          <span className="inline-block animate-scroll-cue motion-reduce:animate-none">
            <Arrow className="block rotate-90" />
          </span>
        </div>
      </div>
    </div>
  )
}
