import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

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
