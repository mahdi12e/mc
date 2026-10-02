import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { PartKind } from "./types";

export type BuiltMesh = {
  geometry: THREE.BufferGeometry;
  role: "body" | "accent";
};

export type BuiltPart = {
  meshes: BuiltMesh[];
  dispose: () => void;
};

const _c = new THREE.Vector3();

export function buildPart(kind: PartKind, params: Record<string, number>): BuiltPart {
  switch (kind) {
    case "hex-bolt":
      return hexBolt(params);
    case "hex-nut":
      return hexNut(params);
    case "washer":
      return washer(params);
    case "standoff":
      return standoff(params);
    case "shaft":
      return shaft(params);
    case "block":
      return block(params);
    case "plate":
      return plate(params);
    case "pipe":
      return pipe(params);
    case "hex-bar":
      return hexBar(params);
    case "angle-bar":
      return angleBar(params);
    case "l-bracket":
      return lBracket(params);
    case "flange":
      return flange(params);
    case "spur-gear":
      return spurGear(params);
    case "bearing":
      return bearing(params);
    case "pulley":
      return pulley(params);
    case "coupling":
      return coupling(params);
    case "spring":
      return spring(params);
    default:
      return block({ w: 20, h: 20, d: 20 });
  }
}

function hexBolt(p: Record<string, number>): BuiltPart {
  const d = n(p.d, 8);
  const L = n(p.L, 32);
  const af = n(p.af, 13);
  const headH = n(p.headH, 5.3);
  const thread = Math.min(n(p.thread, 22), L);
  const shank = Math.max(0.6, L - thread);
  const rHex = afToR(af);
  const r = d / 2;
  const tipH = Math.min(d * 0.32, 2.4);

  const tip = new THREE.ConeGeometry(r * 0.86, tipH, 20);
  tip.translate(0, tipH / 2, 0);

  const threadGeo = latheThread(r * 0.86, r, thread, Math.max(0.65, d * 0.125));
  threadGeo.translate(0, tipH * 0.72, 0);

  const shankGeo = new THREE.CylinderGeometry(r, r, shank, 28);
  shankGeo.translate(0, tipH * 0.72 + thread + shank / 2, 0);

  const faceH = Math.min(0.55, headH * 0.14);
  const face = new THREE.CylinderGeometry(d * 0.72, d * 0.72, faceH, 28);
  const yFace = tipH * 0.72 + thread + shank + faceH / 2;
  face.translate(0, yFace, 0);

  const head = new THREE.CylinderGeometry(rHex, rHex, headH, 6);
  head.translate(0, yFace + faceH / 2 + headH / 2, 0);

  const ch = Math.min(0.75, headH * 0.22);
  const chamfer = new THREE.CylinderGeometry(rHex * 0.78, rHex, ch, 6);
  chamfer.translate(0, yFace + faceH / 2 + headH - ch / 2 + 0.02, 0);

  return solids([mergeAndCenter([tip, threadGeo, shankGeo, face, head, chamfer])]);
}

function hexNut(p: Record<string, number>): BuiltPart {
  const d = n(p.d, 8);
  const af = n(p.af, 13);
  const t = n(p.t, 6.5);
  const shape = hexShape(afToR(af));
  punch(shape, 0, 0, d / 2);
  const geo = extrude(shape, t, 0.18);
  return solids([center(geo)]);
}

function washer(p: Record<string, number>): BuiltPart {
  const inner = n(p.d, 8.4);
  const od = Math.max(n(p.od, 16), inner + 1);
  const t = n(p.t, 1.6);
  const shape = ring(od / 2, inner / 2);
  return solids([center(extrude(shape, t, 0))]);
}

function standoff(p: Record<string, number>): BuiltPart {
  const d = n(p.d, 6);
  const af = n(p.af, 10);
  const L = n(p.L, 20);
  const pin = L * 0.28;
  const body = new THREE.CylinderGeometry(afToR(af), afToR(af), L, 6);
  const p1 = new THREE.CylinderGeometry(d / 2, d / 2, pin, 20);
  const p2 = p1.clone();
  p1.translate(0, L / 2 + pin / 2, 0);
  p2.translate(0, -(L / 2 + pin / 2), 0);
  return solids([center(mergeAndCenter([body, p1, p2]))]);
}

