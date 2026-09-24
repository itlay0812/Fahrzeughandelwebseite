import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Inventory } from "./components/Inventory";
import { Contact } from "./components/Contact";
import { About } from "./components/About";
import { Imprint } from "./components/Imprint";
import { Privacy } from "./components/Privacy";
import { Admin } from "./components/Admin";
import { SetupAdmin } from "./components/SetupAdmin";
import { NotFound } from "./components/NotFound";
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
      { path: "bestand", Component: Inventory },
      { path: "kontakt", Component: Contact },
      { path: "ueber-uns", Component: About },
      { path: "impressum", Component: Imprint },
      { path: "datenschutz", Component: Privacy },
      { path: ADMIN_ROUTE_SEGMENT, Component: Admin },
      { path: "setup-admin", Component: SetupAdmin },
      { path: "*", Component: NotFound },
    ],
  },
], { basename });
