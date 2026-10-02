import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { BOLT_PRESETS, CATALOG, paramLabel } from "@/lib/cad/catalog";
import { MATERIALS } from "@/lib/cad/materials";
import { t } from "@/lib/cad/i18n";
import { useCadStore } from "@/lib/cad/store";
import { MATERIAL_IDS, type CadPart, type MaterialId, type Vec3 } from "@/lib/cad/types";
import { cn } from "@/lib/utils";

export function PropertiesPanel() {
  const lang = useCadStore((s) => s.lang);
  const parts = useCadStore((s) => s.parts);
  const selectedId = useCadStore((s) => s.selectedId);
  const part = parts.find((p) => p.id === selectedId);
  if (!part) {
    return (
      <div className="flex flex-col gap-2 py-6">
        <p className="text-sm font-medium text-fg">{t(lang, "noSelection")}</p>
        <p className="text-sm leading-normal text-muted">{t(lang, "noSelectionHint")}</p>
      </div>
    );
  }
  return <PartEditor part={part} />;
}

function PartEditor({ part }: { part: CadPart }) {
  const lang = useCadStore((s) => s.lang);
  const updateParams = useCadStore((s) => s.updateParams);
  const applyBoltPreset = useCadStore((s) => s.applyBoltPreset);
  const setMaterial = useCadStore((s) => s.setMaterial);
  const setTransform = useCadStore((s) => s.setTransform);
  const renamePart = useCadStore((s) => s.renamePart);
  const def = CATALOG[part.kind];
  const showMetric = part.kind === "hex-bolt" || part.kind === "hex-nut";

  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted">{lang === "fa" ? def.labelFa : def.labelEn}</span>
        <Input value={part.name} onChange={(e) => renamePart(part.id, e.target.value)} />
      </label>

      {showMetric ? (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted">{t(lang, "metric")}</span>
          <div className="flex flex-wrap gap-1.5">
            {BOLT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyBoltPreset(part.id, preset.id)}
                className={cn(
                  "h-9 rounded-sm px-3 text-xs font-medium tabular-nums",
                  part.params.d === preset.d
                    ? "bg-accent text-accent-fg"
                    : "bg-surface-2 text-fg hover:bg-surface-2/80",
                )}
              >
                {preset.id}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        {def.params.map((param) => {
          const value = part.params[param.key] ?? param.value;
          return (
            <div key={param.key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-muted">{paramLabel(param, lang)}</span>
                <span className="text-xs tabular-nums text-fg">
                  {param.unit === "count" ? Math.round(value) : value.toFixed(param.step < 1 ? 1 : 0)}
                  {param.unit === "mm" ? " mm" : ""}
                </span>
              </div>
              <Slider
                min={param.min}
                max={param.max}
                step={param.step}
                value={[value]}
                onValueChange={([v]) => {
                  if (v === undefined) return;
                  updateParams(part.id, { [param.key]: v });
                }}
              />
            </div>
          );
        })}
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted">{t(lang, "material")}</span>
        <div className="grid grid-cols-4 gap-2">
          {MATERIAL_IDS.map((id: MaterialId) => {
            const m = MATERIALS[id];
            const active = part.material === id;
            return (
              <button
                key={id}
                type="button"
                title={lang === "fa" ? m.labelFa : m.labelEn}
                onClick={() => setMaterial(part.id, id)}
                className={cn(
                  "flex min-h-11 flex-col items-center gap-1 rounded-md p-1.5",
                  active ? "shadow-[0_0_0_1px_var(--color-accent)]" : "shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
                )}
              >
                <span
                  className="size-6 rounded-full"
                  style={{ background: m.color }}
                  aria-hidden
                />
                <span className="text-xs leading-tight text-muted">
                  {lang === "fa" ? m.labelFa : m.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      <VecEditor
        label={t(lang, "transform")}
        value={part.position}
        onChange={(position) => setTransform(part.id, position, part.rotation)}
      />
      <VecEditor
        label={t(lang, "rot")}
        value={part.rotation}
        onChange={(rotation) => setTransform(part.id, part.position, rotation)}
      />
    </div>
  );
}

function VecEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Vec3;
  onChange: (v: Vec3) => void;
}) {
  const axes = ["X", "Y", "Z"] as const;
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted">{label}</span>
      <div className="grid grid-cols-3 gap-2">
        {axes.map((axis, i) => (
          <label key={axis} className="flex flex-col gap-1">
            <span className="text-xs text-faint">{axis}</span>
            <Input
              type="number"
              className="h-10 px-2"
              value={Number(value[i].toFixed(1))}
              onChange={(e) => {
                const next: Vec3 = [...value];
                next[i] = Number(e.target.value);
                onChange(next);
              }}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
