"use client";

import { useState } from "react";
import type { WifiData, WifiEncryption } from "@/lib/qr/build-value";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200";

export function WifiForm({ value, onChange }: { value: WifiData; onChange: (v: WifiData) => void }) {
  const [showPassword, setShowPassword] = useState(false);

  const set = <K extends keyof WifiData>(key: K, v: WifiData[K]) => onChange({ ...value, [key]: v });

  return (
    <div className="grid gap-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">ชื่อ WiFi (SSID)</span>
        <input
          type="text"
          value={value.ssid}
          onChange={(e) => set("ssid", e.target.value)}
          placeholder="MyHomeWiFi"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">การเข้ารหัส</span>
        <select
          value={value.encryption}
          onChange={(e) => set("encryption", e.target.value as WifiEncryption)}
          className={inputClass}
        >
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">ไม่มีรหัสผ่าน</option>
        </select>
      </label>

      {value.encryption !== "nopass" && (
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">รหัสผ่าน</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={value.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="••••••••"
              className={`${inputClass} pr-16`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-purple-600 hover:bg-purple-50"
            >
              {showPassword ? "ซ่อน" : "แสดง"}
            </button>
          </div>
        </label>
      )}

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={value.hidden}
          onChange={(e) => set("hidden", e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-400"
        />
        เครือข่ายซ่อนอยู่ (Hidden network)
      </label>
    </div>
  );
}
