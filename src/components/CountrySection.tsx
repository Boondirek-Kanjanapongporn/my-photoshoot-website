import { useState } from "react";
import type { FlatPhoto } from "../types";

interface Props {
  label: string;
  photos: FlatPhoto[];
  onPhotoClick: (globalIndex: number) => void;
}

export function CountrySection({ label, photos, onPhotoClick }: Props) {
  const [open, setOpen] = useState(true);

  if (photos.length === 0) return null;

  return (
    <section className="country-section">
      <button
        type="button"
        className="country-header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className={`chevron${open ? " open" : ""}`} aria-hidden="true">
          ▶
        </span>
        <h2>{label}</h2>
        <span className="photo-count">{photos.length}</span>
      </button>
      {open && (
        <div className="photo-grid">
          {photos.map((photo) => (
            <button
              key={photo.src}
              type="button"
              className="photo-thumb"
              onClick={() => onPhotoClick(photo.globalIndex)}
            >
              <img src={photo.src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
