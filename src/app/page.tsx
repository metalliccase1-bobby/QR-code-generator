import { QrGenerator } from "@/components/qr/QrGenerator";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-gradient-to-br from-indigo-50 via-fuchsia-50 to-orange-50">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-32 h-80 w-80 rounded-full bg-indigo-300/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-orange-300/30 blur-3xl" />

      <header className="relative mx-auto w-full max-w-6xl px-4 pt-10 text-center sm:px-6 lg:px-8">
        <h1 className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
          QR Code Generator
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          สร้าง QR code สีสันสดใสสำหรับ URL, ข้อความ, WiFi และนามบัตร พร้อมใส่กรอบและส่งออกเป็น PNG/SVG
        </p>
      </header>

      <main className="relative flex-1">
        <QrGenerator />
      </main>

      <footer className="relative mx-auto w-full max-w-6xl px-4 pb-8 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
        สร้างด้วย Next.js และ qrcode.js
      </footer>
    </div>
  );
}
