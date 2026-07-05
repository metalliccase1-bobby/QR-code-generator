"use client";

import { ColorField } from "./ColorField";

export interface ColorState {
  fgColor: string;
  fgColor2: string;
  useGradient: boolean;
  bgColor: string;
}

interface Preset {
  name: string;
  fgColor: string;
  fgColor2: string;
  useGradient: boolean;
  bgColor: string;
}

const PRESETS: Preset[] = [
  { name: "คลาสสิก", fgColor: "#111827", fgColor2: "#111827", useGradient: false, bgColor: "#ffffff" },
  { name: "พระอาทิตย์ตก", fgColor: "#f97316", fgColor2: "#ec4899", useGradient: true, bgColor: "#fff7ed" },
  { name: "มหาสมุทร", fgColor: "#0284c7", fgColor2: "#6366f1", useGradient: true, bgColor: "#f0f9ff" },
  { name: "ป่าไม้", fgColor: "#16a34a", fgColor2: "#84cc16", useGradient: true, bgColor: "#f0fdf4" },
  { name: "องุ่น", fgColor: "#7c3aed", fgColor2: "#db2777", useGradient: true, bgColor: "#faf5ff" },
  { name: "มิดไนท์", fgColor: "#38bdf8", fgColor2: "#a855f7", useGradient: true, bgColor: "#0f172a" },
];

export function ColorPanel({ value, onChange }: { value: ColorState; onChange: (v: ColorState) => void }) {
  return (
    <div className="grid gap-4">
      <div>
        <span className="mb-2 block text-sm font-medium text-slate-700">ชุดสีสำเร็จรูป</span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              title={preset.name}
              onClick={() =>
                onChange({
                  fgColor: preset.fgColor,
                  fgColor2: preset.fgColor2,
                  useGradient: preset.useGradient,
                  bgColor: preset.bgColor,
                })
              }
              className="h-9 w-9 rounded-full border-2 border-white shadow ring-1 ring-slate-200 transition hover:scale-110"
              style={{
                background: preset.useGradient
                  ? `linear-gradient(135deg, ${preset.fgColor}, ${preset.fgColor2})`
                  : preset.fgColor,
              }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ColorField label="สี QR (Foreground)" value={value.fgColor} onChange={(v) => onChange({ ...value, fgColor: v })} />
        <ColorField label="สีพื้นหลัง (Background)" value={value.bgColor} onChange={(v) => onChange({ ...value, bgColor: v })} />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={value.useGradient}
          onChange={(e) => onChange({ ...value, useGradient: e.target.checked })}
          className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-400"
        />
        ไล่เฉดสี QR (Gradient)
      </label>

      {value.useGradient && (
        <ColorField label="สีที่สอง (Gradient)" value={value.fgColor2} onChange={(v) => onChange({ ...value, fgColor2: v })} />
      )}
    </div>
  );
}
