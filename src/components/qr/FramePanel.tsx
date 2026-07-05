"use client";

import { ColorField } from "./ColorField";
import type { FrameOptions, FramePosition } from "@/lib/qr/layout";

export function FramePanel({ value, onChange }: { value: FrameOptions; onChange: (v: FrameOptions) => void }) {
  return (
    <div className="grid gap-4">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={value.enabled}
          onChange={(e) => onChange({ ...value, enabled: e.target.checked })}
          className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-400"
        />
        เพิ่มกรอบ + ข้อความรอบ QR
      </label>

      {value.enabled && (
        <div className="grid gap-4 rounded-xl bg-slate-50 p-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">ข้อความในกรอบ</span>
            <input
              type="text"
              value={value.text}
              onChange={(e) => onChange({ ...value, text: e.target.value })}
              placeholder="SCAN ME"
              maxLength={30}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
            />
          </label>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">ตำแหน่งข้อความ</span>
            <div className="grid grid-cols-2 gap-2">
              {(["top", "bottom"] as FramePosition[]).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => onChange({ ...value, position: pos })}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    value.position === pos
                      ? "bg-purple-600 text-white shadow"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {pos === "top" ? "ด้านบน" : "ด้านล่าง"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ColorField label="สีกรอบ" value={value.frameColor} onChange={(v) => onChange({ ...value, frameColor: v })} />
            <ColorField label="สีข้อความ" value={value.textColor} onChange={(v) => onChange({ ...value, textColor: v })} />
          </div>
        </div>
      )}
    </div>
  );
}
