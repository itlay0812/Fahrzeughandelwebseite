import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";

export default function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </HelmetProvider>
  );
}