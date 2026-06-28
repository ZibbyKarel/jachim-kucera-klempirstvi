import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { SITE } from '@/lib/constants'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '../globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.region}`,
    template: `%s | ${SITE.shortName}`,
  },
  description:
    'Tesařství, pokrývačství a klempířství v Plzeňském kraji. Stavíme krovy, pokládáme střechy a děláme okapy. Přes 20 let poctivé řemeslné práce.',
  keywords: [
    'tesařství',
    'pokrývačství',
    'klempířství',
    'krovy',
    'střechy',
    'Plzeňský kraj',
    'Plzeň',
  ],
  authors: [{ name: SITE.shortName }],
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.region}`,
    description:
      'Tesařství, pokrývačství a klempířství v Plzeňském kraji. Poctivá řemeslná práce, přes 20 let zkušeností.',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} | ${SITE.region}`,
    description: 'Tesařství, pokrývačství a klempířství v Plzeňském kraji.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE.url}/#business`,
  name: SITE.name,
  description: 'Tesařství, pokrývačství a klempířství v Plzeňském kraji',
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  image: `${SITE.url}/images/og-default.jpg`,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Plzeňský kraj',
    addressCountry: 'CZ',
  },
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Plzeňský kraj',
  },
  serviceType: ['Tesařství', 'Pokrývačství', 'Klempířství', 'Čištění střech'],
  knowsLanguage: ['cs', 'en'],
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'cs' | 'en')) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const t = await getTranslations('common')

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only rounded-md bg-wood-amber px-4 py-2 font-body text-sm font-medium text-charcoal focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]"
          >
            {t('skipToContent')}
          </a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
