import type { ReactNode } from 'react'

// Pass-through root layout. Skutečný <html>/<body> dodává app/[locale]/layout.tsx
// (a app/not-found.tsx pro globální 404). Tohle je doporučený vzor next-intl,
// aby šlo držet <html lang> uvnitř lokalizovaného segmentu.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
