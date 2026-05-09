import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getStoredProduct, upsertProduct } from "@/lib/productsStore";
import { toast } from "sonner";
import type { Product } from "@/lib/products";
import { ProductForm } from "./admin.products.new";

export const Route = createFileRoute("/admin/products/$slug")({
  component: EditProduct,
});

function EditProduct() {
  const { slug } = Route.useParams();
  const nav = useNavigate();
  const [p, setP] = useState<Product | null>(null);
  useEffect(() => { setP(getStoredProduct(slug) ?? null); }, [slug]);

  if (!p) return <div className="text-mono text-xs">LOADING…</div>;
  return <ProductForm initial={p} onSave={(np) => { upsertProduct(np); toast.success("Saved"); nav({ to: "/admin/products" }); }} />;
}
