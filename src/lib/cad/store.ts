import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BOLT_PRESETS, CATALOG, defaultParams } from "./catalog";
import { emptyProject, makePart, nextPlacement, sampleAssembly, uid } from "./demo";
import type {
  CadPart,
  Lang,
  MaterialId,
  Panel,
  PartKind,
  Tool,
  Vec3,
  ViewPreset,
} from "./types";

type CadState = {
  name: string;
  parts: CadPart[];
  selectedId: string | null;
  lang: Lang;
  tool: Tool;
  panel: Panel;
  grid: boolean;
  snap: boolean;
  snapStep: number;
  section: boolean;
  explode: number;
  viewTick: ViewPreset | null;
  captureTick: number;
  past: CadPart[][];
  future: CadPart[][];
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  setLang: (lang: Lang) => void;
  setTool: (tool: Tool) => void;
  setPanel: (panel: Panel) => void;
  select: (id: string | null) => void;
  addPart: (kind: PartKind) => void;
  updateParams: (id: string, params: Record<string, number>) => void;
  applyBoltPreset: (id: string, presetId: string) => void;
  setMaterial: (id: string, material: MaterialId) => void;
  setTransform: (id: string, position: Vec3, rotation: Vec3) => void;
  commitTransform: () => void;
  renamePart: (id: string, name: string) => void;
  duplicateSelected: () => void;
  deleteSelected: () => void;
  toggleVisible: (id: string) => void;
  toggleLocked: (id: string) => void;
  toggleGrid: () => void;
  toggleSnap: () => void;
  toggleSection: () => void;
  setExplode: (v: number) => void;
  requestView: (preset: ViewPreset) => void;
  clearView: () => void;
  requestCapture: () => void;
  undo: () => void;
  redo: () => void;
  newProject: () => void;
  loadSample: () => void;
  setName: (name: string) => void;
};

const sample = sampleAssembly();

function cloneParts(parts: CadPart[]): CadPart[] {
  return structuredClone(parts);
}

function withHistory(
  set: (partial: Partial<CadState> | ((s: CadState) => Partial<CadState>)) => void,
  get: () => CadState,
  mutate: (parts: CadPart[]) => CadPart[],
) {
  const { parts, past } = get();
  const next = mutate(cloneParts(parts));
  set({
    parts: next,
    past: [...past.slice(-48), cloneParts(parts)],
    future: [],
  });
}

