import {
  BoxSelect,
  Grid3x3,
  Magnet,
  Maximize2,
  Move,
  RotateCcw,
  Scan,
  MousePointer2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { t } from "@/lib/cad/i18n";
import { useCadStore } from "@/lib/cad/store";
import type { Tool, ViewPreset } from "@/lib/cad/types";
import { cn } from "@/lib/utils";

export function ViewPanel() {
  const lang = useCadStore((s) => s.lang);
  const tool = useCadStore((s) => s.tool);
  const setTool = useCadStore((s) => s.setTool);
  const grid = useCadStore((s) => s.grid);
  const snap = useCadStore((s) => s.snap);
  const section = useCadStore((s) => s.section);
  const explode = useCadStore((s) => s.explode);
  const toggleGrid = useCadStore((s) => s.toggleGrid);
  const toggleSnap = useCadStore((s) => s.toggleSnap);
  const toggleSection = useCadStore((s) => s.toggleSection);
  const setExplode = useCadStore((s) => s.setExplode);
  const requestView = useCadStore((s) => s.requestView);

  const tools: { id: Tool; icon: typeof Move; label: "select" | "move" | "rotate" }[] = [
    { id: "select", icon: MousePointer2, label: "select" },
    { id: "move", icon: Move, label: "move" },
    { id: "rotate", icon: RotateCcw, label: "rotate" },
  ];

  const views: { id: ViewPreset; label: "iso" | "front" | "top" | "right" | "left" | "fit" }[] = [
    { id: "iso", label: "iso" },
    { id: "front", label: "front" },
    { id: "top", label: "top" },
    { id: "right", label: "right" },
    { id: "left", label: "left" },
    { id: "fit", label: "fit" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-2">
        {tools.map((item) => (
          <Button
            key={item.id}
            variant={tool === item.id ? "default" : "secondary"}
            onClick={() => setTool(item.id)}
          >
            <item.icon />
            {t(lang, item.label)}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {views.map((item) => (
          <Button key={item.id} variant="outline" size="sm" onClick={() => requestView(item.id)}>
            {item.id === "fit" ? <Maximize2 /> : null}
            {t(lang, item.label)}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <ToggleChip active={grid} onClick={toggleGrid} icon={Grid3x3} label={t(lang, "grid")} />
        <ToggleChip active={snap} onClick={toggleSnap} icon={Magnet} label={t(lang, "snap")} />
        <ToggleChip active={section} onClick={toggleSection} icon={Scan} label={t(lang, "section")} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-medium text-muted">
            <BoxSelect className="size-3.5" />
            {t(lang, "explode")}
          </span>
          <span className="text-xs tabular-nums text-fg">{Math.round(explode * 100)}%</span>
        </div>
        <Slider min={0} max={1} step={0.01} value={[explode]} onValueChange={([v]) => setExplode(v ?? 0)} />
      </div>
    </div>
  );
}

function ToggleChip({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Grid3x3;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-11 flex-col items-center justify-center gap-1 rounded-md text-xs",
        active ? "bg-accent text-accent-fg" : "bg-surface-2 text-fg",
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}
