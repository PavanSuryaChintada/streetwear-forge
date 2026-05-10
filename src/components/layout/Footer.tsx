import { Link } from "@tanstack/react-router";
import { Newsletter } from "./Newsletter";
import { Instagram } from "lucide-react";

export function Footer() {
  const cols: { h: string; l: { label: string; to: string; search?: Record<string, string> }[] }[] = [
    { h: "SHOP", l: [
      { label: "New Drops", to: "/shop" },
      { label: "Tops", to: "/shop", search: { cat: "Tops" } },
      { label: "Bottoms", to: "/shop", search: { cat: "Bottoms" } },
      { label: "Outerwear", to: "/shop", search: { cat: "Outerwear" } },
      { label: "Accessories", to: "/shop", search: { cat: "Accessories" } },
      { label: "Sale", to: "/shop", search: { sale: "1" } },
    ]},
    { h: "BRAND", l: [
      { label: "About", to: "/about" },
      { label: "Lookbook", to: "/lookbook" },
      { label: "Contact", to: "/contact" },
      { label: "Policies", to: "/policies" },
    ]},
    { h: "HELP", l: [
      { label: "FAQ", to: "/faq" },
      { label: "Size Guide", to: "/size-guide" },
      { label: "Refer & Earn", to: "/refer" },
      { label: "Rewards", to: "/rewards" },
      { label: "My Orders", to: "/account" },
    ]},
  ];

  return (
    <footer className="border-t border-border mt-24 bg-surface/40">
      <div className="px-4 md:px-8 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="text-display text-3xl tracking-wider">
            STUDIO<span className="text-primary">/</span>DENY
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Streetwear for the ones who refuse to blend in. Made in India. Worn worldwide.
          </p>
          <div className="mt-5">
            <div className="text-mono text-[11px] tracking-[0.25em] text-primary mb-2">DROP ALERTS</div>
            <Newsletter />
          </div>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-mono text-[11px] tracking-widest text-muted-foreground hover:text-primary">
            <Instagram className="size-4" /> @STUDIODENY
          </a>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <div className="text-mono text-[11px] tracking-[0.25em] text-primary mb-4">{c.h}</div>
            <ul className="space-y-2 text-sm">
              {c.l.map((i) => (
                <li key={i.label}>
                  <a href={i.to} className="text-muted-foreground hover:text-foreground transition-colors">{i.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 md:px-8 py-5 flex flex-col md:flex-row gap-2 items-center justify-between text-mono text-[11px] tracking-widest text-muted-foreground">
        <div>© {new Date().getFullYear()} STUDIO/DENY · ALL RIGHTS RESERVED</div>
        <Link to="/admin" className="hover:text-primary">BUILT IN THE DARK</Link>
      </div>
    </footer>
  );
}
