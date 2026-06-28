import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { SITE } from '@/lib/constants'
import { IsometricHouse } from '@/components/house/IsometricHouse'
import { ServicesScroll } from '@/components/sections/ServicesScroll'
import { ProjectsPreview } from '@/components/sections/ProjectsPreview'
import { AboutSection } from '@/components/sections/AboutSection'
import { ContactSection } from '@/components/sections/ContactSection'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('common')

  return (
    <>
      {/* 1A — Interaktivní dům přes celý viewport */}
      <section
        aria-label="Rozcestník — interaktivní dům"
        className="relative bg-wood-dark"
      >
        <IsometricHouse />

        {/* Spodní lišta přes dům */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
          <div className="container-content flex items-center justify-between border-t border-cream/10 bg-gradient-to-t from-wood-dark to-transparent py-5">
            <p className="font-display text-lg italic text-cream md:text-xl">
              &bdquo;{SITE.tagline}&ldquo;
            </p>
            <p className="font-body text-xs uppercase tracking-widest text-wood-light">
              {t('region')}
            </p>
          </div>
        </div>
      </section>

      {/* 1B — Služby (horizontální scroll) */}
      <ServicesScroll />

      {/* 1C — Realizace preview */}
      <ProjectsPreview />

      {/* 1D — O nás zkráceně */}
      <AboutSection />

      {/* 1E — Kontakt CTA */}
      <ContactSection />
    </>
  )
}
