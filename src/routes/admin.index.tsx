import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, Tag, DollarSign, ArrowRight } from "lucide-react";
import { getProducts, CATEGORIES, type Product } from "@/lib/data";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    setProducts(getProducts());
    const sync = () => setProducts(getProducts());
    window.addEventListener("maisonor:data", sync);
    return () => window.removeEventListener("maisonor:data", sync);
  }, []);

  const totalValue = products.reduce((s, p) => s + p.price, 0);

  const stats = [
    { label: "Total Products", value: products.length, icon: Package },
    { label: "Categories", value: CATEGORIES.length, icon: Tag },
    { label: "Catalogue Value", value: `₹${totalValue.toLocaleString("en-IN")}`, icon: DollarSign },
  ];

  return (
    <div className="p-10">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Overview</div>
          <h1 className="font-display text-4xl">Welcome back.</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {stats.map(s => (
          <div key={s.label} className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{s.label}</div>
                <div className="mt-3 font-display text-4xl">{s.value}</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <s.icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 glass rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl">Recent Products</h2>
          <Link to="/admin/products" className="text-xs uppercase tracking-[0.2em] text-primary inline-flex items-center gap-2">
            Manage all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="space-y-3">
          {products.slice(0, 5).map(p => (
            <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-sidebar-accent transition">
              <img src={p.image} alt="" className="h-12 w-12 rounded object-cover" />
              <div className="flex-1">
                <div className="text-sm">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.category} · {p.color}</div>
              </div>
              <div className="text-primary">₹{p.price.toLocaleString("en-IN")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
