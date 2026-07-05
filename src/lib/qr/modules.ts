import QRCode from "qrcode";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QrModules {
  size: number;
  isDark: (row: number, col: number) => boolean;
}

export function getQrModules(value: string, ecLevel: ErrorCorrectionLevel): QrModules {
  const qr = QRCode.create(value, { errorCorrectionLevel: ecLevel });
  const { modules } = qr;
  return {
    size: modules.size,
    isDark: (row: number, col: number) => !!modules.get(row, col),
  };
}
