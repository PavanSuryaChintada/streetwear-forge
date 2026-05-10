import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSettings, saveSettings, TIER_KEYS, type LoyaltySettings } from "@/lib/settings";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [s, setS] = useState<LoyaltySettings | null>(null);
  useEffect(() => setS(getSettings()), []);
  if (!s) return <div className="text-mono text-xs">LOADING…</div>;

  const setDiscount = (k: keyof LoyaltySettings["discount"], v: number) =>
    setS({ ...s, discount: { ...s.discount, [k]: v } });

  return (
    <div className="max-w-3xl">
      <h1 className="text-display text-4xl md:text-5xl mb-2">SETTINGS.</h1>
      <p className="text-muted-foreground text-sm mb-8">Tune loyalty discounts, points economy and shipping rules.</p>

      <section className="border border-border bg-surface p-6 mb-6">
        <div className="text-mono text-[11px] tracking-[0.25em] text-primary mb-4">LOYALTY DISCOUNT BY TIER</div>
        <div className="grid sm:grid-cols-2 gap-4">
          {TIER_KEYS.map((t) => (
            <label key={t} className="block">
              <div className="text-mono text-[10px] tracking-widest text-muted-foreground mb-1">{t} (%)</div>
              <input
                type="number" min={0} max={90}
                value={s.discount[t]}
                onChange={(e) => setDiscount(t, Math.max(0, Math.min(90, Number(e.target.value) || 0)))}
                className="bg-background border border-border h-10 px-3 w-full text-mono text-sm"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="border border-border bg-surface p-6 mb-6">
        <div className="text-mono text-[11px] tracking-[0.25em] text-primary mb-4">POINTS ECONOMY</div>
        <div className="grid sm:grid-cols-3 gap-4">
          <label>
            <div className="text-mono text-[10px] tracking-widest text-muted-foreground mb-1">POINTS / ₹100</div>
            <input type="number" value={s.pointsPer100} onChange={(e) => setS({ ...s, pointsPer100: Number(e.target.value) || 0 })}
              className="bg-background border border-border h-10 px-3 w-full text-mono text-sm" />
          </label>
          <label>
            <div className="text-mono text-[10px] tracking-widest text-muted-foreground mb-1">₹ / POINT</div>
            <input type="number" value={s.rupeesPerPoint} onChange={(e) => setS({ ...s, rupeesPerPoint: Number(e.target.value) || 0 })}
              className="bg-background border border-border h-10 px-3 w-full text-mono text-sm" />
          </label>
          <label>
            <div className="text-mono text-[10px] tracking-widest text-muted-foreground mb-1">FREE SHIPPING ABOVE ₹</div>
            <input type="number" value={s.freeShipping} onChange={(e) => setS({ ...s, freeShipping: Number(e.target.value) || 0 })}
              className="bg-background border border-border h-10 px-3 w-full text-mono text-sm" />
          </label>
        </div>
      </section>

      <button
        onClick={() => { saveSettings(s); toast.success("Settings saved"); }}
        className="bg-primary text-primary-foreground h-12 px-6 text-mono text-xs tracking-widest hover:glow-primary"
      >
        SAVE SETTINGS
      </button>
    </div>
  );
}
