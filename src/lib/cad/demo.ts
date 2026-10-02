import { CATALOG, defaultParams } from "./catalog";
import type { CadPart, MaterialId, PartKind, Vec3 } from "./types";

let seq = 0;
export function uid(): string {
  seq += 1;
  return `p${Date.now().toString(36)}${seq.toString(36)}`;
}

export function makePart(
  kind: PartKind,
  patch: Partial<CadPart> & { params?: Record<string, number> } = {},
): CadPart {
  const params = { ...defaultParams(kind), ...patch.params };
  return {
    id: patch.id ?? uid(),
    kind,
    name: patch.name ?? CATALOG[kind].labelFa,
    params,
    position: patch.position ?? [0, 0, 0],
    rotation: patch.rotation ?? [0, 0, 0],
    material: patch.material ?? defaultMaterial(kind),
    visible: patch.visible ?? true,
    locked: patch.locked ?? false,
  };
}

function defaultMaterial(kind: PartKind): MaterialId {
  if (kind === "spur-gear" || kind === "pulley") return "steel";
  if (kind === "bearing") return "stainless";
  if (kind === "plate" || kind === "l-bracket" || kind === "block") return "aluminum";
  if (kind === "spring") return "steel";
  if (kind === "washer") return "stainless";
  return "steel";
}

export function sampleAssembly(): { name: string; parts: CadPart[] } {
  const plateT = 10;
  const plateW = 170;
  const plateD = 100;
  const flangeOd = 72;
  const flangeT = 10;
  const shaftD = 16;
  const yPlate = plateT / 2;
  const yAxis = plateT + flangeOd / 2;

  const parts: CadPart[] = [
    makePart("plate", {
      name: "صفحه پایه",
      material: "aluminum",
      params: { w: plateW, d: plateD, t: plateT, hole: 7, margin: 14 },
      position: [0, yPlate, 0],
    }),
    makePart("flange", {
      name: "فلنج راست",
      material: "steel",
      params: { od: flangeOd, id: shaftD + 0.4, t: flangeT, bolts: 4, hole: 7, pcd: 50 },
      position: [10, yAxis, 0],
      rotation: [0, 0, 90],
    }),
    makePart("flange", {
      name: "فلنج چپ",
      material: "steel",
      params: { od: flangeOd, id: shaftD + 0.4, t: flangeT, bolts: 4, hole: 7, pcd: 50 },
      position: [-10, yAxis, 0],
      rotation: [0, 0, 90],
    }),
    makePart("shaft", {
      name: "شفت اصلی",
      material: "stainless",
      params: { d: shaftD, L: 128 },
      position: [18, yAxis, 0],
      rotation: [0, 0, 90],
    }),
    makePart("spur-gear", {
      name: "چرخ‌دنده",
      material: "steel",
      params: { teeth: 18, module: 2.4, thickness: 12, bore: shaftD },
      position: [52, yAxis, 0],
      rotation: [0, 0, 90],
    }),
    makePart("bearing", {
      name: "بلبرینگ",
      material: "stainless",
      params: { od: 35, id: 15, w: 11 },
      position: [-48, yAxis, 0],
      rotation: [0, 0, 90],
    }),
    makePart("pulley", {
      name: "پولی",
      material: "aluminum",
      params: { od: 40, w: 14, groove: 5, bore: shaftD - 2 },
      position: [-70, yAxis, 0],
      rotation: [0, 0, 90],
    }),
  ];

  const pcd = 50;
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const y = yAxis + Math.sin(a) * (pcd / 2);
    const z = Math.cos(a) * (pcd / 2);
    parts.push(
      makePart("hex-bolt", {
        name: `پیچ فلنج ${i + 1}`,
        material: "steel",
        params: { d: 6, L: 28, af: 10, headH: 4, thread: 18 },
        position: [16, y, z],
        rotation: [0, 0, 90],
      }),
    );
    parts.push(
      makePart("hex-nut", {
        name: `مهره فلنج ${i + 1}`,
        material: "steel",
        params: { d: 6, af: 10, t: 5 },
        position: [-16, y, z],
        rotation: [0, 0, 90],
      }),
    );
  }

  const corners: Vec3[] = [
    [71, 0, 36],
    [-71, 0, 36],
    [71, 0, -36],
    [-71, 0, -36],
  ];
  corners.forEach((c, i) => {
    const headH = 5.3;
    const L = 22;
    const h = headH + L;
    const y = plateT + headH - h / 2;
    parts.push(
      makePart("washer", {
        name: `واشر ${i + 1}`,
        material: "stainless",
        params: { d: 8.4, od: 16, t: 1.6 },
        position: [c[0], plateT + 0.9, c[2]],
      }),
    );
    parts.push(
      makePart("hex-bolt", {
        name: `پیچ پایه ${i + 1}`,
        material: "steel",
        params: { d: 8, L, af: 13, headH, thread: 16 },
        position: [c[0], y + 1.6, c[2]],
      }),
    );
  });

  return { name: "گیربکس رومیزی", parts };
}

export function emptyProject(): { name: string; parts: CadPart[] } {
  return { name: "بدون‌نام", parts: [] };
}

export function nextPlacement(existing: CadPart[], kind: PartKind): Vec3 {
  const nParts = existing.length;
  const col = nParts % 5;
  const row = Math.floor(nParts / 5);
  const params = defaultParams(kind);
  const lift = liftFor(kind, params);
  return [col * 48 - 96, lift, row * 48 - 48];
}

function liftFor(kind: PartKind, params: Record<string, number>): number {
  switch (kind) {
    case "hex-bolt":
      return (params.headH + params.L) / 2;
    case "hex-nut":
      return params.t / 2;
    case "washer":
      return params.t / 2;
    case "shaft":
    case "hex-bar":
    case "pipe":
    case "spring":
    case "standoff":
    case "coupling":
      return params.L / 2;
    case "block":
      return params.h / 2;
    case "plate":
      return params.t / 2;
    case "angle-bar":
      return Math.max(params.a, params.b) / 2;
    case "l-bracket":
      return Math.max(params.a, params.b) / 2;
    case "flange":
      return params.t / 2;
    case "spur-gear":
      return params.thickness / 2;
    case "bearing":
      return params.w / 2;
    case "pulley":
      return params.w / 2;
    default:
      return 10;
  }
}
