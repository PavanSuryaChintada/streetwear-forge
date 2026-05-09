import { products as base, type Product } from "./products";

const OVR_KEY = "sd_products_overrides"; // slug -> Partial<Product>
const NEW_KEY = "sd_products_custom";    // Product[]
const DEL_KEY = "sd_products_deleted";   // string[]

const read = <T,>(k: string, fb: T): T => {
  if (typeof window === "undefined") return fb;
  try { return JSON.parse(localStorage.getItem(k) || "null") ?? fb; } catch { return fb; }
};
const write = (k: string, v: unknown) => {
  if (typeof window !== "undefined") localStorage.setItem(k, JSON.stringify(v));
};

export function listProducts(): Product[] {
  const ovr = read<Record<string, Partial<Product>>>(OVR_KEY, {});
  const custom = read<Product[]>(NEW_KEY, []);
  const deleted = new Set(read<string[]>(DEL_KEY, []));
  const merged = base
    .filter((p) => !deleted.has(p.slug))
    .map((p) => ({ ...p, ...(ovr[p.slug] || {}) }));
  return [...merged, ...custom];
}

export function getStoredProduct(slug: string): Product | undefined {
  return listProducts().find((p) => p.slug === slug);
}

export function upsertProduct(p: Product) {
  const isBase = base.some((b) => b.slug === p.slug);
  if (isBase) {
    const ovr = read<Record<string, Partial<Product>>>(OVR_KEY, {});
    ovr[p.slug] = p;
    write(OVR_KEY, ovr);
  } else {
    const custom = read<Product[]>(NEW_KEY, []);
    const i = custom.findIndex((x) => x.slug === p.slug);
    if (i >= 0) custom[i] = p; else custom.push(p);
    write(NEW_KEY, custom);
  }
}

export function deleteProduct(slug: string) {
  if (base.some((b) => b.slug === slug)) {
    const del = read<string[]>(DEL_KEY, []);
    if (!del.includes(slug)) del.push(slug);
    write(DEL_KEY, del);
  } else {
    write(NEW_KEY, read<Product[]>(NEW_KEY, []).filter((p) => p.slug !== slug));
  }
}
