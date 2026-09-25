  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { router } from "./app/routes";
  import "./styles/index.css";

  /* Die Unterseiten werden nachgeladen: Erst rendern, wenn die aktuelle
     Route da ist, sonst zeigt der Router beim Start kurz nichts an. */
  function routerBereit() {
    if (router.state.initialized) return Promise.resolve();
    return new Promise<void>((resolve) => {
      const abmelden = router.subscribe((state) => {
        if (!state.initialized) return;
        abmelden();
        resolve();
      });
    });
  }

  routerBereit().then(() => {
    createRoot(document.getElementById("root")!).render(<App />);
  });
