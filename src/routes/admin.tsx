import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Package, ShoppingBag, Home } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Admin — STUDIO/DENY" }] }),
});

function AdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role !== "admin") navigate({ to: "/account" });
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  const links = [
    { to: "/admin" as const, label: "DASHBOARD", icon: LayoutDashboard, exact: true },
    { to: "/admin/products" as const, label: "PRODUCTS", icon: Package },
    { to: "/admin/orders" as const, label: "ORDERS", icon: ShoppingBag },
  ];

  return (
    <div className="grid md:grid-cols-[220px_1fr] min-h-screen">
      <aside className="border-r border-border bg-surface p-5 md:sticky md:top-14 md:h-[calc(100vh-3.5rem)]">
        <div className="text-mono text-[10px] tracking-[0.3em] text-primary mb-6">◢ ADMIN</div>
        <nav className="space-y-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.exact }}
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              className="flex items-center gap-2 px-3 py-2 text-mono text-xs tracking-widest hover:bg-muted"
            >
              <l.icon className="size-4" /> {l.label}
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
