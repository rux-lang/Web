import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const webDirectory = resolve(import.meta.dirname, "..");
const qualityHost = process.env.RUX_QUALITY_HOST ?? "127.0.0.1";
const qualityPort = process.env.RUX_QUALITY_PORT ?? "4173";
const origin = `https://${qualityHost}:${qualityPort}`;

function run(command, args, environment = process.env) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd: webDirectory,
      env: environment,
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (status) => {
      if (status === 0) resolvePromise();
      else reject(new Error(`${args[0] ?? command} exited with status ${status}`));
    });
  });
}

function startQualityServer(environment = process.env) {
  const child = spawn(process.execPath, [resolve(webDirectory, "test/quality-server.mjs")], {
    cwd: webDirectory,
    env: environment,
    stdio: ["ignore", "pipe", "inherit"],
  });
  let output = "";
  const ready = new Promise((resolvePromise, reject) => {
    child.once("error", reject);
    child.once("exit", (status) => {
      reject(new Error(`Quality server exited with status ${status} before becoming ready`));
    });
    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      process.stdout.write(text);
      output += text;
      if (output.includes("Quality server listening")) resolvePromise();
    });
  });
  return { child, ready };
}

async function stopQualityServer(child) {
  if (child.exitCode !== null) return;
  const exited = new Promise((resolvePromise) => child.once("exit", resolvePromise));
  child.kill("SIGTERM");
  await Promise.race([exited, new Promise((resolvePromise) => setTimeout(resolvePromise, 5000))]);
  if (child.exitCode === null) {
    child.kill("SIGKILL");
    await exited;
  }
}

await rm(resolve(webDirectory, "lighthouse-reports"), {
  recursive: true,
  force: true,
});

await run(process.execPath, [resolve(webDirectory, "node_modules/nuxt/bin/nuxt.mjs"), "generate"], {
  ...process.env,
  NUXT_PUBLIC_API_BASE_URL: origin,
});

const cli = resolve(webDirectory, "node_modules/@lhci/cli/src/cli.js");
const profiles = process.env.RUX_QUALITY_PROFILES?.split(",").filter(Boolean) ?? ["mobile", "desktop"];
const server = startQualityServer();
try {
  await server.ready;
  for (const profile of profiles) {
    if (!["mobile", "desktop"].includes(profile)) {
      throw new Error(`Unknown Lighthouse profile: ${profile}`);
    }
    await run(process.execPath, [cli, "autorun", `--config=lighthouserc.${profile}.cjs`]);
  }
} finally {
  await stopQualityServer(server.child);
}
