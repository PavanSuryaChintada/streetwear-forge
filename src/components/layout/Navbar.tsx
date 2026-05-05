import { Link, useRouterState } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, User, Menu } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

const nav = [
  { label: "ALL", to: "/shop" },
  { label: "TOPS", to: "/shop", search: { cat: "Tops" } },
  { label: "BOTTOMS", to: "/shop", search: { cat: "Bottoms" } },
  { label: "OUTERWEAR", to: "/shop", search: { cat: "Outerwear" } },
  { label: "ACCESSORIES", to: "/shop", search: { cat: "Accessories" } },
  { label: "SALE", to: "/shop", search: { sale: "1" } },
];

export function Navbar() {
  const { count, open } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-8 h-14">
        <button
          className="md:hidden p-2 -ml-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          <Menu className="size-5" />
        </button>
        <Link to="/" className="text-display text-2xl md:text-3xl tracking-wider leading-none">
          STUDIO<span className="text-primary">/</span>DENY
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          <button className="p-2 hover:text-primary transition-colors" aria-label="Search">
            <Search className="size-5" />
          </button>
          <button className="p-2 hover:text-primary transition-colors hidden md:inline-flex" aria-label="Wishlist">
            <Heart className="size-5" />
          </button>
          <Link to="/account" className="p-2 hover:text-primary transition-colors hidden md:inline-flex" aria-label="Account">
            <User className="size-5" />
          </Link>
          <button
            onClick={open}
            className="p-2 hover:text-primary transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full size-4 flex items-center justify-center text-mono">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
      <nav className="hidden md:flex items-center justify-center gap-7 h-10 border-t border-border/60 text-mono text-[11px] tracking-[0.18em]">
        {nav.map((n) => (
          <Link
            key={n.label}
            to={n.to}
            search={n.search as never}
            className={`hover:text-primary transition-colors ${path === n.to ? "text-foreground" : "text-muted-foreground"}`}
          >
            {n.label}
          </Link>
        ))}
      </nav>
      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-surface px-4 py-3 flex flex-col gap-3 text-mono text-xs tracking-[0.18em]">
          {nav.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              search={n.search as never}
              onClick={() => setMobileOpen(false)}
              className="hover:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
