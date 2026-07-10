import { useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import { CameraTabs } from "./components/CameraTabs";
import { CameraSpecs } from "./components/CameraSpecs";
import { CountrySection } from "./components/CountrySection";
import { Lightbox } from "./components/Lightbox";
import { CAMERAS } from "./data/cameras";
import { ProfileCard } from "./components/ProfileCard";
import { SimpleLightbox } from "./components/SimpleLightbox";
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

  const flatPhotos: FlatPhoto[] = useMemo(() => {
    if (!manifest) return [];
    const photos: FlatPhoto[] = [];
    for (const country of activeCameraConfig.countries) {
      const files = manifest[activeCameraConfig.key]?.[country.key] ?? [];
      for (const filename of files) {
        photos.push({
          camera: activeCameraConfig.key,
          country: country.key,
          filename,
          src: buildSrc(activeCameraConfig.key, country.key, filename),
          globalIndex: photos.length,
        });
      }
    }
    return photos;
  }, [manifest, activeCameraConfig]);

  const photosByCountry = useMemo(() => {
    const map = new Map<string, FlatPhoto[]>();
    for (const country of activeCameraConfig.countries) {
      map.set(
        country.key,
        flatPhotos.filter((p) => p.country === country.key),
      );
    }
    return map;
  }, [flatPhotos, activeCameraConfig]);

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
          {manifest !== null && flatPhotos.length === 0 && (
            <p className="status-message">
              No photos found for this camera yet.
            </p>
          )}
          {activeCameraConfig.countries.map((country) => (
            <CountrySection
              key={country.key}
              label={country.label}
              photos={photosByCountry.get(country.key) ?? []}
              onPhotoClick={(index) => setLightboxIndex(index)}
            />
          ))}
        </main>

        {lightboxIndex !== null && (
          <Lightbox
            photos={flatPhotos}
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