function shaft(p: Record<string, number>): BuiltPart {
  const d = n(p.d, 16);
  const L = n(p.L, 90);
  const ch = Math.min(d * 0.12, 1.6);
  const body = new THREE.CylinderGeometry(d / 2, d / 2, L - ch * 2, 36);
  const c1 = new THREE.CylinderGeometry(d / 2 * 0.86, d / 2, ch, 36);
  const c2 = new THREE.CylinderGeometry(d / 2, d / 2 * 0.86, ch, 36);
  c1.translate(0, (L - ch) / 2, 0);
  c2.translate(0, -(L - ch) / 2, 0);
  return solids([mergeAndCenter([body, c1, c2])]);
}

function block(p: Record<string, number>): BuiltPart {
  const w = n(p.w, 40);
  const h = n(p.h, 24);
  const d = n(p.d, 30);
  const geo = new THREE.BoxGeometry(w, h, d);
  return solids([geo]);
}

function plate(p: Record<string, number>): BuiltPart {
  const w = n(p.w, 120);
  const d = n(p.d, 80);
  const t = n(p.t, 8);
  const hole = n(p.hole, 6.6);
  const m = n(p.margin, 12);
  const shape = new THREE.Shape();
  const hw = w / 2;
  const hd = d / 2;
  const r = Math.min(3, t);
  roundedRect(shape, -hw, -hd, w, d, r);
  if (hole > 0) {
    const xs = [-(hw - m), hw - m];
    const zs = [-(hd - m), hd - m];
    for (const x of xs) for (const z of zs) punch(shape, x, z, hole / 2);
  }
  return solids([center(extrude(shape, t, 0.12))]);
}

function pipe(p: Record<string, number>): BuiltPart {
  const od = n(p.od, 32);
  const id = Math.min(n(p.id, 26), od - 0.8);
  const L = n(p.L, 70);
  const shape = ring(od / 2, Math.max(0.4, id / 2));
  return solids([center(extrude(shape, L, 0))]);
}

function hexBar(p: Record<string, number>): BuiltPart {
  const af = n(p.af, 14);
  const L = n(p.L, 60);
  const geo = new THREE.CylinderGeometry(afToR(af), afToR(af), L, 6);
  return solids([geo]);
}

function angleBar(p: Record<string, number>): BuiltPart {
  const a = n(p.a, 30);
  const b = n(p.b, 30);
  const t = n(p.t, 3);
  const L = n(p.L, 90);
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(a, 0);
  shape.lineTo(a, t);
  shape.lineTo(t, t);
  shape.lineTo(t, b);
  shape.lineTo(0, b);
  shape.closePath();
  return solids([center(extrude(shape, L, 0))]);
}

function lBracket(p: Record<string, number>): BuiltPart {
  const a = n(p.a, 48);
  const b = n(p.b, 40);
  const w = n(p.w, 28);
  const t = n(p.t, 4);
  const hole = n(p.hole, 5);
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(a, 0);
  shape.lineTo(a, t);
  shape.lineTo(t, t);
  shape.lineTo(t, b);
  shape.lineTo(0, b);
  shape.closePath();
  if (hole > 0) {
    punch(shape, a * 0.62, t * 0.5, hole / 2);
    punch(shape, t * 0.5, b * 0.62, hole / 2);
  }
  return solids([center(extrude(shape, w, 0.1))]);
}

function flange(p: Record<string, number>): BuiltPart {
  const od = n(p.od, 76);
  const id = n(p.id, 18);
  const t = n(p.t, 10);
  const bolts = Math.max(3, Math.round(n(p.bolts, 4)));
  const hole = n(p.hole, 7);
  const pcd = n(p.pcd, 52);
  const shape = ring(od / 2, Math.max(0.6, id / 2));
  for (let i = 0; i < bolts; i++) {
    const a = (i / bolts) * Math.PI * 2;
    punch(shape, Math.cos(a) * (pcd / 2), Math.sin(a) * (pcd / 2), hole / 2);
  }
  const plateGeo = extrude(shape, t, 0.12);
  const hubH = t * 0.55;
  const hub = new THREE.CylinderGeometry(id / 2 + 4, id / 2 + 5.5, hubH, 36);
  const hubHole = new THREE.CylinderGeometry(id / 2, id / 2, hubH + 0.4, 32);
  hub.translate(0, t + hubH / 2, 0);
  hubHole.translate(0, t + hubH / 2, 0);
  // Visual hub without CSG: annulus via lathe
  const hubRing = ring(id / 2 + 5.2, id / 2);
  const hubGeo = extrude(hubRing, hubH, 0);
  hubGeo.translate(0, t, 0);
  hub.dispose();
  hubHole.dispose();
  return solids([center(mergeAndCenter([plateGeo, hubGeo]))]);
}

