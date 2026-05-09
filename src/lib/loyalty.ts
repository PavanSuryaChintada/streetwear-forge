import type { Order } from "./orders";

export const TIERS = [
  { name: "ROOKIE", min: 0 },
  { name: "RUNNER", min: 1000 },
  { name: "RIOT", min: 3000 },
  { name: "LEGEND", min: 8000 },
] as const;

export const pointsFromOrders = (orders: Order[]) =>
  Math.round(
    orders
      .filter((o) => o.status !== "CANCELLED" && o.status !== "REFUNDED")
      .reduce((s, o) => s + o.total / 10, 0)
  );

export const tierFor = (pts: number) =>
  [...TIERS].reverse().find((t) => pts >= t.min) ?? TIERS[0];
