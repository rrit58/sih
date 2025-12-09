/**
 * YouTube Data API v3 utilities
 * Fetches playlist videos and metadata with proper error handling
 */

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  tag: string
}

/**
 * Convert ISO8601 duration to human-readable format (e.g., "PT1H30M45S" -> "1:30:45")
 */
export function convertISO8601Duration(iso8601Duration: string): string {
  if (!iso8601Duration || iso8601Duration === 'PT0S') return '0:00'

  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  const matches = iso8601Duration.match(regex)

  if (!matches) return '0:00'

  const hours = parseInt(matches[1] || '0', 10)
  const minutes = parseInt(matches[2] || '0', 10)
  const seconds = parseInt(matches[3] || '0', 10)

  const paddedMinutes = (minutes || 0).toString().padStart(2, '0')
  const paddedSeconds = (seconds || 0).toString().padStart(2, '0')

  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`
  }

  return `${paddedMinutes}:${paddedSeconds}`
}

/**
 * Fetch videos from a YouTube playlist using the YouTube Data API v3
 * Steps:
 * 1. Get playlist items (which contain video IDs)
 * 2. Batch fetch video details (thumbnail, duration, tags)
 * @param playlistId - YouTube Playlist ID
 * @param apiKey - YouTube Data API key
 * @param maxResults - Number of videos to fetch (default 15, max 50)
 */
export async function fetchYouTubePlaylistVideos(
  playlistId: string,
  apiKey: string,
  maxResults: number = 15
): Promise<YouTubeVideo[]> {
  if (!playlistId || !apiKey) {
    throw new Error('Missing YouTube API key or Playlist ID')
  }

  try {
    // Step 1: Fetch playlist items (get video IDs)
    const playlistItemsUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
    playlistItemsUrl.searchParams.set('key', apiKey)
    playlistItemsUrl.searchParams.set('playlistId', playlistId)
    playlistItemsUrl.searchParams.set('part', 'contentDetails,snippet')
    playlistItemsUrl.searchParams.set('maxResults', String(Math.min(maxResults, 50)))

    const playlistResponse = await fetch(playlistItemsUrl.toString())
    if (!playlistResponse.ok) {
      const error = await playlistResponse.json()
      throw new Error(
        error?.error?.message || `YouTube API error: ${playlistResponse.status}`
      )
    }

    const playlistData = await playlistResponse.json()
    const items = playlistData.items || []

    if (items.length === 0) {
      throw new Error('No videos found in this playlist')
    }

    // Extract video IDs
    const videoIds = items
      .map((item: any) => item.contentDetails?.videoId)
      .filter(Boolean)

    if (videoIds.length === 0) {
      throw new Error('Could not extract video IDs from playlist')
    }

    // Step 2: Batch fetch video details (in chunks of 50, YouTube API limit)
    const videos: YouTubeVideo[] = []
    const chunkSize = 50

    for (let i = 0; i < videoIds.length; i += chunkSize) {
      const chunk = videoIds.slice(i, i + chunkSize)
      const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos')
      videosUrl.searchParams.set('key', apiKey)
      videosUrl.searchParams.set('id', chunk.join(','))
      videosUrl.searchParams.set('part', 'snippet,contentDetails')

      const videosResponse = await fetch(videosUrl.toString())
      if (!videosResponse.ok) {
        const error = await videosResponse.json()
        throw new Error(
          error?.error?.message || `YouTube API error: ${videosResponse.status}`
        )
      }

      const videosData = await videosResponse.json()
      const videosList = videosData.items || []

      videosList.forEach((video: any) => {
        const tags = video.snippet?.tags || []
        videos.push({
          id: video.id,
          title: video.snippet?.title || 'Untitled',
          description: video.snippet?.description || '',
          thumbnail:
            video.snippet?.thumbnails?.medium?.url ||
            video.snippet?.thumbnails?.default?.url ||
            '',
          duration: convertISO8601Duration(video.contentDetails?.duration || 'PT0S'),
          tag: tags.length > 0 ? tags[0] : 'Video',
        })
      })
    }

    return videos
  } catch (error) {
    console.error('Error fetching YouTube playlist:', error)
    throw error
  }
}

/**
 * Validate YouTube Playlist ID format (usually 34 characters starting with PL, UU, RD, or OL)
 */
export function isValidPlaylistId(playlistId: string): boolean {
  // Basic validation: YouTube playlist IDs are typically 34 chars and start with specific prefixes
  return /^[A-Za-z0-9_-]{34,}$/.test(playlistId)
}
