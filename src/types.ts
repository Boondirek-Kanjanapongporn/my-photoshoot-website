export type Manifest = Record<string, Record<string, string[]>>;

export interface CameraConfig {
  key: string;
  label: string;
  lens?: string;
  countries: { key: string; label: string }[];
  specs: { label: string; value: string }[];
}

export interface FlatPhoto {
  camera: string;
  country: string;
  filename: string;
  src: string;
  globalIndex: number;
}
