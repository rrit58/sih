import React, { useEffect, useState } from 'react'
import styles from './VideoPlayer.module.css'

interface Props {
  videoId: string
  title: string
  onClose: () => void
}

export default function VideoPlayer({ videoId, title, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Slight delay for animation entrance
    setIsVisible(true)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(), 300)
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div
      className={`${styles.backdrop} ${isVisible ? styles.visible : ''}`}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div className={`${styles.modal} ${isVisible ? styles.modalVisible : ''}`}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className={styles.closeBtn}
          aria-label="Close video player"
          title="Close (Esc)"
        >
          ✕
        </button>

        {/* Title */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>

        {/* Video container */}
        <div className={styles.videoContainer}>
          <iframe
            className={styles.iframe}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}
