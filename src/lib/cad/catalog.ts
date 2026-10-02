import type { Lang, ParamDef, PartDef, PartKind } from "./types";

export const CATALOG: Record<PartKind, PartDef> = {
  "hex-bolt": {
    kind: "hex-bolt",
    category: "fastener",
    labelFa: "پیچ شش‌گوش",
    labelEn: "Hex bolt",
    blurbFa: "پیچ متریک با سر شش‌گوش و رزوه",
    blurbEn: "Metric hex-head bolt with thread",
    params: [
      p("d", 8, 3, 30, 0.5, "mm", "قطر", "Diameter"),
      p("L", 32, 8, 120, 1, "mm", "طول", "Length"),
      p("af", 13, 5, 46, 0.5, "mm", "آچارخور", "Across flats"),
      p("headH", 5.3, 2, 20, 0.1, "mm", "ارتفاع سر", "Head height"),
      p("thread", 22, 4, 110, 1, "mm", "طول رزوه", "Thread length"),
    ],
  },
  "hex-nut": {
    kind: "hex-nut",
    category: "fastener",
    labelFa: "مهره شش‌گوش",
    labelEn: "Hex nut",
    blurbFa: "مهره متریک با سوراخ رزوه",
    blurbEn: "Metric hex nut",
    params: [
      p("d", 8, 3, 30, 0.5, "mm", "قطر سوراخ", "Hole"),
      p("af", 13, 5, 46, 0.5, "mm", "آچارخور", "Across flats"),
      p("t", 6.5, 2, 24, 0.1, "mm", "ضخامت", "Thickness"),
    ],
  },
  washer: {
    kind: "washer",
    category: "fastener",
    labelFa: "واشر",
    labelEn: "Washer",
    blurbFa: "واشر تخت فولادی",
    blurbEn: "Flat washer",
    params: [
      p("d", 8.4, 3, 36, 0.1, "mm", "قطر داخلی", "Inner dia"),
      p("od", 16, 6, 60, 0.5, "mm", "قطر خارجی", "Outer dia"),
      p("t", 1.6, 0.4, 8, 0.1, "mm", "ضخامت", "Thickness"),
    ],
  },
  standoff: {
    kind: "standoff",
    category: "fastener",
    labelFa: "اسپیسر",
    labelEn: "Standoff",
    blurbFa: "فاصله‌گذار شش‌گوش با پین",
    blurbEn: "Hex standoff with pins",
    params: [
      p("d", 6, 3, 16, 0.5, "mm", "قطر پین", "Pin dia"),
      p("af", 10, 5, 24, 0.5, "mm", "آچارخور", "Across flats"),
      p("L", 20, 6, 80, 1, "mm", "طول بدنه", "Body"),
    ],
  },
  shaft: {
    kind: "shaft",
    category: "stock",
    labelFa: "شفت",
    labelEn: "Shaft",
    blurbFa: "میل‌گرد با پخ انتهایی",
    blurbEn: "Round shaft with chamfer",
    params: [
      p("d", 16, 4, 60, 0.5, "mm", "قطر", "Diameter"),
      p("L", 90, 16, 260, 1, "mm", "طول", "Length"),
    ],
  },
  block: {
    kind: "block",
    category: "stock",
    labelFa: "بلوک",
    labelEn: "Block",
    blurbFa: "مکعب مستطیل ماشین‌کاری",
    blurbEn: "Rectangular stock block",
    params: [
      p("w", 40, 8, 180, 1, "mm", "طول", "Width"),
      p("h", 24, 6, 120, 1, "mm", "ارتفاع", "Height"),
      p("d", 30, 6, 160, 1, "mm", "عمق", "Depth"),
    ],
  },
  plate: {
    kind: "plate",
    category: "stock",
    labelFa: "ورق",
    labelEn: "Plate",
    blurbFa: "ورق با چهار سوراخ گوشه",
    blurbEn: "Plate with corner holes",
    params: [
      p("w", 120, 20, 280, 1, "mm", "طول", "Width"),
      p("d", 80, 16, 220, 1, "mm", "عرض", "Depth"),
      p("t", 8, 2, 30, 0.5, "mm", "ضخامت", "Thickness"),
      p("hole", 6.6, 0, 20, 0.1, "mm", "قطر سوراخ", "Hole"),
      p("margin", 12, 6, 40, 1, "mm", "حاشیه سوراخ", "Margin"),
    ],
  },
  pipe: {
    kind: "pipe",
    category: "stock",
    labelFa: "لوله",
    labelEn: "Tube",
    blurbFa: "لوله جدارنازک",
    blurbEn: "Hollow tube",
    params: [
      p("od", 32, 8, 90, 0.5, "mm", "قطر خارجی", "Outer dia"),
      p("id", 26, 4, 84, 0.5, "mm", "قطر داخلی", "Inner dia"),
      p("L", 70, 12, 240, 1, "mm", "طول", "Length"),
    ],
  },
  "hex-bar": {
    kind: "hex-bar",
    category: "stock",
    labelFa: "میل شش‌گوش",
    labelEn: "Hex bar",
    blurbFa: "پروفیل شش‌ضلعی",
    blurbEn: "Hexagonal bar stock",
    params: [
      p("af", 14, 6, 40, 0.5, "mm", "آچارخور", "Across flats"),
      p("L", 60, 12, 220, 1, "mm", "طول", "Length"),
    ],
  },
  "angle-bar": {
    kind: "angle-bar",
    category: "frame",
    labelFa: "نبشی",
    labelEn: "Angle bar",
    blurbFa: "پروفیل نبشی L",
    blurbEn: "L-profile angle",
    params: [
      p("a", 30, 10, 80, 1, "mm", "بال الف", "Leg A"),
      p("b", 30, 10, 80, 1, "mm", "بال ب", "Leg B"),
      p("t", 3, 1.5, 12, 0.5, "mm", "ضخامت", "Thickness"),
      p("L", 90, 20, 260, 1, "mm", "طول", "Length"),
    ],
  },
  "l-bracket": {
    kind: "l-bracket",
    category: "frame",
    labelFa: "گونیا",
    labelEn: "L-bracket",
    blurbFa: "براکت ۹۰ درجه سوراخ‌دار",
    blurbEn: "Right-angle bracket",
    params: [
      p("a", 48, 16, 100, 1, "mm", "بال الف", "Leg A"),
      p("b", 40, 16, 100, 1, "mm", "بال ب", "Leg B"),
      p("w", 28, 12, 80, 1, "mm", "عرض", "Width"),
      p("t", 4, 2, 12, 0.5, "mm", "ضخامت", "Thickness"),
      p("hole", 5, 0, 12, 0.5, "mm", "سوراخ", "Hole"),
    ],
  },
  flange: {
    kind: "flange",
    category: "frame",
    labelFa: "فلنج",
    labelEn: "Flange",
    blurbFa: "فلنج دایره‌ای با دایره پیچ",
    blurbEn: "Circular flange with bolt circle",
    params: [
      p("od", 76, 28, 160, 1, "mm", "قطر خارجی", "Outer dia"),
      p("id", 18, 4, 80, 0.5, "mm", "قطر داخلی", "Bore"),
      p("t", 10, 4, 28, 0.5, "mm", "ضخامت", "Thickness"),
      p("bolts", 4, 3, 12, 1, "count", "تعداد پیچ", "Bolts"),
      p("hole", 7, 3, 16, 0.5, "mm", "قطر سوراخ", "Hole"),
      p("pcd", 52, 18, 130, 1, "mm", "دایره پیچ", "PCD"),
    ],
  },
  "spur-gear": {
    kind: "spur-gear",
    category: "drive",
    labelFa: "چرخ‌دنده",
    labelEn: "Spur gear",
    blurbFa: "چرخ‌دنده ساده پارامتری",
    blurbEn: "Parametric spur gear",
    params: [
      p("teeth", 18, 8, 48, 1, "count", "تعداد دندانه", "Teeth"),
      p("module", 2.5, 1, 6, 0.1, "mm", "مدول", "Module"),
      p("thickness", 10, 3, 28, 0.5, "mm", "ضخامت", "Thickness"),
      p("bore", 12, 4, 40, 0.5, "mm", "قطر سوراخ", "Bore"),
    ],
  },
  bearing: {
    kind: "bearing",
    category: "drive",
    labelFa: "بلبرینگ",
    labelEn: "Bearing",
    blurbFa: "بلبرینگ شیار عمیق",
    blurbEn: "Deep-groove ball bearing",
    params: [
      p("od", 35, 16, 80, 1, "mm", "قطر خارجی", "Outer dia"),
      p("id", 15, 6, 50, 0.5, "mm", "قطر داخلی", "Inner dia"),
      p("w", 11, 5, 24, 0.5, "mm", "عرض", "Width"),
    ],
  },
  pulley: {
    kind: "pulley",
    category: "drive",
    labelFa: "پولی",
    labelEn: "Pulley",
    blurbFa: "پولی تسمه‌ای شیاردار",
    blurbEn: "V-groove pulley",
    params: [
      p("od", 44, 16, 100, 1, "mm", "قطر", "Diameter"),
      p("w", 14, 6, 36, 0.5, "mm", "عرض", "Width"),
      p("groove", 5, 2, 12, 0.5, "mm", "شیار", "Groove"),
      p("bore", 10, 4, 30, 0.5, "mm", "سوراخ", "Bore"),
    ],
  },
  coupling: {
    kind: "coupling",
    category: "drive",
    labelFa: "کوپلینگ",
    labelEn: "Coupling",
    blurbFa: "کوپلینگ صلب شفت",
    blurbEn: "Rigid shaft coupling",
    params: [
      p("od", 28, 14, 70, 1, "mm", "قطر", "Diameter"),
      p("L", 32, 16, 80, 1, "mm", "طول", "Length"),
      p("bore", 10, 4, 36, 0.5, "mm", "سوراخ", "Bore"),
    ],
  },
  spring: {
    kind: "spring",
    category: "drive",
    labelFa: "فنر",
    labelEn: "Spring",
    blurbFa: "فنر فشاری مارپیچ",
    blurbEn: "Compression coil spring",
    params: [
      p("d", 16, 6, 40, 0.5, "mm", "قطر", "Diameter"),
      p("wire", 2, 0.8, 5, 0.1, "mm", "سیم", "Wire"),
      p("L", 36, 10, 100, 1, "mm", "طول", "Length"),
      p("coils", 8, 4, 18, 1, "count", "حلقه", "Coils"),
    ],
  },
};

