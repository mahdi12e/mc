export const PART_KINDS = [
  "hex-bolt",
  "hex-nut",
  "washer",
  "shaft",
  "block",
  "plate",
  "l-bracket",
  "flange",
  "pipe",
  "spur-gear",
  "bearing",
  "spring",
  "pulley",
  "angle-bar",
  "hex-bar",
  "standoff",
  "coupling",
] as const;

export type PartKind = (typeof PART_KINDS)[number];

export const MATERIAL_IDS = [
  "steel",
  "stainless",
  "aluminum",
  "brass",
  "copper",
  "titanium",
  "nylon",
  "rubber",
] as const;

export type MaterialId = (typeof MATERIAL_IDS)[number];

export type Lang = "fa" | "en";

export type Tool = "select" | "move" | "rotate";

export type Panel = "none" | "library" | "parts" | "view" | "project" | "props";

export type ViewPreset = "iso" | "front" | "top" | "right" | "left" | "fit";

export type ParamDef = {
  key: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: "mm" | "count";
  labelFa: string;
  labelEn: string;
};

export type PartDef = {
  kind: PartKind;
  category: "fastener" | "stock" | "drive" | "frame";
  labelFa: string;
  labelEn: string;
  blurbFa: string;
  blurbEn: string;
  params: ParamDef[];
};

export type Vec3 = [number, number, number];

export type CadPart = {
  id: string;
  kind: PartKind;
  name: string;
  params: Record<string, number>;
  position: Vec3;
  rotation: Vec3;
  material: MaterialId;
  visible: boolean;
  locked: boolean;
};

export type CadSnapshot = {
  version: 1;
  name: string;
  parts: CadPart[];
};
