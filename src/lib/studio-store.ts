import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  STYLES,
  findProfile,
  findSampler,
  mapResolution,
  wantsFourK,
  type StyleDef,
  type VramProfile,
} from "./catalog";
import { editImages, generateImages } from "./imagine";
import { clamp, randomSeed } from "./utils";

export type StudioTab = "txt2img" | "img2img" | "extras" | "pnginfo" | "gallery" | "settings";

export type GalleryItem = {
  id: string;
  url: string;
  prompt: string;
  negative: string;
  modelId: string;
  samplerId: string;
  schedulerId: string;
  cfg: number;
  steps: number;
  seed: number;
  width: number;
  height: number;
  createdAt: number;
  source: StudioTab;
  usedPrompt: string;
};

type StudioState = {
  tab: StudioTab;
  prompt: string;
  negative: string;
  modelId: string;
  samplerId: string;
  schedulerId: string;
  styleIds: string[];
  cfg: number;
  steps: number;
  seed: number;
  seedLocked: boolean;
  width: number;
  height: number;
  batchCount: number;
  batchSize: number;
  restoreFaces: boolean;
  clipSkip: number;
  hires: boolean;
  denoise: number;
  upscalerId: string;
  extrasScale: number;
  profileId: string;
  tileAttention: boolean;
  tileVae: boolean;
  memoryGuard: boolean;
  engine: "rocm" | "directml";
  sourceImage: string | null;
  busy: boolean;
  progress: number;
  status: string;
  error: string | null;
  jobId: number;
  images: GalleryItem[];
  selectedId: string | null;
  elapsedMs: number;
  setTab: (tab: StudioTab) => void;
  patch: (partial: Partial<StudioState>) => void;
  toggleStyle: (id: string) => void;
  applyProfile: (id: string, resetSize?: boolean) => void;
  swapSize: () => void;
  setSize: (w: number, h: number) => void;
  interrupt: () => void;
  sendCurrentTo: (tab: "img2img" | "extras") => void;
  removeSelected: () => void;
  generate: () => Promise<void>;
};

const MAX_GALLERY = 36;

function activeStyles(ids: string[]): StyleDef[] {
  return STYLES.filter((s) => ids.includes(s.id));
}

