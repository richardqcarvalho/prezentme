export type CountryT = {
  name: string;
  dial: string;
  flag: string;
};

export const COUNTRIES: CountryT[] = [
  { name: "United States", dial: "+1", flag: "🇺🇸" },
  { name: "Canada", dial: "+1", flag: "🇨🇦" },
  { name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { name: "France", dial: "+33", flag: "🇫🇷" },
  { name: "Germany", dial: "+49", flag: "🇩🇪" },
  { name: "Spain", dial: "+34", flag: "🇪🇸" },
  { name: "Italy", dial: "+39", flag: "🇮🇹" },
  { name: "Portugal", dial: "+351", flag: "🇵🇹" },
  { name: "Netherlands", dial: "+31", flag: "🇳🇱" },
  { name: "Belgium", dial: "+32", flag: "🇧🇪" },
  { name: "Switzerland", dial: "+41", flag: "🇨🇭" },
  { name: "Austria", dial: "+43", flag: "🇦🇹" },
  { name: "Sweden", dial: "+46", flag: "🇸🇪" },
  { name: "Norway", dial: "+47", flag: "🇳🇴" },
  { name: "Denmark", dial: "+45", flag: "🇩🇰" },
  { name: "Finland", dial: "+358", flag: "🇫🇮" },
  { name: "Poland", dial: "+48", flag: "🇵🇱" },
  { name: "Ireland", dial: "+353", flag: "🇮🇪" },
  { name: "Greece", dial: "+30", flag: "🇬🇷" },
  { name: "Romania", dial: "+40", flag: "🇷🇴" },
  { name: "Hungary", dial: "+36", flag: "🇭🇺" },
  { name: "Czechia", dial: "+420", flag: "🇨🇿" },
  { name: "Ukraine", dial: "+380", flag: "🇺🇦" },
  { name: "Russia", dial: "+7", flag: "🇷🇺" },
  { name: "Turkey", dial: "+90", flag: "🇹🇷" },
  { name: "Brazil", dial: "+55", flag: "🇧🇷" },
  { name: "Argentina", dial: "+54", flag: "🇦🇷" },
  { name: "Chile", dial: "+56", flag: "🇨🇱" },
  { name: "Colombia", dial: "+57", flag: "🇨🇴" },
  { name: "Mexico", dial: "+52", flag: "🇲🇽" },
  { name: "Peru", dial: "+51", flag: "🇵🇪" },
  { name: "Uruguay", dial: "+598", flag: "🇺🇾" },
  { name: "India", dial: "+91", flag: "🇮🇳" },
  { name: "China", dial: "+86", flag: "🇨🇳" },
  { name: "Japan", dial: "+81", flag: "🇯🇵" },
  { name: "South Korea", dial: "+82", flag: "🇰🇷" },
  { name: "Australia", dial: "+61", flag: "🇦🇺" },
  { name: "New Zealand", dial: "+64", flag: "🇳🇿" },
  { name: "South Africa", dial: "+27", flag: "🇿🇦" },
  { name: "Nigeria", dial: "+234", flag: "🇳🇬" },
  { name: "Egypt", dial: "+20", flag: "🇪🇬" },
  { name: "Morocco", dial: "+212", flag: "🇲🇦" },
  { name: "Kenya", dial: "+254", flag: "🇰🇪" },
  { name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { name: "United Arab Emirates", dial: "+971", flag: "🇦🇪" },
  { name: "Israel", dial: "+972", flag: "🇮🇱" },
  { name: "Singapore", dial: "+65", flag: "🇸🇬" },
  { name: "Malaysia", dial: "+60", flag: "🇲🇾" },
  { name: "Indonesia", dial: "+62", flag: "🇮🇩" },
  { name: "Philippines", dial: "+63", flag: "🇵🇭" },
  { name: "Vietnam", dial: "+84", flag: "🇻🇳" },
  { name: "Thailand", dial: "+66", flag: "🇹🇭" },
  { name: "Pakistan", dial: "+92", flag: "🇵🇰" },
  { name: "Bangladesh", dial: "+880", flag: "🇧🇩" },
];

export const DEFAULT_COUNTRY_DIAL = "+1";

export function getCountryByDial(dial: string): CountryT {
  return COUNTRIES.find((country) => country.dial === dial) ?? COUNTRIES[0];
}

export function splitNumber(value: string): { dial: string; local: string } {
  const digits = value.replace(/\D/g, "");
  if (!digits) return { dial: DEFAULT_COUNTRY_DIAL, local: "" };

  const withoutPrefix = digits.startsWith("00") ? digits.slice(2) : digits;
  const candidates = COUNTRIES.map((country) => country.dial)
    .sort((a, b) => b.length - a.length)
    .filter((dial) => withoutPrefix.startsWith(dial.replace("+", "")));

  if (candidates.length === 0)
    return { dial: DEFAULT_COUNTRY_DIAL, local: withoutPrefix };

  const dial = candidates[0];
  return { dial, local: withoutPrefix.slice(dial.length - 1) };
}
