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
        wood: {
          dark: '#1a1410', // pozadí — spálené dřevo
          medium: '#2C1F14', // sekundární pozadí
          warm: '#8B5E3C', // primární dřevo
          light: '#C4955A', // světlé dřevo, hover
          amber: '#D47F3A', // akcent, CTA
        },
        steel: {
          dark: '#2D3748',
          medium: '#4A5568',
          light: '#718096',
        },
        cream: '#F5ECD7', // text, linky (sepia)
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
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
    },
  },
  plugins: [],
}

export default config
