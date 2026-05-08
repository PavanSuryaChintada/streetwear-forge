import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X, Sparkles } from "lucide-react";
import { products } from "@/lib/products";
import { formatINR } from "@/context/CartContext";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products
      .map((p) => {
        const score =
          (p.name.toLowerCase().includes(term) ? 5 : 0) +
          (p.category.toLowerCase().includes(term) ? 3 : 0) +
          (p.description.toLowerCase().includes(term) ? 1 : 0) +
          (p.material.toLowerCase().includes(term) ? 1 : 0);
        return { p, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => x.p);
  }, [q]);

  const suggestions = ["hoodie", "cargo", "tee", "bomber", "denim", "acid"];

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="px-4 md:px-8 pt-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 border-b-2 border-primary pb-3">
          <Search className="size-5 text-primary" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="HUNT FOR HEAT…"
            className="flex-1 bg-transparent outline-none text-display text-2xl md:text-4xl tracking-wider placeholder:text-muted-foreground/40"
          />
          <button onClick={onClose} aria-label="Close" className="p-2 hover:text-primary">
            <X className="size-5" />
          </button>
        </div>

        {!q && (
          <div className="mt-6">
            <div className="text-mono text-[10px] tracking-widest text-muted-foreground mb-3 flex items-center gap-1">
              <Sparkles className="size-3 text-secondary" /> SUGGESTED
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => setQ(s)} className="px-3 py-1.5 border border-border text-mono text-xs tracking-widest hover:border-primary hover:text-primary">
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {q && results.length === 0 && (
          <div className="mt-10 text-center text-muted-foreground text-sm">
            Nothing matches <span className="text-foreground">"{q}"</span> — try another vibe.
          </div>
        )}

        {results.length > 0 && (
          <ul className="mt-6 divide-y divide-border border border-border bg-surface">
            {results.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/product/$slug"
                  params={{ slug: p.slug }}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 hover:bg-muted"
                >
                  <div className="w-14 h-16 bg-muted overflow-hidden shrink-0">
                    <img src={p.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{p.name}</div>
                    <div className="text-mono text-[10px] tracking-widest text-muted-foreground">{p.category.toUpperCase()}</div>
                  </div>
                  <div className="text-mono text-sm">{formatINR(p.price)}</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
