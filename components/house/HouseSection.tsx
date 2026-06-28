'use client'

import type { ReactNode } from 'react'

interface HouseSectionProps {
  id: string
  ariaLabel: string
  active: boolean
  onActivate: () => void
  onHover: (groupId: string | null) => void
  children: ReactNode
}

/**
 * Interaktivní skupina domu (#g-…). Reaguje na klik, klávesnici i hover
 * a hlásí stav rodiči, který podle toho zvýrazní odpovídající label.
 */
export function HouseSection({
  id,
  ariaLabel,
  active,
  onActivate,
  onHover,
  children,
}: HouseSectionProps) {
  return (
    <g
      id={id}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onActivate()
        }
      }}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(id)}
      onBlur={() => onHover(null)}
      className="house-section cursor-pointer outline-none"
      data-active={active ? 'true' : 'false'}
    >
      {/* Neviditelná hit-area zvětší plochu pro klik/tap. */}
      <g
        className="transition-[stroke,opacity] duration-300"
        style={{
          stroke: active ? 'var(--wood-amber)' : '#F5ECD7',
          opacity: active ? 1 : 0.85,
        }}
      >
        {children}
      </g>
    </g>
  )
}
