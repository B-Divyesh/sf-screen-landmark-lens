export const LICENSE_KEY = "sb_license:screen-landmark-lens";
const VERDICT_KEY = `${LICENSE_KEY}:verdict`;
const API = "https://api.sociobot.in/api/v1/products/screen-landmark-lens";

export type LicenseState = { valid: boolean; reason: string; checkedAt: number };

export function acceptLicenseFromUrl(): boolean {
  const url = new URL(location.href);
  const license = url.searchParams.get("license");
  if (!license) return false;
  localStorage.setItem(LICENSE_KEY, license.trim());
  localStorage.removeItem(VERDICT_KEY);
  url.searchParams.delete("license");
  history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  return true;
}

export function cachedLicenseState(): LicenseState | null {
  try {
    const state = JSON.parse(localStorage.getItem(VERDICT_KEY) || "null") as LicenseState | null;
    return state && typeof state.valid === "boolean" ? state : null;
  } catch { return null; }
}

export function hasOptimisticUnlock(): boolean {
  const token = localStorage.getItem(LICENSE_KEY);
  const state = cachedLicenseState();
  return Boolean(token && state?.valid);
}

export async function verifyLicense(force = false): Promise<LicenseState | null> {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return null;
  const cached = cachedLicenseState();
  if (!force && cached && Date.now() - cached.checkedAt < 86_400_000) return cached;
  try {
    const response = await fetch(`${API}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error(`Verification returned ${response.status}`);
    const result = await response.json() as { valid: boolean; reason: string };
    const state = { valid: result.valid, reason: result.reason, checkedAt: Date.now() };
    localStorage.setItem(VERDICT_KEY, JSON.stringify(state));
    return state;
  } catch {
    return cached;
  }
}

export async function restoreLicense(token: string): Promise<LicenseState | null> {
  localStorage.setItem(LICENSE_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
  return verifyLicense(true);
}

export const checkoutUrl = `${API}/checkout`;
