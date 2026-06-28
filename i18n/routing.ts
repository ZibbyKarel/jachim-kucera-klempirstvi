import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['cs', 'en'],
  defaultLocale: 'cs',
  // Czech is the primary market — keep its URLs clean (no /cs prefix).
  localePrefix: 'as-needed',
})

export type Locale = (typeof routing.locales)[number]

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
