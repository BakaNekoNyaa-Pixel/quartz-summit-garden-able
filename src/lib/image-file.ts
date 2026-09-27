export async function fileToDataUrl(file: File, maxEdge = 1536): Promise<string> {
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
  return canvas.toDataURL("image/jpeg", 0.92);
}

function readAscii(bytes: Uint8Array, start: number, length: number) {
  return String.fromCharCode(...bytes.subarray(start, start + length));
}

export async function readPngParameters(file: File): Promise<string | null> {
  const buf = new Uint8Array(await file.arrayBuffer());
  if (buf.length < 16) return null;
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < 8; i++) if (buf[i] !== sig[i]) return null;

  let offset = 8;
  const texts: string[] = [];
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

export function downloadUrl(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.target = "_blank";
  a.click();
}
