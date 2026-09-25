import fs from 'fs'
import http from 'http'
import path from 'path'
import type { AddressInfo } from 'net'
import type { Plugin } from 'vite'
import { SITE_URL, OEFFENTLICHE_SEITEN } from '../src/app/seiten'

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
}

/* GitHub Pages kennt kein SPA-Routing: Jede öffentliche Seite bekommt eine
   eigene HTML-Datei (/kontakt → kontakt.html, HTTP 200), alle übrigen Pfade
   fängt die 404.html ab. Die öffentlichen Seiten werden anschließend im
   Browser vorgerendert, damit Crawler ohne JavaScript Text und Meta-Tags
   sehen. Dazu die Sitemap aus derselben Seitenliste.
   PRERENDER=0 überspringt das Vorrendern (z. B. ohne installiertes Chromium). */
export function statischeSeiten(): Plugin {
  let outDir = 'dist'
  return {
    name: 'statische-seiten',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
      fs.writeFileSync(path.join(outDir, '404.html'), html)
      for (const seite of OEFFENTLICHE_SEITEN) {
        fs.writeFileSync(dateiFuer(outDir, seite), html)
      }

      const urls = OEFFENTLICHE_SEITEN.map(
        (seite) => `  <url>\n    <loc>${SITE_URL}${seite}</loc>\n  </url>`,
      ).join('\n')
      fs.writeFileSync(
        path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      )

      if (process.env.PRERENDER !== '0') await vorrendern(outDir)
    },
  }
}

function dateiFuer(outDir: string, seite: string) {
  return path.join(outDir, seite === '/' ? 'index.html' : `${seite.slice(1)}.html`)
}

/* Liefert dist so aus wie GitHub Pages: /kontakt → kontakt.html, sonst 404.html. */
function starteServer(outDir: string) {
  const server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url ?? '/', 'http://localhost')
    let datei = path.join(outDir, decodeURIComponent(pathname))
    if (pathname === '/') datei = path.join(outDir, 'index.html')
    else if (!path.extname(datei)) datei += '.html'
    if (!datei.startsWith(outDir) || !fs.existsSync(datei)) {
      res.statusCode = 404
      datei = path.join(outDir, '404.html')
    }
    res.setHeader('Content-Type', MIME[path.extname(datei)] ?? 'application/octet-stream')
    fs.createReadStream(datei).pipe(res)
  })
  return new Promise<http.Server>((resolve) =>
    server.listen(0, '127.0.0.1', () => resolve(server)),
  )
}

async function vorrendern(outDir: string) {
  const { chromium } = await import('playwright')
  const server = await starteServer(outDir)
  const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
  const browser = await chromium.launch()

  try {
    /* Reduzierte Bewegung: kein Scroll-Intro, die Startseite zeigt direkt den Hero. */
    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
      reducedMotion: 'reduce',
    })
    const ergebnisse: [string, string][] = []

    for (const seite of OEFFENTLICHE_SEITEN) {
      await page.goto(`${origin}${seite}`, { waitUntil: 'networkidle' })
      await page.waitForSelector('link[rel="canonical"][data-rh]', { state: 'attached' })

      /* Einmal durchscrollen, damit whileInView-Animationen ihren Endzustand erreichen. */
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y)
          await new Promise((r) => setTimeout(r, 60))
        }
        window.scrollTo(0, 0)
      })
      await page.waitForTimeout(800)

      const vorab = await page.evaluate(() => {
        /* Markiert den vorgerenderten Inhalt; index.html blendet ihn für
           Besucher mit JavaScript aus, bis React übernimmt. */
        document.getElementById('root')?.firstElementChild?.setAttribute('data-vorab', '')
        document.documentElement.classList.remove('js')
        return `<!DOCTYPE html>\n${document.documentElement.outerHTML}`
      })
      if (vorab.includes(origin)) {
        throw new Error(`Vorgerendertes HTML für ${seite} enthält die lokale Adresse ${origin}.`)
      }
      ergebnisse.push([seite, vorab])
    }

    for (const [seite, vorab] of ergebnisse) {
      fs.writeFileSync(dateiFuer(outDir, seite), vorab)
    }
    console.log(`\n✓ ${ergebnisse.length} Seiten vorgerendert`)
  } finally {
    await browser.close()
    server.close()
  }
}
