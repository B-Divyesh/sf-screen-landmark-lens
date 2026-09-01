import { spawn } from "node:child_process";

// Tauri treats CI=1 as an invalid boolean in this worker, while CI=true is
// accepted. Normalise only that value so the documented npm command works in
// local shells and CI alike.
const environment = { ...process.env, CI: process.env.CI === "1" ? "true" : process.env.CI };
const executable = process.platform === "win32" ? "tauri.cmd" : "tauri";
// Windows cannot execute the npm-generated `tauri.cmd` shim directly through
// child_process.spawn. Asking the Windows command shell to run that shim keeps
// the same command path as other platforms and lets the release matrix build
// the MSI and NSIS packages.
const child = spawn(executable, process.argv.slice(2), {
  stdio: "inherit",
  env: environment,
  shell: process.platform === "win32",
});
child.on("exit", (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
child.on("error", (error) => { console.error(`Could not start Tauri: ${error.message}`); process.exit(1); });
