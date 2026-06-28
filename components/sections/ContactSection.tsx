'use client'

import { useTranslations } from 'next-intl'
import { SITE } from '@/lib/constants'
import { ContactForm } from '@/components/ui/ContactForm'
import { Reveal } from '@/components/ui/Reveal'

export function ContactSection() {
  const t = useTranslations()

  return (
    <section
      id="kontakt"
      aria-labelledby="contact-cta-heading"
      className="relative overflow-hidden border-t border-cream/10 bg-wood-dark py-24 md:py-32"
    >
      <div className="grain absolute inset-0" aria-hidden="true" />
      <div className="container-content relative">
        <Reveal className="text-center">
          <span className="eyebrow">{t('home.contactHeading')}</span>
          <h2
            id="contact-cta-heading"
            className="mt-4 font-display text-4xl italic text-cream md:text-5xl"
          >
            Zavolejte nebo napište. Domluvíme se.
          </h2>
          <a
            href={`tel:${SITE.phoneHref}`}
            className="mt-8 inline-block font-display text-5xl text-wood-amber transition-colors hover:text-wood-light md:text-7xl"
          >
            {SITE.phone}
          </a>
          <p className="mt-4 font-body text-sm uppercase tracking-widest text-cream/50">
            {SITE.region}
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="mx-auto mt-16 max-w-2xl rounded-sm border border-cream/10 bg-wood-medium/60 p-8 md:p-10"
        >
          <ContactForm compact />
        </Reveal>
      </div>
    </section>
  )
}
