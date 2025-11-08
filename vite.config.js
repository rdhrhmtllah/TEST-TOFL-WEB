import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      external: [], // Pastikan tidak ada external yang diblokir
    },
  },
  server: {
    headers: {
      "Content-Security-Policy":
        "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; media-src 'self' 'unsafe-inline' data: blob: https:;",
    },
  },
});
