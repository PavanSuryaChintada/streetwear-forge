import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { products, categories, type Category } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { X } from "lucide-react";

type Search = { cat?: string; sale?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    cat: typeof s.cat === "string" ? s.cat : undefined,
    sale: typeof s.sale === "string" ? s.sale : undefined,
  }),
  component: Shop,
  head: () => ({
    meta: [
      { title: "Shop — STUDIO/DENY" },
      { name: "description", content: "Shop the latest streetwear drops from Studio Deny." },
    ],
  }),
});

const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];
type Sort = "new" | "low" | "high";

function Shop() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const initialCat = (categories as readonly string[]).includes(search.cat ?? "")
    ? (search.cat as Category)
    : "All";

  const [cat, setCat] = useState<Category>(initialCat);
  const [sizes, setSizes] = useState<string[]>([]);
  const [sale, setSale] = useState<boolean>(search.sale === "1");
  const [sort, setSort] = useState<Sort>("new");

  const items = useMemo(() => {
    let r = products.slice();
    if (cat !== "All") r = r.filter((p) => p.category === cat);
    if (sizes.length) r = r.filter((p) => p.sizes.some((s) => sizes.includes(s)));
    if (sale) r = r.filter((p) => p.compareAt);
    if (sort === "low") r.sort((a, b) => a.price - b.price);
    if (sort === "high") r.sort((a, b) => b.price - a.price);
    return r;
  }, [cat, sizes, sale, sort]);

  const toggleSize = (s: string) =>
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const setCatAndUrl = (c: Category) => {
    setCat(c);
    navigate({ search: (prev) => ({ ...prev, cat: c === "All" ? undefined : c }) });
  };

  const activeCount = (cat !== "All" ? 1 : 0) + sizes.length + (sale ? 1 : 0);

  return (
    <section className="px-4 md:px-8 mt-8 md:mt-12">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="text-mono text-[11px] tracking-[0.3em] text-primary mb-2">◢ ALL DROPS</div>
          <h1 className="text-display text-5xl md:text-7xl">SHOP</h1>
        </div>
        <div className="flex items-center gap-3 text-mono text-[11px] tracking-widest text-muted-foreground">
          <span>{items.length} PIECES</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="bg-surface border border-border px-3 h-9 text-foreground"
          >
            <option value="new">NEWEST</option>
            <option value="low">PRICE: LOW → HIGH</option>
            <option value="high">PRICE: HIGH → LOW</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        {/* Filters */}
        <aside className="space-y-7 text-sm">
          <div>
            <div className="text-mono text-[11px] tracking-[0.25em] text-primary mb-3">CATEGORY</div>
            <ul className="space-y-1.5">
              {categories.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => setCatAndUrl(c)}
                    className={`text-left w-full hover:text-primary transition-colors ${cat === c ? "text-foreground font-semibold" : "text-muted-foreground"}`}
                  >
                    {c.toUpperCase()}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-mono text-[11px] tracking-[0.25em] text-primary mb-3">SIZE</div>
            <div className="flex flex-wrap gap-1.5">
              {allSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSize(s)}
                  className={`size-9 border text-mono text-xs transition-colors ${sizes.includes(s) ? "bg-foreground text-background border-foreground" : "border-border hover:border-primary"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-mono text-[11px] tracking-[0.25em] text-primary mb-3">DEALS</div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sale}
                onChange={(e) => setSale(e.target.checked)}
                className="accent-primary"
              />
              <span className="text-mono text-xs tracking-widest">ON SALE ONLY</span>
            </label>
          </div>

          {activeCount > 0 && (
            <button
              onClick={() => { setCat("All"); setSizes([]); setSale(false); navigate({ search: {} }); }}
              className="text-mono text-[11px] tracking-widest text-primary hover:underline flex items-center gap-1"
            >
              <X className="size-3" /> CLEAR ALL ({activeCount})
            </button>
          )}
        </aside>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {items.length === 0 ? (
            <div className="col-span-full py-24 text-center">
              <div className="text-display text-5xl text-muted-foreground/40">NOTHING HERE</div>
              <p className="text-mono text-xs tracking-widest text-muted-foreground mt-2">
                TRY ANOTHER FILTER COMBO
              </p>
            </div>
          ) : items.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}
