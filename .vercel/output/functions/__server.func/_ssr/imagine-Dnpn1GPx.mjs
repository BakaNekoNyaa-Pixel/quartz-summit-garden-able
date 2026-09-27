import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { c as findModel, d as findScheduler, f as findUpscaler, m as nearestAspect, u as findSampler } from "./catalog-CdNQ86Bs.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/imagine-Dnpn1GPx.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function buildImaginePrompt(input) {
	const model = findModel(input.modelId);
	const sampler = findSampler(input.samplerId);
	const scheduler = findScheduler(input.schedulerId);
	const styleText = input.styles.map((s) => s.text).join(", ");
	const parts = [];
	parts.push(model.prefix);
	if (styleText) parts.push(styleText);
	parts.push(input.prompt.trim());
	parts.push(model.suffix);
	parts.push(`Rendered as a finished still with ${sampler.name} sampler and ${scheduler.name} noise schedule, CFG ${input.cfg}, ${input.steps} sampling steps, seed ${input.seed}. ${sampler.look}`);
	if (input.restoreFaces) parts.push("Natural facial structure, clean eyes, believable skin, no warped features.");
	if (input.clipSkip >= 2) parts.push("Strong prompt adherence, distinctive style, less photoreal drift.");
	parts.push(`Frame intended at ${input.width}×${input.height}, fill the canvas, no letterboxing, no watermark, no caption, no UI chrome.`);
	if (input.negative.trim()) parts.push(`Strictly avoid: ${input.negative.trim()}.`);
	return parts.filter(Boolean).join("\n");
}
function buildEditPrompt(input) {
	if (input.mode === "extras") return [
		`Upscale this image with ${findUpscaler(input.upscalerId ?? "rdna-gan").name}.`,
		"Increase micro-detail, texture, and optical sharpness.",
		"Preserve subject identity, composition, colors, lighting, and crop.",
		"No restyle, no added objects, no text, no watermark.",
		input.prompt.trim() ? `Optional direction: ${input.prompt.trim()}` : ""
	].filter(Boolean).join(" ");
	return [
		`Edit this image. Keep ${Math.round((1 - input.denoise) * 100)}% of composition and identity; change ${Math.round(input.denoise * 100)}% according to the prompt.`,
		input.prompt.trim(),
		"Match the original camera and lighting unless the prompt requires otherwise.",
		"No watermark, no extra limbs, no text overlay.",
		input.negative.trim() ? `Avoid: ${input.negative.trim()}.` : ""
	].filter(Boolean).join(" ");
}
var GenerateSchema = object({
	prompt: string().trim().min(1).max(2500),
	negative: string().max(1200).default(""),
	modelId: string(),
	samplerId: string(),
	schedulerId: string(),
	styles: array(object({
		id: string(),
		name: string(),
		text: string()
	})).max(6).default([]),
	cfg: number().min(1).max(30),
	steps: number().int().min(1).max(80),
	seed: number().int(),
	width: number().int().min(256).max(4096),
	height: number().int().min(256).max(4096),
	restoreFaces: boolean().default(false),
	clipSkip: number().int().min(1).max(4).default(1),
	n: number().int().min(1).max(2).default(1),
	resolution: _enum([
		"1k",
		"1.5k",
		"2k"
	]),
	hires: boolean().default(false),
	fourK: boolean().default(false)
});
var EditSchema = object({
	prompt: string().max(2500).default(""),
	negative: string().max(1200).default(""),
	denoise: number().min(.05).max(1).default(.45),
	mode: _enum(["img2img", "extras"]),
	upscalerId: string().optional(),
	imageUrl: string().min(8).max(8e6),
	resolution: _enum([
		"1k",
		"1.5k",
		"2k"
	]).default("2k"),
	aspectRatio: string().optional(),
	n: number().int().min(1).max(2).default(1)
});
async function xaiImages(path, body) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "El motor de imagen no está disponible en este entorno."
	};
	const call = async () => fetch(`https://api.x.ai${path}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify(body),
		signal: AbortSignal.timeout(12e4)
	});
	let res;
	try {
		res = await call();
		if (!res.ok) res = await call();
	} catch {
		return {
			ok: false,
			error: "Tiempo de espera del motor. Inténtalo de nuevo."
		};
	}
	if (!res.ok) {
		let detail = `Error del motor (${res.status})`;
		try {
			const errBody = await res.json();
			if (typeof errBody.error === "string") detail = errBody.error;
			else if (errBody.error?.message) detail = errBody.error.message;
		} catch {}
		if (res.status === 400) return {
			ok: false,
			error: "El prompt fue rechazado. Prueba a reformularlo."
		};
		if (res.status === 401 || res.status === 403 || /credits|spending-limit|subscription/i.test(detail)) return {
			ok: false,
			error: "No hay cupo de generación ahora mismo. El estudio sigue listo: revisa el plan o inténtalo más tarde."
		};
		return {
			ok: false,
			error: detail
		};
	}
	const images = ((await res.json()).data ?? []).map((item) => {
		return {
			url: item.url ? item.url : item.b64_json ? `data:image/jpeg;base64,${item.b64_json}` : "",
			revisedPrompt: item.revised_prompt
		};
	}).filter((item) => item.url);
	if (!images.length) return {
		ok: false,
		error: "El motor no devolvió ninguna imagen."
	};
	return {
		ok: true,
		images,
		usedPrompt: String(body.prompt ?? "")
	};
}
function imageRef(imageUrl) {
	return {
		url: imageUrl,
		type: "image_url"
	};
}
var generateImages_createServerFn_handler = createServerRpc({
	id: "bc7c606729868393dab3284668db16e19f9c71be586b8070e42ece1ab7eecd51",
	name: "generateImages",
	filename: "src/lib/imagine.ts"
}, (opts) => generateImages.__executeServer(opts));
var generateImages = createServerFn({ method: "POST" }).validator((input) => GenerateSchema.parse(input)).handler(generateImages_createServerFn_handler, async ({ data }) => {
	const usedPrompt = buildImaginePrompt(data);
	const aspect = nearestAspect(data.width, data.height);
	const first = await xaiImages("/v1/images/generations", {
		model: "grok-imagine-image-2.0",
		prompt: usedPrompt,
		n: Math.min(2, data.n),
		aspect_ratio: aspect,
		resolution: data.hires || data.fourK ? "1k" : data.resolution,
		response_format: "url"
	});
	if (!first.ok) return first;
	if (!(data.hires || data.fourK)) return {
		...first,
		usedPrompt
	};
	const targetRes = "2k";
	const upscaled = [];
	for (const img of first.images) {
		const extra = await xaiImages("/v1/images/edits", {
			model: "grok-imagine-image-2.0",
			prompt: data.fourK ? "Lossless ultra-sharp 4K upscale. Preserve composition, identity, colors and lighting. Add micro-detail only. No crop, no restyle, no text." : "2× hires fix upscale. Preserve composition and identity. Sharpen textures. No crop, no restyle.",
			image: imageRef(img.url),
			n: 1,
			aspect_ratio: aspect,
			resolution: targetRes,
			response_format: "url"
		});
		if (extra.ok) upscaled.push(...extra.images);
		else upscaled.push(img);
	}
	return {
		ok: true,
		images: upscaled,
		usedPrompt
	};
});
var editImages_createServerFn_handler = createServerRpc({
	id: "89e10c9bb58a1464e7b54e067b50b73a1b4696b442aaa741977310ee5195f64b",
	name: "editImages",
	filename: "src/lib/imagine.ts"
}, (opts) => editImages.__executeServer(opts));
var editImages = createServerFn({ method: "POST" }).validator((input) => EditSchema.parse(input)).handler(editImages_createServerFn_handler, async ({ data }) => {
	const usedPrompt = buildEditPrompt(data);
	const result = await xaiImages("/v1/images/edits", {
		model: "grok-imagine-image-2.0",
		prompt: usedPrompt,
		image: imageRef(data.imageUrl),
		n: Math.min(2, data.n),
		aspect_ratio: data.aspectRatio,
		resolution: data.resolution,
		response_format: "url"
	});
	if (!result.ok) return result;
	return {
		...result,
		usedPrompt
	};
});
//#endregion
export { editImages_createServerFn_handler, generateImages_createServerFn_handler };
