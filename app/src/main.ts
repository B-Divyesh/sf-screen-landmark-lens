import "./style.css";
import { invoke } from "@tauri-apps/api/core";
import { findLandmarks, spokenLandmark, summarize, type Landmark } from "../../shared/landmarks";

type WindowInfo = { id: number; title: string; appName: string; width: number; height: number };
type Analysis = { windowTitle: string; width: number; height: number; elapsedMs: number; landmarks: Landmark[] };

const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const select = $("#window-select") as HTMLSelectElement;
const scanButton = $("#scan-button") as HTMLButtonElement;
const readButton = $("#read-all") as HTMLButtonElement;
const buttonsButton = $("#describe-buttons") as HTMLButtonElement;
const findInput = $("#find-input") as HTMLInputElement;
const findButton = $("#find-form button") as HTMLButtonElement;
const list = $("#landmark-list") as HTMLOListElement;
let analysis: Analysis | null = null;
let demoMode = new URLSearchParams(location.search).get("demo") === "1";
const storageKey = (name: string) => `${demoMode ? "demo:" : ""}lens:${name}`;
let speechRate = Number(localStorage.getItem(storageKey("speech-rate")) || 1);

const sampleAnalysis: Analysis = {
  windowTitle: "Sample Legacy App — Quarterly report",
  width: 1200,
  height: 800,
  elapsedMs: 0,
  landmarks: [
    { text: "Quarterly report", x: 72, y: 54, width: 240, height: 34, direction: "top left", likelyButton: false },
    { text: "Status: Ready to submit", x: 430, y: 248, width: 280, height: 30, direction: "middle center", likelyButton: false },
    { text: "Save", x: 920, y: 662, width: 88, height: 42, direction: "bottom right", likelyButton: true },
    { text: "Cancel", x: 1024, y: 662, width: 96, height: 42, direction: "bottom right", likelyButton: true },
    { text: "Print", x: 802, y: 662, width: 86, height: 42, direction: "bottom center", likelyButton: true },
  ],
};

function announce(message: string, speak = false) {
  $("#announcer").textContent = "";
  requestAnimationFrame(() => { $("#announcer").textContent = message; });
  if (speak && "speechSynthesis" in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = speechRate;
    speechSynthesis.speak(utterance);
  }
}

function setBusy(busy: boolean) {
  scanButton.disabled = busy || !select.value;
  scanButton.querySelector("span")!.textContent = busy ? "Reading locally…" : "Capture and read";
  document.body.toggleAttribute("data-busy", busy);
}

function setDemoMode(enabled: boolean) {
  demoMode = enabled;
  const url = new URL(location.href);
  if (enabled) url.searchParams.set("demo", "1");
  else url.searchParams.delete("demo");
  history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  document.querySelector<HTMLElement>("#demo-banner")!.hidden = !enabled;
}

function loadSample() {
  setDemoMode(true);
  analysis = structuredClone(sampleAnalysis);
  renderLandmarks();
  [readButton, buttonsButton, findInput, findButton].forEach((element) => { element.disabled = false; });
  $("#scan-meta").textContent = "5 sample labels loaded. No capture was made and nothing was saved.";
  announce("Sample project loaded. Five visible labels are ready to explore.", true);
}

function showError(message: string) {
  const empty = $("#result-empty");
  empty.className = "empty-state error-state";
  empty.innerHTML = `<div class="error-mark" aria-hidden="true">!</div><p>Lens couldn’t read that window</p><small></small>`;
  empty.querySelector("small")!.textContent = message;
  empty.hidden = false;
  list.hidden = true;
  $("#scan-meta").textContent = "Capture failed. The previous image was discarded.";
  announce(`Capture failed. ${message}`, true);
}

async function loadWindows() {
  select.disabled = true;
  select.innerHTML = `<option value="">Looking for visible windows…</option>`;
  try {
    const windows = await invoke<WindowInfo[]>("list_windows");
    select.innerHTML = windows.length
      ? `<option value="">Choose a window…</option>${windows.map((w) => `<option value="${w.id}">${escapeHtml(w.title)} — ${escapeHtml(w.appName)} (${w.width}×${w.height})</option>`).join("")}`
      : `<option value="">No capturable windows found</option>`;
    select.disabled = !windows.length;
    $("#scan-meta").textContent = windows.length ? `${windows.length} visible windows available.` : "Open the target app, then refresh this list.";
    if (!windows.length) announce("No capturable windows found. Open the target app, then refresh.");
  } catch (error) {
    select.innerHTML = `<option value="">Window access unavailable</option>`;
    $("#scan-meta").textContent = "Window access is available in the installed desktop app.";
    showError(humanError(error));
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]!));
}

