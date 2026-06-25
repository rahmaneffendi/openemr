import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const uiRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(uiRoot, "..");
const srcRoot = join(uiRoot, "src");
const distRoot = join(uiRoot, "dist");

function normalizeBackendUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) {
    return "";
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    url.pathname = url.pathname.replace(/\/+$/, "");
    return url.toString().replace(/\/+$/, "");
  } catch {
    console.warn(`OPENEMR_BACKEND_URL is not a valid URL: ${trimmed}`);
    return "";
  }
}

const config = {
  appName: process.env.OPENEMR_APP_NAME || "OpenEMR",
  backendUrl: normalizeBackendUrl(process.env.OPENEMR_BACKEND_URL),
  deploymentEnvironment: process.env.VERCEL_ENV || "local",
  builtAt: new Date().toISOString()
};

await rm(distRoot, { recursive: true, force: true });
await mkdir(join(distRoot, "assets"), { recursive: true });
await cp(srcRoot, distRoot, { recursive: true });
await cp(
  join(repoRoot, "public", "images", "login-logo.svg"),
  join(distRoot, "assets", "openemr-logo.svg")
);
await cp(
  join(repoRoot, "public", "images", "favicon-32x32.png"),
  join(distRoot, "favicon-32x32.png")
);
await writeFile(
  join(distRoot, "config.js"),
  `window.OPENEMR_VERCEL_UI_CONFIG = ${JSON.stringify(config, null, 2)};\n`
);

console.log(`Built Vercel UI in ${distRoot}`);
if (!config.backendUrl) {
  console.log("Set OPENEMR_BACKEND_URL in Vercel to enable backend links.");
}
