import { spawn } from "node:child_process";

// Tauri treats CI=1 as an invalid boolean in this worker, while CI=true is
// accepted. Normalise only that value so the documented npm command works in
// local shells and CI alike.
const environment = { ...process.env, CI: process.env.CI === "1" ? "true" : process.env.CI };
const executable = process.platform === "win32" ? "tauri.cmd" : "tauri";
const child = spawn(executable, process.argv.slice(2), { stdio: "inherit", env: environment });
child.on("exit", (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
child.on("error", (error) => { console.error(`Could not start Tauri: ${error.message}`); process.exit(1); });
