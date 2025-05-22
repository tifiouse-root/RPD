import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./hooks/use-theme";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="bank-app-theme">
    <App />
  </ThemeProvider>
);
