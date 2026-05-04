import { useCart, formatINR } from "@/context/CartContext";
import { X, Minus, Plus, Trash2 } from "lucide-react";

const FREE_SHIP = 999;

export function CartDrawer() {
  const { isOpen, close, items, remove, setQty, subtotal } = useCart();
  const remaining = Math.max(0, FREE_SHIP - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIP) * 100);

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-surface border-l border-border flex flex-col transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-border">
          <h2 className="text-display text-2xl tracking-wider">YOUR BAG</h2>
          <button onClick={close} aria-label="Close" className="p-2 hover:text-primary">
            <X className="size-5" />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-border">
          {subtotal >= FREE_SHIP ? (
            <p className="text-mono text-[11px] tracking-widest text-secondary">
              ✦ FREE SHIPPING UNLOCKED
            </p>
          ) : (
            <p className="text-mono text-[11px] tracking-widest text-muted-foreground">
              ADD <span className="text-primary">{formatINR(remaining)}</span> FOR FREE SHIPPING
            </p>
          )}
          <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${pct}%`, boxShadow: pct > 0 ? "0 0 12px var(--primary)" : "" }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-8 gap-3">
              <div className="text-display text-5xl text-muted-foreground/40">EMPTY</div>
              <p className="text-sm text-muted-foreground">No drops in your bag yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((it) => (
                <li key={it.product.slug + it.size} className="p-5 flex gap-4">
                  <div className="w-20 h-24 bg-muted overflow-hidden shrink-0">
                    <img src={it.product.image} alt={it.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-mono text-[10px] tracking-widest text-muted-foreground">
                      {it.product.category.toUpperCase()}
                    </div>
                    <div className="font-semibold leading-tight truncate">{it.product.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">SIZE {it.size}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          className="p-1 hover:text-primary"
                          onClick={() => setQty(it.product.slug, it.size, it.qty - 1)}
                          aria-label="Decrease"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="text-mono text-xs w-7 text-center">{it.qty}</span>
                        <button
                          className="p-1 hover:text-primary"
                          onClick={() => setQty(it.product.slug, it.size, it.qty + 1)}
                          aria-label="Increase"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-mono text-sm">{formatINR(it.product.price * it.qty)}</span>
                        <button
                          onClick={() => remove(it.product.slug, it.size)}
                          className="text-muted-foreground hover:text-primary"
                          aria-label="Remove"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-mono text-xs tracking-widest text-muted-foreground">SUBTOTAL</span>
            <span className="text-display text-2xl">{formatINR(subtotal)}</span>
          </div>
          <button
            disabled={items.length === 0}
            className="w-full bg-primary text-primary-foreground font-bold tracking-[0.2em] text-mono text-xs h-12 hover:glow-primary transition-shadow disabled:opacity-40 disabled:cursor-not-allowed"
          >
            CHECKOUT —&gt;
          </button>
          <p className="text-[10px] text-mono tracking-widest text-muted-foreground text-center">
            TAX & SHIPPING CALCULATED AT CHECKOUT
          </p>
        </div>
      </aside>
    </>
  );
}
