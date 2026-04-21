import { createHashRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Inventory } from "./components/Inventory";
import { Contact } from "./components/Contact";
import { About } from "./components/About";
import { Imprint } from "./components/Imprint";
import { Privacy } from "./components/Privacy";
import { Admin } from "./components/Admin";
import { SetupAdmin } from "./components/SetupAdmin";
import { ADMIN_ROUTE_SEGMENT } from "./adminRoute";

export const router = createHashRouter([
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
    ],
  },
]);
