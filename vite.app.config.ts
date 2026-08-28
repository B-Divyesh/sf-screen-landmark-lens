import { defineConfig } from "vite";

export default defineConfig({
  root: "app",
  clearScreen: false,
  build: { outDir: "../dist/app", emptyOutDir: true, target: "es2022", sourcemap: true },
  server: { port: 5173, strictPort: true }
});
