import { useMemo, useState } from "react";
import { PartGlyph } from "@/components/cad/part-glyph";
import { Input } from "@/components/ui/input";
import { CATALOG, CATEGORIES, partLabel } from "@/lib/cad/catalog";
import { t } from "@/lib/cad/i18n";
import { useCadStore } from "@/lib/cad/store";
import type { PartKind } from "@/lib/cad/types";
import { cn } from "@/lib/utils";

export function LibraryPanel() {
  const lang = useCadStore((s) => s.lang);
  const addPart = useCadStore((s) => s.addPart);
  const setPanel = useCadStore((s) => s.setPanel);
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const groups = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const items = (Object.keys(CATALOG) as PartKind[]).filter((kind) => {
        const def = CATALOG[kind];
        if (def.category !== cat.id) return false;
        if (!query) return true;
        return (
          def.labelFa.includes(q.trim()) ||
          def.labelEn.toLowerCase().includes(query) ||
          def.blurbFa.includes(q.trim()) ||
          def.blurbEn.toLowerCase().includes(query)
        );
      });
      return { cat, items };
    }).filter((g) => g.items.length > 0);
  }, [query, q]);

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t(lang, "search")}
        aria-label={t(lang, "search")}
      />
      {groups.map(({ cat, items }) => (
        <section key={cat.id} className="flex flex-col gap-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted">
            {lang === "fa" ? cat.fa : cat.en}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {items.map((kind) => {
              const def = CATALOG[kind];
              return (
                <button
                  key={kind}
                  type="button"
                  onClick={() => {
                    addPart(kind);
                    setPanel("none");
                  }}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-lg bg-surface-2 p-3 text-start",
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-colors duration-150",
                    "hover:bg-surface-2/80 min-h-11",
                  )}
                >
                  <PartGlyph kind={kind} className="size-10 text-accent" />
                  <span className="text-sm font-medium text-fg">{partLabel(kind, lang)}</span>
                  <span className="text-xs leading-snug text-muted">
                    {lang === "fa" ? def.blurbFa : def.blurbEn}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
