import { useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import { CameraTabs } from "./components/CameraTabs";
import { CameraSpecs } from "./components/CameraSpecs";
import { CountrySection } from "./components/CountrySection";
import { Lightbox } from "./components/Lightbox";
import { ProfileCard } from "./components/ProfileCard";
import { SimpleLightbox } from "./components/SimpleLightbox";
import { CAMERAS } from "./data/cameras";
import type { FlatPhoto, Manifest } from "./types";
import "./App.css";

function buildSrc(camera: string, country: string, filename: string) {
  return encodeURI(`/images/${camera}/${country}/${filename}`);
}

function App() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [activeCamera, setActiveCamera] = useState(CAMERAS[0].key);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [profilePhotoOpen, setProfilePhotoOpen] = useState(false);

  useEffect(() => {
    fetch("/images/manifest.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load manifest");
        return res.json();
      })
      .then(setManifest)
      .catch((err) => {
        console.error(err);
        setManifest({});
      });
  }, []);

  const activeCameraConfig = useMemo(
    () => CAMERAS.find((c) => c.key === activeCamera) ?? CAMERAS[0],
    [activeCamera],
  );

  // Build flat photo lists AND per-country groupings for every camera up front,
  // so each camera's gallery only needs to be computed once, not on every tab switch.
  const photosByCamera = useMemo(() => {
    const result = new Map<
      string,
      { flat: FlatPhoto[]; byCountry: Map<string, FlatPhoto[]> }
    >();
    if (!manifest) return result;

    for (const camera of CAMERAS) {
      const flat: FlatPhoto[] = [];
      const byCountry = new Map<string, FlatPhoto[]>();

      for (const country of camera.countries) {
        const files = manifest[camera.key]?.[country.key] ?? [];
        const countryPhotos: FlatPhoto[] = files.map((filename, i) => ({
          camera: camera.key,
          country: country.key,
          filename,
          src: buildSrc(camera.key, country.key, filename),
          globalIndex: flat.length + i,
        }));
        flat.push(...countryPhotos);
        byCountry.set(country.key, countryPhotos);
      }

      result.set(camera.key, { flat, byCountry });
    }

    return result;
  }, [manifest]);

  const activePhotos = photosByCamera.get(activeCamera);
  const activeFlatPhotos = activePhotos?.flat ?? [];

  function handleTabChange(key: string) {
    setActiveCamera(key);
    setLightboxIndex(null);
  }

  return (
    <ThemeProvider>
      <div className="page">
        <header className="page-header">
          <div className="page-header-top">
            <h1>Photo Samples</h1>
            <ThemeToggle />
          </div>
          <ProfileCard onPhotoClick={() => setProfilePhotoOpen(true)} />
        </header>

        <CameraTabs
          cameras={CAMERAS}
          activeKey={activeCamera}
          onSelect={handleTabChange}
        />
        <CameraSpecs camera={activeCameraConfig} />

        <main className="gallery">
          {manifest === null && (
            <p className="status-message">Loading photos…</p>
          )}

          {manifest !== null &&
            CAMERAS.map((camera) => {
              const data = photosByCamera.get(camera.key);
              const isActive = camera.key === activeCamera;
              const hasPhotos = (data?.flat.length ?? 0) > 0;

              return (
                <div
                  key={camera.key}
                  className="camera-gallery"
                  style={{ display: isActive ? "block" : "none" }}
                  aria-hidden={!isActive}
                >
                  {!hasPhotos && (
                    <p className="status-message">
                      No photos found for this camera yet.
                    </p>
                  )}
                  {camera.countries.map((country) => (
                    <CountrySection
                      key={country.key}
                      label={country.label}
                      photos={data?.byCountry.get(country.key) ?? []}
                      onPhotoClick={(index) => setLightboxIndex(index)}
                    />
                  ))}
                </div>
              );
            })}
        </main>

        {lightboxIndex !== null && (
          <Lightbox
            photos={activeFlatPhotos}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}

        {profilePhotoOpen && (
          <SimpleLightbox
            src="/images/profile.jpg"
            alt="Boondirek Kanjanapongporn"
            onClose={() => setProfilePhotoOpen(false)}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
