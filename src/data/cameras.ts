import type { CameraConfig } from "../types";

export const CAMERAS: CameraConfig[] = [
  {
    key: "fujifilm xt50",
    label: "Fujifilm X-T50",
    lens: "Fujifilm XF 16-50mm f/2.8-4.8 R LM WR",
    countries: [
      { key: "england", label: "England" },
      { key: "japan", label: "Japan" },
    ],
    specs: [
      { label: "Sensor", value: "40.2MP APS-C X-Trans CMOS 5 HR" },
      { label: "Processor", value: "X-Processor 5" },
      { label: "ISO Range", value: "125 – 12800 (ext. 64 – 51200)" },
      { label: "Video", value: "6.2K/30p, 4K/60p" },
      { label: "Stabilization", value: "In-body 5-axis, up to 7 stops" },
    ],
  },
  {
    key: "nikon d5300",
    label: "Nikon D5300",
    // lens: undefined — add later once you remember it
    countries: [{ key: "thailand", label: "Thailand" }],
    specs: [
      { label: "Sensor", value: "24.2MP APS-C CMOS" },
      { label: "Processor", value: "EXPEED 4" },
      { label: "ISO Range", value: "100 – 12800 (ext. 25600)" },
      { label: "Video", value: "1080p / 60fps" },
      { label: "Autofocus", value: "39-point AF system" },
    ],
  },
];