export const CATEGORIES: { id: PartDef["category"]; fa: string; en: string }[] = [
  { id: "fastener", fa: "اتصالات", en: "Fasteners" },
  { id: "stock", fa: "مقاطع", en: "Stock" },
  { id: "frame", fa: "سازه‌ای", en: "Frame" },
  { id: "drive", fa: "انتقال قدرت", en: "Drive" },
];

export const BOLT_PRESETS = [
  { id: "M4", d: 4, af: 7, headH: 2.8, t: 3.2 },
  { id: "M5", d: 5, af: 8, headH: 3.5, t: 4 },
  { id: "M6", d: 6, af: 10, headH: 4, t: 5 },
  { id: "M8", d: 8, af: 13, headH: 5.3, t: 6.5 },
  { id: "M10", d: 10, af: 16, headH: 6.4, t: 8 },
  { id: "M12", d: 12, af: 18, headH: 7.5, t: 10 },
] as const;

export function defaultParams(kind: PartKind): Record<string, number> {
  const out: Record<string, number> = {};
  for (const param of CATALOG[kind].params) out[param.key] = param.value;
  return out;
}

export function paramLabel(def: ParamDef, lang: Lang): string {
  return lang === "fa" ? def.labelFa : def.labelEn;
}

export function partLabel(kind: PartKind, lang: Lang): string {
  return lang === "fa" ? CATALOG[kind].labelFa : CATALOG[kind].labelEn;
}

export function partSizeHint(kind: PartKind, params: Record<string, number>): string {
  const d = CATALOG[kind];
  const bits = d.params.slice(0, 3).map((param) => {
    const v = params[param.key] ?? param.value;
    if (param.unit === "count") return `${Math.round(v)}`;
    return `${trimNum(v)}`;
  });
  return bits.join(" × ");
}

export function trimNum(n: number): string {
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}

function p(
  key: string,
  value: number,
  min: number,
  max: number,
  step: number,
  unit: ParamDef["unit"],
  labelFa: string,
  labelEn: string,
): ParamDef {
  return { key, value, min, max, step, unit, labelFa, labelEn };
}
