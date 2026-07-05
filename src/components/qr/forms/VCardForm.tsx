"use client";

import type { VCardData } from "@/lib/qr/build-value";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200";

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

export function VCardForm({ value, onChange }: { value: VCardData; onChange: (v: VCardData) => void }) {
  const set = <K extends keyof VCardData>(key: K, v: VCardData[K]) => onChange({ ...value, [key]: v });

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="ชื่อ" value={value.firstName} onChange={(v) => set("firstName", v)} placeholder="สมชาย" />
        <Field label="นามสกุล" value={value.lastName} onChange={(v) => set("lastName", v)} placeholder="ใจดี" />
      </div>
      <Field label="เบอร์โทรศัพท์" value={value.phone} onChange={(v) => set("phone", v)} placeholder="+66812345678" type="tel" />
      <Field label="อีเมล" value={value.email} onChange={(v) => set("email", v)} placeholder="name@example.com" type="email" />
      <Field label="บริษัท / องค์กร" value={value.org} onChange={(v) => set("org", v)} placeholder="บริษัทของฉัน" />
      <Field label="เว็บไซต์" value={value.url} onChange={(v) => set("url", v)} placeholder="https://example.com" />
    </div>
  );
}
