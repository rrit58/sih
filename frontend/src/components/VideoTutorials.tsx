import React, { useEffect, useRef, useState } from 'react'
import VideoCarousel from './VideoCarousel'
import VideoPlayer from './VideoPlayer'
import styles from './VideoTutorials.module.css'
import { fetchYouTubePlaylistVideos, YouTubeVideo } from '../utils/youtubeApi'

export default function VideoTutorials() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
  const videoTrackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true)
        setError(null)

        const apiKey = import.meta.env.VITE_YT_API_KEY
        const playlistId = import.meta.env.VITE_YT_PLAYLIST_ID


        if (!apiKey || !playlistId) {
          setError(
            'YouTube API configuration is missing. Please set VITE_YT_API_KEY and VITE_YT_PLAYLIST_ID in your .env file.'
          )
          setLoading(false)
          return
        }

        const fetchedVideos = await fetchYouTubePlaylistVideos(playlistId, apiKey, 15)
        setVideos(fetchedVideos)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load videos'
        setError(errorMsg)
        console.error('Error loading YouTube videos:', err)
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [])

  if (error) {
    return (
      <section aria-labelledby="video-tutorials" className={styles.section}>
        <div className={styles.header}>
          <div>
            <h2 id="video-tutorials" className={styles.title}>
              Video Tutorials
            </h2>
            <p className={styles.subtitle}>
              Watch step-by-step tutorials to understand DBT, Aadhaar Linking, NPCI Seeding, and Scholarships.
            </p>
          </div>
        </div>
        <div className={styles.errorBox}>
          <p className={styles.errorTitle}>Unable to Load Videos</p>
          <p className={styles.errorMessage}>{error}</p>
          <details className={styles.errorDetails}>
            <summary>Setup Instructions</summary>
            <p>
              Please ensure you have set the following in your <code>.env</code> file:
            </p>
            <ul>
              <li>
                <code>VITE_YT_API_KEY</code> - Your YouTube Data API key
              </li>
              <li>
                <code>VITE_YT_PLAYLIST_ID</code> - Your YouTube Playlist ID
              </li>
            </ul>
            <p>
              After adding these values, restart the development server and refresh the page.
            </p>
          </details>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section aria-labelledby="video-tutorials" className={styles.section}>
        <div className={styles.header}>
          <div>
            <h2 id="video-tutorials" className={styles.title}>
              Video Tutorials
            </h2>
            <p className={styles.subtitle}>
              Watch step-by-step tutorials to understand DBT, Aadhaar Linking, NPCI Seeding, and Scholarships.
            </p>
          </div>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading videos...</p>
        </div>
      </section>
    )
  }

  if (videos.length === 0) {
    return (
      <section aria-labelledby="video-tutorials" className={styles.section}>
        <div className={styles.header}>
          <div>
            <h2 id="video-tutorials" className={styles.title}>
              Video Tutorials
            </h2>
            <p className={styles.subtitle}>
              Watch step-by-step tutorials to understand DBT, Aadhaar Linking, NPCI Seeding, and Scholarships.
            </p>
          </div>
        </div>
        <div className={styles.emptyState}>
          <p>No videos found in the playlist.</p>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="video-tutorials" className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 id="video-tutorials" className={styles.title}>
            Video Tutorials
          </h2>
          <p className={styles.subtitle}>
            Watch step-by-step tutorials to understand DBT, Aadhaar Linking, NPCI Seeding, and Scholarships.
          </p>
        </div>
      </div>

      <VideoCarousel>
        {videos.map((video) => (
          <article
            key={video.id}
            className={styles.videoCard}
            role="listitem"
          >
            <div className={styles.thumbnailContainer}>
              <img
                src={video.thumbnail}
                alt={video.title}
                className={styles.thumbnail}
              />
              <button
                onClick={() => setSelectedVideo(video)}
                className={styles.playButton}
                aria-label={`Play video: ${video.title}`}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                </svg>
              </button>
              <span className={styles.duration}>{video.duration}</span>
            </div>

            <div className={styles.cardContent}>
              <span className={styles.tag}>{video.tag}</span>
              <h3 className={styles.videoTitle}>{video.title}</h3>
            </div>
          </article>
        ))}
      </VideoCarousel>

      {/* Video player modal */}
      {selectedVideo && (
        <VideoPlayer
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </section>
  )
}
