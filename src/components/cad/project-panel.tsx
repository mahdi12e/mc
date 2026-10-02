import { Camera, FolderPlus, Languages, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { t } from "@/lib/cad/i18n";
import { useCadStore } from "@/lib/cad/store";

export function ProjectPanel() {
  const lang = useCadStore((s) => s.lang);
  const name = useCadStore((s) => s.name);
  const parts = useCadStore((s) => s.parts);
  const setName = useCadStore((s) => s.setName);
  const newProject = useCadStore((s) => s.newProject);
  const loadSample = useCadStore((s) => s.loadSample);
  const requestCapture = useCadStore((s) => s.requestCapture);
  const setLang = useCadStore((s) => s.setLang);

  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted">{t(lang, "rename")}</span>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <p className="text-sm tabular-nums text-muted">
        {parts.length} {t(lang, "partsCount")} · {t(lang, "units")}
      </p>
      <div className="flex flex-col gap-2">
        <Button variant="secondary" onClick={newProject}>
          <FolderPlus />
          {t(lang, "newProject")}
        </Button>
        <Button variant="secondary" onClick={loadSample}>
          <LayoutGrid />
          {t(lang, "loadSample")}
        </Button>
        <Button variant="outline" onClick={requestCapture}>
          <Camera />
          {t(lang, "exportPng")}
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted">{t(lang, "language")}</span>
        <Button
          variant="outline"
          onClick={() => setLang(lang === "fa" ? "en" : "fa")}
        >
          <Languages />
          {lang === "fa" ? "English" : "فارسی"}
        </Button>
      </div>
      <p className="text-sm leading-normal text-muted">{t(lang, "about")}</p>
    </div>
  );
}
