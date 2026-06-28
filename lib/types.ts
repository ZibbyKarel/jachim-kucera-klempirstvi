export type ServiceSlug =
  | 'tesarstvi'
  | 'pokryvacstvi'
  | 'klempirstvi'
  | 'cisteni-strech'

export type ProjectCategory = 'tesarstvi' | 'pokryvacstvi' | 'klempirstvi'

export interface ServiceWorkItem {
  /** Pořadové číslo zobrazené velkým fontem (01, 02, …). */
  number: string
  title: string
  description: string
}

export interface Service {
  slug: ServiceSlug
  /** Skupina v SVG domě, na kterou služba navazuje (#g-…). */
  houseGroup: string
  title: string
  /** Krátký tagline pod nadpisem na kartě. */
  tagline: string
  /** Dvě–tři věty na homepage kartě. */
  shortDescription: string
  /** Plné odstavce na detailní stránce. */
  longDescription: string[]
  /** Velké číslované položky „Co zahrnuje". */
  workItems: ServiceWorkItem[]
  /** Hero obrázek detailní stránky. */
  heroImage: string
  /** Galerie na detailní stránce. */
  gallery: { src: string; alt: string }[]
  seo: {
    title: string
    description: string
  }
}

export interface Project {
  id: string
  title: string
  category: ProjectCategory
  location: string
  year: number
  description: string
  images: string[]
  thumbnail: string
}

export interface HouseLabel {
  id: string
  /** Krátký nadpis (název sekce). */
  text: string
  /** Podtitulek — typ služby. */
  subtext: string
  /** Pozice v procentech vůči wrapperu. */
  position: { x: string; y: string }
  groupId: string
  href: string
}

export interface TimelineMilestone {
  year: string
  title: string
  description: string
}

export interface CompanyValue {
  title: string
  description: string
}
