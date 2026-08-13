/**
 * Builds public/og-image.png — the 1200x630 card social platforms and chat
 * apps render when a Cube27 Talent URL is shared.
 *
 * Deliberately dependency-free: it decodes the existing brand logo with the
 * built-in zlib, composites it over a flat brand background, and re-encodes.
 * Run it again after changing the logo or the background:
 *
 *   node scripts/generate-og-image.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { inflateSync, deflateSync, crc32 } from "node:zlib";

const SOURCE = "public/cube27_logo.png";
const OUTPUT = "public/og-image.png";
const WIDTH = 1200;
const HEIGHT = 630;
/**
 * --c27-surface in src/styles/tokens.css. The wordmark is near-black and was
 * drawn for light ground; on the navy field it loses almost all its contrast.
 */
const BACKGROUND = [0xff, 0xff, 0xff];
/**
 * Logo width as a share of the card. The source is only 300px wide, so this is
 * held down to limit upscaling artefacts — link cards render around 500px, at
 * which size the remaining softness is not visible.
 */
const LOGO_SHARE = 0.45;

/** Decodes a non-interlaced truecolour PNG to flat RGBA. */
function decodePng(buffer) {
  if (buffer.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG");

  let offset = 8;
  let header = null;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);

    if (type === "IHDR") {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        depth: data[8],
        colorType: data[9],
        interlace: data[12],
      };
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }

    offset += 12 + length;
  }

  if (!header) throw new Error("no IHDR");
  if (header.depth !== 8 || header.interlace !== 0) {
    throw new Error(
      `unsupported PNG: depth ${header.depth}, interlace ${header.interlace}`,
    );
  }
  if (header.colorType !== 2 && header.colorType !== 6) {
    throw new Error(`unsupported colour type ${header.colorType}`);
  }

  const channels = header.colorType === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(idat));
  const stride = header.width * channels;
  const pixels = Buffer.alloc(header.width * header.height * 4);

  let previous = Buffer.alloc(stride);

  for (let y = 0; y < header.height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const line = Buffer.from(
      raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)),
    );

    for (let x = 0; x < stride; x += 1) {
      const left = x >= channels ? line[x - channels] : 0;
      const up = previous[x];
      const upLeft = x >= channels ? previous[x - channels] : 0;

      switch (filter) {
        case 1:
          line[x] = (line[x] + left) & 0xff;
          break;
        case 2:
          line[x] = (line[x] + up) & 0xff;
          break;
        case 3:
          line[x] = (line[x] + ((left + up) >> 1)) & 0xff;
          break;
        case 4: {
          const p = left + up - upLeft;
          const dl = Math.abs(p - left);
          const du = Math.abs(p - up);
          const dul = Math.abs(p - upLeft);
          const predictor =
            dl <= du && dl <= dul ? left : du <= dul ? up : upLeft;
          line[x] = (line[x] + predictor) & 0xff;
          break;
        }
        default:
          break;
      }
    }

    for (let x = 0; x < header.width; x += 1) {
      const src = x * channels;
      const dst = (y * header.width + x) * 4;
      pixels[dst] = line[src];
      pixels[dst + 1] = line[src + 1];
      pixels[dst + 2] = line[src + 2];
      pixels[dst + 3] = channels === 4 ? line[src + 3] : 255;
    }

    previous = line;
  }

  return { width: header.width, height: header.height, pixels };
}

/** Bilinear sample of the source, returning premultiplied-safe RGBA. */
function sample(image, fx, fy) {
  const x0 = Math.max(0, Math.min(image.width - 1, Math.floor(fx)));
  const y0 = Math.max(0, Math.min(image.height - 1, Math.floor(fy)));
  const x1 = Math.min(image.width - 1, x0 + 1);
  const y1 = Math.min(image.height - 1, y0 + 1);
  const tx = fx - x0;
  const ty = fy - y0;

  const at = (x, y, c) => image.pixels[(y * image.width + x) * 4 + c];
  const out = [0, 0, 0, 0];

  for (let c = 0; c < 4; c += 1) {
    const top = at(x0, y0, c) * (1 - tx) + at(x1, y0, c) * tx;
    const bottom = at(x0, y1, c) * (1 - tx) + at(x1, y1, c) * tx;
    out[c] = top * (1 - ty) + bottom * ty;
  }

  return out;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(body) >>> 0, 0);
  return Buffer.concat([length, body, checksum]);
}

function encodePng(width, height, rgb) {
  const stride = width * 3;
  const raw = Buffer.alloc(height * (stride + 1));

  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0;
    rgb.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const logo = decodePng(readFileSync(SOURCE));

/**
 * LOGO_SHARE sets the width, but a tall enough source would then overflow the
 * card vertically and the compositing loop would write past the canvas — which
 * a Buffer silently drops, clipping the logo. Contain-fit within both axes so
 * the aspect ratio survives and the origins stay non-negative.
 */
const scale = Math.min((WIDTH * LOGO_SHARE) / logo.width, HEIGHT / logo.height);
const targetWidth = Math.max(1, Math.round(logo.width * scale));
const targetHeight = Math.max(1, Math.round(logo.height * scale));
const originX = Math.round((WIDTH - targetWidth) / 2);
const originY = Math.round((HEIGHT - targetHeight) / 2);

const canvas = Buffer.alloc(WIDTH * HEIGHT * 3);
for (let i = 0; i < WIDTH * HEIGHT; i += 1) {
  canvas[i * 3] = BACKGROUND[0];
  canvas[i * 3 + 1] = BACKGROUND[1];
  canvas[i * 3 + 2] = BACKGROUND[2];
}

for (let y = 0; y < targetHeight; y += 1) {
  for (let x = 0; x < targetWidth; x += 1) {
    const [r, g, b, a] = sample(
      logo,
      (x / targetWidth) * (logo.width - 1),
      (y / targetHeight) * (logo.height - 1),
    );

    const alpha = a / 255;
    if (alpha <= 0) continue;

    const dst = ((originY + y) * WIDTH + originX + x) * 3;
    canvas[dst] = Math.round(r * alpha + canvas[dst] * (1 - alpha));
    canvas[dst + 1] = Math.round(g * alpha + canvas[dst + 1] * (1 - alpha));
    canvas[dst + 2] = Math.round(b * alpha + canvas[dst + 2] * (1 - alpha));
  }
}

writeFileSync(OUTPUT, encodePng(WIDTH, HEIGHT, canvas));
console.log(`${OUTPUT} ${WIDTH}x${HEIGHT}`);
