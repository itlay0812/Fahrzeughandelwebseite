import { defineConfig, loadEnv, type Plugin } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { SITE_URL, OEFFENTLICHE_SEITEN } from './src/app/seiten'

/* GitHub Pages kennt kein SPA-Routing: Jede öffentliche Seite bekommt eine
   eigene HTML-Datei (/kontakt → kontakt.html, HTTP 200), alle übrigen Pfade
   fängt die 404.html ab. Dazu die Sitemap aus derselben Seitenliste. */
function statischeSeiten(): Plugin {
  let outDir = 'dist'
  return {
    name: 'statische-seiten',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
      fs.writeFileSync(path.join(outDir, '404.html'), html)
      for (const seite of OEFFENTLICHE_SEITEN) {
        if (seite === '/') continue
        fs.writeFileSync(path.join(outDir, `${seite.slice(1)}.html`), html)
      }
      const urls = OEFFENTLICHE_SEITEN.map(
        (seite) => `  <url>\n    <loc>${SITE_URL}${seite}</loc>\n  </url>`,
      ).join('\n')
      fs.writeFileSync(
        path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const configuredBase = (env.VITE_BASE_PATH || '/').trim()
  const withLeadingSlash = configuredBase.startsWith('/')
    ? configuredBase
    : `/${configuredBase}`
  const base = withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`

  return {
    // STRATO-ready base path:
    // - root domain: VITE_BASE_PATH=/
    // - subfolder deploy: VITE_BASE_PATH=/app/
    base,
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
      statischeSeiten(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
