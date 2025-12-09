import React, { useRef } from 'react'
import styles from './VideoCarousel.module.css'

interface Props {
  children: React.ReactNode
}

export default function VideoCarousel({ children }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null)

  const scroll = (direction: 'left' | 'right') => {
    const el = trackRef.current
    if (!el) return

    const scrollAmount = el.clientWidth * 0.75 // Scroll 75% of visible width
    el.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <div className={styles.carouselWrapper}>
      {/* Left arrow button */}
      <button
        aria-label="Scroll carousel left"
        onClick={() => scroll('left')}
        className={styles.arrowBtn}
        style={{ left: 0 }}
      >
        ‹
      </button>

      {/* Video track */}
      <div ref={trackRef} className={styles.track}>
        {children}
      </div>

      {/* Right arrow button */}
      <button
        aria-label="Scroll carousel right"
        onClick={() => scroll('right')}
        className={styles.arrowBtn}
        style={{ right: 0 }}
      >
        ›
      </button>
    </div>
  )
}
