import { Dices, FlipHorizontal2, Square } from "lucide-react";
import {
  MODELS,
  PROMPT_PRESETS,
  SAMPLERS,
  SCHEDULERS,
  SIZE_PRESETS,
  STYLES,
  findProfile,
  findSampler,
} from "@/lib/catalog";
import { fileToDataUrl } from "@/lib/image-file";
import { useStudio } from "@/lib/studio-store";
import { randomSeed } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input, NativeSelect, Textarea } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

function Num({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <Field label={label} hint={String(value)}>
      <div className="flex items-center gap-3">
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={([v]) => onChange(v ?? min)}
        />
        <Input
          type="number"
          className="h-8 w-20 shrink-0"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </Field>
  );
}

export function PromptPanel() {
  const s = useStudio();
  const profile = findProfile(s.profileId);
  const showSource = s.tab === "img2img" || s.tab === "extras";

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-3 md:p-4">
      {showSource ? <SourceSlot /> : null}

      <Field label="Prompt">
        <Textarea
          rows={5}
          value={s.prompt}
          placeholder="Describe la imagen. Sujeto, luz, objetivo, material…"
          onChange={(e) => s.patch({ prompt: e.target.value })}
        />
      </Field>

      <div className="flex flex-wrap gap-1.5">
        {PROMPT_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground"
            onClick={() => s.patch({ prompt: p.prompt, negative: p.negative })}
          >
            {p.label}
          </button>
        ))}
      </div>

      <Field label="Prompt negativo">
        <Textarea
          rows={2}
          value={s.negative}
          onChange={(e) => s.patch({ negative: e.target.value })}
        />
      </Field>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="generate"
          size="lg"
          className="min-h-12 flex-1"
          disabled={s.busy}
          onClick={() => void s.generate()}
        >
          Generar
          <span className="hidden font-mono text-xs font-normal opacity-80 sm:inline">Ctrl+Enter</span>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="min-h-12 sm:w-36"
          disabled={!s.busy}
          onClick={() => s.interrupt()}
        >
          Interrumpir
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {STYLES.map((st) => {
          const on = s.styleIds.includes(st.id);
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => s.toggleStyle(st.id)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors duration-150 ${
                on
                  ? "border-brand bg-brand/15 text-foreground"
                  : "border-border bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {st.name}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Sampler">
          <NativeSelect
            value={s.samplerId}
            onChange={(e) => {
              const sampler = findSampler(e.target.value);
              s.patch({
                samplerId: sampler.id,
                schedulerId: sampler.scheduler ?? s.schedulerId,
              });
            }}
          >
            {SAMPLERS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Schedule type">
          <NativeSelect
            value={s.schedulerId}
            onChange={(e) => s.patch({ schedulerId: e.target.value })}
          >
            {SCHEDULERS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </div>

      <Num
        label="Sampling steps"
        value={s.steps}
        min={4}
        max={profile.id === "igpu" ? 28 : 60}
        step={1}
        onChange={(steps) => s.patch({ steps })}
      />
      <Num
        label="CFG Scale"
        value={s.cfg}
        min={1}
        max={20}
        step={0.5}
        onChange={(cfg) => s.patch({ cfg })}
      />

      {s.tab === "img2img" ? (
        <Num
          label="Denoising strength"
          value={s.denoise}
          min={0.05}
          max={1}
          step={0.05}
          onChange={(denoise) => s.patch({ denoise })}
        />
      ) : null}

      {s.tab === "extras" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Upscaler">
            <NativeSelect
              value={s.upscalerId}
              onChange={(e) => s.patch({ upscalerId: e.target.value })}
            >
              {["rdna-gan", "esrgan", "latent", "anime", "ultrasharp"].map((id) => (
                <option key={id} value={id}>
                  {id === "rdna-gan"
                    ? "RDNA-GAN 4x"
                    : id === "esrgan"
                      ? "R-ESRGAN 4x+"
                      : id === "latent"
                        ? "Latent"
                        : id === "anime"
                          ? "R-ESRGAN Anime"
                          : "4x UltraSharp"}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Num
            label="Escala"
            value={s.extrasScale}
            min={1}
            max={4}
            step={1}
            onChange={(extrasScale) => s.patch({ extrasScale })}
          />
        </div>
      ) : null}

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Ancho × Alto</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => s.swapSize()} aria-label="Invertir">
              <FlipHorizontal2 />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => s.setSize(1024, 1024)}
              aria-label="Cuadrado"
            >
              <Square />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SIZE_PRESETS.map((p) => {
            const isFourK = Math.max(p.w, p.h) >= 2560;
            const blocked =
              s.memoryGuard &&
              Math.max(p.w, p.h) > profile.maxLongEdge &&
              !(profile.allow4k && isFourK);
            const active = s.width === p.w && s.height === p.h;
            return (
              <button
                key={p.id}
                type="button"
                disabled={blocked}
                onClick={() => s.setSize(p.w, p.h)}
                className={`rounded-md border px-2.5 py-1.5 text-xs tabular-nums transition-colors duration-150 disabled:opacity-30 ${
                  active
                    ? "border-brand bg-brand/15 text-foreground"
                    : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Num label="Ancho" value={s.width} min={512} max={3840} step={64} onChange={(w) => s.setSize(w, s.height)} />
          <Num label="Alto" value={s.height} min={512} max={3840} step={64} onChange={(h) => s.setSize(s.width, h)} />
        </div>
        {s.memoryGuard &&
        Math.max(s.width, s.height) > profile.maxLongEdge &&
        !(profile.allow4k && Math.max(s.width, s.height) >= 2560) ? (
          <p className="mt-2 text-xs text-warn">
            El guardián de memoria recortará a {profile.maxLongEdge}px en el lado largo.
          </p>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Seed">
          <div className="flex gap-1.5">
            <Input
              className="font-mono"
              value={s.seed}
              onChange={(e) => s.patch({ seed: Number(e.target.value) || -1, seedLocked: true })}
            />
            <Button
              variant="outline"
              size="icon"
              aria-label="Semilla aleatoria"
              onClick={() => s.patch({ seed: randomSeed(), seedLocked: false })}
            >
              <Dices />
            </Button>
          </div>
        </Field>
        <Num
          label="Batch count"
          value={s.batchCount}
          min={1}
          max={profile.maxBatch}
          step={1}
          onChange={(batchCount) => s.patch({ batchCount })}
        />
        <Num
          label="Batch size"
          value={s.batchSize}
          min={1}
          max={profile.maxBatch}
          step={1}
          onChange={(batchSize) => s.patch({ batchSize })}
        />
      </div>

      {s.tab === "txt2img" ? (
        <div className="grid gap-3 rounded-lg bg-card p-3 sm:grid-cols-2">
          <label className="flex min-h-11 items-center justify-between gap-3">
            <span className="text-sm">Hires. fix</span>
            <Switch
              checked={s.hires}
              disabled={!profile.allowHires}
              onCheckedChange={(hires) => s.patch({ hires })}
            />
          </label>
          <label className="flex min-h-11 items-center justify-between gap-3">
            <span className="text-sm">Restore faces</span>
            <Switch
              checked={s.restoreFaces}
              onCheckedChange={(restoreFaces) => s.patch({ restoreFaces })}
            />
          </label>
          <Num
            label="CLIP skip"
            value={s.clipSkip}
            min={1}
            max={2}
            step={1}
            onChange={(clipSkip) => s.patch({ clipSkip })}
          />
          <Field label="Checkpoint">
            <NativeSelect value={s.modelId} onChange={(e) => s.patch({ modelId: e.target.value })}>
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>
      ) : null}

      <div className="rounded-lg border border-border bg-card p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium">Motor AMD</p>
          <Badge tone="ok">{s.engine === "rocm" ? "ROCm" : "DirectML"}</Badge>
        </div>
        <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
          Inferencia en la nube: tu PC no se congela. El perfil limita resolución y lote como lo haría la VRAM.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex min-h-11 items-center justify-between gap-3">
            <span className="text-sm">Guardián de memoria</span>
            <Switch checked={s.memoryGuard} onCheckedChange={(memoryGuard) => s.patch({ memoryGuard })} />
          </label>
          <label className="flex min-h-11 items-center justify-between gap-3">
            <span className="text-sm">Atención teselada</span>
            <Switch checked={s.tileAttention} onCheckedChange={(tileAttention) => s.patch({ tileAttention })} />
          </label>
          <label className="flex min-h-11 items-center justify-between gap-3">
            <span className="text-sm">VAE teselado</span>
            <Switch checked={s.tileVae} onCheckedChange={(tileVae) => s.patch({ tileVae })} />
          </label>
        </div>
      </div>
    </div>
  );
}

function SourceSlot() {
  const sourceImage = useStudio((s) => s.sourceImage);
  const patch = useStudio((s) => s.patch);

  return (
    <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card p-4 text-center">
      {sourceImage ? (
        <img src={sourceImage} alt="Origen" className="frame max-h-48 rounded-md object-contain" />
      ) : (
        <>
          <p className="text-sm text-foreground">Suelta una imagen o pulsa para cargar</p>
          <p className="text-xs text-muted-foreground">JPG, PNG · se recodifica a 1536px para no saturar</p>
        </>
      )}
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const url = await fileToDataUrl(file);
          patch({ sourceImage: url });
        }}
      />
    </label>
  );
}
