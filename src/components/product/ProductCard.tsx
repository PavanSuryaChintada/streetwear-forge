import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart, formatINR } from "@/context/CartContext";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart();
  const [hover, setHover] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  return (
    <div
      className="group relative animate-in fade-in slide-in-from-bottom-2 duration-500"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "both" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setShowSizes(false); }}
    >
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-surface border border-border">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={1280}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hover ? "opacity-0" : "opacity-100"}`}
          />
          <img
            src={product.hoverImage}
            alt=""
            loading="lazy"
            aria-hidden
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hover ? "opacity-100" : "opacity-0"}`}
          />
          {product.badge && (
            <span className={`absolute top-2 left-2 text-mono text-[10px] tracking-widest px-2 py-1 ${
              product.badge === "SALE" ? "bg-secondary text-secondary-foreground" :
              product.badge === "SOLD OUT" ? "bg-muted text-muted-foreground" :
              "bg-primary text-primary-foreground"
            }`}>
              {product.badge}
            </span>
          )}
          <button
            aria-label="Wishlist"
            onClick={(e) => { e.preventDefault(); }}
            className="absolute top-2 right-2 p-1.5 bg-background/60 backdrop-blur-sm border border-border hover:text-primary transition-colors"
          >
            <Heart className="size-3.5" />
          </button>

          {/* Quick size on hover (desktop) */}
          <div
            className={`absolute inset-x-0 bottom-0 hidden md:block transition-all duration-300 ${hover ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
          >
            {!showSizes ? (
              <button
                onClick={(e) => { e.preventDefault(); setShowSizes(true); }}
                className="w-full bg-foreground text-background text-mono text-[11px] tracking-[0.2em] py-2.5 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                + QUICK ADD
              </button>
            ) : (
              <div className="flex bg-foreground text-background">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={(e) => { e.preventDefault(); add(product, s); setShowSizes(false); }}
                    className="flex-1 text-mono text-xs py-2.5 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 px-0.5">
          <div className="text-mono text-[10px] tracking-widest text-muted-foreground">
            {product.category.toUpperCase()}
          </div>
          <div className="mt-1 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
          </div>
          <div className="mt-1 flex items-baseline gap-2 text-mono">
            <span className="text-sm">{formatINR(product.price)}</span>
            {product.compareAt && (
              <span className="text-xs text-muted-foreground line-through">
                {formatINR(product.compareAt)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
