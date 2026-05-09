import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { listProducts } from "@/lib/productsStore";
const products = listProducts();
import { ProductCard } from "@/components/product/ProductCard";
import { Truck, ShieldCheck, Sparkles, MapPin } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const featured = products.slice(0, 4);
  return (
    <>
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[600px] overflow-hidden grain">
        <img
          src={hero}
          alt="Studio Deny hero"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
        <div className="absolute inset-0 flex flex-col justify-end px-4 md:px-12 pb-16 md:pb-24">
          <div className="text-mono text-[11px] tracking-[0.4em] text-secondary mb-4">
            ◢ DROP 014 — SHADOW REALM
          </div>
          <h1 className="text-display text-[16vw] md:text-[10vw] leading-[0.85] tracking-tight">
            BUILT<br />
            <span className="text-primary text-glow-primary">IN THE</span> DARK
          </h1>
          <p className="mt-6 max-w-md text-muted-foreground text-sm md:text-base">
            Heavyweight streetwear. Raw graphics. Zero apologies. New collection live now.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="bg-primary text-primary-foreground px-8 h-12 inline-flex items-center text-mono text-xs tracking-[0.2em] font-bold hover:glow-primary transition-shadow"
            >
              SHOP THE DROP →
            </Link>
            <Link
              to="/shop"
              search={{ cat: "Outerwear" } as never}
              className="border border-foreground/40 px-8 h-12 inline-flex items-center text-mono text-xs tracking-[0.2em] font-bold hover:border-primary hover:text-primary transition-colors"
            >
              OUTERWEAR
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-4 md:px-8 mt-16 md:mt-24">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-mono text-[11px] tracking-[0.3em] text-primary mb-2">◢ COLLECTIONS</div>
            <h2 className="text-display text-5xl md:text-7xl">PICK YOUR POISON</h2>
          </div>
          <Link to="/shop" className="text-mono text-[11px] tracking-widest text-muted-foreground hover:text-primary hidden md:block">
            VIEW ALL →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {[
            { label: "TOPS", img: products[1].image },
            { label: "BOTTOMS", img: products[2].image },
            { label: "OUTERWEAR", img: products[3].image },
            { label: "ACCESSORIES", img: products[4].image },
          ].map((c) => (
            <Link
              key={c.label}
              to="/shop"
              search={{ cat: c.label === "TOPS" ? "Tops" : c.label === "BOTTOMS" ? "Bottoms" : c.label === "OUTERWEAR" ? "Outerwear" : "Accessories" } as never}
              className="group relative aspect-[3/4] overflow-hidden border border-border bg-surface"
            >
              <img src={c.img} alt={c.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                <div className="text-display text-2xl md:text-4xl tracking-wider group-hover:text-primary transition-colors">
                  {c.label}
                </div>
                <div className="text-mono text-[10px] tracking-widest text-muted-foreground mt-1">SHOP →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="px-4 md:px-8 mt-20 md:mt-28">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-mono text-[11px] tracking-[0.3em] text-primary mb-2">◢ NEW ARRIVALS</div>
            <h2 className="text-display text-5xl md:text-7xl">FRESH OFF THE PRESS</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {featured.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <section className="relative mt-24 md:mt-32 mx-4 md:mx-8 border border-border p-8 md:p-16 overflow-hidden grain">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
        <div className="relative">
          <div className="text-mono text-[11px] tracking-[0.3em] text-secondary mb-4">◢ MANIFESTO</div>
          <blockquote className="text-display text-4xl md:text-7xl leading-[0.95] max-w-4xl">
            "WE DON'T MAKE CLOTHES <span className="text-primary">FOR EVERYONE.</span> WE MAKE CLOTHES FOR THE ONES WHO STOPPED ASKING <span className="text-secondary">PERMISSION.</span>"
          </blockquote>
          <div className="text-mono text-xs tracking-widest text-muted-foreground mt-6">— STUDIO/DENY, EST. 2024</div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="mt-20 md:mt-28 border-y border-border bg-surface/50">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
          {[
            { icon: Truck, h: "FREE SHIPPING", s: "ON ORDERS ₹999+" },
            { icon: ShieldCheck, h: "SECURE CHECKOUT", s: "256-BIT SSL" },
            { icon: Sparkles, h: "HEAVYWEIGHT", s: "PREMIUM FABRICS" },
            { icon: MapPin, h: "MADE IN INDIA", s: "SHIPPED WORLDWIDE" },
          ].map((t) => (
            <div key={t.h} className="flex flex-col items-center text-center py-8 px-4 gap-2">
              <t.icon className="size-6 text-primary" />
              <div className="text-mono text-xs tracking-widest font-bold">{t.h}</div>
              <div className="text-mono text-[10px] tracking-widest text-muted-foreground">{t.s}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
