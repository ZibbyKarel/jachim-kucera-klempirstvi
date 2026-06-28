import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { getService } from '@/lib/constants'
import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate'

const service = getService('cisteni-strech')!

export const metadata: Metadata = {
  title: service.seo.title,
  description: service.seo.description,
  alternates: { canonical: '/sluzby/cisteni-strech' },
  openGraph: {
    title: service.seo.title,
    description: service.seo.description,
    images: [{ url: service.heroImage }],
  },
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  if (!service) notFound()
  return <ServicePageTemplate service={service} />
}
