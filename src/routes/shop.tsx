import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { categories, type Category } from "@/lib/products";
import { listProducts } from "@/lib/productsStore";
const products = listProducts();
import { ProductCard } from "@/components/product/ProductCard";
import { X, SlidersHorizontal, ChevronDown } from "lucide-react";

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
      { name: "description", content: "Shop the latest streetwear drops from Studio Deny. Hoodies, tees, cargos, outerwear — all built in the dark." },
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
  const [filterOpen, setFilterOpen] = useState(false);

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
    navigate({ search: (prev: Search) => ({ ...prev, cat: c === "All" ? undefined : c }) });
  };

  const activeCount = (cat !== "All" ? 1 : 0) + sizes.length + (sale ? 1 : 0);

  return (
    <section className="px-4 md:px-8 mt-8 md:mt-12 pb-24">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="text-mono text-primary mb-2" style={{ fontSize: "11px", letterSpacing: "0.35em" }}>◢ ALL DROPS</div>
          <h1 className="text-display leading-none" style={{ fontSize: "clamp(52px, 8vw, 96px)" }}>SHOP</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-mono text-muted-foreground" style={{ fontSize: "11px", letterSpacing: "0.25em" }}>
            {items.length} PIECES
          </span>
          {/* Sort */}
          <div className="relative">
            <select
              id="shop-sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="appearance-none border border-border bg-surface text-foreground text-mono pr-8 pl-3 h-10 hover:border-primary transition-colors cursor-pointer"
              style={{ fontSize: "11px", letterSpacing: "0.15em" }}
            >
              <option value="new">NEWEST</option>
              <option value="low">PRICE: LOW → HIGH</option>
              <option value="high">PRICE: HIGH → LOW</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          </div>
          {/* Mobile filter toggle */}
          <button
            id="shop-filter-toggle"
            className="md:hidden border border-border h-10 px-4 flex items-center gap-2 text-mono hover:border-primary hover:text-primary transition-colors"
            style={{ fontSize: "11px", letterSpacing: "0.15em" }}
            onClick={() => setFilterOpen((v) => !v)}
          >
            <SlidersHorizontal className="size-3.5" />
            FILTERS {activeCount > 0 && `(${activeCount})`}
          </button>
        </div>
      </div>

      {/* Category pills — mobile */}
      <div className="flex gap-2 overflow-x-auto pb-3 md:hidden scrollbar-none mb-6" style={{ scrollbarWidth: "none" }}>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCatAndUrl(c)}
            className={`shrink-0 h-9 px-4 border text-mono transition-colors ${
              cat === c
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-muted-foreground hover:border-primary"
            }`}
            style={{ fontSize: "10px", letterSpacing: "0.2em" }}
          >
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[200px_1fr] gap-8 lg:gap-12">
        {/* Sidebar filters */}
        <aside
          className={`space-y-8 text-sm ${filterOpen ? "block" : "hidden"} md:block`}
          style={{ paddingTop: "4px" }}
        >
          {/* Category */}
          <div>
            <div className="text-mono text-primary mb-4" style={{ fontSize: "11px", letterSpacing: "0.3em" }}>CATEGORY</div>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c}>
                  <button
                    id={`filter-cat-${c.toLowerCase()}`}
                    onClick={() => setCatAndUrl(c)}
                    className={`text-left w-full flex items-center justify-between transition-colors hover:text-primary ${
                      cat === c ? "text-foreground font-semibold" : "text-muted-foreground"
                    }`}
                    style={{ fontSize: "12px" }}
                  >
                    <span>{c.toUpperCase()}</span>
                    <span className="text-mono" style={{ fontSize: "10px" }}>
                      {c === "All" ? products.length : products.filter((p) => p.category === c).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Size */}
          <div>
            <div className="text-mono text-primary mb-4" style={{ fontSize: "11px", letterSpacing: "0.3em" }}>SIZE</div>
            <div className="flex flex-wrap gap-1.5">
              {allSizes.map((s) => (
                <button
                  key={s}
                  id={`filter-size-${s}`}
                  onClick={() => toggleSize(s)}
                  className={`size-10 border text-mono text-xs transition-all hover:border-primary ${
                    sizes.includes(s)
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                  style={{ fontSize: "11px" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Sale */}
          <div>
            <div className="text-mono text-primary mb-4" style={{ fontSize: "11px", letterSpacing: "0.3em" }}>DEALS</div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`size-4 border flex items-center justify-center transition-colors ${
                  sale ? "border-primary bg-primary" : "border-border group-hover:border-primary"
                }`}
              >
                {sale && <div className="size-2 bg-primary-foreground" style={{ clipPath: "polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%)" }} />}
              </div>
              <input
                type="checkbox"
                checked={sale}
                onChange={(e) => setSale(e.target.checked)}
                className="sr-only"
              />
              <span className="text-mono text-muted-foreground group-hover:text-foreground transition-colors" style={{ fontSize: "11px", letterSpacing: "0.2em" }}>
                ON SALE ONLY
              </span>
            </label>
          </div>

          {/* Clear */}
          {activeCount > 0 && (
            <>
              <div className="h-px bg-border" />
              <button
                id="filter-clear-btn"
                onClick={() => { setCat("All"); setSizes([]); setSale(false); navigate({ search: {} }); }}
                className="text-mono text-primary hover:underline flex items-center gap-1.5"
                style={{ fontSize: "11px", letterSpacing: "0.2em" }}
              >
                <X className="size-3" /> CLEAR ALL ({activeCount})
              </button>
            </>
          )}
        </aside>

        {/* Product grid */}
        <div>
          {items.length === 0 ? (
            <div className="py-32 text-center">
              <div className="text-display text-muted-foreground/30" style={{ fontSize: "clamp(48px, 8vw, 96px)" }}>
                NOTHING
              </div>
              <p className="text-mono text-muted-foreground mt-3" style={{ fontSize: "11px", letterSpacing: "0.3em" }}>
                TRY ANOTHER FILTER COMBO
              </p>
              <button
                onClick={() => { setCat("All"); setSizes([]); setSale(false); navigate({ search: {} }); }}
                className="mt-6 border border-border px-6 py-2.5 text-mono text-muted-foreground hover:border-primary hover:text-primary transition-colors inline-block"
                style={{ fontSize: "11px", letterSpacing: "0.2em" }}
              >
                CLEAR FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {items.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
