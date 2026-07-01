'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap'
import { services } from '@/lib/constants'
import { ServiceCard } from '@/components/ui/ServiceCard'

/* -------------------------------------------------------------------------- */
/*  ServicesScroll — „Co umíme"                                                 */
/*                                                                              */
/*  Tři režimy podle šířky (vše přes matchMedia, mimo ně zůstává vertikální):   */
/*   • mobil (<768)        — prostý vertikální stack (jen držící pin, viz níže). */
/*   • desktop (768–1279)  — horizontální posun pásu (karty přesahují okno,      */
/*                            takže táhnutí je výrazné).                         */
/*   • velký monitor (≥1280) — pás se vejde do okna, takže horizontální posun by  */
/*                            byl skoro neznatelný. Místo něj se sekce pinne a    */
/*                            karty se „rozdají" — postupně vyjeví (stagger:      */
/*                            fade + posun zdola + lehký scale/náklon).          */
/*                                                                              */
/*  JEDEN pin na sekci. Kdysi tu byl vlastní pin (rozdání/pás) A NAVÍC pin ze     */
/*  StackCoveru → dva piny v jednom scroll regionu se přepočítávaly proti sobě   */
/*  a scrub „zamrzl" (karty se rozdaly až mimo okno). Teď má Služby JEN tenhle    */
/*  vlastní pin a v <StackCover pin={false}>; jeho koncový úsek = přesně 100vh    */
/*  „držení" (všechny karty rozdané, sekce kryje okno), po kterém Realizace       */
/*  svým −100vh náběhem vyjedou přes zamrzlé Služby. Rozdání/pás proto mapujeme   */
/*  jen do PRVNÍ části dráhy a zbytek (100vh) je čistá výdrž (pad v timeline).    */
/*                                                                              */
/*  Pinujeme VNITŘNÍ wrapper, ne <section>. GSAP pin obalí cíl do .pin-spaceru   */
/*  (přerodičuje ho); <section> tak zůstane přímým potomkem <main> a React ji   */
/*  při navigaci najde (jinak removeChild NotFoundError).                       */
/* -------------------------------------------------------------------------- */

export function ServicesScroll() {
  const t = useTranslations('home')
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const pinned = pinRef.current
    const track = trackRef.current
    if (!section || !pinned || !track) return

    // Výdrž na konci pinu = 100vh (přes ni Realizace svým −100vh náběhem vyjedou).
    const cover = () => document.documentElement.clientHeight

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      const cards = () => Array.from(track.children) as HTMLElement[]

      // --- mobil (<768): žádná animace, jen držící pin, ať Realizace mají co krýt ---
      mm.add('(max-width: 767px)', () => {
        if (prefersReducedMotion()) return
        ScrollTrigger.create({
          trigger: section,
          start: 'bottom bottom', // zamrzne, až spodek sekce dojede ke spodku okna
          end: () => '+=' + cover(),
          pin: pinned,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        })
      })

      // --- desktop (768–1279): horizontální posun pásu + 100vh výdrž ---
      mm.add('(min-width: 768px) and (max-width: 1279px)', () => {
        if (prefersReducedMotion()) return
        const getDistance = () => track.scrollWidth - window.innerWidth
        // poměr výdrže k posunu (pro pad v timeline; scrub mapuje duration → scroll)
        const holdRatio = cover() / Math.max(getDistance(), 1)

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => '+=' + (getDistance() + cover()),
            pin: pinned,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
        tl.to(track, { x: () => -getDistance(), ease: 'none', duration: 1 })
        // výdrž: pás dojel, sekce kryje okno; Realizace teď vyjedou přes ni
        tl.to({}, { duration: holdRatio })
      })

      // --- velký monitor (≥1280): pin + „rozdání" karet + 100vh výdrž ---
      mm.add('(min-width: 1280px)', () => {
        if (prefersReducedMotion()) return
        const els = cards()
        // výchozí stav: skryté, posunuté dolů, mírně zmenšené a nakloněné
        gsap.set(els, {
          opacity: 0,
          y: 80,
          scale: 0.92,
          rotateZ: (i) => (i % 2 === 0 ? -2.5 : 2.5),
          transformOrigin: 'center bottom',
        })

        // dráha rozdání (dost, ať se čte jako záměrné i na širokém monitoru)
        const deal = () => window.innerHeight * 1.15
        const dealDur = 1 + 0.5 * (els.length - 1) // duration + stagger všech karet
        const holdRatio = (dealDur * cover()) / deal() // pad → přesně 100vh výdrž

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => '+=' + (deal() + cover()),
            pin: pinned,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        tl.to(els, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateZ: 0,
          ease: 'power3.out',
          duration: 1,
          stagger: 0.5,
        })
        // výdrž: všechny karty rozdané a sekce kryje okno; Realizace vyjedou přes ni
        tl.to({}, { duration: holdRatio })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="services-heading"
      /* Překrytí (pin hero + náběh přes něj) i z-index řeší obal <StackCover>.
         Stín dělá náběžnou hranu čitelnou. */
      className="relative bg-wood-dark shadow-[0_-30px_60px_-30px_rgba(45,43,40,0.3)]"
    >
      {/* Vnitřní wrapper = pinovaný prvek (GSAP ho obalí do .pin-spaceru). */}
      <div
        ref={pinRef}
        className="relative overflow-hidden py-20 md:h-screen md:py-0"
      >
        <div className="container-content pt-8 md:absolute md:left-0 md:right-0 md:top-12 md:z-10">
          <span className="eyebrow">{t('servicesHeading')}</span>
          <h2
            id="services-heading"
            className="mt-3 max-w-xl font-display text-3xl italic text-cream md:text-4xl"
          >
            {t('servicesIntro')}
          </h2>
        </div>

        <div className="md:flex md:h-full md:items-center">
          <div
            ref={trackRef}
            className="mt-10 flex flex-col gap-6 px-6 md:mt-0 md:h-[64vh] md:flex-row md:gap-8 md:px-10 md:pl-[8vw] md:pr-[8vw] xl:h-[58vh] xl:w-full xl:justify-center xl:gap-6 xl:pl-[4vw] xl:pr-[4vw]"
          >
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
