import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'
import { SITE_URL } from '../src/app/seiten'
import { projectId, publicAnonKey } from '../utils/supabase/info'

/* Ersatz für die Google-Bewertungen, falls Supabase einmal nicht erreichbar
   ist: Beim Build wird der aktuelle Stand als dist/bewertungen.json abgelegt.
   Liefert Supabase nichts, wird die Datei übernommen, die gerade live ist –
   so bleibt immer der letzte bekannte Stand erhalten. */
export function bewertungenStand(): Plugin {
  let outDir = 'dist'
  return {
    name: 'bewertungen-stand',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const quellen: [string, RequestInit][] = [
        [
          `https://${projectId}.supabase.co/functions/v1/make-server-004f047d/bewertungen`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } },
        ],
        [`${SITE_URL}/bewertungen.json`, {}],
      ]

      for (const [url, init] of quellen) {
        try {
          const antwort = await fetch(url, { ...init, signal: AbortSignal.timeout(8000) })
          if (!antwort.ok) continue
          const daten = await antwort.json()
          if (!daten?.ok || !Array.isArray(daten.reviews) || daten.reviews.length === 0) continue
          fs.writeFileSync(path.join(outDir, 'bewertungen.json'), JSON.stringify(daten))
          console.log(`\n✓ Bewertungen-Stand gesichert (${daten.reviews.length} Texte, Quelle: ${new URL(url).host})`)
          return
        } catch {
          /* Nächste Quelle versuchen. */
        }
      }
      /* Ohne Stand trotzdem eine Datei ablegen: Die Seite zeigt dann den
         Leerzustand, und die Browser-Konsole meldet keinen 404. */
      fs.writeFileSync(
        path.join(outDir, 'bewertungen.json'),
        JSON.stringify({ ok: false, reason: 'kein-stand' }),
      )
      console.log('\n– Kein Bewertungen-Stand verfügbar, leere Ersatzdatei abgelegt.')
    },
  }
}
