'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { prefersReducedMotion } from '@/lib/gsap'

const MAX_DEG = 18
const LERP = 0.055

/**
 * Pseudo-3D rotace domu kolem osy Y.
 * Sdílená logika pro desktop (mousemove), mobil (touchmove + inertia)
 * a progresivní vylepšení přes DeviceOrientation (gyroskop).
 *
 * Vrací `enableGyro` — funkci, kterou je potřeba zavolat z user gesta
 * (kvůli iOS `requestPermission`).
 */
export function useHouseRotation(targetRef: RefObject<HTMLElement | SVGElement>) {
  const enableGyroRef = useRef<() => void>(() => {})

  useEffect(() => {
    const el = targetRef.current
    if (!el || prefersReducedMotion()) return

    const state = { target: 0, current: 0 }
    let velocity = 0
    let lastTouchX: number | null = null
    let lastTouchTime = 0
    let inertiaActive = false
    let rafId = 0

    const clamp = (v: number) => Math.max(-MAX_DEG, Math.min(MAX_DEG, v))
    const fromRatio = (ratio: number) => clamp((ratio - 0.5) * 2 * MAX_DEG)

    /* ----- Desktop: pohyb myši ----- */
    const onMouseMove = (e: MouseEvent) => {
      inertiaActive = false
      state.target = fromRatio(e.clientX / window.innerWidth)
    }

    /* ----- Mobil: dotyk ----- */
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      inertiaActive = false
      const now = performance.now()
      state.target = fromRatio(touch.clientX / window.innerWidth)
      if (lastTouchX !== null) {
        const dt = Math.max(now - lastTouchTime, 1)
        velocity = ((touch.clientX - lastTouchX) / window.innerWidth) * MAX_DEG * 2 * (16 / dt)
      }
      lastTouchX = touch.clientX
      lastTouchTime = now
    }

    const onTouchEnd = () => {
      lastTouchX = null
      inertiaActive = true
    }

    /* ----- Progresivní: gyroskop ----- */
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null) return
      inertiaActive = false
      // gamma -90..90 → mapuj na -MAX..MAX
      state.target = clamp((e.gamma / 90) * MAX_DEG)
    }

    enableGyroRef.current = () => {
      const DOE = window.DeviceOrientationEvent as
        | (typeof DeviceOrientationEvent & {
            requestPermission?: () => Promise<'granted' | 'denied'>
          })
        | undefined
      if (!DOE) return
      if (typeof DOE.requestPermission === 'function') {
        DOE.requestPermission()
          .then((res) => {
            if (res === 'granted')
              window.addEventListener('deviceorientation', onOrientation)
          })
          .catch(() => {
            /* tichý fallback na drag */
          })
      } else {
        window.addEventListener('deviceorientation', onOrientation)
      }
    }

    /* ----- rAF lerp smyčka ----- */
    const tick = () => {
      if (inertiaActive && Math.abs(velocity) > 0.1) {
        state.target = clamp(state.target + velocity)
        velocity *= 0.92
      } else if (inertiaActive) {
        inertiaActive = false
      }
      state.current += (state.target - state.current) * LERP
      el.style.transform = `rotateY(${state.current.toFixed(2)}deg)`
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('deviceorientation', onOrientation)
    }
  }, [targetRef])

  return { enableGyro: () => enableGyroRef.current() }
}
