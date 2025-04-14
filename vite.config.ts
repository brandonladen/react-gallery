import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "https://authentication.secretstartups.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/gallery-api": { // Proxy for gallery-related requests
        target: "https://gallery.secretstartups.org", // Replace with the correct API for galleries
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gallery-api/, ""), // Adjust path to match the gallery API
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
