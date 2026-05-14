import { SOUNDCLOUD_TRACKS_PAGE_URL } from './soundcloudConfig.js'

const RSS2JSON = 'https://api.rss2json.com/v1/api.json'

function userIdFromOembedHtml(html) {
  const m = html?.match(/api\.soundcloud\.com%2Fusers%2F(\d+)/)
  return m ? m[1] : null
}

function trackIdFromGuid(guid) {
  const m = String(guid ?? '').match(/tracks\/(\d+)/)
  return m ? m[1] : null
}

/**
 * Loads public tracks from SoundCloud in the browser (no deploy needed).
 * Uses oEmbed (CORS *) + rss2json (JSON, browser-usable) because the raw RSS feed is not fetchable cross-origin.
 */
export async function fetchSoundcloudTracksLive(options = {}) {
  const { signal } = options

  const oembedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(SOUNDCLOUD_TRACKS_PAGE_URL)}`
  const oembedRes = await fetch(oembedUrl, { signal })
  if (!oembedRes.ok) throw new Error(`SoundCloud oEmbed failed (${oembedRes.status})`)
  const oembed = await oembedRes.json()
  const userId = userIdFromOembedHtml(oembed.html)
  if (!userId) throw new Error('Could not read SoundCloud user id from oEmbed')

  const rssBase = `https://feeds.soundcloud.com/users/soundcloud:users:${userId}/sounds.rss`
  const tracks = []
  const seen = new Set()
  let rssPageUrl = rssBase
  const maxPages = 40

  for (let page = 0; page < maxPages && rssPageUrl; page++) {
    const rss2Url = `${RSS2JSON}?rss_url=${encodeURIComponent(rssPageUrl)}&_=${Date.now()}`
    const rssRes = await fetch(rss2Url, { signal })
    if (!rssRes.ok) throw new Error(`Track feed proxy failed (${rssRes.status})`)
    const data = await rssRes.json()
    if (data.status !== 'ok') throw new Error(data.message || 'Track feed returned an error')
    const items = data.items
    if (!Array.isArray(items) || items.length === 0) break

    const countBeforePage = tracks.length
    for (const item of items) {
      const link = item.link
      const title = item.title
      if (link && title && !seen.has(link)) {
        seen.add(link)
        tracks.push({ id: link, title, url: link })
      }
    }
    if (tracks.length === countBeforePage) break

    const last = items[items.length - 1]
    const beforeId = trackIdFromGuid(last.guid)
    if (!beforeId) break
    const nextPage = `${rssBase}?before=${beforeId}`
    rssPageUrl = nextPage === rssPageUrl ? null : nextPage
  }

  return tracks
}
