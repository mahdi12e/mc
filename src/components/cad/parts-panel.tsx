import { Copy, Eye, EyeOff, Lock, LockOpen, Trash2 } from "lucide-react";
import { PartGlyph } from "@/components/cad/part-glyph";
import { Button } from "@/components/ui/button";
import { partLabel, partSizeHint } from "@/lib/cad/catalog";
import { t } from "@/lib/cad/i18n";
import { useCadStore } from "@/lib/cad/store";
import { cn } from "@/lib/utils";

export function PartsPanel() {
  const lang = useCadStore((s) => s.lang);
  const parts = useCadStore((s) => s.parts);
  const selectedId = useCadStore((s) => s.selectedId);
  const select = useCadStore((s) => s.select);
  const toggleVisible = useCadStore((s) => s.toggleVisible);
  const toggleLocked = useCadStore((s) => s.toggleLocked);
  const duplicateSelected = useCadStore((s) => s.duplicateSelected);
  const deleteSelected = useCadStore((s) => s.deleteSelected);
  const setPanel = useCadStore((s) => s.setPanel);

  if (parts.length === 0) {
    return (
      <div className="flex flex-col gap-2 py-6">
        <p className="text-sm font-medium text-fg">{t(lang, "emptyTitle")}</p>
        <p className="text-sm leading-normal text-muted">{t(lang, "emptyBody")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {parts.map((part) => {
        const active = part.id === selectedId;
        return (
          <div
            key={part.id}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5",
              active ? "bg-surface-2" : "hover:bg-surface-2/60",
            )}
          >
            <button
              type="button"
              onClick={() => {
                select(part.id);
                setPanel("props");
              }}
              className="flex min-h-11 min-w-0 flex-1 items-center gap-2 text-start"
            >
              <PartGlyph kind={part.kind} className="size-8 shrink-0 text-accent" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-fg">{part.name}</span>
                <span className="block truncate text-xs tabular-nums text-muted">
                  {partLabel(part.kind, lang)} · {partSizeHint(part.kind, part.params)}
                </span>
              </span>
            </button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={part.visible ? t(lang, "hide") : t(lang, "show")}
              onClick={() => toggleVisible(part.id)}
            >
              {part.visible ? <Eye /> : <EyeOff />}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={part.locked ? t(lang, "unlock") : t(lang, "lock")}
              onClick={() => toggleLocked(part.id)}
            >
              {part.locked ? <Lock /> : <LockOpen />}
            </Button>
          </div>
        );
      })}
      {selectedId ? (
        <div className="mt-3 flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={duplicateSelected}>
            <Copy />
            {t(lang, "duplicate")}
          </Button>
          <Button variant="outline" className="flex-1" onClick={deleteSelected}>
            <Trash2 />
            {t(lang, "delete")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
