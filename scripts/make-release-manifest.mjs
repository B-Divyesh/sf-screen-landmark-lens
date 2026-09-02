import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const directory = process.argv[2] || "release-assets";
const packageVersion = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8")).version;
const version = (process.env.RELEASE_TAG || `v${packageVersion}`).replace(/^v/, "");
const repository = process.env.GITHUB_REPOSITORY || "B-Divyesh/sf-screen-landmark-lens";
const tag = process.env.RELEASE_TAG || `v${version}`;
const commit = process.env.GITHUB_SHA || "local-build";
const files = (await readdir(directory)).filter((name) => !["SHA256SUMS", "latest.json"].includes(name));
const sums = [];

if (version !== packageVersion) throw new Error(`Release ${tag} does not match package version ${packageVersion}`);
if (process.env.CI && !/^[a-f0-9]{40}$/.test(commit)) throw new Error(`Invalid release source commit: ${commit}`);

for (const file of files.sort()) {
  const hash = createHash("sha256").update(await readFile(join(directory, file))).digest("hex");
  sums.push({ file, hash });
}

const pick = (part, extension) => sums.find(({ file }) => file.toLowerCase().includes(part) && file.toLowerCase().endsWith(extension));
const platformFiles = {
  "macos-arm64": pick("macos-arm64", ".dmg"),
  "macos-x64": pick("macos-x64", ".dmg"),
  windows: pick("windows", ".msi"),
  linux: pick("linux", ".appimage")
};

for (const [platform, value] of Object.entries(platformFiles)) {
  if (!value) throw new Error(`Missing release asset for ${platform}. Found: ${files.join(", ")}`);
}

for (const platform of Object.keys(platformFiles)) {
  const sourceFile = join(directory, `${platform}.source.json`);
  const source = JSON.parse(await readFile(sourceFile, "utf8"));
  if (source.platform !== platform || source.tag !== tag || source.commit !== commit) {
    throw new Error(`Source report for ${platform} does not match ${tag} at ${commit}`);
  }
}

const platforms = Object.fromEntries(Object.entries(platformFiles).map(([platform, value]) => {
  const file = basename(value.file);
  return [platform, {
    url: `https://github.com/${repository}/releases/download/${tag}/${encodeURIComponent(file)}`,
    sha256: value.hash,
    publisherSigned: false,
    commit,
  }];
}));

await writeFile(join(directory, "SHA256SUMS"), `${sums.map(({ file, hash }) => `${hash}  ${file}`).join("\n")}\n`);
await writeFile(join(directory, "latest.json"), `${JSON.stringify({
  schemaVersion: 2,
  version,
  tag,
  commit,
  release: { url: `https://github.com/${repository}/releases/tag/${tag}`, commit },
  checksums: { url: `https://github.com/${repository}/releases/download/${tag}/SHA256SUMS`, commit },
  platforms,
})}\n`);
console.log(`Created checksums and manifest for ${Object.keys(platforms).join(", ")}`);
