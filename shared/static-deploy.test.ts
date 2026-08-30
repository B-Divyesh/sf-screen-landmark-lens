import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type StaticWebAppsConfig = {
  navigationFallback?: { rewrite?: string; exclude?: string[] };
  responseOverrides?: Record<string, { rewrite?: string; statusCode?: number }>;
};

const config = JSON.parse(
  readFileSync(new URL("../site/public/staticwebapp.config.json", import.meta.url), "utf8"),
) as StaticWebAppsConfig;

describe("static deployment artifact", () => {
  it("keeps the Static Web Apps configuration at the published site root", () => {
    expect(config.navigationFallback).toMatchObject({ rewrite: "/index.html" });
    expect(config.navigationFallback?.exclude).toEqual(expect.arrayContaining([
      "/assets/*",
      "/demo/*",
      "/privacy/*",
      "/terms/*",
    ]));
  });

  it("uses a response override for the real 404 without an invalid route rule", () => {
    expect(config.responseOverrides?.["404"]).toEqual({ rewrite: "/404.html", statusCode: 404 });
  });
});
