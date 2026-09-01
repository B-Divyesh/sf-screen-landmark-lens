import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const targetDir = process.env.CARGO_TARGET_DIR || join(tmpdir(), "screen-landmark-lens-cargo-target");
const child = spawn("cargo", ["test", "--manifest-path", "src-tauri/Cargo.toml", ...process.argv.slice(2)], {
  cwd: new URL("../", import.meta.url),
  env: { ...process.env, CARGO_BUILD_JOBS: process.env.CARGO_BUILD_JOBS || "1", CARGO_TARGET_DIR: targetDir },
  stdio: "inherit",
});

child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  if (signal) console.error(`cargo test stopped by ${signal}`);
  process.exitCode = code ?? 1;
});
