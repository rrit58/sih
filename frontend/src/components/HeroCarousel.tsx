import React, { useEffect, useRef, useState } from 'react'

type Props = {
  images: string[]
  interval?: number
}

export default function HeroCarousel({ images, interval = 4000 }: Props) {
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const timer = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isPlaying) return
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, interval)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [isPlaying, interval, images.length])

  // Pause on hover
  const handleMouseEnter = () => setIsPlaying(false)
  const handleMouseLeave = () => setIsPlaying(true)

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length)
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length])

  // Simple drag support
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let startX: number | null = null
    let delta = 0

    const onDown = (e: PointerEvent) => {
      el.setPointerCapture(e.pointerId)
      startX = e.clientX
      setIsPlaying(false)
      el.classList.add('grabbing')
    }
    const onMove = (e: PointerEvent) => {
      if (startX == null) return
      delta = e.clientX - startX
    }
    const onUp = (e: PointerEvent) => {
      try { el.releasePointerCapture(e.pointerId) } catch {}
      el.classList.remove('grabbing')
      if (Math.abs(delta) > 50) {
        if (delta > 0) setIndex((i) => (i - 1 + images.length) % images.length)
        else setIndex((i) => (i + 1) % images.length)
      }
      startX = null
      delta = 0
      setIsPlaying(true)
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)

    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [images.length])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-0 overflow-hidden rounded-2xl cursor-grab"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-roledescription="carousel"
    >
      <div className="absolute inset-0 flex transition-transform duration-700" style={{ transform: `translateX(-${index * 100}%)` }}>
        {images.map((src, i) => {
          const isVideo = typeof src === 'string' && src.toLowerCase().endsWith('.mp4')
          return (
            <div key={i} className="w-full flex-shrink-0 h-full">
              {isVideo ? (
                <video
                  src={src}
                  className="w-full h-full object-contain object-center bg-transparent"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label={`Slide ${i + 1} video`}
                />
              ) : (
                <img
                  src={src}
                  alt={`Slide ${i + 1}`}
                  className="w-full h-full object-contain object-center block bg-transparent"
                  loading="lazy"
                />
              )}
            </div>
          )
        })}
      </div>

      {/* indicators */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex items-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 w-8 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}
