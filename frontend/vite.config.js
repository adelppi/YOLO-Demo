import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../',
    chunkSizeWarningLimit: 2000, // handle warning on vendor.js bundle size
  },
  base: "/YOLO-Demo/",
});
