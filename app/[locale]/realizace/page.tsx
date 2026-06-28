import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { projects } from '@/lib/constants'
import { ProjectGallery } from '@/components/ui/ProjectGallery'

export const metadata: Metadata = {
  title: 'Realizace — Naše střechy v Plzeňském kraji',
  description:
    'Vybrané realizace tesařských, pokrývačských a klempířských prací po celém Plzeňském kraji. Krovy, střechy, okapy a rekonstrukce.',
  alternates: { canonical: '/realizace' },
}

export default async function RealizacePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="bg-wood-dark">
      <header className="container-content pb-12 pt-36 md:pt-44">
        <span className="eyebrow">Realizace</span>
        <h1 className="mt-3 max-w-3xl font-display text-5xl italic leading-tight text-cream md:text-7xl">
          Co jsme postavili
        </h1>
        <p className="mt-5 max-w-xl font-body text-base leading-relaxed text-cream/70">
          Výběr z toho, na čem jsme za poslední roky pracovali. Od krovů přes
          kompletní střechy až po klempířské detaily — všechno v Plzeňském kraji
          a okolí.
        </p>
      </header>

      <div className="container-content pb-28">
        <ProjectGallery projects={projects} enableFilter />
      </div>
    </div>
  )
}
