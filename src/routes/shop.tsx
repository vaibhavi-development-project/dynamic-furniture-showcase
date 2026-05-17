import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getProducts, CATEGORIES, CATEGORY_LABELS, type Product, type Category } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { PageTransition } from "@/components/PageTransition";

type Search = { category?: Category | "All"; color?: string; style?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: (s.category as any) ?? "All",
    color: (s.color as string) || undefined,
    style: (s.style as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Collection — MaisonOr" },
      { name: "description", content: "Browse the full MaisonOr collection of sofas, chairs, tables, beds and cabinets." },
      { property: "og:title", content: "Collection — MaisonOr" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    setProducts(getProducts());
    const sync = () => setProducts(getProducts());
    window.addEventListener("maisonor:data", sync);
    return () => window.removeEventListener("maisonor:data", sync);
  }, []);

  const colors = useMemo(() => Array.from(new Set(products.map(p => p.color))), [products]);
  const styles = useMemo(() => Array.from(new Set(products.map(p => p.style))), [products]);

  const filtered = products.filter(p =>
    (search.category === "All" || !search.category || p.category === search.category) &&
    (!search.color || p.color === search.color) &&
    (!search.style || p.style === search.style)
  );

  const set = (patch: Partial<Search>) => navigate({ search: (prev: Search) => ({ ...prev, ...patch }) });

  return (
    <PageTransition>
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">The Collection</div>
          <h1 className="font-display text-6xl md:text-7xl">Every piece, considered.</h1>
        </motion.div>

        {/* Filters */}
        <div className="mt-14 flex flex-wrap gap-3 items-center">
          <FilterPill label="All" active={!search.category || search.category === "All"} onClick={() => set({ category: "All" })} />
          {CATEGORIES.map(c => (
            <FilterPill key={c} label={CATEGORY_LABELS[c]} active={search.category === c} onClick={() => set({ category: c })} />
          ))}
          <span className="mx-2 h-6 w-px bg-border" />
          <select
            value={search.color || ""}
            onChange={e => set({ color: e.target.value || undefined })}
            className="bg-card border border-border rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            <option value="">All Colors</option>
            {colors.map(c => <option key={c}>{c}</option>)}
          </select>
          <select
            value={search.style || ""}
            onChange={e => set({ style: e.target.value || undefined })}
            className="bg-card border border-border rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            <option value="">All Styles</option>
            {styles.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.04 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="md:col-span-3 text-center py-20 text-muted-foreground">No pieces match these filters.</div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-xs uppercase tracking-[0.2em] border transition-all duration-500 ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-gold"
          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}
