import { getQrModules } from "./modules";
import { computeLayout } from "./layout";
import type { RenderOptions } from "./render-canvas";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildQrSvg(options: RenderOptions): string {
  const modules = getQrModules(options.value, options.ecLevel);
  const layout = computeLayout({ moduleCount: modules.size, frame: options.frame });

  const parts: string[] = [];
  const useGradient = options.colors.useGradient && Boolean(options.colors.fgColor2);

  if (useGradient) {
    const qrEnd = { x: layout.qrBlockX + layout.qrBlockSize, y: layout.qrBlockY + layout.qrBlockSize };
    parts.push(
      `<defs><linearGradient id="qrFg" gradientUnits="userSpaceOnUse" x1="${layout.qrBlockX}" y1="${layout.qrBlockY}" x2="${qrEnd.x}" y2="${qrEnd.y}">` +
        `<stop offset="0" stop-color="${options.colors.fgColor}"/>` +
        `<stop offset="1" stop-color="${options.colors.fgColor2}"/>` +
        `</linearGradient></defs>`
    );
  }

  if (layout.hasFrame) {
    parts.push(
      `<rect x="0" y="0" width="${layout.outer.width}" height="${layout.outer.height}" rx="${layout.outer.radius}" fill="${options.frame.frameColor}"/>`
    );
    if (layout.innerCard) {
      parts.push(
        `<rect x="${layout.innerCard.x}" y="${layout.innerCard.y}" width="${layout.innerCard.width}" height="${layout.innerCard.height}" rx="${layout.innerCard.radius}" fill="${options.colors.bgColor}"/>`
      );
    }
    if (layout.band && options.frame.text.trim()) {
      const fontSize = Math.min(26, layout.band.height * 0.42);
      const cx = layout.band.x + layout.band.width / 2;
      const cy = layout.band.y + layout.band.height / 2;
      parts.push(
        `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${fontSize}" fill="${options.frame.textColor}" letter-spacing="1">${escapeXml(
          options.frame.text.trim().toUpperCase()
        )}</text>`
      );
    }
  } else {
    parts.push(`<rect x="0" y="0" width="${layout.canvasWidth}" height="${layout.canvasHeight}" fill="${options.colors.bgColor}"/>`);
  }

  const overlap = 0.6;
  let pathData = "";
  for (let row = 0; row < modules.size; row += 1) {
    for (let col = 0; col < modules.size; col += 1) {
      if (!modules.isDark(row, col)) continue;
      const x = layout.qrBlockX + layout.quietZone + col * layout.moduleSize;
      const y = layout.qrBlockY + layout.quietZone + row * layout.moduleSize;
      const w = layout.moduleSize + overlap;
      pathData += `M${x} ${y}h${w}v${w}h${-w}Z`;
    }
  }
  parts.push(`<path d="${pathData}" fill="${useGradient ? "url(#qrFg)" : options.colors.fgColor}"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${layout.canvasWidth}" height="${layout.canvasHeight}" viewBox="0 0 ${layout.canvasWidth} ${layout.canvasHeight}">${parts.join("")}</svg>`;
}
