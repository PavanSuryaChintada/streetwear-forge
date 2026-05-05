import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCart, formatINR } from "@/context/CartContext";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Bag — STUDIO/DENY" }] }),
});

const SHIPPING = (subtotal: number) => (subtotal >= 999 ? 0 : 99);

function CartPage() {
  const { items, remove, setQty, subtotal } = useCart();
  const navigate = useNavigate();
  const ship = SHIPPING(subtotal);

  if (items.length === 0) {
    return (
      <section className="px-4 md:px-8 py-24 text-center">
        <div className="text-display text-7xl text-muted-foreground/30">EMPTY BAG</div>
        <p className="text-muted-foreground mt-4">Nothing to check out. Go grab a fit.</p>
        <Link to="/shop" className="inline-block mt-8 bg-primary text-primary-foreground px-8 py-3 text-mono text-xs tracking-widest hover:glow-primary">
          BROWSE DROPS →
        </Link>
      </section>
    );
  }

  return (
    <section className="px-4 md:px-8 mt-8 md:mt-12">
      <div className="text-mono text-[11px] tracking-[0.3em] text-primary mb-2">◢ YOUR BAG</div>
      <h1 className="text-display text-5xl md:text-7xl mb-8">CHECKOUT.</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <ul className="divide-y divide-border border-y border-border">
          {items.map((it) => (
            <li key={it.product.slug + it.size} className="py-5 flex gap-4">
              <Link to="/product/$slug" params={{ slug: it.product.slug }} className="w-24 h-32 bg-muted overflow-hidden shrink-0">
                <img src={it.product.image} alt={it.product.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="text-mono text-[10px] tracking-widest text-muted-foreground">{it.product.category.toUpperCase()}</div>
                <Link to="/product/$slug" params={{ slug: it.product.slug }} className="font-semibold hover:text-primary">{it.product.name}</Link>
                <div className="text-xs text-muted-foreground mt-0.5">SIZE {it.size}</div>
                <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center border border-border">
                    <button className="p-2 hover:text-primary" onClick={() => setQty(it.product.slug, it.size, it.qty - 1)} aria-label="Decrease"><Minus className="size-3" /></button>
                    <span className="text-mono text-xs w-8 text-center">{it.qty}</span>
                    <button className="p-2 hover:text-primary" onClick={() => setQty(it.product.slug, it.size, it.qty + 1)} aria-label="Increase"><Plus className="size-3" /></button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-mono">{formatINR(it.product.price * it.qty)}</span>
                    <button onClick={() => remove(it.product.slug, it.size)} className="text-muted-foreground hover:text-primary" aria-label="Remove"><Trash2 className="size-4" /></button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="bg-surface border border-border p-6 h-fit lg:sticky lg:top-28">
          <h2 className="text-display text-2xl mb-4 tracking-wider">SUMMARY</h2>
          <div className="space-y-2 text-sm text-mono">
            <div className="flex justify-between"><span className="text-muted-foreground">SUBTOTAL</span><span>{formatINR(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">SHIPPING</span><span>{ship === 0 ? "FREE" : formatINR(ship)}</span></div>
            <div className="border-t border-border pt-3 mt-3 flex justify-between text-base">
              <span>TOTAL</span><span className="text-display text-2xl">{formatINR(subtotal + ship)}</span>
            </div>
          </div>
          <button
            onClick={() => navigate({ to: "/checkout" })}
            className="w-full mt-5 bg-primary text-primary-foreground font-bold tracking-[0.2em] text-mono text-xs h-12 hover:glow-primary transition-shadow inline-flex items-center justify-center gap-2"
          >
            CHECKOUT <ArrowRight className="size-4" />
          </button>
          <Link to="/shop" className="block mt-3 text-center text-mono text-[11px] tracking-widest text-muted-foreground hover:text-primary">CONTINUE SHOPPING</Link>
        </aside>
      </div>
    </section>
  );
}
