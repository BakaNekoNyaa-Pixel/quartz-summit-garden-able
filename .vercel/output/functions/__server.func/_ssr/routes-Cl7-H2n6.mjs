import { i as __toESM } from "../_runtime.mjs";
import { n as Slot, o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as SIZE_PRESETS, c as findModel, h as wantsFourK, i as SCHEDULERS, l as findProfile, n as PROMPT_PRESETS, o as STYLES, p as mapResolution, r as SAMPLERS, s as VRAM_PROFILES, t as MODELS, u as findSampler } from "./catalog-CdNQ86Bs.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
import { a as Send, c as FlipHorizontal2, i as Square, l as Download, o as Maximize2, r as Trash2, s as Image, t as X, u as Dices } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cl7-H2n6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
var generateImages = createServerFn({ method: "POST" }).validator((input) => GenerateSchema.parse(input)).handler(createSsrRpc("bc7c606729868393dab3284668db16e19f9c71be586b8070e42ece1ab7eecd51"));
var editImages = createServerFn({ method: "POST" }).validator((input) => EditSchema.parse(input)).handler(createSsrRpc("89e10c9bb58a1464e7b54e067b50b73a1b4696b442aaa741977310ee5195f64b"));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function randomSeed() {
	return Math.floor(Math.random() * 2147483647);
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function formatDuration(ms) {
	const s = Math.max(0, ms) / 1e3;
	return s < 10 ? `${s.toFixed(1)}s` : `${s.toFixed(0)}s`;
}
var MAX_GALLERY = 36;
function activeStyles(ids) {
	return STYLES.filter((s) => ids.includes(s.id));
}
function clampToProfile(width, height, profile, guard) {
	const max = !guard ? 3840 : profile.allow4k ? 3840 : profile.maxLongEdge;
	const long = Math.max(width, height);
	if (long <= max) return {
		width,
		height
	};
	const scale = max / long;
	const snap = (n) => Math.max(512, Math.round(n / 64) * 64);
	return {
		width: snap(width * scale),
		height: snap(height * scale)
	};
}
var useStudio = create()(persist((set, get) => ({
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
	denoise: .45,
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
	setTab: (tab) => set({
		tab,
		error: null
	}),
	patch: (partial) => set(partial),
	toggleStyle: (id) => set((s) => ({ styleIds: s.styleIds.includes(id) ? s.styleIds.filter((x) => x !== id) : [...s.styleIds, id] })),
	applyProfile: (id, resetSize = true) => {
		const profile = findProfile(id);
		const size = resetSize ? {
			width: profile.defaultWidth,
			height: profile.defaultHeight
		} : clampToProfile(get().width, get().height, profile, true);
		set({
			profileId: id,
			tileAttention: profile.tileAttention,
			tileVae: profile.tileVae,
			steps: profile.defaultSteps,
			batchSize: Math.min(get().batchSize, profile.maxBatch),
			batchCount: Math.min(get().batchCount, profile.maxBatch),
			hires: profile.allowHires ? get().hires : false,
			...size
		});
	},
	swapSize: () => set((s) => ({
		width: s.height,
		height: s.width
	})),
	setSize: (w, h) => {
		set(clampToProfile(w, h, findProfile(get().profileId), get().memoryGuard));
	},
	interrupt: () => set((s) => ({
		jobId: s.jobId + 1,
		busy: false,
		progress: 0,
		status: "Interrumpido"
	})),
	sendCurrentTo: (tab) => {
		const current = get().images.find((i) => i.id === get().selectedId);
		if (!current) return;
		set({
			tab,
			sourceImage: current.url,
			prompt: current.prompt,
			negative: current.negative
		});
	},
	removeSelected: () => {
		const id = get().selectedId;
		set((s) => {
			const images = s.images.filter((i) => i.id !== id);
			return {
				images,
				selectedId: images[0]?.id ?? null
			};
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
			elapsedMs: 0
		});
		const tick = window.setInterval(() => {
			const s = get();
			if (s.jobId !== jobId || !s.busy) return;
			set({
				progress: Math.min(s.progress + (100 - s.progress) * .07, 92),
				status: `${fourK ? "2K nativo → extra 4K" : hires ? "Hires. fix" : `${mapResolution(Math.max(size.width, size.height), profile).toUpperCase()} · ${profile.name}`} · ${sampler.name}`,
				elapsedMs: performance.now() - t0
			});
		}, 280);
		try {
			let result;
			if (start.tab === "img2img" || start.tab === "extras") result = await editImages({ data: {
				prompt: start.prompt,
				negative: start.negative,
				denoise: start.tab === "extras" ? .2 : start.denoise,
				mode: start.tab === "extras" ? "extras" : "img2img",
				upscalerId: start.upscalerId,
				imageUrl: start.sourceImage,
				resolution: fourK || start.tab === "extras" ? "2k" : mapResolution(Math.max(size.width, size.height), profile),
				n
			} });
			else result = await generateImages({ data: {
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
				fourK
			} });
			if (get().jobId !== jobId) return;
			if (!result.ok) {
				set({
					busy: false,
					progress: 0,
					status: "Error",
					error: result.error
				});
				return;
			}
			const items = result.images.map((img, i) => ({
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
				usedPrompt: result.usedPrompt
			}));
			set((s) => ({
				busy: false,
				progress: 100,
				status: "Listo",
				elapsedMs: performance.now() - t0,
				images: [...items, ...s.images].slice(0, MAX_GALLERY),
				selectedId: items[0]?.id ?? s.selectedId
			}));
		} catch {
			if (get().jobId !== jobId) return;
			set({
				busy: false,
				progress: 0,
				status: "Error",
				error: "No se pudo contactar el motor."
			});
		} finally {
			window.clearInterval(tick);
		}
	}
}), {
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
		selectedId: s.selectedId
	})
}));
function Badge({ className, tone = "muted", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tracking-wide", tone === "muted" && "bg-secondary text-muted-foreground", tone === "brand" && "bg-brand/15 text-brand", tone === "ok" && "bg-ok/15 text-ok", tone === "warn" && "bg-warn/15 text-warn", className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-10 w-full rounded-md border border-input bg-muted px-3 text-sm text-foreground outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40", className),
		...props
	});
}
function NativeSelect({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("flex h-10 w-full rounded-md border border-input bg-muted px-3 text-sm text-foreground outline-none transition-[box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full resize-y rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground outline-none transition-[box-shadow] duration-150 placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40", className),
		...props
	});
}
function Progress({ value, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-1.5 w-full overflow-hidden rounded-full bg-secondary", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full bg-brand transition-[width] duration-200 ease-out",
			style: { width: `${Math.min(100, Math.max(0, value))}%` }
		})
	});
}
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("flex gap-1 overflow-x-auto border-b border-border px-2 md:px-3", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("relative shrink-0 px-3 py-2.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:text-foreground", "after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:bg-brand after:transition-transform after:duration-200 data-[state=active]:after:scale-x-100", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
		className: cn("min-h-0 flex-1 outline-none", className),
		...props
	});
}
async function fileToDataUrl(file, maxEdge = 1536) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
	const width = Math.max(1, Math.round(bitmap.width * scale));
	const height = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas no disponible");
	ctx.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();
	return canvas.toDataURL("image/jpeg", .92);
}
function readAscii(bytes, start, length) {
	return String.fromCharCode(...bytes.subarray(start, start + length));
}
async function readPngParameters(file) {
	const buf = new Uint8Array(await file.arrayBuffer());
	if (buf.length < 16) return null;
	const sig = [
		137,
		80,
		78,
		71,
		13,
		10,
		26,
		10
	];
	for (let i = 0; i < 8; i++) if (buf[i] !== sig[i]) return null;
	let offset = 8;
	const texts = [];
	const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
	while (offset + 12 <= buf.length) {
		const length = view.getUint32(offset);
		const type = readAscii(buf, offset + 4, 4);
		const dataStart = offset + 8;
		const dataEnd = dataStart + length;
		if (dataEnd + 4 > buf.length) break;
		if (type === "tEXt" || type === "iTXt") {
			const data = buf.subarray(dataStart, dataEnd);
			const z = data.indexOf(0);
			const key = readAscii(data, 0, z < 0 ? data.length : z);
			const value = new TextDecoder().decode(data.subarray(z < 0 ? data.length : z + 1));
			if (/parameters|prompt|comment/i.test(key)) texts.push(`${key}\n${value}`);
			else texts.push(`${key}: ${value}`);
		}
		if (type === "IEND") break;
		offset = dataEnd + 4;
	}
	return texts.length ? texts.join("\n\n") : null;
}
function downloadUrl(url, filename) {
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.rel = "noopener";
	a.target = "_blank";
	a.click();
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,box-shadow,opacity,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			generate: "bg-brand text-brand-foreground hover:bg-brand/90 font-semibold tracking-wide",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			outline: "border border-border bg-transparent hover:bg-muted",
			ghost: "hover:bg-muted",
			danger: "bg-destructive text-primary-foreground hover:bg-destructive/90"
		},
		size: {
			default: "h-10 px-4",
			sm: "h-8 px-3 text-xs",
			lg: "h-12 px-5 text-base",
			icon: "size-10",
			"icon-sm": "size-8"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Field({ label, hint, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("flex min-w-0 flex-col gap-1.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium text-muted-foreground",
				children: label
			}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs tabular-nums text-foreground",
				children: hint
			}) : null]
		}), children]
	});
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex h-6 w-full touch-none select-none items-center", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-brand" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "relative block size-4 rounded-full bg-primary shadow-border outline-none after:absolute after:left-1/2 after:top-1/2 after:size-10 after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] focus-visible:ring-2 focus-visible:ring-ring" })]
	});
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border bg-secondary transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=checked]:bg-brand", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-primary transition-transform duration-150 data-[state=checked]:translate-x-5 data-[state=checked]:bg-brand-foreground" })
	});
}
function Num({ label, value, min, max, step, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
		label,
		hint: String(value),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				value: [value],
				min,
				max,
				step,
				onValueChange: ([v]) => onChange(v ?? min)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "number",
				className: "h-8 w-20 shrink-0",
				value,
				min,
				max,
				step,
				onChange: (e) => onChange(Number(e.target.value))
			})]
		})
	});
}
function PromptPanel() {
	const s = useStudio();
	const profile = findProfile(s.profileId);
	const showSource = s.tab === "img2img" || s.tab === "extras";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-3 md:p-4",
		children: [
			showSource ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceSlot, {}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Prompt",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 5,
					value: s.prompt,
					placeholder: "Describe la imagen. Sujeto, luz, objetivo, material…",
					onChange: (e) => s.patch({ prompt: e.target.value })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: PROMPT_PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground",
					onClick: () => s.patch({
						prompt: p.prompt,
						negative: p.negative
					}),
					children: p.label
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Prompt negativo",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 2,
					value: s.negative,
					onChange: (e) => s.patch({ negative: e.target.value })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "generate",
					size: "lg",
					className: "min-h-12 flex-1",
					disabled: s.busy,
					onClick: () => void s.generate(),
					children: ["Generar", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden font-mono text-xs font-normal opacity-80 sm:inline",
						children: "Ctrl+Enter"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "lg",
					className: "min-h-12 sm:w-36",
					disabled: !s.busy,
					onClick: () => s.interrupt(),
					children: "Interrumpir"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: STYLES.map((st) => {
					const on = s.styleIds.includes(st.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => s.toggleStyle(st.id),
						className: `rounded-full border px-3 py-1.5 text-xs transition-colors duration-150 ${on ? "border-brand bg-brand/15 text-foreground" : "border-border bg-secondary text-muted-foreground hover:text-foreground"}`,
						children: st.name
					}, st.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Sampler",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
						value: s.samplerId,
						onChange: (e) => {
							const sampler = findSampler(e.target.value);
							s.patch({
								samplerId: sampler.id,
								schedulerId: sampler.scheduler ?? s.schedulerId
							});
						},
						children: SAMPLERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item.id,
							children: item.name
						}, item.id))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Schedule type",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
						value: s.schedulerId,
						onChange: (e) => s.patch({ schedulerId: e.target.value }),
						children: SCHEDULERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item.id,
							children: item.name
						}, item.id))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
				label: "Sampling steps",
				value: s.steps,
				min: 4,
				max: profile.id === "igpu" ? 28 : 60,
				step: 1,
				onChange: (steps) => s.patch({ steps })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
				label: "CFG Scale",
				value: s.cfg,
				min: 1,
				max: 20,
				step: .5,
				onChange: (cfg) => s.patch({ cfg })
			}),
			s.tab === "img2img" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
				label: "Denoising strength",
				value: s.denoise,
				min: .05,
				max: 1,
				step: .05,
				onChange: (denoise) => s.patch({ denoise })
			}) : null,
			s.tab === "extras" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Upscaler",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
						value: s.upscalerId,
						onChange: (e) => s.patch({ upscalerId: e.target.value }),
						children: [
							"rdna-gan",
							"esrgan",
							"latent",
							"anime",
							"ultrasharp"
						].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: id,
							children: id === "rdna-gan" ? "RDNA-GAN 4x" : id === "esrgan" ? "R-ESRGAN 4x+" : id === "latent" ? "Latent" : id === "anime" ? "R-ESRGAN Anime" : "4x UltraSharp"
						}, id))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Escala",
					value: s.extrasScale,
					min: 1,
					max: 4,
					step: 1,
					onChange: (extrasScale) => s.patch({ extrasScale })
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1.5 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-muted-foreground",
						children: "Ancho × Alto"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							onClick: () => s.swapSize(),
							"aria-label": "Invertir",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlipHorizontal2, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							onClick: () => s.setSize(1024, 1024),
							"aria-label": "Cuadrado",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: SIZE_PRESETS.map((p) => {
						const isFourK = Math.max(p.w, p.h) >= 2560;
						const blocked = s.memoryGuard && Math.max(p.w, p.h) > profile.maxLongEdge && !(profile.allow4k && isFourK);
						const active = s.width === p.w && s.height === p.h;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: blocked,
							onClick: () => s.setSize(p.w, p.h),
							className: `rounded-md border px-2.5 py-1.5 text-xs tabular-nums transition-colors duration-150 disabled:opacity-30 ${active ? "border-brand bg-brand/15 text-foreground" : "border-border bg-secondary text-muted-foreground hover:text-foreground"}`,
							children: p.label
						}, p.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Ancho",
						value: s.width,
						min: 512,
						max: 3840,
						step: 64,
						onChange: (w) => s.setSize(w, s.height)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Alto",
						value: s.height,
						min: 512,
						max: 3840,
						step: 64,
						onChange: (h) => s.setSize(s.width, h)
					})]
				}),
				s.memoryGuard && Math.max(s.width, s.height) > profile.maxLongEdge && !(profile.allow4k && Math.max(s.width, s.height) >= 2560) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-warn",
					children: [
						"El guardián de memoria recortará a ",
						profile.maxLongEdge,
						"px en el lado largo."
					]
				}) : null
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Seed",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "font-mono",
								value: s.seed,
								onChange: (e) => s.patch({
									seed: Number(e.target.value) || -1,
									seedLocked: true
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								"aria-label": "Semilla aleatoria",
								onClick: () => s.patch({
									seed: randomSeed(),
									seedLocked: false
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dices, {})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Batch count",
						value: s.batchCount,
						min: 1,
						max: profile.maxBatch,
						step: 1,
						onChange: (batchCount) => s.patch({ batchCount })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Batch size",
						value: s.batchSize,
						min: 1,
						max: profile.maxBatch,
						step: 1,
						onChange: (batchSize) => s.patch({ batchSize })
					})
				]
			}),
			s.tab === "txt2img" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 rounded-lg bg-card p-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: "Hires. fix"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: s.hires,
							disabled: !profile.allowHires,
							onCheckedChange: (hires) => s.patch({ hires })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: "Restore faces"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: s.restoreFaces,
							onCheckedChange: (restoreFaces) => s.patch({ restoreFaces })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "CLIP skip",
						value: s.clipSkip,
						min: 1,
						max: 2,
						step: 1,
						onChange: (clipSkip) => s.patch({ clipSkip })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Checkpoint",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
							value: s.modelId,
							onChange: (e) => s.patch({ modelId: e.target.value }),
							children: MODELS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: m.id,
								children: m.name
							}, m.id))
						})
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-card p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Motor AMD"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "ok",
							children: s.engine === "rocm" ? "ROCm" : "DirectML"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-xs leading-relaxed text-muted-foreground",
						children: "Inferencia en la nube: tu PC no se congela. El perfil limita resolución y lote como lo haría la VRAM."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-h-11 items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "Guardián de memoria"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: s.memoryGuard,
									onCheckedChange: (memoryGuard) => s.patch({ memoryGuard })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-h-11 items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "Atención teselada"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: s.tileAttention,
									onCheckedChange: (tileAttention) => s.patch({ tileAttention })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-h-11 items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "VAE teselado"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: s.tileVae,
									onCheckedChange: (tileVae) => s.patch({ tileVae })
								})]
							})
						]
					})
				]
			})
		]
	});
}
function SourceSlot() {
	const sourceImage = useStudio((s) => s.sourceImage);
	const patch = useStudio((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card p-4 text-center",
		children: [sourceImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: sourceImage,
			alt: "Origen",
			className: "frame max-h-48 rounded-md object-contain"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-foreground",
			children: "Suelta una imagen o pulsa para cargar"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "JPG, PNG · se recodifica a 1536px para no saturar"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "file",
			accept: "image/*",
			className: "sr-only",
			onChange: async (e) => {
				const file = e.target.files?.[0];
				if (!file) return;
				const url = await fileToDataUrl(file);
				patch({ sourceImage: url });
			}
		})]
	});
}
var Dialog = Dialog$1;
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-background/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed left-1/2 top-1/2 z-50 w-full max-w-6xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-3 shadow-border focus:outline-none relative", className),
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "sr-only",
				children: "Vista de imagen"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
				className: "sr-only",
				children: "Imagen generada a tamaño completo"
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon-sm",
					className: "absolute right-2 top-2",
					"aria-label": "Cerrar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
				})
			})
		]
	})] });
}
function OutputStage() {
	const images = useStudio((s) => s.images);
	const selectedId = useStudio((s) => s.selectedId);
	const busy = useStudio((s) => s.busy);
	const progress = useStudio((s) => s.progress);
	const patch = useStudio((s) => s.patch);
	const current = images.find((i) => i.id === selectedId) ?? images[0];
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col gap-3 p-3 md:p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "checker-well relative flex min-h-64 flex-1 items-center justify-center overflow-hidden rounded-lg",
				children: [
					busy && !current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 shimmer" }) : null,
					current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex h-full w-full items-center justify-center",
						onClick: () => setOpen(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: current.url,
							alt: current.prompt,
							className: "frame max-h-full max-w-full object-contain"
						})
					}) : busy ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyWell, {}),
					busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-3 left-3 right-3 rounded-md bg-background/80 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-1.5 text-xs text-muted-foreground",
							children: [
								"Muestreando… ",
								Math.round(progress),
								"%"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1 overflow-hidden rounded-full bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-brand transition-[width] duration-200",
								style: { width: `${progress}%` }
							})
						})]
					}) : null
				]
			}),
			current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaBar, {
				item: current,
				onOpen: () => setOpen(true)
			}) : null,
			images.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto pb-1",
				children: images.map((img) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => patch({ selectedId: img.id }),
					className: `relative size-16 shrink-0 overflow-hidden rounded-md border ${img.id === current?.id ? "border-brand" : "border-border"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: img.url,
						alt: "",
						className: "size-full object-cover"
					})
				}, img.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "relative bg-well p-2",
					children: current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: current.url,
						alt: current.prompt,
						className: "max-h-screen w-full rounded-lg object-contain"
					}) : null
				})
			})
		]
	});
}
function MetaBar({ item, onOpen }) {
	const sendCurrentTo = useStudio((s) => s.sendCurrentTo);
	const removeSelected = useStudio((s) => s.removeSelected);
	const patch = useStudio((s) => s.patch);
	const model = findModel(item.modelId);
	const sampler = findSampler(item.samplerId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg border border-border bg-card p-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm text-foreground",
					children: item.prompt || "Sin prompt"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-mono text-xs tabular-nums text-muted-foreground",
					children: [
						model.name,
						" · ",
						item.width,
						"×",
						item.height,
						" · ",
						sampler.name,
						" · ",
						item.steps,
						" steps · CFG",
						" ",
						item.cfg,
						" · seed ",
						item.seed
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: onOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, {}), " Ampliar"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => downloadUrl(item.url, `rdna-forge-${item.seed}.jpg`),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), " Descargar"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => sendCurrentTo("img2img"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {}), " img2img"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => patch({
							seed: item.seed,
							seedLocked: true
						}),
						children: "Reusar seed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						"aria-label": "Eliminar",
						onClick: removeSelected,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
					})
				]
			})]
		})
	});
}
function EmptyWell() {
	const error = useStudio((s) => s.error);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex max-w-sm flex-col items-center gap-3 px-6 py-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-8 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-foreground",
				children: "Nada generado todavía"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-relaxed text-muted-foreground",
				children: "Escribe un prompt y pulsa Generar. El motor corre fuera de tu GPU: el PC no se pega aunque pidas 2K."
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-relaxed text-warn",
				children: error
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [
				MODELS[0].name,
				" · ",
				SAMPLERS[8].name
			] })
		]
	});
}
function GalleryTab() {
	const images = useStudio((s) => s.images);
	const selectedId = useStudio((s) => s.selectedId);
	const patch = useStudio((s) => s.patch);
	const setTab = useStudio((s) => s.setTab);
	if (!images.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6 text-sm text-muted-foreground",
		children: "La galería se llena con cada generación. Se guarda en este navegador."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-2 overflow-y-auto p-3 md:grid-cols-4 lg:grid-cols-5",
		children: images.map((img) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => {
				patch({ selectedId: img.id });
				setTab("txt2img");
			},
			className: `overflow-hidden rounded-lg border ${img.id === selectedId ? "border-brand" : "border-border"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: img.url,
				alt: img.prompt,
				className: "aspect-square w-full object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate px-2 py-1.5 text-left text-xs text-muted-foreground",
				children: img.prompt
			})]
		}, img.id))
	});
}
function SettingsTab() {
	const s = useStudio();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-5 overflow-y-auto p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-medium",
				children: "Perfil de VRAM"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Elige la GPU real. En PCs modestos recorta resolución; en RX 9070 deja 2K nativo y extras 4K."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: VRAM_PROFILES.map((p) => {
					const active = s.profileId === p.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => s.applyProfile(p.id),
						className: `rounded-lg border p-4 text-left transition-colors duration-150 ${active ? "border-brand bg-brand/10" : "border-border bg-card hover:bg-muted"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: p.name
							}), p.id === "rx9070" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "brand",
								children: "Detectada"
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-muted-foreground",
							children: p.subtitle
						})]
					}, p.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Backend",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
						value: s.engine,
						onChange: (e) => s.patch({ engine: e.target.value }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "rocm",
							children: "ROCm (Linux / nativo AMD)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "directml",
							children: "DirectML (Windows)"
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-11 items-center justify-between gap-3 self-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm",
						children: "Guardián de memoria"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: s.memoryGuard,
						onCheckedChange: (memoryGuard) => s.patch({ memoryGuard })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-foreground",
					children: "Cómo evita colgar el PC"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-2 list-disc space-y-1 pl-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Una sola generación a la vez. Interrumpir cancela el trabajo." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "El lote se recorta al máximo del perfil (1–2)." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "4K no corre nativo: 2K y un pase extra de nitidez." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "La inferencia no usa tu VRAM local, así que Windows no se reinicia." })
					]
				})]
			})
		]
	});
}
function PngInfoTab() {
	const [info, setInfo] = (0, import_react.useState)("");
	const [preview, setPreview] = (0, import_react.useState)(null);
	const images = useStudio((s) => s.images);
	const selectedId = useStudio((s) => s.selectedId);
	const patch = useStudio((s) => s.patch);
	const selected = images.find((i) => i.id === selectedId) ?? images[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-4 overflow-y-auto p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Carga un PNG para leer parámetros"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "También muestra los metadatos de la imagen seleccionada"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/png,image/jpeg",
						className: "sr-only",
						onChange: async (e) => {
							const file = e.target.files?.[0];
							if (!file) return;
							setPreview(await fileToDataUrl(file, 1024));
							const parsed = await readPngParameters(file);
							setInfo(parsed ?? "Sin chunks de parámetros. Si es una imagen de RDNA Forge, usa la ficha de abajo.");
						}
					})
				]
			}),
			preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: preview,
				alt: "",
				className: "frame mx-auto max-h-56 rounded-lg object-contain"
			}) : null,
			info ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 10,
				readOnly: true,
				value: info,
				className: "font-mono text-xs"
			}) : selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Imagen seleccionada"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-xs leading-relaxed text-muted-foreground",
						children: [
							findModel(selected.modelId).name,
							"\n",
							findSampler(selected.samplerId).name,
							" · ",
							selected.steps,
							" steps · CFG ",
							selected.cfg,
							"\n",
							selected.width,
							"×",
							selected.height,
							" · seed ",
							selected.seed,
							"\n\n",
							selected.prompt,
							"\n\nNegative prompt:\n",
							selected.negative
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						variant: "outline",
						size: "sm",
						onClick: () => patch({
							prompt: selected.prompt,
							negative: selected.negative,
							modelId: selected.modelId,
							samplerId: selected.samplerId,
							steps: selected.steps,
							cfg: selected.cfg,
							seed: selected.seed,
							seedLocked: true,
							width: selected.width,
							height: selected.height
						}),
						children: "Enviar a txt2img"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Nada que leer todavía."
			})
		]
	});
}
var TABS = [
	{
		id: "txt2img",
		label: "txt2img"
	},
	{
		id: "img2img",
		label: "img2img"
	},
	{
		id: "extras",
		label: "Extras"
	},
	{
		id: "pnginfo",
		label: "PNG Info"
	},
	{
		id: "gallery",
		label: "Galería"
	},
	{
		id: "settings",
		label: "Ajustes"
	}
];
function StudioApp() {
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
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
				e.preventDefault();
				generate();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [generate]);
	(0, import_react.useEffect)(() => {
		if (error) toast.error(error);
	}, [error]);
	const split = tab === "txt2img" || tab === "img2img" || tab === "extras";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-background md:h-dvh md:overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "top-center",
				richColors: false
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-center gap-3 border-b border-border px-3 py-2.5 md:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold tracking-tight",
							children: "RDNA Forge"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Estudio de imagen para Radeon"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-48 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
							value: modelId,
							onChange: (e) => patch({ modelId: e.target.value }),
							"aria-label": "Checkpoint",
							children: MODELS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: m.id,
								children: [
									m.kind,
									" · ",
									m.name
								]
							}, m.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "brand",
						children: profile.name
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: tab,
				onValueChange: (v) => setTab(v),
				className: "flex min-h-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, { children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: t.id,
						children: t.label
					}, t.id)) }),
					split ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: tab,
						className: "grid min-h-0 flex-1 grid-cols-1 md:grid-cols-12 md:overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-h-0 md:col-span-7 md:h-full md:border-r md:border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptPanel, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-h-0 md:col-span-5 md:h-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutputStage, {})
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "pnginfo",
						className: "min-h-0 flex-1 overflow-y-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PngInfoTab, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "gallery",
						className: "min-h-0 flex-1 overflow-y-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryTab, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "settings",
						className: "min-h-0 flex-1 overflow-y-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsTab, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "border-t border-border bg-card px-3 py-2 md:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1.5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [status, busy ? ` · ${Math.round(progress)}%` : elapsedMs > 0 ? ` · ${formatDuration(elapsedMs)}` : ""] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono tabular-nums",
						children: [
							width,
							"×",
							height,
							" · ",
							samplerId,
							" · ",
							profile.vramGb,
							" GB"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: busy ? progress : 0 })]
			})
		]
	});
}
function Mark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: "size-7 text-brand",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "2",
			y: "2",
			width: "20",
			height: "20",
			rx: "3",
			className: "fill-secondary"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M6 18h3.4L12 8.8 14.6 18H18L12 4.5z"
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioApp, {});
}
//#endregion
export { Home as component };
