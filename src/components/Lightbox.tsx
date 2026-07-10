import { useCallback, useEffect, useMemo, useRef } from "react";
import type { FlatPhoto } from "../types";

interface Props {
  photos: FlatPhoto[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const THUMB_WINDOW = 7;
const SWIPE_THRESHOLD = 50; // minimum px distance to count as a swipe

export function Lightbox({ photos, currentIndex, onClose, onNavigate }: Props) {
  const total = photos.length;
  const current = photos[currentIndex];
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => onNavigate((index + total) % total),
    [total, onNavigate],
  );

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goTo(currentIndex - 1);
      if (e.key === "ArrowRight") goTo(currentIndex + 1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, goTo, onClose]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Only treat as a swipe if horizontal movement dominates vertical
    // (so vertical scrolling on the overlay still works normally)
    if (
      Math.abs(deltaX) > SWIPE_THRESHOLD &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      if (deltaX < 0) {
        goTo(currentIndex + 1); // swiped left -> next photo
      } else {
        goTo(currentIndex - 1); // swiped right -> previous photo
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  }

  const thumbIndices = useMemo(() => {
    const half = Math.floor(THUMB_WINDOW / 2);
    let start = currentIndex - half;
    let end = currentIndex + half;

    if (start < 0) {
      end += -start;
      start = 0;
    }
    if (end > total - 1) {
      start -= end - (total - 1);
      end = total - 1;
    }
    start = Math.max(0, start);

    const indices: number[] = [];
    for (let i = start; i <= end; i++) indices.push(i);
    return indices;
  }, [currentIndex, total]);

  if (!current) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="lightbox-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div
          className="lightbox-main"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            className="lightbox-arrow left"
            onClick={() => goTo(currentIndex - 1)}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <img src={current.src} alt="" className="lightbox-image" />
          <button
            type="button"
            className="lightbox-arrow right"
            onClick={() => goTo(currentIndex + 1)}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>

        <div className="lightbox-caption">
          {current.country.charAt(0).toUpperCase() + current.country.slice(1)} ·{" "}
          {currentIndex + 1} / {total}
        </div>

        <div className="lightbox-thumbs">
          {thumbIndices.map((i) => (
            <button
              key={photos[i].src}
              type="button"
              className={`lightbox-thumb${i === currentIndex ? " active" : ""}`}
              onClick={() => goTo(i)}
            >
              <img src={photos[i].src} alt="" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
