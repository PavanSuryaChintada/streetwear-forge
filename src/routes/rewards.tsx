import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ordersFor, type Order } from "@/lib/orders";
import { Trophy, Zap, Gift, Sparkles } from "lucide-react";

export const Route = createFileRoute("/rewards")({
  component: Rewards,
  head: () => ({ meta: [{ title: "Rewards — STUDIO/DENY" }] }),
});

const TIERS = [
  { name: "ROOKIE", min: 0, color: "text-muted-foreground" },
  { name: "RUNNER", min: 1000, color: "text-secondary" },
  { name: "RIOT", min: 3000, color: "text-primary" },
  { name: "LEGEND", min: 8000, color: "text-primary text-glow-primary" },
];

function Rewards() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { if (user) setOrders(ordersFor(user.email)); }, [user]);

  const points = Math.round(orders.reduce((s, o) => s + o.total / 10, 0));
  const tier = [...TIERS].reverse().find((t) => points >= t.min) ?? TIERS[0];
  const next = TIERS.find((t) => t.min > points);
  const pct = next ? Math.min(100, Math.round((points / next.min) * 100)) : 100;

  return (
    <section className="px-4 md:px-8 mt-8 md:mt-12 max-w-5xl mx-auto">
      <div className="text-mono text-[11px] tracking-[0.3em] text-primary mb-2">◢ DENY CLUB</div>
      <h1 className="text-display text-5xl md:text-7xl mb-8">REWARDS.</h1>

      {!user ? (
        <div className="border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">Log in to track your points.</p>
          <Link to="/login" className="mt-4 inline-block text-mono text-xs tracking-widest text-primary hover:underline">→ LOG IN</Link>
        </div>
      ) : (
        <>
          <div className="border border-border bg-surface p-6 md:p-10">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <div className="text-mono text-[10px] tracking-widest text-muted-foreground">YOUR TIER</div>
                <div className={`text-display text-5xl md:text-7xl ${tier.color}`}>{tier.name}</div>
              </div>
              <div className="text-right">
                <div className="text-mono text-[10px] tracking-widest text-muted-foreground">POINTS</div>
                <div className="text-display text-5xl md:text-7xl">{points}</div>
              </div>
            </div>
            {next && (
              <div className="mt-6">
                <div className="flex justify-between text-mono text-[11px] tracking-widest text-muted-foreground mb-1">
                  <span>{tier.name}</span>
                  <span>{next.name} · {next.min - points} pts</span>
                </div>
                <div className="h-1 bg-muted overflow-hidden">
                  <div className="h-full bg-primary glow-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-3 mt-6">
            {[
              { icon: Zap, t: "EARN", d: "1 pt for every ₹10 spent. Stacks across the bag." },
              { icon: Gift, t: "REDEEM", d: "100 pts = ₹100 off. No expiry. No catch." },
              { icon: Sparkles, t: "PERKS", d: "Early drops, secret colorways, free shipping at RIOT+." },
            ].map((c) => (
              <div key={c.t} className="border border-border bg-surface p-5">
                <c.icon className="size-5 text-primary" />
                <div className="text-display text-2xl tracking-wider mt-3">{c.t}</div>
                <p className="text-sm text-muted-foreground mt-1">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border border-border p-5 flex items-center gap-3">
            <Trophy className="size-5 text-secondary" />
            <p className="text-sm text-muted-foreground">
              {orders.length} order{orders.length === 1 ? "" : "s"} on the books. Keep collecting heat.
            </p>
          </div>
        </>
      )}
    </section>
  );
}