function spurGear(p: Record<string, number>): BuiltPart {
  const teeth = Math.max(8, Math.round(n(p.teeth, 18)));
  const module = n(p.module, 2.5);
  const thickness = n(p.thickness, 10);
  const bore = n(p.bore, 12);
  const pitchR = (teeth * module) / 2;
  const outerR = pitchR + module;
  const rootR = Math.max(pitchR - module * 1.25, bore / 2 + module * 0.35);
  const shape = new THREE.Shape();
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const half = Math.PI / teeth;
    pts.push(polar(rootR, a - half * 0.92));
    pts.push(polar(rootR, a - half * 0.38));
    pts.push(polar(outerR, a - half * 0.18));
    pts.push(polar(outerR, a + half * 0.18));
    pts.push(polar(rootR, a + half * 0.38));
    pts.push(polar(rootR, a + half * 0.92));
  }
  shape.setFromPoints(pts);
  shape.closePath();
  punch(shape, 0, 0, bore / 2);
  const geo = extrude(shape, thickness, 0.22);
  const hub = extrude(ring(bore / 2 + module * 1.1, bore / 2), thickness * 1.18, 0);
  return solids([center(mergeAndCenter([geo, hub]))]);
}

function bearing(p: Record<string, number>): BuiltPart {
  const od = n(p.od, 35);
  const id = n(p.id, 15);
  const w = n(p.w, 11);
  const race = Math.max(1.2, (od - id) * 0.18);
  const outer = extrude(ring(od / 2, od / 2 - race), w, 0.08);
  const inner = extrude(ring(id / 2 + race, id / 2), w, 0.08);
  const rings = center(mergeAndCenter([outer, inner]));

  const ballR = Math.max(0.8, (od - id) / 4 - 0.6);
  const pathR = (od + id) / 4;
  const count = Math.max(6, Math.round((Math.PI * 2 * pathR) / (ballR * 2.35)));
  const ballGeos: THREE.BufferGeometry[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const s = new THREE.SphereGeometry(ballR, 14, 10);
    s.translate(Math.cos(a) * pathR, 0, Math.sin(a) * pathR);
    ballGeos.push(s);
  }
  const balls = center(mergeAndCenter(ballGeos));
  // rings and balls share the same centering origin if we center separately —
  // center each around 0,0,0 independently; both are already around origin.
  rings.computeBoundingBox();
  balls.computeBoundingBox();
  return {
    meshes: [
      { geometry: rings, role: "body" },
      { geometry: balls, role: "accent" },
    ],
    dispose() {
      rings.dispose();
      balls.dispose();
    },
  };
}

function pulley(p: Record<string, number>): BuiltPart {
  const od = n(p.od, 44);
  const w = n(p.w, 14);
  const groove = Math.min(n(p.groove, 5), w * 0.7);
  const bore = n(p.bore, 10);
  const r = od / 2;
  const pts = [
    new THREE.Vector2(bore / 2, 0),
    new THREE.Vector2(r, 0),
    new THREE.Vector2(r, (w - groove) / 2),
    new THREE.Vector2(r - groove * 0.7, w / 2),
    new THREE.Vector2(r, (w + groove) / 2),
    new THREE.Vector2(r, w),
    new THREE.Vector2(bore / 2, w),
  ];
  const geo = new THREE.LatheGeometry(pts, 48);
  geo.computeVertexNormals();
  return solids([center(geo)]);
}

