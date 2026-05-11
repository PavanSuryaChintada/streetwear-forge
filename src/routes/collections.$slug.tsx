import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { productsInCategory, findCategoryBySlug, listCategories } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";

export const Route = createFileRoute("/collections/$slug")({
  component: CollectionPage,
  head: ({ params }) => ({ meta: [{ title: `${params.slug.toUpperCase()} — STUDIO/DENY` }] }),
});

function CollectionPage() {
  const { slug } = Route.useParams();
  const [items, setItems] = useState(() => productsInCategory(slug));
  useEffect(() => setItems(productsInCategory(slug)), [slug]);
  const cat = useMemo(() => findCategoryBySlug(slug), [slug]);
  const all = listCategories();

  return (
    <section className="px-4 md:px-8 mt-24 md:mt-28 pb-16 max-w-7xl mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="text-mono text-[10px] tracking-[0.3em] text-primary mb-2">COLLECTION</div>
          <h1 className="text-display text-5xl md:text-7xl">{cat?.name?.toUpperCase() ?? slug.toUpperCase()}.</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {all.map((c) => (
            <Link key={c.slug} to="/collections/$slug" params={{ slug: c.slug }}
              className={`text-mono text-[10px] tracking-widest px-3 h-8 inline-flex items-center border ${c.slug === slug ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary hover:text-primary"}`}>
              {c.name.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 border border-border bg-surface">
          <p className="text-muted-foreground text-sm">No products in this collection yet.</p>
          <Link to="/shop" className="inline-block mt-4 text-mono text-xs tracking-widest text-primary">VIEW ALL →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      )}
    </section>
  );
}
