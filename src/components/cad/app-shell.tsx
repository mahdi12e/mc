import {
  Box,
  Copy,
  FolderCog,
  Library,
  MousePointer2,
  Move,
  Plus,
  Redo2,
  RotateCcw,
  ScanEye,
  Trash2,
  Undo2,
} from "lucide-react";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { LibraryPanel } from "@/components/cad/library-panel";
import { PartsPanel } from "@/components/cad/parts-panel";
import { ProjectPanel } from "@/components/cad/project-panel";
import { PropertiesPanel } from "@/components/cad/properties-panel";
import { ViewPanel } from "@/components/cad/view-panel";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/drawer";
import { t } from "@/lib/cad/i18n";
import { useCadStore } from "@/lib/cad/store";
import type { Panel } from "@/lib/cad/types";
import { cn } from "@/lib/utils";

const Viewport = lazy(() => import("@/components/cad/viewport"));

export function AppShell() {
  const lang = useCadStore((s) => s.lang);
  const panel = useCadStore((s) => s.panel);
  const setPanel = useCadStore((s) => s.setPanel);

  useEffect(() => {
    void useCadStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);

  useHotkeys();

  const sheetOpen = panel !== "none";
  const sheetTitle =
    panel === "library"
      ? t(lang, "library")
      : panel === "parts"
        ? t(lang, "parts")
        : panel === "view"
          ? t(lang, "view")
          : panel === "project"
            ? t(lang, "project")
            : t(lang, "properties");

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-bg text-fg">
      <TopBar />
      <div className="relative flex min-h-0 flex-1">
        <aside className="hidden w-72 shrink-0 flex-col gap-3 overflow-y-auto border-e border-border bg-surface p-4 lg:flex">
          <h2 className="text-sm font-medium">{t(lang, "library")}</h2>
          <LibraryPanel />
        </aside>

        <main className="relative min-w-0 flex-1">
          <ClientViewport />
          <EmptyHint />
          <ViewChipBar />
          <SelectedBar />
          <button
            type="button"
            onClick={() => setPanel("library")}
            className="absolute end-4 bottom-4 z-20 flex size-14 items-center justify-center rounded-lg bg-accent text-accent-fg shadow-lg lg:hidden"
            aria-label={t(lang, "add")}
          >
            <Plus className="size-6" />
          </button>
        </main>

        <aside className="hidden w-80 shrink-0 flex-col overflow-hidden border-s border-border bg-surface lg:flex">
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <h2 className="mb-3 text-sm font-medium">{t(lang, "properties")}</h2>
            <PropertiesPanel />
          </div>
          <div className="max-h-[42%] overflow-y-auto border-t border-border p-4">
            <h2 className="mb-3 text-sm font-medium">{t(lang, "parts")}</h2>
            <PartsPanel />
          </div>
        </aside>
      </div>

      <footer className="hidden h-12 items-center justify-between gap-3 border-t border-border bg-surface px-4 text-xs text-muted lg:flex">
        <span className="tabular-nums">{t(lang, "units")}</span>
        <DesktopTools />
        <span>{t(lang, "tagline")}</span>
      </footer>
      <MobileNav />

      <BottomSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          if (!open) setPanel("none");
        }}
        title={sheetTitle}
      >
        {panel === "library" ? <LibraryPanel /> : null}
        {panel === "parts" ? <PartsPanel /> : null}
        {panel === "view" ? <ViewPanel /> : null}
        {panel === "project" ? <ProjectPanel /> : null}
        {panel === "props" ? <PropertiesPanel /> : null}
      </BottomSheet>
    </div>
  );
}

function ClientViewport() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-bg">
        <p className="text-sm text-muted">در حال بارگذاری صحنه سه‌بعدی…</p>
      </div>
    );
  }
  return (
    <Suspense
      fallback={
        <div className="absolute inset-0 grid place-items-center bg-bg">
          <p className="text-sm text-muted">در حال بارگذاری صحنه سه‌بعدی…</p>
        </div>
      }
    >
      <Viewport />
    </Suspense>
  );
}

function TopBar() {
  const lang = useCadStore((s) => s.lang);
  const name = useCadStore((s) => s.name);
  const parts = useCadStore((s) => s.parts);
  const undo = useCadStore((s) => s.undo);
  const redo = useCadStore((s) => s.redo);
  const past = useCadStore((s) => s.past);
  const future = useCadStore((s) => s.future);
  const setPanel = useCadStore((s) => s.setPanel);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface px-3 pt-[env(safe-area-inset-top)]">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Mark />
        <div className="min-w-0">
          <h1 className="truncate text-sm font-medium tracking-tight text-fg">{t(lang, "app")}</h1>
          <p className="truncate text-xs text-muted">
            {name} · {parts.length} {t(lang, "partsCount")}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon-sm" onClick={undo} disabled={past.length === 0} aria-label={t(lang, "undo")}>
        <Undo2 />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={redo} disabled={future.length === 0} aria-label={t(lang, "redo")}>
        <Redo2 />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={() => setPanel("project")} aria-label={t(lang, "project")}>
        <FolderCog />
      </Button>
    </header>
  );
}

function Mark() {
  return (
    <span className="grid size-9 place-items-center rounded-md bg-surface-2 text-accent shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
        <polygon
          points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </span>
  );
}

function ViewChipBar() {
  const lang = useCadStore((s) => s.lang);
  const requestView = useCadStore((s) => s.requestView);
  const items = ["iso", "front", "top", "fit"] as const;
  return (
    <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex justify-end">
      <div className="pointer-events-auto flex gap-1 rounded-lg bg-surface/90 p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
        {items.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => requestView(id)}
            className="h-9 min-w-11 rounded-sm px-2.5 text-xs text-fg hover:bg-surface-2"
          >
            {t(lang, id)}
          </button>
        ))}
      </div>
    </div>
  );
}

