// Loyalty / discount + general admin settings (localStorage-backed).
const KEY = "sd_settings_v1";

export type LoyaltySettings = {
  /** % discount per tier */
  discount: { ROOKIE: number; RUNNER: number; RIOT: number; LEGEND: number };
  /** points earned per ₹100 spent */
  pointsPer100: number;
  /** rupees value of 1 point on redeem */
  rupeesPerPoint: number;
  /** free shipping threshold */
  freeShipping: number;
};

const DEFAULTS: LoyaltySettings = {
  discount: { ROOKIE: 0, RUNNER: 5, RIOT: 10, LEGEND: 15 },
  pointsPer100: 10,
  rupeesPerPoint: 1,
  freeShipping: 2499,
};

export function getSettings(): LoyaltySettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    return { ...DEFAULTS, ...(raw || {}), discount: { ...DEFAULTS.discount, ...((raw && raw.discount) || {}) } };
  } catch {
    return DEFAULTS;
  }
}

export function saveSettings(s: LoyaltySettings) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(s));
}

export const TIER_KEYS = ["ROOKIE", "RUNNER", "RIOT", "LEGEND"] as const;
export type TierKey = (typeof TIER_KEYS)[number];
