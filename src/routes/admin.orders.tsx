import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listOrders, updateOrderStatus, type Order, type OrderStatus } from "@/lib/orders";
import { formatINR } from "@/context/CartContext";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const STATUSES: OrderStatus[] = ["PLACED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => setOrders(listOrders()), []);

  const change = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
    setOrders(listOrders());
    toast.success(`Order ${id} → ${status}`);
  };

  return (
    <div>
      <h1 className="text-display text-4xl md:text-5xl mb-6">ORDERS.</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-sm">No orders yet.</p>
      ) : (
        <div className="border border-border bg-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-mono text-[10px] tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left p-3">ORDER</th>
                <th className="text-left p-3">CUSTOMER</th>
                <th className="text-left p-3">DATE</th>
                <th className="text-left p-3">TOTAL</th>
                <th className="text-left p-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="p-3 text-mono text-xs">#{o.id}</td>
                  <td className="p-3 text-muted-foreground">{o.userEmail}</td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-mono">{formatINR(o.total)}</td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => change(o.id, e.target.value as OrderStatus)}
                      className="bg-background border border-border px-2 h-8 text-mono text-xs"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
