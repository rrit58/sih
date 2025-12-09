import React, { useEffect, useRef, useState } from 'react'

type Props = {
  images: string[]
  interval?: number
}

export default function GalleryCarousel({ images, interval = 3500 }: Props) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [slidesPerView, setSlidesPerView] = useState(4)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchDelta = useRef(0)
  const liveRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onResize() {
      const w = window.innerWidth
      // mobile: 1, tablet: 2, small desktop: 3, large desktop: 4
      if (w < 640) setSlidesPerView(1)
      else if (w < 900) setSlidesPerView(2)
      else if (w < 1100) setSlidesPerView(3)
      else setSlidesPerView(4)
    }

    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setIndex((v) => {
        const maxIndex = Math.max(0, images.length - slidesPerView)
        if (v >= maxIndex) return 0
        return v + 1
      })
    }, interval)
    return () => clearInterval(id)
  }, [images.length, slidesPerView, interval, paused])

  // announce slide changes for screen readers
  useEffect(() => {
    if (!liveRef.current) return
    const cur = index + 1
    const total = images.length
    liveRef.current.textContent = `Slide ${cur} of ${total}`
  }, [index, images.length])

  // keyboard left/right navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        setPaused(true)
        prev()
      } else if (e.key === 'ArrowRight') {
        setPaused(true)
        next()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slidesPerView, images.length])

  function prev() {
    setIndex((v) => Math.max(0, v - 1))
  }

  function next() {
    setIndex((v) => {
      const maxIndex = Math.max(0, images.length - slidesPerView)
      if (v >= maxIndex) return 0
      return v + 1
    })
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchDelta.current = 0
    setPaused(true)
  }

  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current == null) return
    touchDelta.current = e.touches[0].clientX - touchStartX.current
  }

  function onTouchEnd() {
    const delta = touchDelta.current
    touchStartX.current = null
    touchDelta.current = 0
    setPaused(false)
    if (Math.abs(delta) > 40) {
      if (delta > 0) prev()
      else next()
    }
  }

  // mouse drag for desktop
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let down = false
    let startX = 0
    let moved = 0

    function onDown(e: MouseEvent) {
      down = true
      startX = e.clientX
      moved = 0
      setPaused(true)
    }
    function onMove(e: MouseEvent) {
      if (!down) return
      moved = e.clientX - startX
    }
    function onUp() {
      if (!down) return
      down = false
      setPaused(false)
      if (Math.abs(moved) > 60) {
        if (moved > 0) prev()
        else next()
      }
    }

    el.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)

    return () => {
      el.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [images.length, slidesPerView])

  const maxIndex = Math.max(0, images.length - slidesPerView)
  const translatePercent = (index * 100) / slidesPerView

  return (
    <section className="bg-white rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Our Campaign </h2>
          <p className="text-sm text-slate-600">Captured moments from our awareness drives</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous"
            onClick={() => {
              setPaused(true)
              prev()
            }}
            className="h-10 w-10 rounded-md bg-white border border-slate-200 shadow-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#003B75]"
          >
            <svg className="h-5 w-5 text-slate-700" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button
            aria-label="Next"
            onClick={() => {
              setPaused(true)
              next()
            }}
            className="h-10 w-10 rounded-md bg-white border border-slate-200 shadow-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#003B75]"
          >
            <svg className="h-5 w-5 text-slate-700" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        role="region"
        aria-roledescription="carousel"
        aria-label="Gallery carousel"
        tabIndex={0}
        className="overflow-hidden"
      >
        <div className="flex gap-4 gallery-track flex-nowrap" style={{ transition: 'transform 600ms cubic-bezier(.2,.8,.2,1)' }}>
          {images.map((src, i) => (
            <div key={i} className={`flex-shrink-0 gallery-slide inline-block align-top`} aria-hidden={i < index || i >= index + slidesPerView ? 'true' : 'false'}>
              <div className="rounded-xl overflow-hidden shadow-sm bg-white">
                <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-40 sm:h-48 md:h-56 lg:h-60 object-cover transition-transform duration-300 hover:scale-105" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        {/* small indicators */}
        {Array.from({ length: Math.max(1, images.length - slidesPerView + 1) }).map((_, i) => (
          <button
            key={i}
            onClick={() => { setIndex(i); setPaused(true); }}
            className={`h-2.5 w-8 rounded-full ${i === index ? 'bg-[#003B75]' : 'bg-slate-200'} focus:outline-none`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="sr-only" aria-live="polite" ref={liveRef} />

      <style>{`
        .gallery-track { transform: translateX(-${translatePercent}%); display:flex; flex-wrap:nowrap; }
        .gallery-slide { display:inline-block; width: calc(100% / ${slidesPerView}); vertical-align:top; }
      `}</style>
    </section>
  )
}
