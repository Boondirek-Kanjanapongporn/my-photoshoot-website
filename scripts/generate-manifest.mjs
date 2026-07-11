import {
  readdirSync,
  statSync,
  writeFileSync,
  readFileSync,
  existsSync,
} from "node:fs";
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
const excludeListPath = join(process.cwd(), "scripts", "excluded-photos.json");

function isImage(filename) {
  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function loadExcludeList() {
  if (!existsSync(excludeListPath)) return [];
  try {
    const raw = readFileSync(excludeListPath, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn(
        "excluded-photos.json should be an array of strings. Ignoring.",
      );
      return [];
    }
    return parsed;
  } catch (err) {
    console.warn(`Could not parse excluded-photos.json: ${err.message}`);
    return [];
  }
}

function buildExcludeMatcher(excludeList) {
  const filenameOnly = new Set();
  const fullPaths = new Set();

  for (const entry of excludeList) {
    const normalized = entry.trim().toLowerCase();
    if (!normalized) continue;
    if (normalized.includes("/")) {
      fullPaths.add(normalized);
    } else {
      filenameOnly.add(normalized);
    }
  }

  return function isExcluded(camera, country, filename) {
    const lowerFilename = filename.toLowerCase();
    if (filenameOnly.has(lowerFilename)) return true;
    const fullPath = `${camera}/${country}/${filename}`.toLowerCase();
    return fullPaths.has(fullPath);
  };
}

function buildManifest() {
  const excludeList = loadExcludeList();
  const isExcluded = buildExcludeMatcher(excludeList);

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
  let excludedCount = 0;

  for (const camera of cameraDirs) {
    const cameraPath = join(imagesRoot, camera);
    const countryDirs = readdirSync(cameraPath).filter((name) =>
      statSync(join(cameraPath, name)).isDirectory(),
    );

    manifest[camera] = {};
    for (const country of countryDirs) {
      const countryPath = join(cameraPath, country);
      const files = readdirSync(countryPath)
        .filter(isImage)
        .filter((filename) => {
          const excluded = isExcluded(camera, country, filename);
          if (excluded) excludedCount++;
          return !excluded;
        })
        .sort(naturalSort);

      manifest[camera][country] = files;
    }
  }

  writeFileSync(
    join(imagesRoot, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  console.log(
    `Manifest generated for ${cameraDirs.length} camera folder(s). ${excludedCount} photo(s) excluded.`,
  );
}

buildManifest();
