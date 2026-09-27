//#region node_modules/.nitro/vite/services/ssr/assets/catalog-CdNQ86Bs.js
var MODELS = [
	{
		id: "flux-rdna",
		name: "FLUX.1 RDNA [dev]",
		kind: "FLUX",
		prefix: "Photoreal cinematic still, natural physics, rich materials.",
		suffix: "Coherent lighting, sharp optics, no warped anatomy."
	},
	{
		id: "sdxl",
		name: "SDXL Base 1.0",
		kind: "SDXL",
		prefix: "High-fidelity illustration, balanced composition, clean edges.",
		suffix: "Detailed but not overcooked, consistent perspective."
	},
	{
		id: "realistic",
		name: "Realistic Vision XL",
		kind: "Photo",
		prefix: "Photographed, real skin texture, believable optics, available light.",
		suffix: "DSLR look, accurate materials, no plastic skin, no extra fingers."
	},
	{
		id: "cinematic",
		name: "CineStill 35mm",
		kind: "Film",
		prefix: "35mm motion-picture still, anamorphic character, practical lights.",
		suffix: "Film grain, motivated lighting, shallow depth where it fits."
	},
	{
		id: "anime",
		name: "Illustrious Anime XL",
		kind: "Anime",
		prefix: "Anime key visual, clean linework, expressive eyes, cel-shaded color.",
		suffix: "Studio lighting, readable silhouette, no photoreal skin."
	},
	{
		id: "pony",
		name: "Pony Diffusion XL",
		kind: "Stylized",
		prefix: "Stylized character illustration, bold shapes, graphic color.",
		suffix: "Sharp design, appealing proportions, finished render."
	},
	{
		id: "archviz",
		name: "ArchViz Unreal",
		kind: "Arch",
		prefix: "Architectural visualization, physically based materials, daylight.",
		suffix: "Correct scale, clean edges, no warped architecture."
	},
	{
		id: "product",
		name: "Product Studio",
		kind: "Product",
		prefix: "Studio product photograph, controlled lighting, precise materials.",
		suffix: "Catalog sharpness, seamless or grounded set, no brand logos."
	}
];
var SAMPLERS = [
	{
		id: "euler",
		name: "Euler",
		look: "Stable, slightly soft, faithful to the prompt."
	},
	{
		id: "euler_a",
		name: "Euler a",
		look: "Ancestral, more variation and painterly life."
	},
	{
		id: "heun",
		name: "Heun",
		look: "Heavier, smoother, fewer artifacts."
	},
	{
		id: "lms",
		name: "LMS",
		look: "Linear multistep, calm and even."
	},
	{
		id: "ddim",
		name: "DDIM",
		look: "Deterministic, crisp structure."
	},
	{
		id: "dpm2",
		name: "DPM2",
		look: "Second-order, clean midtones."
	},
	{
		id: "dpm2_a",
		name: "DPM2 a",
		look: "Ancestral DPM, more texture."
	},
	{
		id: "dpmpp_2m",
		name: "DPM++ 2M",
		look: "Modern default, sharp and reliable."
	},
	{
		id: "dpmpp_2m_karras",
		name: "DPM++ 2M Karras",
		look: "Karras noise, photographic cleanliness.",
		scheduler: "karras"
	},
	{
		id: "dpmpp_sde",
		name: "DPM++ SDE",
		look: "Stochastic, richer grain and detail."
	},
	{
		id: "dpmpp_sde_karras",
		name: "DPM++ SDE Karras",
		look: "SDE with Karras, detailed but controlled.",
		scheduler: "karras"
	},
	{
		id: "dpmpp_2m_sde",
		name: "DPM++ 2M SDE",
		look: "Hybrid 2M/SDE, high microdetail."
	},
	{
		id: "dpmpp_3m_sde",
		name: "DPM++ 3M SDE",
		look: "Third-order, very fine structure."
	},
	{
		id: "unipc",
		name: "UniPC",
		look: "Fast convergent, good at low steps."
	},
	{
		id: "lcm",
		name: "LCM",
		look: "Few-step, slightly softer, very quick."
	},
	{
		id: "restart",
		name: "Restart",
		look: "Restart sampling, extra clarity in textures."
	},
	{
		id: "ddpm",
		name: "DDPM",
		look: "Classic diffusion, slower, even noise."
	}
];
var SCHEDULERS = [
	{
		id: "automatic",
		name: "Automatic"
	},
	{
		id: "karras",
		name: "Karras"
	},
	{
		id: "exponential",
		name: "Exponential"
	},
	{
		id: "polyexponential",
		name: "Polyexponential"
	},
	{
		id: "sgm_uniform",
		name: "SGM Uniform"
	},
	{
		id: "simple",
		name: "Simple"
	},
	{
		id: "ddim_uniform",
		name: "DDIM Uniform"
	},
	{
		id: "beta",
		name: "Beta"
	},
	{
		id: "linear_quadratic",
		name: "Linear Quadratic"
	}
];
var STYLES = [
	{
		id: "cinematic",
		name: "Cinematic",
		text: "cinematic color grade, volumetric light, anamorphic bokeh"
	},
	{
		id: "photo",
		name: "Photographic",
		text: "natural photography, accurate materials, real lens artifacts"
	},
	{
		id: "analog",
		name: "Analog film",
		text: "Kodak Portra, gentle grain, halation, analog color"
	},
	{
		id: "paint",
		name: "Digital painting",
		text: "painted brushwork, rich pigment, artstation finish"
	},
	{
		id: "fantasy",
		name: "Fantasy art",
		text: "epic fantasy illustration, ornate detail, dramatic sky"
	},
	{
		id: "portrait",
		name: "Studio portrait",
		text: "85mm portrait, beauty lighting, catchlights, shallow DOF"
	},
	{
		id: "iso",
		name: "Isometric",
		text: "isometric view, clean 30-degree projection, miniature set"
	},
	{
		id: "water",
		name: "Watercolor",
		text: "watercolor on paper, pigment blooms, visible paper tooth"
	}
];
var UPSCALERS = [
	{
		id: "rdna-gan",
		name: "RDNA-GAN 4x"
	},
	{
		id: "esrgan",
		name: "R-ESRGAN 4x+"
	},
	{
		id: "latent",
		name: "Latent (nearest)"
	},
	{
		id: "anime",
		name: "R-ESRGAN 4x+ Anime"
	},
	{
		id: "ultrasharp",
		name: "4x UltraSharp"
	}
];
var VRAM_PROFILES = [
	{
		id: "igpu",
		name: "Integrada / 4 GB",
		subtitle: "iGPU o entrada. 1K, lote 1, teselado on.",
		vramGb: 4,
		maxLongEdge: 768,
		resolution: "1k",
		maxBatch: 1,
		defaultSteps: 16,
		defaultWidth: 768,
		defaultHeight: 768,
		allowHires: false,
		allow4k: false,
		tileAttention: true,
		tileVae: true
	},
	{
		id: "8gb",
		name: "8 GB · RX 6600 / 7600",
		subtitle: "1K nativo, teselado, sin 4K.",
		vramGb: 8,
		maxLongEdge: 1024,
		resolution: "1k",
		maxBatch: 1,
		defaultSteps: 22,
		defaultWidth: 1024,
		defaultHeight: 1024,
		allowHires: false,
		allow4k: false,
		tileAttention: true,
		tileVae: true
	},
	{
		id: "12gb",
		name: "12 GB · RX 6700 / 7700",
		subtitle: "Hasta 1.5K. Hires opcional.",
		vramGb: 12,
		maxLongEdge: 1536,
		resolution: "1.5k",
		maxBatch: 1,
		defaultSteps: 26,
		defaultWidth: 1280,
		defaultHeight: 720,
		allowHires: true,
		allow4k: false,
		tileAttention: true,
		tileVae: false
	},
	{
		id: "rx9070",
		name: "16 GB · RX 9070",
		subtitle: "Tu GPU. 2K nativo, extras 4K, lote 2.",
		vramGb: 16,
		maxLongEdge: 2048,
		resolution: "2k",
		maxBatch: 2,
		defaultSteps: 30,
		defaultWidth: 1920,
		defaultHeight: 1080,
		allowHires: true,
		allow4k: true,
		tileAttention: false,
		tileVae: false
	},
	{
		id: "24gb",
		name: "24 GB+",
		subtitle: "Tope de estudio. 2K nativo + extras 4K.",
		vramGb: 24,
		maxLongEdge: 3840,
		resolution: "2k",
		maxBatch: 2,
		defaultSteps: 32,
		defaultWidth: 2048,
		defaultHeight: 2048,
		allowHires: true,
		allow4k: true,
		tileAttention: false,
		tileVae: false
	}
];
var SIZE_PRESETS = [
	{
		id: "512",
		w: 512,
		h: 512,
		label: "512"
	},
	{
		id: "768",
		w: 768,
		h: 768,
		label: "768"
	},
	{
		id: "1024",
		w: 1024,
		h: 1024,
		label: "1K"
	},
	{
		id: "1280",
		w: 1280,
		h: 720,
		label: "HD"
	},
	{
		id: "1536",
		w: 1536,
		h: 1536,
		label: "1.5K"
	},
	{
		id: "1920",
		w: 1920,
		h: 1080,
		label: "2K"
	},
	{
		id: "2048",
		w: 2048,
		h: 2048,
		label: "Q2K"
	},
	{
		id: "3840",
		w: 3840,
		h: 2160,
		label: "4K"
	}
];
var PROMPT_PRESETS = [
	{
		id: "pilot",
		label: "Retrato hangar",
		prompt: "Retrato cinematográfico de un piloto con casco de fibra de carbono, luz cálida de hangar, 85mm, piel real, reflejos en la visera",
		negative: "cartoon, extra fingers, oversharpen, watermark, text"
	},
	{
		id: "forest",
		label: "Bosque",
		prompt: "Bosque de secuoyas al amanecer, niebla densa entre troncos, luz volumétrica dorada, fotografía de paisaje, 35mm",
		negative: "people, buildings, neon, oversaturated, illustration"
	},
	{
		id: "cabin",
		label: "Cabina RDNA",
		prompt: "Interior de cabina de nave RDNA, paneles holográficos sutiles, aleación oscura cepillada, asiento de piloto, concepto industrial realista",
		negative: "cartoon, messy cables, extra screens, low-res"
	},
	{
		id: "still",
		label: "Producto",
		prompt: "Reloj mecánico de titanio sobre pizarra negra, luz de ventana lateral, reflejo controlado, foto de producto de estudio",
		negative: "logo, brand, plastic, dusty, text"
	}
];
var RATIOS = [
	[
		1,
		1,
		"1:1"
	],
	[
		16,
		9,
		"16:9"
	],
	[
		9,
		16,
		"9:16"
	],
	[
		4,
		3,
		"4:3"
	],
	[
		3,
		4,
		"3:4"
	],
	[
		3,
		2,
		"3:2"
	],
	[
		2,
		3,
		"2:3"
	],
	[
		2,
		1,
		"2:1"
	],
	[
		1,
		2,
		"1:2"
	],
	[
		21,
		9,
		"21:9"
	],
	[
		5,
		2,
		"5:2"
	]
];
function nearestAspect(width, height) {
	const r = width / Math.max(1, height);
	let best = "1:1";
	let bestDiff = Infinity;
	for (const [a, b, name] of RATIOS) {
		const diff = Math.abs(r - a / b);
		if (diff < bestDiff) {
			bestDiff = diff;
			best = name;
		}
	}
	return best;
}
function mapResolution(longEdge, profile) {
	const edge = Math.min(longEdge, profile.maxLongEdge);
	if (edge >= 1800) return "2k";
	if (edge >= 1280) return profile.resolution === "1k" ? "1k" : "1.5k";
	return "1k";
}
function wantsFourK(width, height, profile) {
	return profile.allow4k && Math.max(width, height) >= 2560;
}
function findModel(id) {
	return MODELS.find((m) => m.id === id) ?? MODELS[0];
}
function findSampler(id) {
	return SAMPLERS.find((s) => s.id === id) ?? SAMPLERS[0];
}
function findScheduler(id) {
	return SCHEDULERS.find((s) => s.id === id) ?? SCHEDULERS[0];
}
function findProfile(id) {
	return VRAM_PROFILES.find((p) => p.id === id) ?? VRAM_PROFILES[3];
}
function findUpscaler(id) {
	return UPSCALERS.find((u) => u.id === id) ?? UPSCALERS[0];
}
//#endregion
export { SIZE_PRESETS as a, findModel as c, findScheduler as d, findUpscaler as f, wantsFourK as h, SCHEDULERS as i, findProfile as l, nearestAspect as m, PROMPT_PRESETS as n, STYLES as o, mapResolution as p, SAMPLERS as r, VRAM_PROFILES as s, MODELS as t, findSampler as u };
