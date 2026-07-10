import type { CameraConfig } from "../types";

export function CameraSpecs({ camera }: { camera: CameraConfig }) {
  return (
    <>
      <dl className="camera-specs">
        {camera.specs.map((spec) => (
          <div className="spec-item" key={spec.label}>
            <dt>{spec.label}</dt>
            <dd>{spec.value}</dd>
          </div>
        ))}
      </dl>
      {camera.lens && (
        <div className="lens-info">
          <dt className="lens-label">Lens</dt>
          <dd className="lens-value">{camera.lens}</dd>
        </div>
      )}
    </>
  );
}
