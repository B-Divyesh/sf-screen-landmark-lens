import { describe, expect, it } from "vitest";
import { findLandmarks, normalize, spokenLandmark, summarize, type Landmark } from "./landmarks";

const item: Landmark = { text: "  Save changes ", x: 2, y: 3, width: 10, height: 5, direction: "bottom right", likelyButton: true };

describe("landmark language", () => {
  it("normalizes and finds text without changing the source", () => {
    expect(normalize("  SAVE   Changes ")).toBe("save changes");
    expect(findLandmarks([item], "save")).toEqual([item]);
  });
  it("includes direction and honest OCR uncertainty in speech", () => {
    expect(spokenLandmark(item)).toContain("bottom right");
    expect(spokenLandmark(item)).toContain("Review the label");
  });
  it("has an actionable empty state", () => expect(summarize([])).toContain("enlarging"));
});
