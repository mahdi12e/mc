import type { MaterialId } from "./types";

export type MaterialLook = {
  color: string;
  metalness: number;
  roughness: number;
  labelFa: string;
  labelEn: string;
};

export const MATERIALS: Record<MaterialId, MaterialLook> = {
  steel: {
    color: "#8d939c",
    metalness: 0.82,
    roughness: 0.34,
    labelFa: "فولاد",
    labelEn: "Steel",
  },
  stainless: {
    color: "#c5ccd3",
    metalness: 0.92,
    roughness: 0.18,
    labelFa: "استیل",
    labelEn: "Stainless",
  },
  aluminum: {
    color: "#b7bec6",
    metalness: 0.62,
    roughness: 0.42,
    labelFa: "آلومینیوم",
    labelEn: "Aluminum",
  },
  brass: {
    color: "#c4a15c",
    metalness: 0.78,
    roughness: 0.28,
    labelFa: "برنج",
    labelEn: "Brass",
  },
  copper: {
    color: "#b56a3e",
    metalness: 0.8,
    roughness: 0.3,
    labelFa: "مس",
    labelEn: "Copper",
  },
  titanium: {
    color: "#9aa0ab",
    metalness: 0.7,
    roughness: 0.38,
    labelFa: "تیتانیوم",
    labelEn: "Titanium",
  },
  nylon: {
    color: "#d9d4c8",
    metalness: 0.04,
    roughness: 0.72,
    labelFa: "نایلون",
    labelEn: "Nylon",
  },
  rubber: {
    color: "#2c2c30",
    metalness: 0.02,
    roughness: 0.92,
    labelFa: "لاستیک",
    labelEn: "Rubber",
  },
};

export const SCENE = {
  clear: "#0c0e11",
  hemiSky: "#d7dde4",
  hemiGround: "#1b1814",
  key: "#f2f0ea",
  fill: "#8ea0b4",
  rim: "#c3b7a4",
  gridCell: "#2e343e",
  gridSection: "#4d5866",
  edge: "#16181d",
  edgeSelected: "#c9d4e0",
  gizmo: "#9aadc0",
};
