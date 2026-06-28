'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import type { Project, ProjectCategory } from '@/lib/types'
import { ImageFrame } from './ImageFrame'

const categoryLabels: Record<ProjectCategory, string> = {
  tesarstvi: 'Tesařství',
  pokryvacstvi: 'Pokrývačství',
  klempirstvi: 'Klempířství',
}

type Filter = ProjectCategory | 'vse'

export function ProjectGallery({
  projects,
  enableFilter = true,
}: {
  projects: Project[]
  enableFilter?: boolean
}) {
  const t = useTranslations('projects')
  const [filter, setFilter] = useState<Filter>('vse')
  const [selected, setSelected] = useState<Project | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const visible =
    filter === 'vse' ? projects : projects.filter((p) => p.category === filter)

  // Animace přechodu mezi filtry.
  useEffect(() => {
    const grid = gridRef.current
    if (!grid || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-project-card]',
        { opacity: 0, scale: 0.96, y: 16 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
        }
      )
    }, gridRef)
    return () => ctx.revert()
  }, [filter])

  const filters: { key: Filter; label: string }[] = [
    { key: 'vse', label: t('filterAll') },
    { key: 'tesarstvi', label: categoryLabels.tesarstvi },
    { key: 'pokryvacstvi', label: categoryLabels.pokryvacstvi },
    { key: 'klempirstvi', label: categoryLabels.klempirstvi },
  ]

  return (
    <div>
      {enableFilter && (
        <div
          role="tablist"
          aria-label="Filtr realizací"
          className="mb-10 flex flex-wrap gap-3"
        >
          {filters.map((f) => {
            const active = filter === f.key
            return (
              <button
                key={f.key}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.key)}
                className={`rounded-full border px-5 py-2 font-body text-xs uppercase tracking-widest transition-colors duration-300 ${
                  active
                    ? 'border-wood-amber bg-wood-amber text-wood-dark'
                    : 'border-cream/20 text-cream/70 hover:border-cream/50 hover:text-cream'
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      )}

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((project, i) => (
          <article
            key={project.id}
            data-project-card
            className={
              // jemný masonry rytmus — každá třetí karta vyšší
              i % 5 === 0 ? 'sm:row-span-2' : ''
            }
          >
            <button
              onClick={() => setSelected(project)}
              className="group block w-full text-left"
              aria-label={`${project.title}, ${project.location} ${project.year} — zobrazit detail`}
            >
              <ImageFrame
                src={project.thumbnail}
                alt={`${project.title} — ${project.location}`}
                aspect={i % 5 === 0 ? '3/4' : '4/3'}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="mt-3 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl italic text-cream transition-colors group-hover:text-wood-amber">
                  {project.title}
                </h3>
                <span className="shrink-0 font-body text-xs uppercase tracking-widest text-cream/40">
                  {project.year}
                </span>
              </div>
              <p className="mt-1 font-body text-xs uppercase tracking-widest text-wood-light">
                {categoryLabels[project.category]} · {project.location}
              </p>
            </button>
          </article>
        ))}
      </div>

      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const t = useTranslations('projects')
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <button
        className="absolute inset-0 bg-wood-dark/90 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Zavřít detail"
        tabIndex={-1}
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="animate-fade-up relative z-10 max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-sm border border-cream/10 bg-wood-medium p-6 outline-none md:p-10"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream transition-colors hover:border-wood-amber hover:text-wood-amber"
          aria-label="Zavřít"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M3 3l10 10M13 3 3 13"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <span className="eyebrow">
          {categoryLabels[project.category]} · {project.location} · {project.year}
        </span>
        <h2 className="mt-3 font-display text-4xl italic text-cream">
          {project.title}
        </h2>
        <p className="mt-4 max-w-2xl font-body text-sm leading-relaxed text-cream/70">
          {project.description}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {project.images.map((img, i) => (
            <ImageFrame
              key={img}
              src={img}
              alt={`${project.title} — foto ${i + 1}`}
              aspect="4/3"
              aged={false}
            />
          ))}
        </div>

        <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-3 border-t border-cream/10 pt-6 font-body text-sm">
          <div>
            <dt className="text-xs uppercase tracking-widest text-cream/40">
              {t('location')}
            </dt>
            <dd className="mt-1 text-cream">{project.location}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-cream/40">
              {t('year')}
            </dt>
            <dd className="mt-1 text-cream">{project.year}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
