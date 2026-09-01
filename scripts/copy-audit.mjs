import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const sources = ["site/index.html", "README.md"];
const banned = /\b(leverage|seamless|effortless|robust|powerful|intuitive|reimagine|supercharge|delightful|journey|ecosystem|AI-powered)\b/i;
const decode = (value) => value
  .replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">")
  .replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&nbsp;", " ");
const words = (value) => value.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
const escape = (value) => value.replaceAll("|", "\\|").replaceAll("\n", " ");

const html = await readFile("site/index.html", "utf8");
const htmlText = decode(html
  .replace(/<script\b[\s\S]*?<\/script>/gi, "")
  .replace(/<style\b[\s\S]*?<\/style>/gi, "")
  .replace(/<[^>]+>/g, "\n"));
const landing = htmlText.split(/\n+/).flatMap((line) => line.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((value) => value.trim()).filter(Boolean) ?? []);

const readme = await readFile("README.md", "utf8");
const readmeWithoutCode = readme.replace(/```[\s\S]*?```/g, "");
const readmeItems = readmeWithoutCode.split(/\n+/).flatMap((line) => {
  const cleaned = line.replace(/^#+\s*/, "").replace(/^[-*]\s+/, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
  if (!cleaned) return [];
  return cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((value) => value.trim()).filter(Boolean) ?? [];
});

const row = (value) => {
  const count = words(value);
  const issues = [count > 22 ? `${count} words` : "", banned.test(value) ? "banned word" : ""].filter(Boolean);
  return `| ${escape(value)} | ${count} | ${issues.length ? `FAIL: ${issues.join(", ")}` : "Pass"} |`;
};
const hashes = Object.fromEntries(await Promise.all(sources.map(async (source) => [source, createHash("sha256").update(await readFile(source)).digest("hex")])));
const output = `# Copy audit\n\nGenerated from the current landing page and README. Every visible landing string, heading, question, and control label is included. Code samples are excluded.\n\nSource hashes: \`${sources.map((source) => `${source}=${hashes[source]}`).join(" · ")}\`\n\n## Landing page inventory\n\n| Copy | Words | Result |\n| --- | ---: | --- |\n${landing.map(row).join("\n")}\n\n## README inventory\n\n| Copy | Words | Result |\n| --- | ---: | --- |\n${readmeItems.map(row).join("\n")}\n\n## Terminology\n\n| Concept | One term |\n| --- | --- |\n| A chosen application area | window |\n| Text identified from pixels | OCR text |\n| A text item Lens can describe | label |\n| Approximate location | direction |\n| Bundled no-risk scenario | sample project |\n| Operating-system control | screen reader |\n`;

if (landing.some((value) => words(value) > 22 || banned.test(value)) || readmeItems.some((value) => words(value) > 22 || banned.test(value))) {
  process.stderr.write("Copy audit contains a sentence over 22 words or a banned term.\n");
  process.exitCode = 1;
}
if (process.argv.includes("--write")) await writeFile(".factory/copy-audit.md", output);
else if (await readFile(".factory/copy-audit.md", "utf8") !== output) {
  process.stderr.write(".factory/copy-audit.md is stale. Run npm run audit:copy.\n");
  process.exitCode = 1;
}
