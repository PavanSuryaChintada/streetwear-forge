export type Review = { author: string; rating: number; title: string; body: string; date: string };

const POOL: Review[] = [
  { author: "Aarav K.", rating: 5, title: "HEAVY. LITERALLY.", body: "Fabric weight is unreal. Fits oversized exactly like the photos.", date: "2026-04-12" },
  { author: "Rhea S.", rating: 5, title: "Built different", body: "Stitching is clean, print hasn't faded after 6 washes.", date: "2026-03-30" },
  { author: "Karan M.", rating: 4, title: "Sized up, perfect", body: "Runs slightly slim — sized up and it sits perfect.", date: "2026-03-22" },
  { author: "Niharika P.", rating: 5, title: "Rotation locked", body: "On me 4x a week. People keep asking where it's from.", date: "2026-02-18" },
  { author: "Vivek J.", rating: 5, title: "Worth every rupee", body: "Looks like 3x the price. Packaging was art.", date: "2026-01-05" },
];

export function reviewsFor(slug: string): Review[] {
  // Deterministic slice based on slug length for variety
  const start = slug.length % POOL.length;
  return [...POOL.slice(start), ...POOL.slice(0, start)].slice(0, 3 + (slug.length % 3));
}

export function averageRating(slug: string): { avg: number; count: number } {
  const r = reviewsFor(slug);
  const avg = r.reduce((s, x) => s + x.rating, 0) / r.length;
  return { avg: Math.round(avg * 10) / 10, count: r.length };
}
