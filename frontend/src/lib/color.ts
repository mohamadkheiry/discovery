// توابع کمکی رنگ برای ساخت گرادیان از primary_color داینامیک

export const DEFAULT_PRIMARY_COLOR = "#7c3aed";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

/** روشن‌تر کردن (amount مثبت) یا تیره‌تر کردن (amount منفی) رنگ هگز */
export function shade(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const mix = (channel: number) =>
    amount >= 0 ? channel + (255 - channel) * amount : channel * (1 + amount);
  return rgbToHex(mix(rgb.r), mix(rgb.g), mix(rgb.b));
}

export function safeHex(hex: string | undefined | null): string {
  if (!hex) return DEFAULT_PRIMARY_COLOR;
  const rgb = hexToRgb(hex);
  return rgb ? hex : DEFAULT_PRIMARY_COLOR;
}

export function gradientFrom(hex: string): string {
  const base = safeHex(hex);
  const light = shade(base, 0.22);
  const dark = shade(base, -0.18);
  return `linear-gradient(135deg, ${light} 0%, ${base} 55%, ${dark} 100%)`;
}

export function withAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(safeHex(hex));
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}
