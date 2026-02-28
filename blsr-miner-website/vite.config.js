import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    allowedHosts: [".gitpod.dev"],
    proxy: {
      "/stats": { target: "http://127.0.0.1:8080", changeOrigin: true },
      "/share": { target: "http://127.0.0.1:8080", changeOrigin: true },
      "/work": { target: "http://127.0.0.1:8080", changeOrigin: true },
      "/payouts": { target: "http://127.0.0.1:8080", changeOrigin: true },
    },
  },
});
