import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@/lib/apiClient";
import App from "./App";
import "./index.css";

const envApiUrl = import.meta.env.VITE_API_URL || "";
const isBrowser = typeof window !== "undefined";
const isProdHost = isBrowser && !["localhost", "127.0.0.1"].includes(window.location.hostname);
const isLocalApi = /localhost|127\.0\.0\.1/.test(envApiUrl);

setBaseUrl(isProdHost && isLocalApi ? "" : envApiUrl);

createRoot(document.getElementById("root")!).render(<App />);
