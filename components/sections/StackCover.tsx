'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap'

/* -------------------------------------------------------------------------- */
/*  StackCover — jednotné „překrytí" sekcí při scrollu                          */
/*                                                                             */
/*  Každá sekce se na konci své dráhy NA CHVÍLI zastaví (pin) a následující     */
/*  sekce po ní vyjede zespodu nahoru, dokud ji KOMPLETNĚ nezakryje — stejný    */
/*  pohyb, jakým služby zakryjí hero. Pin drží VNITŘNÍ wrapper (ne <section>),  */
/*  takže <section> zůstává přímým potomkem <main> a App Router při navigaci    */
/*  nespadne na removeChild; ctx.revert() vše vrátí před odmountováním.         */
/*                                                                             */
/*   • pin: start „bottom bottom" → sekce zamrzne, až její spodek dojede ke      */
/*     spodku okna (takže VYŠŠÍ obsah se stihne odscrollovat a přečíst),        */
/*     drží 100vh (= přesně jedno okno, co potřebuje nástupce na zakrytí).      */
/*   • climb: −100vh marginTop zruší pin-spacer předchozí sekce → tato sekce     */
/*     šplhá PŘES zamrzlou předchozí, místo aby byla odstrčena pod ni.          */
/* -------------------------------------------------------------------------- */

interface StackCoverProps {
  /** Vrstva v překryvu (vyšší = později, kryje předchozí). */
  z: number
  children: ReactNode
  /** Šplhá přes zamrzlou předchozí sekci (−100vh). Vypnout jen pro první vrstvu. */
  climb?: boolean
  /** Zamrzne na konci, ať ji nástupce zakryje. Vypnout pro poslední sekci. */
  pin?: boolean
  className?: string
}

export function StackCover({
  z,
  children,
  climb = true,
  pin = true,
  className = '',
}: StackCoverProps) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (prefersReducedMotion()) return // klidový režim: prostý tok, žádné překrytí

    const apply = () => {
      // 100vh v px (clientHeight = CSS vh, bez scrollbaru) → climb i pin sedí na sebe.
      const vh = document.documentElement.clientHeight
      wrap.style.marginTop = climb ? `-${vh}px` : ''
    }
    apply()

    const ctx = gsap.context(() => {
      if (pin) {
        ScrollTrigger.create({
          trigger: wrap,
          start: 'bottom bottom',
          end: () => '+=' + document.documentElement.clientHeight,
          pin: wrap,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        })
      }
    }, wrapRef)

    const onResize = () => apply()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
      wrap.style.marginTop = ''
    }
  }, [climb, pin, z])

  return (
    <div ref={wrapRef} className={`relative ${className}`} style={{ zIndex: z }}>
      {children}
    </div>
  )
}
