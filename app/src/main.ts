import "./style.css";
import { invoke } from "@tauri-apps/api/core";
import { openUrl } from "@tauri-apps/plugin-opener";
import { acceptLicenseFromUrl, checkoutUrl, hasOptimisticUnlock, restoreLicense, verifyLicense } from "../../shared/license";
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
let speechRate = Number(localStorage.getItem("lens:speech-rate") || 1);

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
    list.innerHTML = items.map((item, index) => `<li><button type="button" data-index="${index}"><span class="landmark-text">${escapeHtml(item.text)}</span><span class="direction">${escapeHtml(item.direction)} · ${Math.round(item.confidence * 100)}% OCR quality estimate</span></button></li>`).join("");
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
  const matches = findLandmarks(analysis?.landmarks || [], findInput.value);
  const message = matches.length
    ? matches.map(spokenLandmark).join(" ")
    : `“${findInput.value.trim()}” was not found in the latest capture. Check the spelling or capture again after revealing it.`;
  $("#find-result").textContent = message;
  announce(message, true);
}

function setPlus(unlocked: boolean, notice = "") {
  $("#plus-locked").hidden = unlocked;
  $("#plus-unlocked").hidden = !unlocked;
  $("#license-status").textContent = notice;
}

function loadSavedTargets() {
  const targets = JSON.parse(localStorage.getItem("lens:saved-targets") || "[]") as string[];
  $("#saved-targets").innerHTML = targets.map((target) => `<li><button type="button" data-target="${escapeHtml(target)}">${escapeHtml(target)}</button></li>`).join("");
}

async function setupLicense() {
  const arrived = acceptLicenseFromUrl();
  setPlus(hasOptimisticUnlock(), hasOptimisticUnlock() ? "Lens Plus is active on this device." : "");
  const state = await verifyLicense(arrived);
  if (state) setPlus(state.valid, state.valid ? "Lens Plus is active on this device." : "License no longer active. Core wayfinding remains available.");
  loadSavedTargets();
}

select.addEventListener("change", () => { scanButton.disabled = !select.value; });
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
$("#buy-link").addEventListener("click", (event) => { event.preventDefault(); openUrl(checkoutUrl).catch(() => location.assign(checkoutUrl)); });
$("#license-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  $("#license-status").textContent = "Verifying license…";
  const state = await restoreLicense(($("#license-input") as HTMLInputElement).value);
  setPlus(Boolean(state?.valid), state?.valid ? "Lens Plus restored." : "That license could not be verified. Check the token and try again.");
});
const rateInput = $("#speech-rate") as HTMLInputElement;
rateInput.value = String(speechRate);
$("#speech-rate-output").textContent = `${speechRate}×`;
rateInput.addEventListener("input", () => { speechRate = Number(rateInput.value); localStorage.setItem("lens:speech-rate", String(speechRate)); $("#speech-rate-output").textContent = `${speechRate}×`; });
$("#save-target").addEventListener("click", () => {
  const target = findInput.value.trim();
  if (!target) { $("#license-status").textContent = "Enter a target in Find text before saving it."; findInput.focus(); return; }
  const saved = JSON.parse(localStorage.getItem("lens:saved-targets") || "[]") as string[];
  localStorage.setItem("lens:saved-targets", JSON.stringify([...new Set([target, ...saved])].slice(0, 12)));
  loadSavedTargets(); $("#license-status").textContent = `Saved “${target}”.`;
});
$("#saved-targets").addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>("button[data-target]");
  if (button) { findInput.value = button.dataset.target!; if (analysis) runFind(); else findInput.focus(); }
});

void loadWindows();
void setupLicense();
