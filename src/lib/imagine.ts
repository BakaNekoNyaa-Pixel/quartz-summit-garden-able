import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { nearestAspect, type Resolution } from "./catalog";
import { buildEditPrompt, buildImaginePrompt } from "./prompt";

const GenerateSchema = z.object({
  prompt: z.string().trim().min(1).max(2500),
  negative: z.string().max(1200).default(""),
  modelId: z.string(),
  samplerId: z.string(),
  schedulerId: z.string(),
  styles: z
    .array(z.object({ id: z.string(), name: z.string(), text: z.string() }))
    .max(6)
    .default([]),
  cfg: z.number().min(1).max(30),
  steps: z.number().int().min(1).max(80),
  seed: z.number().int(),
  width: z.number().int().min(256).max(4096),
  height: z.number().int().min(256).max(4096),
  restoreFaces: z.boolean().default(false),
  clipSkip: z.number().int().min(1).max(4).default(1),
  n: z.number().int().min(1).max(2).default(1),
  resolution: z.enum(["1k", "1.5k", "2k"]),
  hires: z.boolean().default(false),
  fourK: z.boolean().default(false),
});

const EditSchema = z.object({
  prompt: z.string().max(2500).default(""),
  negative: z.string().max(1200).default(""),
  denoise: z.number().min(0.05).max(1).default(0.45),
  mode: z.enum(["img2img", "extras"]),
  upscalerId: z.string().optional(),
  imageUrl: z.string().min(8).max(8_000_000),
  resolution: z.enum(["1k", "1.5k", "2k"]).default("2k"),
  aspectRatio: z.string().optional(),
  n: z.number().int().min(1).max(2).default(1),
});

export type GenerateInput = z.infer<typeof GenerateSchema>;
export type EditInput = z.infer<typeof EditSchema>;

export type ImagineImage = {
  url: string;
  revisedPrompt?: string;
};

export type ImagineResult =
  | { ok: true; images: ImagineImage[]; usedPrompt: string }
  | { ok: false; error: string };

type ApiImage = {
  url?: string;
  b64_json?: string;
  revised_prompt?: string;
};

async function xaiImages(
  path: "/v1/images/generations" | "/v1/images/edits",
  body: Record<string, unknown>,
): Promise<ImagineResult> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error: "El motor de imagen no está disponible en este entorno.",
    };
  }

  const call = async () =>
    fetch(`https://api.x.ai${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120_000),
    });

  let res: Response;
  try {
    res = await call();
    if (!res.ok) {
      res = await call();
    }
  } catch {
    return { ok: false, error: "Tiempo de espera del motor. Inténtalo de nuevo." };
  }

  if (!res.ok) {
    let detail = `Error del motor (${res.status})`;
    try {
      const errBody = (await res.json()) as { error?: { message?: string } | string };
      if (typeof errBody.error === "string") detail = errBody.error;
      else if (errBody.error?.message) detail = errBody.error.message;
    } catch {
      /* keep status text */
    }
    if (res.status === 400) {
      return { ok: false, error: "El prompt fue rechazado. Prueba a reformularlo." };
    }
    if (res.status === 401 || res.status === 403 || /credits|spending-limit|subscription/i.test(detail)) {
      return {
        ok: false,
        error: "No hay cupo de generación ahora mismo. El estudio sigue listo: revisa el plan o inténtalo más tarde.",
      };
    }
    return { ok: false, error: detail };
  }

  const json = (await res.json()) as { data?: ApiImage[] };
  const images = (json.data ?? [])
    .map((item) => {
      const url = item.url
        ? item.url
        : item.b64_json
          ? `data:image/jpeg;base64,${item.b64_json}`
          : "";
      return { url, revisedPrompt: item.revised_prompt };
    })
    .filter((item) => item.url);

  if (!images.length) {
    return { ok: false, error: "El motor no devolvió ninguna imagen." };
  }
  return { ok: true, images, usedPrompt: String(body.prompt ?? "") };
}

function imageRef(imageUrl: string) {
  return {
    url: imageUrl,
    type: "image_url" as const,
  };
}

export const generateImages = createServerFn({ method: "POST" })
  .validator((input: unknown) => GenerateSchema.parse(input))
  .handler(async ({ data }): Promise<ImagineResult> => {
    const usedPrompt = buildImaginePrompt(data);
    const aspect = nearestAspect(data.width, data.height);
    const n = Math.min(2, data.n);

    const firstRes: Resolution = data.hires || data.fourK ? "1k" : data.resolution;

    const first = await xaiImages("/v1/images/generations", {
      model: "grok-imagine-image-2.0",
      prompt: usedPrompt,
      n,
      aspect_ratio: aspect,
      resolution: firstRes,
      response_format: "url",
    });
    if (!first.ok) return first;

    const needUpscale = data.hires || data.fourK;
    if (!needUpscale) return { ...first, usedPrompt };

    const targetRes: Resolution = "2k";
    const upscaled: ImagineImage[] = [];
    for (const img of first.images) {
      const extra = await xaiImages("/v1/images/edits", {
        model: "grok-imagine-image-2.0",
        prompt: data.fourK
          ? "Lossless ultra-sharp 4K upscale. Preserve composition, identity, colors and lighting. Add micro-detail only. No crop, no restyle, no text."
          : "2× hires fix upscale. Preserve composition and identity. Sharpen textures. No crop, no restyle.",
        image: imageRef(img.url),
        n: 1,
        aspect_ratio: aspect,
        resolution: targetRes,
        response_format: "url",
      });
      if (extra.ok) upscaled.push(...extra.images);
      else upscaled.push(img);
    }
    return { ok: true, images: upscaled, usedPrompt };
  });

export const editImages = createServerFn({ method: "POST" })
  .validator((input: unknown) => EditSchema.parse(input))
  .handler(async ({ data }): Promise<ImagineResult> => {
    const usedPrompt = buildEditPrompt(data);
    const result = await xaiImages("/v1/images/edits", {
      model: "grok-imagine-image-2.0",
      prompt: usedPrompt,
      image: imageRef(data.imageUrl),
      n: Math.min(2, data.n),
      aspect_ratio: data.aspectRatio,
      resolution: data.resolution,
      response_format: "url",
    });
    if (!result.ok) return result;
    return { ...result, usedPrompt };
  });
