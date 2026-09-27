import { useState } from "react";
import { VRAM_PROFILES, findModel, findSampler } from "@/lib/catalog";
import { fileToDataUrl, readPngParameters } from "@/lib/image-file";
import { useStudio } from "@/lib/studio-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { NativeSelect, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function GalleryTab() {
  const images = useStudio((s) => s.images);
  const selectedId = useStudio((s) => s.selectedId);
  const patch = useStudio((s) => s.patch);
  const setTab = useStudio((s) => s.setTab);

  if (!images.length) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        La galería se llena con cada generación. Se guarda en este navegador.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 overflow-y-auto p-3 md:grid-cols-4 lg:grid-cols-5">
      {images.map((img) => (
        <button
          key={img.id}
          type="button"
          onClick={() => {
            patch({ selectedId: img.id });
            setTab("txt2img");
          }}
          className={`overflow-hidden rounded-lg border ${
            img.id === selectedId ? "border-brand" : "border-border"
          }`}
        >
          <img src={img.url} alt={img.prompt} className="aspect-square w-full object-cover" />
          <p className="truncate px-2 py-1.5 text-left text-xs text-muted-foreground">{img.prompt}</p>
        </button>
      ))}
    </div>
  );
}

export function SettingsTab() {
  const s = useStudio();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 overflow-y-auto p-4">
      <div>
        <h2 className="text-lg font-medium">Perfil de VRAM</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Elige la GPU real. En PCs modestos recorta resolución; en RX 9070 deja 2K nativo y extras 4K.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {VRAM_PROFILES.map((p) => {
          const active = s.profileId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => s.applyProfile(p.id)}
              className={`rounded-lg border p-4 text-left transition-colors duration-150 ${
                active ? "border-brand bg-brand/10" : "border-border bg-card hover:bg-muted"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{p.name}</p>
                {p.id === "rx9070" ? <Badge tone="brand">Detectada</Badge> : null}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.subtitle}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2">
        <Field label="Backend">
          <NativeSelect
            value={s.engine}
            onChange={(e) => s.patch({ engine: e.target.value as "rocm" | "directml" })}
          >
            <option value="rocm">ROCm (Linux / nativo AMD)</option>
            <option value="directml">DirectML (Windows)</option>
          </NativeSelect>
        </Field>
        <label className="flex min-h-11 items-center justify-between gap-3 self-end">
          <span className="text-sm">Guardián de memoria</span>
          <Switch checked={s.memoryGuard} onCheckedChange={(memoryGuard) => s.patch({ memoryGuard })} />
        </label>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
        <p className="text-foreground">Cómo evita colgar el PC</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Una sola generación a la vez. Interrumpir cancela el trabajo.</li>
          <li>El lote se recorta al máximo del perfil (1–2).</li>
          <li>4K no corre nativo: 2K y un pase extra de nitidez.</li>
          <li>La inferencia no usa tu VRAM local, así que Windows no se reinicia.</li>
        </ul>
      </div>
    </div>
  );
}

export function PngInfoTab() {
  const [info, setInfo] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);
  const images = useStudio((s) => s.images);
  const selectedId = useStudio((s) => s.selectedId);
  const patch = useStudio((s) => s.patch);
  const selected = images.find((i) => i.id === selectedId) ?? images[0];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 overflow-y-auto p-4">
      <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-6 text-center">
        <p className="text-sm">Carga un PNG para leer parámetros</p>
        <p className="mt-1 text-xs text-muted-foreground">También muestra los metadatos de la imagen seleccionada</p>
        <input
          type="file"
          accept="image/png,image/jpeg"
          className="sr-only"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setPreview(await fileToDataUrl(file, 1024));
            const parsed = await readPngParameters(file);
            setInfo(parsed ?? "Sin chunks de parámetros. Si es una imagen de RDNA Forge, usa la ficha de abajo.");
          }}
        />
      </label>
      {preview ? <img src={preview} alt="" className="frame mx-auto max-h-56 rounded-lg object-contain" /> : null}
      {info ? (
        <Textarea rows={10} readOnly value={info} className="font-mono text-xs" />
      ) : selected ? (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium">Imagen seleccionada</p>
          <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground">
            {findModel(selected.modelId).name}
            {"\n"}
            {findSampler(selected.samplerId).name} · {selected.steps} steps · CFG {selected.cfg}
            {"\n"}
            {selected.width}×{selected.height} · seed {selected.seed}
            {"\n\n"}
            {selected.prompt}
            {"\n\nNegative prompt:\n"}
            {selected.negative}
          </p>
          <Button
            className="mt-3"
            variant="outline"
            size="sm"
            onClick={() =>
              patch({
                prompt: selected.prompt,
                negative: selected.negative,
                modelId: selected.modelId,
                samplerId: selected.samplerId,
                steps: selected.steps,
                cfg: selected.cfg,
                seed: selected.seed,
                seedLocked: true,
                width: selected.width,
                height: selected.height,
              })
            }
          >
            Enviar a txt2img
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nada que leer todavía.</p>
      )}
    </div>
  );
}
