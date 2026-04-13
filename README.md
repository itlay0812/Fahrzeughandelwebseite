
  # Fahrzeughandel Landingpage

  This is a code bundle for Fahrzeughandel Landingpage. The original project is available at https://www.figma.com/design/k1ocfhDzc7mFViRRd06cjA/Fahrzeughandel-Landingpage.

  ## Running the code

  Run `npm i` to install the dependencies.

  Create a `.env` file based on `.env.example` and set your EmailJS values.

  Run `npm run dev` to start the development server.

  ## EmailJS setup for inquiry notifications

  The app sends an email notification for each new inquiry from:
  - car detail inquiry modal
  - contact page (search request and sell request)

  Required environment variables:
  - `VITE_EMAILJS_SERVICE_ID`
  - `VITE_EMAILJS_TEMPLATE_ID`
  - `VITE_EMAILJS_PUBLIC_KEY`
  - `VITE_INQUIRY_RECEIVER_EMAIL`

  EmailJS template params used by the app:
  - `to_email`
  - `inquiry_type`
  - `subject`
  - `name`
  - `email`
  - `phone`
  - `message`
  - `car_name`
  - `car_year`
  - `car_price`
  - `availability`
  - `submitted_at`

  ## Deploy to GitHub Pages

  This project uses a GitHub Actions workflow (`.github/workflows/deploy.yml`) to build and deploy the `dist` folder.

  1. Push your branch to `main`.
  2. In GitHub: `Settings` -> `Pages` -> `Build and deployment`.
  3. Set `Source` to `GitHub Actions`.

  Important: Do not deploy the repository root directly. GitHub Pages must serve the Vite build output (`dist`), otherwise the page tries to load `/src/main.tsx` and shows a white screen.
  