function humanError(error: unknown): string {
  const message = String(error).replace(/^Error:\s*/, "");
  if (/permission|denied/i.test(message)) return "Allow screen recording for Screen Landmark Lens in system settings, then try again.";
  if (/not found|closed/i.test(message)) return "The selected window may have closed. Refresh the window list and choose it again.";
  if (/invoke|__TAURI__/i.test(message)) return "Install and open the desktop app to capture a window. Browser previews cannot access other windows.";
  return `${message} Try refreshing the window list.`;
}

async function scan() {
  if (!select.value) return;
  setBusy(true);
  $("#scan-meta").textContent = "Capturing only the selected window and reading it on this device…";
  announce("Capture started. Reading locally.");
  try {
    analysis = await invoke<Analysis>("analyze_window", { windowId: Number(select.value) });
    renderLandmarks();
    const summary = summarize(analysis.landmarks);
    $("#scan-meta").textContent = `${analysis.landmarks.length} labels found in ${analysis.elapsedMs} ms. Capture discarded after analysis.`;
    announce(summary, true);
  } catch (error) { showError(humanError(error)); }
  finally { setBusy(false); }
}

function renderLandmarks() {
  const items = analysis?.landmarks || [];
  const empty = $("#result-empty");
  if (!items.length) {
    empty.className = "empty-state";
    empty.innerHTML = `<div class="reticle" aria-hidden="true"><span></span></div><p>No readable labels found</p><small>Enlarge the target window or increase its contrast, then capture again.</small>`;
    empty.hidden = false; list.hidden = true;
  } else {
    empty.hidden = true; list.hidden = false;
    list.innerHTML = items.map((item, index) => `<li><button type="button" data-index="${index}"><span class="landmark-text">${escapeHtml(item.text)}</span><span class="direction">${escapeHtml(item.direction)} · OCR text; review if it sounds unexpected</span></button></li>`).join("");
  }
  [readButton, buttonsButton, findInput, findButton].forEach((element) => element.disabled = !items.length);
}

function readAll() { if (analysis) announce(summarize(analysis.landmarks), true); }

function describeButtons() {
  const likely = analysis?.landmarks.filter((item) => item.likelyButton) || [];
  const message = likely.length
    ? `${likely.length} likely ${likely.length === 1 ? "button" : "buttons"}. ${likely.map((item) => `${item.text}, ${item.direction}`).join(". ")}. These are estimates from visible wording, not accessibility metadata.`
    : "No likely buttons were identified from common action words. Try finding the visible label instead.";
  announce(message, true);
  $("#find-result").textContent = message;
}

function runFind() {
  const query = findInput.value.trim();
  if (!query) {
    const message = "Enter a label to find, then choose Find.";
    $("#find-result").textContent = message;
    announce(message, true);
    findInput.focus();
    return;
  }
  const matches = findLandmarks(analysis?.landmarks || [], findInput.value);
  const message = matches.length
    ? matches.map(spokenLandmark).join(" ")
    : `“${query}” was not found in the latest capture. Check the spelling or capture again after revealing it.`;
  $("#find-result").textContent = message;
  announce(message, true);
}

select.addEventListener("change", () => { scanButton.disabled = !select.value; });
$("#load-sample").addEventListener("click", loadSample);
$("#reset-demo").addEventListener("click", loadSample);
$("#start-real").addEventListener("click", () => {
  analysis = null;
  setDemoMode(false);
  renderLandmarks();
  $("#scan-meta").textContent = "Waiting for a selected window.";
  void loadWindows();
  announce("Demo ended. Choose a visible window to begin.");
});
$("#refresh-windows").addEventListener("click", loadWindows);
scanButton.addEventListener("click", scan);
readButton.addEventListener("click", readAll);
buttonsButton.addEventListener("click", describeButtons);
$("#find-form").addEventListener("submit", (event) => { event.preventDefault(); runFind(); });
list.addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>("button[data-index]");
  if (button && analysis) announce(spokenLandmark(analysis.landmarks[Number(button.dataset.index)]), true);
});
document.addEventListener("keydown", (event) => {
  if (!(event.altKey && event.shiftKey)) return;
  if (event.key.toLowerCase() === "l" && !readButton.disabled) { event.preventDefault(); readAll(); }
  if (event.key.toLowerCase() === "b" && !buttonsButton.disabled) { event.preventDefault(); describeButtons(); }
  if (event.key.toLowerCase() === "f") { event.preventDefault(); findInput.focus(); }
});
const rateInput = $("#speech-rate") as HTMLInputElement;
rateInput.value = String(speechRate);
$("#speech-rate-output").textContent = `${speechRate}×`;
rateInput.addEventListener("input", () => { speechRate = Number(rateInput.value); localStorage.setItem(storageKey("speech-rate"), String(speechRate)); $("#speech-rate-output").textContent = `${speechRate}×`; });

if (demoMode) loadSample();
else void loadWindows();
