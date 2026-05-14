import fs from 'node:fs/promises'
import path from 'node:path'
import { SOUNDCLOUD_TRACKS_PAGE_URL } from '../src/lib/soundcloudConfig.js'

function decodeXmlEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
}

function firstTextTag(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const m = block.match(re)
  if (!m) return ''
  return decodeXmlEntities(m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1').trim())
}

function parseRssPage(xml) {
  const pageItems = []
  const itemRe = /<item\b[^>]*>([\s\S]*?)<\/item>/gi
  let im
  while ((im = itemRe.exec(xml)) !== null) {
    const block = im[1]
    const title = firstTextTag(block, 'title')
    const link = firstTextTag(block, 'link')
    const pubDate = firstTextTag(block, 'pubDate')
    if (title && link) pageItems.push({ title, link, pubDate })
  }
  const nextHref =
    xml.match(/<atom:link[^>]+href="([^"]+)"[^>]*rel="next"/i)?.[1] ||
    xml.match(/<atom:link[^>]+rel="next"[^>]*href="([^"]+)"/i)?.[1] ||
    null
  return { pageItems, nextUrl: nextHref }
}

export async function fetchSoundcloudTracksFromRss() {
  const oembedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(
    SOUNDCLOUD_TRACKS_PAGE_URL,
  )}`
  const oembedRes = await fetch(oembedUrl)
  if (!oembedRes.ok) throw new Error(`SoundCloud oEmbed failed (${oembedRes.status})`)
  const oembed = await oembedRes.json()
  const m = oembed.html?.match(/api\.soundcloud\.com%2Fusers%2F(\d+)/)
  if (!m) throw new Error('Could not read SoundCloud user id from oEmbed response')
  const userId = m[1]

  let url = `https://feeds.soundcloud.com/users/soundcloud:users:${userId}/sounds.rss`
  const tracks = []
  const seen = new Set()
  const maxPages = 40

  for (let page = 0; page < maxPages && url; page++) {
    const rssRes = await fetch(url)
    if (!rssRes.ok) throw new Error(`SoundCloud RSS failed (${rssRes.status})`)
    const xml = await rssRes.text()
    const { pageItems, nextUrl } = parseRssPage(xml)
    for (const it of pageItems) {
      if (!seen.has(it.link)) {
        seen.add(it.link)
        tracks.push({ id: it.link, title: it.title, url: it.link, pubDate: it.pubDate })
      }
    }
    url = nextUrl && nextUrl !== url ? nextUrl : null
  }

  return tracks
}

function attachMiddleware(server) {
  server.middlewares.use(async (req, res, next) => {
    const p = req.url?.split('?')[0] ?? ''
    if (p !== '/api/soundcloud-tracks') return next()
    if (req.method !== 'GET') return next()
    try {
      const tracks = await fetchSoundcloudTracksFromRss()
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({ tracks }))
    } catch (err) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(
        JSON.stringify({
          error: err instanceof Error ? err.message : 'Failed to load SoundCloud tracks',
        }),
      )
    }
  })
}

export function soundcloudTracksPlugin() {
  /** @type {import('vite').ResolvedConfig | null} */
  let resolvedConfig = null

  return {
    name: 'soundcloud-tracks',
    configResolved(config) {
      resolvedConfig = config
    },
    configureServer(server) {
      attachMiddleware(server)
    },
    configurePreviewServer(server) {
      attachMiddleware(server)
    },
    async closeBundle() {
      if (!resolvedConfig) return
      const outDir = resolvedConfig.build.outDir
      const tracks = await fetchSoundcloudTracksFromRss()
      await fs.mkdir(outDir, { recursive: true })
      await fs.writeFile(
        path.join(outDir, 'soundcloud-tracks.json'),
        JSON.stringify({ tracks }, null, 0),
        'utf8',
      )
    },
  }
}