export const useCadStore = create<CadState>()(
  persist(
    (set, get) => ({
      name: sample.name,
      parts: sample.parts,
      selectedId: sample.parts[4]?.id ?? null,
      lang: "fa",
      tool: "select",
      panel: "none",
      grid: true,
      snap: true,
      snapStep: 1,
      section: false,
      explode: 0,
      viewTick: null,
      captureTick: 0,
      past: [],
      future: [],
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      setLang: (lang) => set({ lang }),
      setTool: (tool) => set({ tool }),
      setPanel: (panel) => set({ panel }),
      select: (id) => set({ selectedId: id }),
      addPart: (kind) => {
        withHistory(set, get, (parts) => {
          const part = makePart(kind, {
            name: get().lang === "fa" ? CATALOG[kind].labelFa : CATALOG[kind].labelEn,
            position: nextPlacement(parts, kind),
            params: defaultParams(kind),
          });
          set({ selectedId: part.id, panel: get().panel === "library" ? "props" : get().panel });
          return [...parts, part];
        });
      },
      updateParams: (id, params) => {
        withHistory(set, get, (parts) =>
          parts.map((p) => (p.id === id ? { ...p, params: { ...p.params, ...params } } : p)),
        );
      },
      applyBoltPreset: (id, presetId) => {
        const preset = BOLT_PRESETS.find((b) => b.id === presetId);
        if (!preset) return;
        withHistory(set, get, (parts) =>
          parts.map((p) => {
            if (p.id !== id) return p;
            if (p.kind === "hex-bolt") {
              return {
                ...p,
                params: {
                  ...p.params,
                  d: preset.d,
                  af: preset.af,
                  headH: preset.headH,
                  thread: Math.min(p.params.thread ?? 22, p.params.L ?? 32),
                },
              };
            }
            if (p.kind === "hex-nut") {
              return { ...p, params: { ...p.params, d: preset.d, af: preset.af, t: preset.t } };
            }
            return p;
          }),
        );
      },
      setMaterial: (id, material) => {
        withHistory(set, get, (parts) => parts.map((p) => (p.id === id ? { ...p, material } : p)));
      },
      setTransform: (id, position, rotation) => {
        set({
          parts: get().parts.map((p) => (p.id === id ? { ...p, position, rotation } : p)),
        });
      },
      commitTransform: () => {
        const { parts, past } = get();
        const last = past[past.length - 1];
        if (last && JSON.stringify(last) === JSON.stringify(parts)) return;
        set({ past: [...past.slice(-48), last ? last : cloneParts(parts)], future: [] });
      },
      renamePart: (id, name) => {
        set({ parts: get().parts.map((p) => (p.id === id ? { ...p, name } : p)) });
      },
      duplicateSelected: () => {
        const { selectedId } = get();
        if (!selectedId) return;
        withHistory(set, get, (parts) => {
          const src = parts.find((p) => p.id === selectedId);
          if (!src) return parts;
          const copy: CadPart = {
            ...structuredClone(src),
            id: uid(),
            name: `${src.name} ·۲`,
            position: [src.position[0] + 16, src.position[1], src.position[2] + 16],
          };
          set({ selectedId: copy.id });
          return [...parts, copy];
        });
      },
      deleteSelected: () => {
        const { selectedId } = get();
        if (!selectedId) return;
        withHistory(set, get, (parts) => {
          const next = parts.filter((p) => p.id !== selectedId);
          set({ selectedId: next.at(-1)?.id ?? null });
          return next;
        });
      },
      toggleVisible: (id) => {
        set({
          parts: get().parts.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p)),
        });
      },
      toggleLocked: (id) => {
        set({
          parts: get().parts.map((p) => (p.id === id ? { ...p, locked: !p.locked } : p)),
        });
      },
      toggleGrid: () => set({ grid: !get().grid }),
      toggleSnap: () => set({ snap: !get().snap }),
      toggleSection: () => set({ section: !get().section }),
      setExplode: (v) => set({ explode: v }),
      requestView: (preset) => set({ viewTick: preset }),
      clearView: () => set({ viewTick: null }),
      requestCapture: () => set({ captureTick: get().captureTick + 1 }),
      undo: () => {
        const { past, parts, future } = get();
        const prev = past.at(-1);
        if (!prev) return;
        set({
          parts: prev,
          past: past.slice(0, -1),
          future: [cloneParts(parts), ...future].slice(0, 48),
          selectedId: prev.find((p) => p.id === get().selectedId)?.id ?? prev.at(-1)?.id ?? null,
        });
      },
      redo: () => {
        const { future, parts, past } = get();
        const next = future[0];
        if (!next) return;
        set({
          parts: next,
          future: future.slice(1),
          past: [...past, cloneParts(parts)],
        });
      },
      newProject: () => {
        const empty = emptyProject();
        withHistory(set, get, () => empty.parts);
        set({ name: empty.name, selectedId: null, panel: "library", explode: 0 });
      },
      loadSample: () => {
        const demo = sampleAssembly();
        withHistory(set, get, () => demo.parts);
        set({ name: demo.name, selectedId: demo.parts[4]?.id ?? null, panel: "none", explode: 0 });
      },
      setName: (name) => set({ name }),
    }),
    {
      name: "alyazh-cad-v1",
      skipHydration: true,
      partialize: (s) => ({
        name: s.name,
        parts: s.parts,
        selectedId: s.selectedId,
        lang: s.lang,
        tool: s.tool,
        grid: s.grid,
        snap: s.snap,
        section: s.section,
        explode: s.explode,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export function selectedPart(): CadPart | undefined {
  const { parts, selectedId } = useCadStore.getState();
  return parts.find((p) => p.id === selectedId);
}
