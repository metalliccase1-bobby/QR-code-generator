"use client";

import type { QrType } from "@/lib/qr/build-value";

export function UrlTextForm({
  qrType,
  text,
  onChange,
}: {
  qrType: QrType;
  text: string;
  onChange: (v: string) => void;
}) {
  if (qrType === "url") {
    return (
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">ลิงก์ URL</span>
        <input
          type="text"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
        />
      </label>
    );
  }

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">ข้อความ</span>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="พิมพ์ข้อความที่ต้องการแปลงเป็น QR code"
        rows={4}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
      />
    </label>
  );
}
