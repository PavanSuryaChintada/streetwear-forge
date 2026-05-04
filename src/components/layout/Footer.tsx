export function Footer() {
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
        </div>
        {[
          { h: "SHOP", l: ["New Drops", "Tops", "Bottoms", "Outerwear", "Sale"] },
          { h: "HELP", l: ["Shipping", "Returns", "Size Guide", "Contact"] },
          { h: "FOLLOW", l: ["Instagram", "TikTok", "WhatsApp", "Newsletter"] },
        ].map((c) => (
          <div key={c.h}>
            <div className="text-mono text-[11px] tracking-[0.25em] text-primary mb-4">{c.h}</div>
            <ul className="space-y-2 text-sm">
              {c.l.map((i) => (
                <li key={i}>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{i}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 md:px-8 py-5 flex flex-col md:flex-row gap-2 items-center justify-between text-mono text-[11px] tracking-widest text-muted-foreground">
        <div>© {new Date().getFullYear()} STUDIO/DENY · ALL RIGHTS RESERVED</div>
        <div>BUILT IN THE DARK</div>
      </div>
    </footer>
  );
}
