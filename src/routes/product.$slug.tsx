import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getProduct, products } from "@/lib/products";
import { useCart, formatINR } from "@/context/CartContext";
import { ProductCard } from "@/components/product/ProductCard";
import { Heart, Truck, RotateCcw, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — STUDIO/DENY` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — STUDIO/DENY` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  component: PDP,
  notFoundComponent: () => (
    <div className="px-8 py-24 text-center">
      <h1 className="text-display text-5xl">PRODUCT NOT FOUND</h1>
      <Link to="/shop" className="mt-6 inline-block text-mono text-xs tracking-widest text-primary hover:underline">
        ← BACK TO SHOP
      </Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="px-8 py-24 text-center">
      <h1 className="text-display text-3xl">SOMETHING BROKE</h1>
      <p className="text-mono text-xs text-muted-foreground mt-2">{error.message}</p>
      <button onClick={reset} className="mt-6 text-mono text-xs tracking-widest text-primary hover:underline">RETRY</button>
    </div>
  ),
});

function PDP() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [tab, setTab] = useState<"desc" | "mat" | "ship">("desc");
  const [mainImg, setMainImg] = useState(product.image);
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  return (
    <>
      <div className="px-4 md:px-8 pt-6">
        <nav className="text-mono text-[10px] tracking-widest text-muted-foreground">
          <Link to="/" className="hover:text-primary">HOME</Link> /{" "}
          <Link to="/shop" className="hover:text-primary">SHOP</Link> /{" "}
          <span className="text-foreground">{product.name.toUpperCase()}</span>
        </nav>
      </div>

      <section className="px-4 md:px-8 mt-6 grid md:grid-cols-[100px_1fr_1fr] gap-4 md:gap-8">
        {/* Thumbs */}
        <div className="hidden md:flex flex-col gap-2">
          {[product.image, product.hoverImage].map((src) => (
            <button
              key={src}
              onClick={() => setMainImg(src)}
              className={`aspect-[4/5] border overflow-hidden ${mainImg === src ? "border-primary" : "border-border"}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div className="relative aspect-[4/5] bg-surface border border-border overflow-hidden">
          <img src={mainImg} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
          {product.badge && (
            <span className="absolute top-3 left-3 text-mono text-[10px] tracking-widest px-2 py-1 bg-primary text-primary-foreground">
              {product.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="md:sticky md:top-28 md:self-start">
          <div className="text-mono text-[11px] tracking-[0.3em] text-primary">{product.category.toUpperCase()}</div>
          <h1 className="text-display text-4xl md:text-6xl mt-2 leading-none">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-3 text-mono">
            <span className="text-2xl">{formatINR(product.price)}</span>
            {product.compareAt && (
              <>
                <span className="text-muted-foreground line-through">{formatINR(product.compareAt)}</span>
                <span className="text-secondary text-xs tracking-widest">
                  -{Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="mt-5 text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Color */}
          <div className="mt-6">
            <div className="text-mono text-[11px] tracking-widest text-muted-foreground mb-2">
              COLOR · <span className="text-foreground">{product.colors[0].name.toUpperCase()}</span>
            </div>
            <div className="flex gap-2">
              {product.colors.map((c: { name: string; hex: string }) => (
                <button key={c.name} className="size-8 border border-border ring-offset-2 ring-offset-background ring-1 ring-foreground/20" style={{ backgroundColor: c.hex }} aria-label={c.name} />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-mono text-[11px] tracking-widest text-muted-foreground">SIZE</div>
              <button className="text-mono text-[11px] tracking-widest text-primary hover:underline">SIZE GUIDE</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-12 h-11 px-3 border text-mono text-xs transition-all ${size === s ? "bg-foreground text-background border-foreground" : "border-border hover:border-primary"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            {product.stock <= 5 && (
              <div className="text-mono text-[11px] tracking-widest text-primary mt-3">
                ⚠ ONLY {product.stock} LEFT
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => size && add(product, size)}
              disabled={!size}
              className="flex-1 bg-primary text-primary-foreground font-bold tracking-[0.2em] text-mono text-xs h-[52px] py-4 hover:glow-primary transition-shadow disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {size ? "ADD TO BAG →" : "SELECT SIZE"}
            </button>
            <button aria-label="Wishlist" className="border border-border size-[52px] p-4 hover:border-primary hover:text-primary transition-colors">
              <Heart className="size-5" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 text-mono text-[10px] tracking-widest text-muted-foreground">
            <div className="border border-border p-3 flex flex-col items-center gap-1">
              <Truck className="size-4 text-primary" /><span>FREE SHIP ₹999+</span>
            </div>
            <div className="border border-border p-3 flex flex-col items-center gap-1">
              <RotateCcw className="size-4 text-primary" /><span>7-DAY RETURNS</span>
            </div>
            <div className="border border-border p-3 flex flex-col items-center gap-1">
              <ShieldCheck className="size-4 text-primary" /><span>SECURE PAY</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-t border-border">
            <div className="flex gap-6 border-b border-border text-mono text-[11px] tracking-widest">
              {[
                { k: "desc", l: "DESCRIPTION" },
                { k: "mat", l: "MATERIAL & CARE" },
                { k: "ship", l: "SHIPPING" },
              ].map((t) => (
                <button
                  key={t.k}
                  onClick={() => setTab(t.k as typeof tab)}
                  className={`py-3 border-b-2 -mb-px ${tab === t.k ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  {t.l}
                </button>
              ))}
            </div>
            <div className="py-5 text-sm text-muted-foreground leading-relaxed">
              {tab === "desc" && product.description}
              {tab === "mat" && product.material + " Wash cold inside out. Hang dry. Don't iron the print."}
              {tab === "ship" && "Dispatched within 48 hours. Free shipping on orders ₹999+. International shipping available."}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="px-4 md:px-8 mt-24">
          <div className="text-mono text-[11px] tracking-[0.3em] text-primary mb-2">◢ MORE LIKE THIS</div>
          <h2 className="text-display text-4xl md:text-6xl mb-6">YOU MIGHT ALSO RUN</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
          </div>
        </section>
      )}
    </>
  );
}
