"use client";

import { useMemo, useState } from "react";
import { TypeTabs } from "./TypeTabs";
import { UrlTextForm } from "./forms/UrlTextForm";
import { WifiForm } from "./forms/WifiForm";
import { VCardForm } from "./forms/VCardForm";
import { ColorPanel, type ColorState } from "./ColorPanel";
import { FramePanel } from "./FramePanel";
import { QrPreview } from "./QrPreview";
import { buildQrValue, type QrType, type VCardData, type WifiData } from "@/lib/qr/build-value";
import type { FrameOptions } from "@/lib/qr/layout";
import type { ErrorCorrectionLevel } from "@/lib/qr/modules";
import type { RenderOptions } from "@/lib/qr/render-canvas";

const EC_LEVELS: { value: ErrorCorrectionLevel; label: string }[] = [
  { value: "L", label: "L · 7%" },
  { value: "M", label: "M · 15%" },
  { value: "Q", label: "Q · 25%" },
  { value: "H", label: "H · 30%" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-white/60 backdrop-blur">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-purple-700">{title}</h2>
      {children}
    </section>
  );
}

export function QrGenerator() {
  const [qrType, setQrType] = useState<QrType>("url");
  const [text, setText] = useState("https://example.com");
  const [wifi, setWifi] = useState<WifiData>({ ssid: "", password: "", encryption: "WPA", hidden: false });
  const [vcard, setVcard] = useState<VCardData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    org: "",
    url: "",
  });

  const [colors, setColors] = useState<ColorState>({
    fgColor: "#111827",
    fgColor2: "#8b5cf6",
    useGradient: false,
    bgColor: "#ffffff",
  });

  const [ecLevel, setEcLevel] = useState<ErrorCorrectionLevel>("M");

  const [frame, setFrame] = useState<FrameOptions>({
    enabled: false,
    text: "SCAN ME",
    position: "bottom",
    frameColor: "#111827",
    textColor: "#ffffff",
  });

  const value = useMemo(() => buildQrValue({ qrType, text, wifi, vcard }), [qrType, text, wifi, vcard]);

  const renderOptions: RenderOptions = useMemo(
    () => ({ value, ecLevel, colors, frame }),
    [value, ecLevel, colors, frame]
  );

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:px-8 lg:py-12">
      <div className="flex flex-col gap-6">
        <Section title="ประเภทข้อมูล">
          <TypeTabs value={qrType} onChange={setQrType} />
          <div className="mt-4">
            {(qrType === "url" || qrType === "text") && (
              <UrlTextForm qrType={qrType} text={text} onChange={setText} />
            )}
            {qrType === "wifi" && <WifiForm value={wifi} onChange={setWifi} />}
            {qrType === "vcard" && <VCardForm value={vcard} onChange={setVcard} />}
          </div>
        </Section>

        <Section title="สีสัน">
          <ColorPanel value={colors} onChange={setColors} />
        </Section>

        <Section title="กรอบ & ข้อความ">
          <FramePanel value={frame} onChange={setFrame} />
        </Section>

        <Section title="ตั้งค่าขั้นสูง">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">ระดับความสามารถแก้ไขข้อผิดพลาด</span>
          <div className="grid grid-cols-4 gap-2">
            {EC_LEVELS.map((lvl) => (
              <button
                key={lvl.value}
                type="button"
                onClick={() => setEcLevel(lvl.value)}
                className={`rounded-lg px-2 py-2 text-xs font-semibold transition ${
                  ecLevel === lvl.value
                    ? "bg-purple-600 text-white shadow"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </Section>
      </div>

      <div className="lg:sticky lg:top-8">
        <Section title="ตัวอย่าง QR Code">
          <QrPreview options={renderOptions} />
        </Section>
      </div>
    </div>
  );
}
