import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import { MODELS } from "@/lib/catalog";
import { useStudio, type StudioTab } from "@/lib/studio-store";
import { Badge } from "@/components/ui/badge";
import { NativeSelect } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDuration } from "@/lib/utils";
import { findProfile } from "@/lib/catalog";
import { PromptPanel } from "./prompt-panel";
import { OutputStage } from "./output-stage";
import { GalleryTab, PngInfoTab, SettingsTab } from "./side-tabs";

const TABS: { id: StudioTab; label: string }[] = [
  { id: "txt2img", label: "txt2img" },
  { id: "img2img", label: "img2img" },
  { id: "extras", label: "Extras" },
  { id: "pnginfo", label: "PNG Info" },
  { id: "gallery", label: "Galería" },
  { id: "settings", label: "Ajustes" },
];

export function StudioApp() {
  const tab = useStudio((s) => s.tab);
  const setTab = useStudio((s) => s.setTab);
  const generate = useStudio((s) => s.generate);
  const modelId = useStudio((s) => s.modelId);
  const patch = useStudio((s) => s.patch);
  const profileId = useStudio((s) => s.profileId);
  const busy = useStudio((s) => s.busy);
  const progress = useStudio((s) => s.progress);
  const status = useStudio((s) => s.status);
  const error = useStudio((s) => s.error);
  const elapsedMs = useStudio((s) => s.elapsedMs);
  const samplerId = useStudio((s) => s.samplerId);
  const width = useStudio((s) => s.width);
  const height = useStudio((s) => s.height);
  const profile = findProfile(profileId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        void generate();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [generate]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const split = tab === "txt2img" || tab === "img2img" || tab === "extras";

  return (
    <div className="flex min-h-dvh flex-col bg-background md:h-dvh md:overflow-hidden">
      <Toaster theme="dark" position="top-center" richColors={false} />
      <header className="flex flex-wrap items-center gap-3 border-b border-border px-3 py-2.5 md:px-4">
        <div className="flex items-center gap-2">
          <Mark />
          <div>
            <p className="text-sm font-semibold tracking-tight">RDNA Forge</p>
            <p className="text-xs text-muted-foreground">Estudio de imagen para Radeon</p>
          </div>
        </div>
        <div className="min-w-48 flex-1">
          <NativeSelect
            value={modelId}
            onChange={(e) => patch({ modelId: e.target.value })}
            aria-label="Checkpoint"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.kind} · {m.name}
              </option>
            ))}
          </NativeSelect>
        </div>
        <Badge tone="brand">{profile.name}</Badge>
      </header>

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as StudioTab)}
        className="flex min-h-0 flex-1 flex-col"
      >
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {split ? (
          <TabsContent value={tab} className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-12 md:overflow-hidden">
            <div className="min-h-0 md:col-span-7 md:h-full md:border-r md:border-border">
              <PromptPanel />
            </div>
            <div className="min-h-0 md:col-span-5 md:h-full">
              <OutputStage />
            </div>
          </TabsContent>
        ) : null}

        <TabsContent value="pnginfo" className="min-h-0 flex-1 overflow-y-auto">
          <PngInfoTab />
        </TabsContent>
        <TabsContent value="gallery" className="min-h-0 flex-1 overflow-y-auto">
          <GalleryTab />
        </TabsContent>
        <TabsContent value="settings" className="min-h-0 flex-1 overflow-y-auto">
          <SettingsTab />
        </TabsContent>
      </Tabs>

      <footer className="border-t border-border bg-card px-3 py-2 md:px-4">
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {status}
            {busy ? ` · ${Math.round(progress)}%` : elapsedMs > 0 ? ` · ${formatDuration(elapsedMs)}` : ""}
          </span>
          <span className="font-mono tabular-nums">
            {width}×{height} · {samplerId} · {profile.vramGb} GB
          </span>
        </div>
        <Progress value={busy ? progress : 0} />
      </footer>
    </div>
  );
}

function Mark() {
  return (
    <svg viewBox="0 0 24 24" className="size-7 text-brand" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="3" className="fill-secondary" />
      <path fill="currentColor" d="M6 18h3.4L12 8.8 14.6 18H18L12 4.5z" />
    </svg>
  );
}
