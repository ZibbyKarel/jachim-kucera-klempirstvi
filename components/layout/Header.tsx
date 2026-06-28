'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { navLinks } from '@/lib/constants'
import { Logo } from './Logo'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header() {
  const t = useTranslations('common')
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Header je na homepage průhledný přes dům, po odscrollování ztmavne.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Zavřít menu při změně stránky a zamknout scroll, když je otevřené.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || menuOpen
          ? 'border-b border-cream/10 bg-wood-dark/85 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container-content flex items-center justify-between py-4">
        <Logo />

        <nav
          aria-label="Hlavní navigace"
          className="hidden items-center gap-8 lg:flex"
        >
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`link-underline font-body text-xs uppercase tracking-widest transition-colors duration-300 ${
                  active ? 'text-wood-amber' : 'text-cream/80 hover:text-cream'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          <LanguageSwitcher className="ml-2" />
        </nav>

        {/* Hamburger — mobil / tablet */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? t('close') : t('menu')}
          className="relative z-50 flex h-10 w-10 items-center justify-center lg:hidden"
        >
          <span className="sr-only">{menuOpen ? t('close') : t('menu')}</span>
          <div className="flex w-6 flex-col items-end gap-[6px]">
            <span
              className={`h-px bg-cream transition-all duration-300 ${
                menuOpen ? 'w-6 translate-y-[7px] rotate-45' : 'w-6'
              }`}
            />
            <span
              className={`h-px bg-cream transition-all duration-300 ${
                menuOpen ? 'w-0 opacity-0' : 'w-4'
              }`}
            />
            <span
              className={`h-px bg-cream transition-all duration-300 ${
                menuOpen ? 'w-6 -translate-y-[7px] -rotate-45' : 'w-5'
              }`}
            />
          </div>
        </button>
      </div>

      {/* Fullscreen overlay menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col bg-wood-dark transition-opacity duration-500 lg:hidden ${
          menuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      >
        <nav
          aria-label="Mobilní navigace"
          className="flex flex-1 flex-col justify-center gap-2 px-8"
        >
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-4xl italic text-cream transition-colors duration-300 hover:text-wood-amber"
              style={{
                transitionDelay: menuOpen ? `${i * 40 + 100}ms` : '0ms',
                transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
                opacity: menuOpen ? 1 : 0,
                transitionProperty: 'opacity, transform, color',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-between border-t border-cream/10 px-8 py-6">
          <span className="font-body text-xs uppercase tracking-widest text-wood-light">
            {t('region')}
          </span>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
