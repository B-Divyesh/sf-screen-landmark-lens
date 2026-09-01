import { defineConfig } from "vite";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

export default defineConfig({
  root: "site",
  plugins: [{
    name: "designed-development-404",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url || "/", "http://local").pathname;
        const knownDocument = ["/", "/index.html", "/demo", "/demo/", "/demo/index.html", "/privacy", "/privacy/", "/privacy/index.html", "/terms", "/terms/", "/terms/index.html", "/404.html"].includes(pathname);
        if (request.method === "GET" && request.headers.accept?.includes("text/html") && !knownDocument && !pathname.includes(".")) {
          response.statusCode = 404;
          response.setHeader("Content-Type", "text/html; charset=utf-8");
          response.end(readFileSync(resolve(import.meta.dirname, "site/public/404.html"), "utf8"));
          return;
        }
        next();
      });
    },
  }],
  build: {
    outDir: "../dist/site",
    emptyOutDir: true,
    target: "es2022",
    sourcemap: true,
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, "site/index.html"),
        demo: resolve(import.meta.dirname, "site/demo/index.html"),
      },
    },
  },
  server: { port: 4173, strictPort: true }
});
