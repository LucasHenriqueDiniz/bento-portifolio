import { spawn } from "child_process";
import process from "process";

const start = Date.now();

// Safety timer: force exit if build hangs
typeof setTimeout(() => {
  console.error("Build timeout — forcing exit");
  process.exit(1);
}, 120_000);

const child = spawn("npx", ["vite", "build", "--config", "vite.config.ts"], {
  stdio: "inherit",
  shell: true,
  windowsHide: true,
});

child.on("close", (code) => {
  if (code === 0) {
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`Build completed in ${duration}s`);
  } else {
    console.error(`Build failed with code ${code}`);
  }
  // Hard exit to prevent Windows PowerShell from hanging on open handles
  process.exit(code ?? 1);
});

child.on("error", (err) => {
  console.error("Build spawn error:", err);
  process.exit(1);
});
