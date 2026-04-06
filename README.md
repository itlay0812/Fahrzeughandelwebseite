
  # Fahrzeughandel Landingpage

  This is a code bundle for Fahrzeughandel Landingpage. The original project is available at https://www.figma.com/design/k1ocfhDzc7mFViRRd06cjA/Fahrzeughandel-Landingpage.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Deploy to GitHub Pages

  This project uses a GitHub Actions workflow (`.github/workflows/deploy.yml`) to build and deploy the `dist` folder.

  1. Push your branch to `main`.
  2. In GitHub: `Settings` -> `Pages` -> `Build and deployment`.
  3. Set `Source` to `GitHub Actions`.

  Important: Do not deploy the repository root directly. GitHub Pages must serve the Vite build output (`dist`), otherwise the page tries to load `/src/main.tsx` and shows a white screen.
  