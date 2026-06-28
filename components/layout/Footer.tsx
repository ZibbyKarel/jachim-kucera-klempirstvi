import { Link } from '@/i18n/routing'
import { SITE, navLinks } from '@/lib/constants'
import { Logo } from './Logo'

export function Footer() {
  const year = 2026

  return (
    <footer className="relative overflow-hidden border-t border-cream/10 bg-wood-medium">
      <div className="grain absolute inset-0" aria-hidden="true" />
      <div className="container-content relative grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-5">
          <Logo />
          <p className="max-w-xs font-body text-sm leading-relaxed text-cream/60">
            Poctivá tesařská, pokrývačská a klempířská práce v Plzeňském kraji.
            Stavíme střechy, jako by byly naše vlastní.
          </p>
        </div>

        <nav aria-label="Patička — navigace" className="space-y-4">
          <h2 className="eyebrow">Navigace</h2>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="link-underline font-body text-sm text-cream/70 transition-colors hover:text-cream"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-4">
          <h2 className="eyebrow">Kontakt</h2>
          <ul className="space-y-2 font-body text-sm text-cream/70">
            <li>
              <a
                href={`tel:${SITE.phoneHref}`}
                className="link-underline transition-colors hover:text-cream"
              >
                {SITE.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="link-underline transition-colors hover:text-cream"
              >
                {SITE.email}
              </a>
            </li>
            <li className="pt-2 text-cream/50">{SITE.region}</li>
          </ul>
        </div>
      </div>

      <div className="container-content relative flex flex-col items-start justify-between gap-2 border-t border-cream/10 py-6 font-body text-xs text-cream/40 sm:flex-row sm:items-center">
        <p>
          © {year} {SITE.name}. Všechna práva vyhrazena.
        </p>
        <p>IČO 000 00 000 · Plzeňský kraj</p>
      </div>
    </footer>
  )
}
