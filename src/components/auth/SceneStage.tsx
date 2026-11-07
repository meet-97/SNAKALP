'use client'

import { useRef, type PointerEvent, type ReactNode } from 'react'

// Gives the scene a gentle 3D tilt that follows the mouse (desktop only)
export default function SceneStage({ children }: { children: ReactNode }) {
  const tiltRef = useRef<HTMLDivElement>(null)

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5

    if (tiltRef.current) {
      tiltRef.current.style.transform = `rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg)`
    }
  }

  function handleLeave() {
    if (tiltRef.current) tiltRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[520px]"
      style={{ perspective: '1100px' }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <div
        ref={tiltRef}
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>
    </div>
  )
}
