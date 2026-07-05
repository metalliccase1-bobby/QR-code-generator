export type QrType = "url" | "text" | "wifi" | "vcard";

export type WifiEncryption = "WPA" | "WEP" | "nopass";

export interface WifiData {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  org: string;
  url: string;
}

function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

export function buildWifiValue(data: WifiData): string {
  const { ssid, password, encryption, hidden } = data;
  const parts = [
    "WIFI:",
    `T:${encryption};`,
    `S:${escapeWifi(ssid)};`,
    encryption === "nopass" ? "" : `P:${escapeWifi(password)};`,
    hidden ? "H:true;" : "",
    ";",
  ];
  return parts.join("");
}

export function buildVCardValue(data: VCardData): string {
  const { firstName, lastName, phone, email, org, url } = data;
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${fullName || "Unnamed"}`,
    org ? `ORG:${org}` : "",
    phone ? `TEL;TYPE=CELL:${phone}` : "",
    email ? `EMAIL:${email}` : "",
    url ? `URL:${url}` : "",
    "END:VCARD",
  ].filter(Boolean);
  return lines.join("\r\n");
}

export interface BuildValueInput {
  qrType: QrType;
  text: string;
  wifi: WifiData;
  vcard: VCardData;
}

export function buildQrValue(input: BuildValueInput): string {
  switch (input.qrType) {
    case "url":
    case "text":
      return input.text.trim();
    case "wifi":
      return input.wifi.ssid.trim() ? buildWifiValue(input.wifi) : "";
    case "vcard":
      return input.vcard.firstName.trim() || input.vcard.lastName.trim() || input.vcard.phone.trim()
        ? buildVCardValue(input.vcard)
        : "";
    default:
      return "";
  }
}