function clampToProfile(width: number, height: number, profile: VramProfile, guard: boolean) {
  const max = !guard ? 3840 : profile.allow4k ? 3840 : profile.maxLongEdge;
  const long = Math.max(width, height);
  if (long <= max) return { width, height };
  const scale = max / long;
  const snap = (n: number) => Math.max(512, Math.round(n / 64) * 64);
  return { width: snap(width * scale), height: snap(height * scale) };
}

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      tab: "txt2img",
      prompt: "",
      negative: "lowres, watermark, text, extra fingers, deformed, oversharpen, jpeg artifacts",
      modelId: "flux-rdna",
      samplerId: "dpmpp_2m_karras",
      schedulerId: "karras",
      styleIds: ["cinematic"],
      cfg: 5,
      steps: 30,
      seed: -1,
      seedLocked: false,
      width: 1920,
      height: 1080,
      batchCount: 1,
      batchSize: 1,
      restoreFaces: false,
      clipSkip: 1,
      hires: false,
      denoise: 0.45,
      upscalerId: "rdna-gan",
      extrasScale: 2,
      profileId: "rx9070",
      tileAttention: false,
      tileVae: false,
      memoryGuard: true,
      engine: "rocm",
      sourceImage: null,
      busy: false,
      progress: 0,
      status: "Listo",
      error: null,
      jobId: 0,
      images: [],
      selectedId: null,
      elapsedMs: 0,

      setTab: (tab) => set({ tab, error: null }),
      patch: (partial) => set(partial),
      toggleStyle: (id) =>
        set((s) => ({
          styleIds: s.styleIds.includes(id)
            ? s.styleIds.filter((x) => x !== id)
            : [...s.styleIds, id],
        })),
      applyProfile: (id, resetSize = true) => {
        const profile = findProfile(id);
        const size = resetSize
          ? { width: profile.defaultWidth, height: profile.defaultHeight }
          : clampToProfile(get().width, get().height, profile, true);
        set({
          profileId: id,
          tileAttention: profile.tileAttention,
          tileVae: profile.tileVae,
          steps: profile.defaultSteps,
          batchSize: Math.min(get().batchSize, profile.maxBatch),
          batchCount: Math.min(get().batchCount, profile.maxBatch),
          hires: profile.allowHires ? get().hires : false,
          ...size,
        });
      },
      swapSize: () => set((s) => ({ width: s.height, height: s.width })),
      setSize: (w, h) => {
        const profile = findProfile(get().profileId);
        const next = clampToProfile(w, h, profile, get().memoryGuard);
        set(next);
      },
      interrupt: () =>
        set((s) => ({
          jobId: s.jobId + 1,
          busy: false,
          progress: 0,
          status: "Interrumpido",
        })),
      sendCurrentTo: (tab) => {
        const current = get().images.find((i) => i.id === get().selectedId);
        if (!current) return;
        set({ tab, sourceImage: current.url, prompt: current.prompt, negative: current.negative });
      },
      removeSelected: () => {
        const id = get().selectedId;
        set((s) => {
          const images = s.images.filter((i) => i.id !== id);
          return { images, selectedId: images[0]?.id ?? null };
        });
      },

      generate: async () => {
        const start = get();
        if (start.busy) return;
        if (start.tab !== "txt2img" && !start.sourceImage) {
          set({ error: "Carga o envía una imagen primero." });
          return;
        }
        if (start.tab === "txt2img" && !start.prompt.trim()) {
          set({ error: "Escribe un prompt para generar." });
          return;
        }

        const profile = findProfile(start.profileId);
        const sampler = findSampler(start.samplerId);
        const schedulerId = sampler.scheduler ?? start.schedulerId;
        const size = clampToProfile(start.width, start.height, profile, start.memoryGuard);
        const fourK = wantsFourK(size.width, size.height, profile);
        const hires = start.hires && profile.allowHires && !fourK;
        const n = fourK || hires ? 1 : clamp(start.batchCount * start.batchSize, 1, profile.maxBatch);
        const seed = start.seed < 0 || !start.seedLocked ? randomSeed() : start.seed;
        const jobId = start.jobId + 1;
        const t0 = performance.now();

        set({
          busy: true,
          progress: 6,
          status: "Reservando VRAM…",
          error: null,
          jobId,
          seed,
          width: size.width,
          height: size.height,
          elapsedMs: 0,
        });

        const tick = window.setInterval(() => {
          const s = get();
          if (s.jobId !== jobId || !s.busy) return;
          const next = Math.min(s.progress + (100 - s.progress) * 0.07, 92);
          const label = fourK
            ? "2K nativo → extra 4K"
            : hires
              ? "Hires. fix"
              : `${mapResolution(Math.max(size.width, size.height), profile).toUpperCase()} · ${profile.name}`;
          set({
            progress: next,
            status: `${label} · ${sampler.name}`,
            elapsedMs: performance.now() - t0,
          });
        }, 280);

        try {
          let result;
          if (start.tab === "img2img" || start.tab === "extras") {
            result = await editImages({
              data: {
                prompt: start.prompt,
                negative: start.negative,
                denoise: start.tab === "extras" ? 0.2 : start.denoise,
                mode: start.tab === "extras" ? "extras" : "img2img",
                upscalerId: start.upscalerId,
                imageUrl: start.sourceImage!,
                resolution: fourK || start.tab === "extras" ? "2k" : mapResolution(Math.max(size.width, size.height), profile),
                n,
              },
            });
          } else {
            result = await generateImages({
              data: {
                prompt: start.prompt,
                negative: start.negative,
                modelId: start.modelId,
                samplerId: start.samplerId,
                schedulerId,
                styles: activeStyles(start.styleIds),
                cfg: start.cfg,
                steps: start.steps,
                seed,
                width: size.width,
                height: size.height,
                restoreFaces: start.restoreFaces,
                clipSkip: start.clipSkip,
                n,
                resolution: mapResolution(Math.max(size.width, size.height), profile),
                hires,
                fourK,
              },
            });
          }

          if (get().jobId !== jobId) return;
          if (!result.ok) {
            set({ busy: false, progress: 0, status: "Error", error: result.error });
            return;
          }

          const items: GalleryItem[] = result.images.map((img, i) => ({
            id: `${jobId}-${i}-${seed}`,
            url: img.url,
            prompt: start.prompt,
            negative: start.negative,
            modelId: start.modelId,
            samplerId: start.samplerId,
            schedulerId,
            cfg: start.cfg,
            steps: start.steps,
            seed: seed + i,
            width: size.width,
            height: size.height,
            createdAt: Date.now(),
            source: start.tab,
            usedPrompt: result.usedPrompt,
          }));

          set((s) => ({
            busy: false,
            progress: 100,
            status: "Listo",
            elapsedMs: performance.now() - t0,
            images: [...items, ...s.images].slice(0, MAX_GALLERY),
            selectedId: items[0]?.id ?? s.selectedId,
          }));
        } catch {
          if (get().jobId !== jobId) return;
          set({
            busy: false,
            progress: 0,
            status: "Error",
            error: "No se pudo contactar el motor.",
          });
        } finally {
          window.clearInterval(tick);
        }
      },
    }),
    {
      name: "rdna-forge",
      partialize: (s) => ({
        prompt: s.prompt,
        negative: s.negative,
        modelId: s.modelId,
        samplerId: s.samplerId,
        schedulerId: s.schedulerId,
        styleIds: s.styleIds,
        cfg: s.cfg,
        steps: s.steps,
        seed: s.seed,
        seedLocked: s.seedLocked,
        width: s.width,
        height: s.height,
        batchCount: s.batchCount,
        batchSize: s.batchSize,
        restoreFaces: s.restoreFaces,
        clipSkip: s.clipSkip,
        hires: s.hires,
        denoise: s.denoise,
        upscalerId: s.upscalerId,
        extrasScale: s.extrasScale,
        profileId: s.profileId,
        tileAttention: s.tileAttention,
        tileVae: s.tileVae,
        memoryGuard: s.memoryGuard,
        engine: s.engine,
        images: s.images.slice(0, 12),
        selectedId: s.selectedId,
      }),
    },
  ),
);
