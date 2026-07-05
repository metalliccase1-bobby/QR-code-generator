import { getQrModules, type ErrorCorrectionLevel } from "./modules";
import { computeLayout, type FrameOptions, type QrLayout, type RoundedRect } from "./layout";

export interface QrColorOptions {
  fgColor: string;
  fgColor2: string;
  useGradient: boolean;
  bgColor: string;
}

export interface RenderOptions {
  value: string;
  ecLevel: ErrorCorrectionLevel;
  colors: QrColorOptions;
  frame: FrameOptions;
}

function pathRoundedRect(ctx: CanvasRenderingContext2D, rect: RoundedRect) {
  const { x, y, width: w, height: h, radius } = rect;
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  ctx.beginPath();
  if (r === 0) {
    ctx.rect(x, y, w, h);
    return;
  }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function renderQrToCanvas(canvas: HTMLCanvasElement, options: RenderOptions, pixelRatio = 3): QrLayout {
  const modules = getQrModules(options.value, options.ecLevel);
  const layout = computeLayout({ moduleCount: modules.size, frame: options.frame });

  canvas.width = Math.ceil(layout.canvasWidth * pixelRatio);
  canvas.height = Math.ceil(layout.canvasHeight * pixelRatio);
  canvas.style.width = `${layout.canvasWidth}px`;
  canvas.style.height = `${layout.canvasHeight}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return layout;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.clearRect(0, 0, layout.canvasWidth, layout.canvasHeight);

  if (layout.hasFrame) {
    ctx.fillStyle = options.frame.frameColor;
    pathRoundedRect(ctx, layout.outer);
    ctx.fill();

    if (layout.innerCard) {
      ctx.fillStyle = options.colors.bgColor;
      pathRoundedRect(ctx, layout.innerCard);
      ctx.fill();
    }

    if (layout.band && options.frame.text.trim()) {
      ctx.fillStyle = options.frame.textColor;
      const fontSize = Math.min(26, layout.band.height * 0.42);
      ctx.font = `700 ${fontSize}px "Geist", "Segoe UI", Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const letterSpaced = options.frame.text.trim().toUpperCase();
      ctx.fillText(
        letterSpaced,
        layout.band.x + layout.band.width / 2,
        layout.band.y + layout.band.height / 2,
        layout.band.width - 24
      );
    }
  } else {
    ctx.fillStyle = options.colors.bgColor;
    ctx.fillRect(0, 0, layout.canvasWidth, layout.canvasHeight);
  }

  const qrBlockEnd = layout.qrBlockX + layout.qrBlockSize;
  const fillStyle =
    options.colors.useGradient && options.colors.fgColor2
      ? (() => {
          const gradient = ctx.createLinearGradient(layout.qrBlockX, layout.qrBlockY, qrBlockEnd, layout.qrBlockY + layout.qrBlockSize);
          gradient.addColorStop(0, options.colors.fgColor);
          gradient.addColorStop(1, options.colors.fgColor2);
          return gradient;
        })()
      : options.colors.fgColor;

  ctx.fillStyle = fillStyle;
  const overlap = 0.6;
  for (let row = 0; row < modules.size; row += 1) {
    for (let col = 0; col < modules.size; col += 1) {
      if (!modules.isDark(row, col)) continue;
      const x = layout.qrBlockX + layout.quietZone + col * layout.moduleSize;
      const y = layout.qrBlockY + layout.quietZone + row * layout.moduleSize;
      ctx.fillRect(x, y, layout.moduleSize + overlap, layout.moduleSize + overlap);
    }
  }

  return layout;
}
