import {
  findModel,
  findSampler,
  findScheduler,
  findUpscaler,
  type StyleDef,
} from "./catalog";

export type PromptInput = {
  prompt: string;
  negative: string;
  modelId: string;
  samplerId: string;
  schedulerId: string;
  styles: StyleDef[];
  cfg: number;
  steps: number;
  seed: number;
  width: number;
  height: number;
  restoreFaces: boolean;
  clipSkip: number;
};

export function buildImaginePrompt(input: PromptInput): string {
  const model = findModel(input.modelId);
  const sampler = findSampler(input.samplerId);
  const scheduler = findScheduler(input.schedulerId);
  const styleText = input.styles.map((s) => s.text).join(", ");

  const parts: string[] = [];
  parts.push(model.prefix);
  if (styleText) parts.push(styleText);
  parts.push(input.prompt.trim());
  parts.push(model.suffix);
  parts.push(
    `Rendered as a finished still with ${sampler.name} sampler and ${scheduler.name} noise schedule, CFG ${input.cfg}, ${input.steps} sampling steps, seed ${input.seed}. ${sampler.look}`,
  );
  if (input.restoreFaces) {
    parts.push("Natural facial structure, clean eyes, believable skin, no warped features.");
  }
  if (input.clipSkip >= 2) {
    parts.push("Strong prompt adherence, distinctive style, less photoreal drift.");
  }
  parts.push(
    `Frame intended at ${input.width}×${input.height}, fill the canvas, no letterboxing, no watermark, no caption, no UI chrome.`,
  );
  if (input.negative.trim()) {
    parts.push(`Strictly avoid: ${input.negative.trim()}.`);
  }
  return parts.filter(Boolean).join("\n");
}

export function buildEditPrompt(input: {
  prompt: string;
  negative: string;
  denoise: number;
  mode: "img2img" | "extras";
  upscalerId?: string;
}): string {
  if (input.mode === "extras") {
    const up = findUpscaler(input.upscalerId ?? "rdna-gan");
    return [
      `Upscale this image with ${up.name}.`,
      "Increase micro-detail, texture, and optical sharpness.",
      "Preserve subject identity, composition, colors, lighting, and crop.",
      "No restyle, no added objects, no text, no watermark.",
      input.prompt.trim() ? `Optional direction: ${input.prompt.trim()}` : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  const keep = Math.round((1 - input.denoise) * 100);
  const change = Math.round(input.denoise * 100);
  return [
    `Edit this image. Keep ${keep}% of composition and identity; change ${change}% according to the prompt.`,
    input.prompt.trim(),
    "Match the original camera and lighting unless the prompt requires otherwise.",
    "No watermark, no extra limbs, no text overlay.",
    input.negative.trim() ? `Avoid: ${input.negative.trim()}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
}
