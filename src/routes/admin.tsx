import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Package, ShoppingBag, Home, Users, FileText,
  Undo2, BarChart3, Trophy, Bell, Settings,
} from "lucide-react";
import { listOrders } from "@/lib/orders";
import { getLastSeen, markSeen } from "@/lib/notifications";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Admin — STUDIO/DENY" }] }),
});

function AdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unseen, setUnseen] = useState(0);

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role !== "admin") navigate({ to: "/account" });
  }, [user, navigate]);

  useEffect(() => {
    const tick = () => {
      const last = getLastSeen();
      setUnseen(listOrders().filter((o) => o.createdAt > last).length);
    };
    tick();
    const id = setInterval(tick, 5000);
    const onStorage = () => tick();
    window.addEventListener("storage", onStorage);
    return () => { clearInterval(id); window.removeEventListener("storage", onStorage); };
  }, []);

  if (!user || user.role !== "admin") return null;

  const links = [
    { to: "/admin" as const, label: "DASHBOARD", icon: LayoutDashboard, exact: true },
    { to: "/admin/analytics" as const, label: "ANALYTICS", icon: BarChart3 },
    { to: "/admin/products" as const, label: "PRODUCTS", icon: Package },
    { to: "/admin/orders" as const, label: "ORDERS", icon: ShoppingBag, badge: unseen },
    { to: "/admin/invoices" as const, label: "INVOICES", icon: FileText },
    { to: "/admin/refunds" as const, label: "REFUNDS", icon: Undo2 },
    { to: "/admin/customers" as const, label: "CUSTOMERS", icon: Users },
    { to: "/admin/loyalty" as const, label: "LOYALTY", icon: Trophy },
    { to: "/admin/settings" as const, label: "SETTINGS", icon: Settings },
  ];

  return (
    <div className="grid md:grid-cols-[220px_1fr] min-h-screen">
      <aside className="border-r border-border bg-surface p-5 md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="text-mono text-[10px] tracking-[0.3em] text-primary">◢ ADMIN</div>
          <button
            onClick={() => { markSeen(); setUnseen(0); }}
            className="relative text-muted-foreground hover:text-primary"
            title="Mark all seen"
          >
            <Bell className="size-4" />
            {unseen > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[9px] text-mono px-1 rounded-full">
                {unseen}
              </span>
            )}
          </button>
        </div>
        <nav className="space-y-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.exact }}
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              className="flex items-center gap-2 px-3 py-2 text-mono text-xs tracking-widest hover:bg-muted"
            >
              <l.icon className="size-4" /> <span className="flex-1">{l.label}</span>
              {l.badge ? (
                <span className="bg-primary text-primary-foreground text-[9px] px-1.5 rounded-full">{l.badge}</span>
              ) : null}
            </Link>
          ))}
        </nav>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 text-mono text-[10px] tracking-widest text-muted-foreground hover:text-primary">
          <Home className="size-3" /> BACK TO STORE
        </Link>
      </aside>
      <div className="p-5 md:p-8">
        <Outlet />
      </div>
    </div>
  );
}
