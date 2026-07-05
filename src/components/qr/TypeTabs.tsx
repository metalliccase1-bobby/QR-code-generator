"use client";

import type { QrType } from "@/lib/qr/build-value";

const TABS: { value: QrType; label: string; emoji: string }[] = [
  { value: "url", label: "URL", emoji: "🔗" },
  { value: "text", label: "ข้อความ", emoji: "📝" },
  { value: "wifi", label: "WiFi", emoji: "📶" },
  { value: "vcard", label: "นามบัตร", emoji: "👤" },
];

export function TypeTabs({ value, onChange }: { value: QrType; onChange: (v: QrType) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {TABS.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
              active
                ? "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30 scale-[1.02]"
                : "bg-white/70 text-slate-600 hover:bg-white hover:text-slate-900"
            }`}
          >
            <span aria-hidden>{tab.emoji}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
