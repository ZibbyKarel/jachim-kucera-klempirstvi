import Link from 'next/link'

// Globální 404 mimo lokalizovaný segment — má vlastní <html>,
// protože nad ním není žádný root layout.
export default function GlobalNotFound() {
  return (
    <html lang="cs">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1410',
          color: '#F5ECD7',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '0 1.5rem',
        }}
      >
        <h1 style={{ fontSize: '2rem', margin: 0 }}>404 — Stránka nenalezena</h1>
        <p style={{ color: 'rgba(245,236,215,0.7)', marginTop: '1rem' }}>
          Tahle stránka tu není.
        </p>
        <Link
          href="/"
          style={{
            marginTop: '2rem',
            backgroundColor: '#D47F3A',
            color: '#1a1410',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontSize: '0.85rem',
          }}
        >
          Zpět domů
        </Link>
      </body>
    </html>
  )
}
