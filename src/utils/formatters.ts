const BENGALI_DIGIT_MAP: Record<string, string> = {
  "০": "0",
  "১": "1",
  "২": "2",
  "৩": "3",
  "৪": "4",
  "৫": "5",
  "৬": "6",
  "৭": "7",
  "৮": "8",
  "৯": "9",
};

// export function parseBengaliNumber(value: string): number {
//   const normalized = value
//     .split("")
//     .map((ch) => BENGALI_DIGIT_MAP[ch] ?? ch)
//     .join("")
//     .replace(/[^0-9.]/g, "");
//   return parseFloat(normalized);
// }
// export function formatDate(date: Date, locale = "bn-BD"): string {
//   try {
//     return new Intl.DateTimeFormat(locale, {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     }).format(date);
//   } catch {
//     return date.toISOString();
//   }
// }

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("BDT", "৳");
};

// export const toBengaliNumber = (num: number | string): string => {
//   const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
//   return num.toString().replace(/[0-9]/g, (w) => bengaliDigits[+w]);
// };

export const parseBengaliNumber = (
  value: string | number | undefined | null,
): number => {
  if (value === undefined || value === null || value === "") return 0;
  if (typeof value === "number") return value;

  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

  const converted = value
    .toString()
    .replace(/[০-৯]/g, (digit) => bengaliDigits.indexOf(digit).toString())
    .replace(/[^\d.]/g, "");

  return parseFloat(converted) || 0;
};

export const toBengaliNumber = (num: number | string): string => {
  if (num === undefined || num === null) return "";
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .replace(/\d/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
};