function coupling(p: Record<string, number>): BuiltPart {
  const od = n(p.od, 28);
  const L = n(p.L, 32);
  const bore = n(p.bore, 10);
  const shape = ring(od / 2, bore / 2);
  const body = extrude(shape, L, 0.15);
  const collar = extrude(ring(od / 2 + 1.2, bore / 2), 3.2, 0);
  collar.translate(0, L / 2 - 1.6, 0);
  const screw = new THREE.CylinderGeometry(1.6, 1.6, od / 2, 12);
  screw.rotateZ(Math.PI / 2);
  screw.translate(od / 4, L * 0.28, 0);
  const screw2 = screw.clone();
  screw2.translate(0, L * 0.44, 0);
  return solids([center(mergeAndCenter([body, collar, screw, screw2]))]);
}

function spring(p: Record<string, number>): BuiltPart {
  const d = n(p.d, 16);
  const wire = n(p.wire, 2);
  const L = n(p.L, 36);
  const coils = Math.max(3, Math.round(n(p.coils, 8)));
  const r = d / 2 - wire / 2;
  const pts: THREE.Vector3[] = [];
  const steps = coils * 24;
  for (let i = 0; i <= steps; i++) {
    const t = i / 24;
    const a = t * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * r, (t / coils) * L, Math.sin(a) * r));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const geo = new THREE.TubeGeometry(curve, steps, wire / 2, 8, false);
  geo.computeVertexNormals();
  return solids([center(geo)]);
}

function solids(geos: THREE.BufferGeometry[]): BuiltPart {
  return {
    meshes: geos.map((geometry) => ({ geometry, role: "body" as const })),
    dispose() {
      for (const g of geos) g.dispose();
    },
  };
}

function mergeAndCenter(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const ready = geos.map((g) => {
    g.computeVertexNormals();
    return g;
  });
  const merged = mergeGeometries(ready, false);
  for (const g of ready) g.dispose();
  if (!merged) {
    return new THREE.BoxGeometry(8, 8, 8);
  }
  merged.computeVertexNormals();
  return center(merged);
}

function center(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  geo.computeBoundingBox();
  const b = geo.boundingBox;
  if (!b) return geo;
  b.getCenter(_c);
  geo.translate(-_c.x, -_c.y, -_c.z);
  return geo;
}

function extrude(shape: THREE.Shape, depth: number, bevel = 0): THREE.ExtrudeGeometry {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 1,
    curveSegments: 20,
  });
  geo.rotateX(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

function hexShape(vertexR: number): THREE.Shape {
  const s = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (i * Math.PI) / 3;
    const x = Math.cos(a) * vertexR;
    const y = Math.sin(a) * vertexR;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  return s;
}

function ring(outer: number, inner: number): THREE.Shape {
  const s = new THREE.Shape();
  s.absarc(0, 0, Math.max(outer, inner + 0.2), 0, Math.PI * 2, false);
  punch(s, 0, 0, inner);
  return s;
}

function punch(shape: THREE.Shape, x: number, y: number, r: number) {
  if (r <= 0.05) return;
  const hole = new THREE.Path();
  hole.absarc(x, y, r, 0, Math.PI * 2, true);
  shape.holes.push(hole);
}

function roundedRect(shape: THREE.Shape, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 4, h / 4);
  shape.moveTo(x + rr, y);
  shape.lineTo(x + w - rr, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + rr);
  shape.lineTo(x + w, y + h - rr);
  shape.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  shape.lineTo(x + rr, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - rr);
  shape.lineTo(x, y + rr);
  shape.quadraticCurveTo(x, y, x + rr, y);
}

function latheThread(rIn: number, rOut: number, length: number, pitch: number): THREE.LatheGeometry {
  const pts: THREE.Vector2[] = [];
  const turns = Math.max(3, Math.floor(length / pitch));
  const steps = turns * 2;
  pts.push(new THREE.Vector2(rIn * 0.9, 0));
  for (let i = 0; i <= steps; i++) {
    const y = (i / steps) * length;
    pts.push(new THREE.Vector2(i % 2 === 0 ? rOut : rIn, y));
  }
  pts.push(new THREE.Vector2(rIn * 0.9, length));
  const geo = new THREE.LatheGeometry(pts, 28);
  geo.computeVertexNormals();
  return geo;
}

function polar(r: number, a: number): THREE.Vector2 {
  return new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r);
}

function afToR(af: number): number {
  return af / Math.sqrt(3);
}

function n(v: number | undefined, fallback: number): number {
  return Number.isFinite(v) ? (v as number) : fallback;
}
