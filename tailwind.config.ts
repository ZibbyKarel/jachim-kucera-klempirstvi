import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Světlá paleta odvozená přímo z loga: teplá světle šedá podloží (pozadí
        // loga) + uhlový charcoal (text, ikona střechy) + antická mosazná zlatá.
        // Pozn.: názvy tokenů jsou sémantické role, ne doslovné barvy —
        //   `wood.dark`  = základní (světlé) pozadí stránky
        //   `cream`      = popředí / text (charcoal), opacity = ztlumený text
        //   `wood.*`     = mosazné zlaté akcenty
        wood: {
          dark: '#e9e6e0', // ZÁKLADNÍ POZADÍ — teplá světle šedá (pozadí loga)
          medium: '#f4f0e7', // sekundární / střídavé světlé pozadí (krém)
          warm: '#7a5e26', // hluboká mosaz — čísla, drobné akcenty (silný kontrast)
          light: '#c49a4c', // jasná mosazná zlatá z loga — hover, výplně, ozdoby
          amber: '#a07d33', // mosazný akcent — text-akcenty, CTA výplň (čitelný na světlém)
        },
        // Uhlová z loga — text na světlém pozadí, ikony, tmavý text na zlatých CTA.
        charcoal: {
          DEFAULT: '#2d2b28',
          light: '#3a3833',
        },
        steel: {
          dark: '#2D3748',
          medium: '#4A5568',
          light: '#718096',
        },
        cream: '#2d2b28', // POPŘEDÍ / TEXT — charcoal (opacity = ztlumený text)
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.2em',
      },
      maxWidth: {
        content: '1200px',
      },
      transitionTimingFunction: {
        craft: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Pobídka ke scrollu — jemné houpání šipky dolů + pulz průhlednosti.
        'scroll-cue': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.55' },
          '50%': { transform: 'translateY(7px)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'scroll-cue': 'scroll-cue 1.6s cubic-bezier(0.45, 0, 0.55, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
