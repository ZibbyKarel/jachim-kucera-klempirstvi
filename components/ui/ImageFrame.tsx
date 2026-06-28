import Image from 'next/image'

interface ImageFrameProps {
  src: string
  alt: string
  /** poměr stran, např. "4/3", "16/9", "3/4" */
  aspect?: string
  className?: string
  sizes?: string
  priority?: boolean
  /** sépiový/grain overlay, který při hoveru mizí */
  aged?: boolean
  rounded?: boolean
}

/**
 * Rámeček pro fotku realizace.
 *
 * Reálné fotky nejsou součástí zadání — komponenta proto vykresluje
 * architektonický placeholder se správným poměrem stran a `alt` textem.
 * Jakmile do `public{src}` přibude skutečný soubor, stačí odkomentovat
 * <Image> níže a placeholder se nahradí optimalizovaným obrázkem.
 */
export function ImageFrame({
  src,
  alt,
  aspect = '4/3',
  className = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  aged = true,
  rounded = true,
}: ImageFrameProps) {
  const hasRealAsset = false // přepni na true, až budou fotky v /public

  return (
    <div
      className={`group relative overflow-hidden bg-wood-medium ${
        rounded ? 'rounded-sm' : ''
      } ${className}`}
      style={{ aspectRatio: aspect }}
    >
      {hasRealAsset ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className={`object-cover ${aged ? 'photo-aged' : ''}`}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center ${
            aged ? 'photo-aged' : ''
          }`}
          style={{
            background:
              'repeating-linear-gradient(135deg, #2C1F14 0 22px, #271a10 22px 44px)',
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden="true"
            className="text-wood-warm opacity-70"
          >
            <path
              d="M4 24 20 8l16 16M8 22v10h24V22"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="max-w-[80%] font-body text-[0.65rem] uppercase tracking-widest text-cream/40">
            {alt}
          </span>
        </div>
      )}
    </div>
  )
}
