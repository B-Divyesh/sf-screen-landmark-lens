import { defineConfig } from "vite";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const repositoryRoot = import.meta.dirname;
const version = (JSON.parse(readFileSync(resolve(repositoryRoot, "package.json"), "utf8")) as { version: string }).version;
const releaseTag = process.env.RELEASE_TAG || `v${version}`;
const tagCommit = (() => {
  try {
    return execFileSync("git", ["rev-list", "-n", "1", releaseTag], { cwd: repositoryRoot, encoding: "utf8" }).trim();
  } catch {
    return "";
  }
})();
const configuredCommit = process.env.RELEASE_COMMIT;

if (tagCommit && configuredCommit && configuredCommit !== tagCommit) {
  throw new Error(`Release commit ${configuredCommit} does not match immutable tag ${releaseTag}`);
}

// Static deployments can be rebuilt after report-only commits. The package's
// immutable version tag, rather than the checkout HEAD, remains the identity
// of the downloadable desktop artifacts. Untagged local development keeps a
// useful identity through the explicit value or current checkout.
const releaseCommit = tagCommit
  || configuredCommit
  || execFileSync("git", ["rev-parse", "HEAD"], { cwd: repositoryRoot, encoding: "utf8" }).trim();
const releaseIdentity = JSON.stringify({ version, tag: releaseTag, commit: releaseCommit });

if (releaseTag !== `v${version}`) throw new Error(`Release tag ${releaseTag} does not match package version ${version}`);
if (!/^[a-f0-9]{40}$/.test(releaseCommit)) throw new Error(`Invalid release commit ${releaseCommit}`);

export default defineConfig({
  root: "site",
  plugins: [{
    name: "designed-development-404",
    transformIndexHtml(html) {
      return {
        html: html.replaceAll("__RELEASE_COMMIT__", releaseCommit),
        tags: [
          { tag: "meta", attrs: { name: "release-commit", content: releaseCommit }, injectTo: "head" },
          { tag: "meta", attrs: { name: "release-tag", content: releaseTag }, injectTo: "head" },
        ],
      };
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "release.json", source: `${releaseIdentity}\n` });
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url || "/", "http://local").pathname;
        if (request.method === "GET" && pathname === "/release.json") {
          response.statusCode = 200;
          response.setHeader("Content-Type", "application/json; charset=utf-8");
          response.end(`${releaseIdentity}\n`);
          return;
        }
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
