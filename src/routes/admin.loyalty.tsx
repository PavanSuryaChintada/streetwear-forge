import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { listOrders, type Order } from "@/lib/orders";
import { pointsFromOrders, tierFor, TIERS } from "@/lib/loyalty";
import { formatINR } from "@/context/CartContext";

export const Route = createFileRoute("/admin/loyalty")({
  component: LoyaltyDash,
});

function LoyaltyDash() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => setOrders(listOrders()), []);

  const data = useMemo(() => {
    const byUser: Record<string, Order[]> = {};
    orders.forEach((o) => { (byUser[o.userEmail] ??= []).push(o); });
    const members = Object.entries(byUser).map(([email, os]) => {
      const pts = pointsFromOrders(os);
      return { email, points: pts, tier: tierFor(pts).name, spent: os.reduce((s, o) => s + o.total, 0) };
    });
    const dist: Record<string, number> = {};
    TIERS.forEach((t) => (dist[t.name] = 0));
    members.forEach((m) => (dist[m.tier]++));
    const totalPoints = members.reduce((s, m) => s + m.points, 0);
    return { members, dist, totalPoints };
  }, [orders]);

  const max = Math.max(1, ...Object.values(data.dist));

  return (
    <div>
      <h1 className="text-display text-4xl md:text-5xl mb-6">LOYALTY.</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card label="MEMBERS" v={data.members.length} />
        <Card label="POINTS ISSUED" v={data.totalPoints} />
        <Card label="REDEEM VALUE" v={formatINR(data.totalPoints)} />
      </div>

      <div className="border border-border bg-surface p-5">
        <div className="text-mono text-[10px] tracking-widest text-muted-foreground mb-4">TIER DISTRIBUTION</div>
        <div className="space-y-3">
          {TIERS.map((t) => (
            <div key={t.name}>
              <div className="flex justify-between text-mono text-xs mb-1"><span>{t.name}</span><span>{data.dist[t.name]}</span></div>
              <div className="h-2 bg-muted overflow-hidden">
                <div className="h-full bg-primary glow-primary" style={{ width: `${(data.dist[t.name] / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-display text-2xl tracking-wider mt-10 mb-4">TOP MEMBERS</h2>
      <div className="border border-border bg-surface overflow-x-auto">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-border">
            {[...data.members].sort((a, b) => b.points - a.points).slice(0, 10).map((m) => (
              <tr key={m.email}>
                <td className="p-3">{m.email}</td>
                <td className="p-3 text-mono">{m.points} pts</td>
                <td className="p-3"><span className="text-mono text-[10px] tracking-widest px-2 py-1 border border-secondary text-secondary">{m.tier}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function Card({ label, v }: { label: string; v: React.ReactNode }) {
  return (
    <div className="border border-border bg-surface p-5">
      <div className="text-mono text-[10px] tracking-widest text-muted-foreground">{label}</div>
      <div className="text-display text-3xl mt-2">{v}</div>
    </div>
  );
}
