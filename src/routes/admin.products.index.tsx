import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listProducts, deleteProduct } from "@/lib/productsStore";
import { formatINR } from "@/context/CartContext";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/products";

export const Route = createFileRoute("/admin/products/")({
  component: AdminProducts,
});

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => setProducts(listProducts()), []);

  const remove = (slug: string) => {
    if (!confirm("Delete this product?")) return;
    deleteProduct(slug);
    setProducts(listProducts());
    toast.success("Product deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-display text-4xl md:text-5xl">PRODUCTS.</h1>
        <Link to="/admin/products/new" className="bg-primary text-primary-foreground px-4 h-10 inline-flex items-center gap-2 text-mono text-xs tracking-widest hover:glow-primary">
          <Plus className="size-4" /> NEW PRODUCT
        </Link>
      </div>

      <div className="border border-border bg-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-mono text-[10px] tracking-widest text-muted-foreground border-b border-border">
            <tr>
              <th className="text-left p-3">PRODUCT</th>
              <th className="text-left p-3">CATEGORY</th>
              <th className="text-left p-3">PRICE</th>
              <th className="text-left p-3">STOCK</th>
              <th className="text-left p-3">STATUS</th>
              <th className="text-right p-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.slug} className="hover:bg-muted/40">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 bg-muted overflow-hidden"><img src={p.image} alt="" className="w-full h-full object-cover" /></div>
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-mono text-[10px] text-muted-foreground">{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{p.category}</td>
                <td className="p-3 text-mono">{formatINR(p.price)}</td>
                <td className="p-3 text-mono">{p.stock}</td>
                <td className="p-3">
                  <span className={`text-mono text-[10px] tracking-widest px-2 py-1 border ${p.stock > 5 ? "border-secondary text-secondary" : "border-primary text-primary"}`}>
                    {p.stock > 5 ? "ACTIVE" : p.stock > 0 ? "LOW STOCK" : "SOLD OUT"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="inline-flex gap-2">
                    <Link to="/admin/products/$slug" params={{ slug: p.slug }} className="border border-border h-8 w-8 inline-flex items-center justify-center hover:border-primary hover:text-primary"><Pencil className="size-3" /></Link>
                    <button onClick={() => remove(p.slug)} className="border border-border h-8 w-8 inline-flex items-center justify-center hover:border-primary hover:text-primary"><Trash2 className="size-3" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
