import { Download, ImageIcon, Send, Trash2, Maximize2 } from "lucide-react";
import { useState } from "react";
import { MODELS, SAMPLERS, findModel, findSampler } from "@/lib/catalog";
import { downloadUrl } from "@/lib/image-file";
import { useStudio, type GalleryItem } from "@/lib/studio-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function OutputStage() {
  const images = useStudio((s) => s.images);
  const selectedId = useStudio((s) => s.selectedId);
  const busy = useStudio((s) => s.busy);
  const progress = useStudio((s) => s.progress);
  const patch = useStudio((s) => s.patch);
  const current = images.find((i) => i.id === selectedId) ?? images[0];
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3 md:p-4">
      <div className="checker-well relative flex min-h-64 flex-1 items-center justify-center overflow-hidden rounded-lg">
        {busy && !current ? <div className="absolute inset-0 shimmer" /> : null}
        {current ? (
          <button
            type="button"
            className="flex h-full w-full items-center justify-center"
            onClick={() => setOpen(true)}
          >
            <img
              src={current.url}
              alt={current.prompt}
              className="frame max-h-full max-w-full object-contain"
            />
          </button>
        ) : busy ? null : (
          <EmptyWell />
        )}
        {busy ? (
          <div className="absolute bottom-3 left-3 right-3 rounded-md bg-background/80 px-3 py-2">
            <p className="mb-1.5 text-xs text-muted-foreground">
              Muestreando… {Math.round(progress)}%
            </p>
            <div className="h-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-brand transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>

      {current ? <MetaBar item={current} onOpen={() => setOpen(true)} /> : null}

      {images.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => patch({ selectedId: img.id })}
              className={`relative size-16 shrink-0 overflow-hidden rounded-md border ${
                img.id === current?.id ? "border-brand" : "border-border"
              }`}
            >
              <img src={img.url} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="relative bg-well p-2">
          {current ? (
            <img
              src={current.url}
              alt={current.prompt}
              className="max-h-screen w-full rounded-lg object-contain"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MetaBar({ item, onOpen }: { item: GalleryItem; onOpen: () => void }) {
  const sendCurrentTo = useStudio((s) => s.sendCurrentTo);
  const removeSelected = useStudio((s) => s.removeSelected);
  const patch = useStudio((s) => s.patch);
  const model = findModel(item.modelId);
  const sampler = findSampler(item.samplerId);

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm text-foreground">{item.prompt || "Sin prompt"}</p>
          <p className="mt-1 font-mono text-xs tabular-nums text-muted-foreground">
            {model.name} · {item.width}×{item.height} · {sampler.name} · {item.steps} steps · CFG{" "}
            {item.cfg} · seed {item.seed}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          <Button variant="outline" size="sm" onClick={onOpen}>
            <Maximize2 /> Ampliar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadUrl(item.url, `rdna-forge-${item.seed}.jpg`)}
          >
            <Download /> Descargar
          </Button>
          <Button variant="outline" size="sm" onClick={() => sendCurrentTo("img2img")}>
            <Send /> img2img
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => patch({ seed: item.seed, seedLocked: true })}
          >
            Reusar seed
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Eliminar" onClick={removeSelected}>
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyWell() {
  const error = useStudio((s) => s.error);
  return (
    <div className="flex max-w-sm flex-col items-center gap-3 px-6 py-10 text-center">
      <ImageIcon className="size-8 text-muted-foreground" />
      <p className="text-sm text-foreground">Nada generado todavía</p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Escribe un prompt y pulsa Generar. El motor corre fuera de tu GPU: el PC no se pega aunque
        pidas 2K.
      </p>
      {error ? <p className="text-xs leading-relaxed text-warn">{error}</p> : <Badge>
        {MODELS[0].name} · {SAMPLERS[8].name}
      </Badge>}
    </div>
  );
}
