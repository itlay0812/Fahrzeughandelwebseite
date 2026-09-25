import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { ADMIN_ROUTE_SEGMENT } from "./adminRoute";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

/* Alte Links aus der Hash-Zeit (/#/kontakt) auf echte Pfade umbiegen. */
if (window.location.hash.startsWith("#/")) {
  const ziel = window.location.hash.slice(2);
  window.history.replaceState(null, "", `${import.meta.env.BASE_URL}${ziel}`);
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      {
        path: "bestand",
        lazy: async () => ({ Component: (await import("./components/Inventory")).Inventory }),
      },
      {
        path: "kontakt",
        lazy: async () => ({ Component: (await import("./components/Contact")).Contact }),
      },
      {
        path: "ueber-uns",
        lazy: async () => ({ Component: (await import("./components/About")).About }),
      },
      {
        path: "impressum",
        lazy: async () => ({ Component: (await import("./components/Imprint")).Imprint }),
      },
      {
        path: "datenschutz",
        lazy: async () => ({ Component: (await import("./components/Privacy")).Privacy }),
      },
      {
        path: ADMIN_ROUTE_SEGMENT,
        lazy: async () => ({ Component: (await import("./components/Admin")).Admin }),
      },
      {
        path: "setup-admin",
        lazy: async () => ({ Component: (await import("./components/SetupAdmin")).SetupAdmin }),
      },
      {
        path: "*",
        lazy: async () => ({ Component: (await import("./components/NotFound")).NotFound }),
      },
    ],
  },
], { basename });
