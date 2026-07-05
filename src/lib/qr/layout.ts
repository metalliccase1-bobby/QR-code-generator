export type FramePosition = "top" | "bottom";

export interface FrameOptions {
  enabled: boolean;
  text: string;
  position: FramePosition;
  frameColor: string;
  textColor: string;
}

export interface LayoutInput {
  moduleCount: number;
  frame: FrameOptions;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RoundedRect extends Rect {
  radius: number;
}

export interface QrLayout {
  canvasWidth: number;
  canvasHeight: number;
  moduleSize: number;
  quietZone: number;
  qrBlockSize: number;
  qrBlockX: number;
  qrBlockY: number;
  hasFrame: boolean;
  hasBandText: boolean;
  outer: RoundedRect;
  innerCard: RoundedRect | null;
  band: Rect | null;
}

const QR_CONTENT_SIZE = 288;
const MARGIN_MODULES = 2;
const FRAME_PADDING = 18;
const INNER_PADDING = 20;
const BAND_HEIGHT = 64;
const OUTER_RADIUS = 32;
const INNER_RADIUS = 18;

export function computeLayout({ moduleCount, frame }: LayoutInput): QrLayout {
  const moduleSize = QR_CONTENT_SIZE / moduleCount;
  const quietZone = moduleSize * MARGIN_MODULES;
  const qrBlockSize = QR_CONTENT_SIZE + quietZone * 2;

  const hasBandText = frame.enabled && frame.text.trim().length > 0;

  if (!frame.enabled) {
    return {
      canvasWidth: qrBlockSize,
      canvasHeight: qrBlockSize,
      moduleSize,
      quietZone,
      qrBlockSize,
      qrBlockX: 0,
      qrBlockY: 0,
      hasFrame: false,
      hasBandText: false,
      outer: { x: 0, y: 0, width: qrBlockSize, height: qrBlockSize, radius: 0 },
      innerCard: null,
      band: null,
    };
  }

  const innerCardSize = qrBlockSize + INNER_PADDING * 2;
  const outerWidth = innerCardSize + FRAME_PADDING * 2;
  const outerHeight = innerCardSize + FRAME_PADDING * 2 + (hasBandText ? BAND_HEIGHT : 0);

  const bandOnTop = frame.position === "top" && hasBandText;
  const innerCardY = FRAME_PADDING + (bandOnTop ? BAND_HEIGHT : 0);

  const band: Rect | null = hasBandText
    ? {
        x: FRAME_PADDING,
        y: bandOnTop ? FRAME_PADDING : FRAME_PADDING + innerCardSize,
        width: innerCardSize,
        height: BAND_HEIGHT,
      }
    : null;

  return {
    canvasWidth: outerWidth,
    canvasHeight: outerHeight,
    moduleSize,
    quietZone,
    qrBlockSize,
    qrBlockX: FRAME_PADDING + INNER_PADDING,
    qrBlockY: innerCardY + INNER_PADDING,
    hasFrame: true,
    hasBandText,
    outer: { x: 0, y: 0, width: outerWidth, height: outerHeight, radius: OUTER_RADIUS },
    innerCard: { x: FRAME_PADDING, y: innerCardY, width: innerCardSize, height: innerCardSize, radius: INNER_RADIUS },
    band,
  };
}