function SelectedBar() {
  const lang = useCadStore((s) => s.lang);
  const parts = useCadStore((s) => s.parts);
  const selectedId = useCadStore((s) => s.selectedId);
  const tool = useCadStore((s) => s.tool);
  const setTool = useCadStore((s) => s.setTool);
  const setPanel = useCadStore((s) => s.setPanel);
  const duplicateSelected = useCadStore((s) => s.duplicateSelected);
  const deleteSelected = useCadStore((s) => s.deleteSelected);
  const part = parts.find((p) => p.id === selectedId);
  if (!part) return null;

  return (
    <div className="absolute inset-x-3 bottom-20 z-10 flex items-center gap-1 rounded-lg bg-surface/95 p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] lg:bottom-4">
      <button
        type="button"
        onClick={() => setPanel("props")}
        className="min-h-11 min-w-0 flex-1 truncate px-3 text-start text-sm text-fg"
      >
        {part.name}
      </button>
      <ToolBtn
        active={tool === "select"}
        label={t(lang, "select")}
        onClick={() => setTool("select")}
      >
        <MousePointer2 />
      </ToolBtn>
      <ToolBtn active={tool === "move"} label={t(lang, "move")} onClick={() => setTool("move")}>
        <Move />
      </ToolBtn>
      <ToolBtn
        active={tool === "rotate"}
        label={t(lang, "rotate")}
        onClick={() => setTool("rotate")}
      >
        <RotateCcw />
      </ToolBtn>
      <ToolBtn label={t(lang, "duplicate")} onClick={duplicateSelected}>
        <Copy />
      </ToolBtn>
      <ToolBtn label={t(lang, "delete")} onClick={deleteSelected}>
        <Trash2 />
      </ToolBtn>
    </div>
  );
}

function ToolBtn({
  active,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid size-11 place-items-center rounded-sm",
        active ? "bg-accent text-accent-fg" : "text-fg hover:bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}

function EmptyHint() {
  const lang = useCadStore((s) => s.lang);
  const parts = useCadStore((s) => s.parts);
  const setPanel = useCadStore((s) => s.setPanel);
  const loadSample = useCadStore((s) => s.loadSample);
  if (parts.length > 0) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center p-6">
      <div className="pointer-events-auto max-w-sm rounded-xl bg-surface p-6 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
        <p className="text-lg font-medium tracking-tight text-fg">{t(lang, "emptyTitle")}</p>
        <p className="mt-2 text-sm leading-normal text-muted">{t(lang, "emptyBody")}</p>
        <div className="mt-4 flex flex-col gap-2">
          <Button onClick={() => setPanel("library")}>{t(lang, "add")}</Button>
          <Button variant="secondary" onClick={loadSample}>
            {t(lang, "loadSample")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function MobileNav() {
  const lang = useCadStore((s) => s.lang);
  const panel = useCadStore((s) => s.panel);
  const setPanel = useCadStore((s) => s.setPanel);
  const items: { id: Panel; icon: typeof Library; label: "library" | "parts" | "view" | "project" }[] = [
    { id: "library", icon: Library, label: "library" },
    { id: "parts", icon: Box, label: "parts" },
    { id: "view", icon: ScanEye, label: "view" },
    { id: "project", icon: FolderCog, label: "project" },
  ];
  return (
    <nav className="flex h-16 shrink-0 items-stretch border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
      {items.map((item) => {
        const active = panel === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setPanel(active ? "none" : item.id)}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-xs",
              active ? "text-accent" : "text-muted",
            )}
          >
            <item.icon className="size-5" />
            {t(lang, item.label)}
          </button>
        );
      })}
    </nav>
  );
}

function DesktopTools() {
  const lang = useCadStore((s) => s.lang);
  const tool = useCadStore((s) => s.tool);
  const setTool = useCadStore((s) => s.setTool);
  const grid = useCadStore((s) => s.grid);
  const snap = useCadStore((s) => s.snap);
  const section = useCadStore((s) => s.section);
  const toggleGrid = useCadStore((s) => s.toggleGrid);
  const toggleSnap = useCadStore((s) => s.toggleSnap);
  const toggleSection = useCadStore((s) => s.toggleSection);
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant={tool === "select" ? "default" : "ghost"} onClick={() => setTool("select")}>
        {t(lang, "select")}
      </Button>
      <Button size="sm" variant={tool === "move" ? "default" : "ghost"} onClick={() => setTool("move")}>
        {t(lang, "move")}
      </Button>
      <Button size="sm" variant={tool === "rotate" ? "default" : "ghost"} onClick={() => setTool("rotate")}>
        {t(lang, "rotate")}
      </Button>
      <Button size="sm" variant={grid ? "secondary" : "ghost"} onClick={toggleGrid}>
        {t(lang, "grid")}
      </Button>
      <Button size="sm" variant={snap ? "secondary" : "ghost"} onClick={toggleSnap}>
        {t(lang, "snap")}
      </Button>
      <Button size="sm" variant={section ? "secondary" : "ghost"} onClick={toggleSection}>
        {t(lang, "section")}
      </Button>
    </div>
  );
}

function useHotkeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const s = useCadStore.getState();
      if (e.key === "Delete" || e.key === "Backspace") s.deleteSelected();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) s.redo();
        else s.undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        s.duplicateSelected();
      }
      if (e.key === "g" || e.key === "G") s.setTool("move");
      if (e.key === "r" || e.key === "R") s.setTool("rotate");
      if (e.key === "q" || e.key === "Q") s.setTool("select");
      if (e.key === "f" || e.key === "F") s.requestView("fit");
      if (e.key === "Escape") {
        s.select(null);
        s.setPanel("none");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
