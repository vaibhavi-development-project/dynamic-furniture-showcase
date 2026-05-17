import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CATEGORIES, getProducts, type Product } from "@/lib/data";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    setItems(getProducts());
    const sync = () => setItems(getProducts());
    window.addEventListener("maisonor:data", sync);
    return () => window.removeEventListener("maisonor:data", sync);
  }, []);

  return (
    <div className="p-10">
      <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Catalogue</div>
      <h1 className="font-display text-4xl mb-2">Categories</h1>
      <p className="text-muted-foreground mb-10">Built-in categories. Each piece belongs to one.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CATEGORIES.map(c => {
          const count = items.filter(p => p.category === c).length;
          return (
            <div key={c} className="glass rounded-2xl p-6 hover-lift">
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Category</div>
              <div className="mt-2 font-display text-3xl">{c}</div>
              <div className="mt-4 text-primary">{count} {count === 1 ? "piece" : "pieces"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
