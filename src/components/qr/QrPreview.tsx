"use client";

import { useEffect, useMemo, useRef } from "react";
import { getQrModules } from "@/lib/qr/modules";
import { renderQrToCanvas, type RenderOptions } from "@/lib/qr/render-canvas";
import { buildQrSvg } from "@/lib/qr/render-svg";
import { downloadBlob } from "@/lib/download";

const ERROR_MESSAGE = "ไม่สามารถสร้าง QR code ได้ กรุณาลดความยาวข้อมูล หรือกรอกข้อมูลให้ครบถ้วน";

export function QrPreview({ options }: { options: RenderOptions }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hasValue = Boolean(options.value.trim());

  // Dry-run the QR encoding during render so failures (e.g. data too long
  // for the chosen error-correction level) surface without setState in an effect.
  const error = useMemo(() => {
    if (!hasValue) return null;
    try {
      getQrModules(options.value, options.ecLevel);
      return null;
    } catch {
      return ERROR_MESSAGE;
    }
  }, [hasValue, options.value, options.ecLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasValue || error) return;
    renderQrToCanvas(canvas, options);
  }, [options, hasValue, error]);

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasValue || error) return;
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, "qrcode.png");
    }, "image/png");
  };

  const handleDownloadSvg = () => {
    if (!hasValue || error) return;
    const svg = buildQrSvg(options);
    downloadBlob(new Blob([svg], { type: "image/svg+xml" }), "qrcode.svg");
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex min-h-[280px] w-full items-center justify-center rounded-2xl bg-white/60 p-6 shadow-inner ring-1 ring-slate-200">
        {!hasValue ? (
          <p className="max-w-[240px] text-center text-sm text-slate-500">
            กรอกข้อมูลด้านซ้ายเพื่อดูตัวอย่าง QR code ของคุณแบบเรียลไทม์
          </p>
        ) : error ? (
          <p className="max-w-[240px] text-center text-sm text-slate-500">{error}</p>
        ) : (
          <canvas ref={canvasRef} className="max-w-full drop-shadow-xl" />
        )}
      </div>

      <div className="flex w-full gap-3">
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={!hasValue || Boolean(error)}
          className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          ดาวน์โหลด PNG
        </button>
        <button
          type="button"
          onClick={handleDownloadSvg}
          disabled={!hasValue || Boolean(error)}
          className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-bold text-purple-700 shadow ring-1 ring-purple-200 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ดาวน์โหลด SVG
        </button>
      </div>
    </div>
  );
}
