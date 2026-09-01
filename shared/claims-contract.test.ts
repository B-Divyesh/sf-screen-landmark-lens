import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type Claim = { id: string; claim: string; where: string; test: string; sandbox: string };

const claims = JSON.parse(readFileSync(new URL("../.factory/claims.json", import.meta.url), "utf8")) as Claim[];
const testSources = ["static-deploy.test.ts", "../tests/site.spec.ts", "../tests-app/app.spec.ts"]
  .map((file) => readFileSync(new URL(file, import.meta.url), "utf8"))
  .join("\n");

describe("claims contract", () => {
  it("gives every unique claim one runnable tagged test", () => {
    expect(new Set(claims.map((claim) => claim.id)).size).toBe(claims.length);
    for (const claim of claims) {
      const tag = `@claim:${claim.id}`;
      expect(testSources.split(tag)).toHaveLength(2);
      expect(claim.test).toContain(tag);
      expect(claim.claim.trim()).not.toBe("");
      expect(claim.where.trim()).not.toBe("");
      expect(claim.sandbox.trim()).not.toBe("");
      if (claim.test.includes("test:shared")) expect(claim.test).toContain(" -- -t ");
      else expect(claim.test).toContain(" -- --grep ");
    }
  });
});
