import { useEffect } from "react";

interface Props {
  src: string;
  alt: string;
  onClose: () => void;
}

export function SimpleLightbox({ src, alt, onClose }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

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
        <div className="lightbox-main">
          <img src={src} alt={alt} className="lightbox-image" />
        </div>
      </div>
    </div>
  );
}
