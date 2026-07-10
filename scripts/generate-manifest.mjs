import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
]);
const imagesRoot = join(process.cwd(), "public", "images");

function isImage(filename) {
  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function buildManifest() {
  let cameraDirs;
  try {
    cameraDirs = readdirSync(imagesRoot).filter((name) =>
      statSync(join(imagesRoot, name)).isDirectory(),
    );
  } catch {
    console.warn(
      `No images directory found at ${imagesRoot}. Writing empty manifest.`,
    );
    writeFileSync(join(imagesRoot, "manifest.json"), "{}");
    return;
  }

  const manifest = {};

  for (const camera of cameraDirs) {
    const cameraPath = join(imagesRoot, camera);
    const countryDirs = readdirSync(cameraPath).filter((name) =>
      statSync(join(cameraPath, name)).isDirectory(),
    );

    manifest[camera] = {};
    for (const country of countryDirs) {
      const countryPath = join(cameraPath, country);
      manifest[camera][country] = readdirSync(countryPath)
        .filter(isImage)
        .sort(naturalSort);
    }
  }

  writeFileSync(
    join(imagesRoot, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  console.log(`Manifest generated for ${cameraDirs.length} camera folder(s).`);
}

buildManifest();
