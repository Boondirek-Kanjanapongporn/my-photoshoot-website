import type { CameraConfig } from "../types";

interface Props {
  cameras: CameraConfig[];
  activeKey: string;
  onSelect: (key: string) => void;
}

export function CameraTabs({ cameras, activeKey, onSelect }: Props) {
  return (
    <div className="camera-tabs" role="tablist" aria-label="Camera selection">
      {cameras.map((camera) => (
        <button
          key={camera.key}
          role="tab"
          type="button"
          aria-selected={camera.key === activeKey}
          className={`camera-tab${camera.key === activeKey ? " active" : ""}`}
          onClick={() => onSelect(camera.key)}
        >
          {camera.label}
        </button>
      ))}
    </div>
  );
}
