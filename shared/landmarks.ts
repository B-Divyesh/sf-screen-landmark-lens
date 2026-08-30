export type Landmark = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  direction: string;
  likelyButton: boolean;
};

export function normalize(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

export function findLandmarks(items: Landmark[], query: string): Landmark[] {
  const needle = normalize(query);
  if (!needle) return [];
  return items.filter((item) => normalize(item.text).includes(needle));
}

export function spokenLandmark(item: Landmark): string {
  return `Found OCR text “${item.text}”, ${item.direction}. Review the label if it sounds unexpected.`;
}

export function summarize(items: Landmark[]): string {
  if (!items.length) return "No readable labels were found. Try enlarging the target window or increasing its contrast.";
  const visible = items.slice(0, 12).map((item) => `${item.text}, ${item.direction}`);
  return `${items.length} visible ${items.length === 1 ? "label" : "labels"}. ${visible.join(". ")}.`;
}
