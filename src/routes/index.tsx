import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { getProducts, type Product, CATEGORIES, CATEGORY_IMAGES, CATEGORY_LABELS } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { PageTransition } from "@/components/PageTransition";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MaisonOr — Luxury Modern Furniture" },
      { name: "description", content: "Discover hand-finished sofas, chairs, tables, beds and cabinets at MaisonOr." },
      { property: "og:title", content: "MaisonOr — Luxury Modern Furniture" },
      { property: "og:description", content: "Furniture as quiet architecture. Hand-finished pieces for the modern home." },
    ],
  }),
  component: Index,
});

function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { setProducts(getProducts()); }, []);
  const featured = products.filter(p => p.featured).slice(0, 6);

  return (
    <PageTransition>
      {/* HERO */}
      <section className="relative -mt-20 h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Luxury living room" className="h-full w-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-10 flex flex-col justify-end pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary mb-6">
              <Sparkles size={14} /> The 2026 Collection
            </div>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.95]">
              Quiet luxury,<br/>
              <span className="text-gradient-gold italic">crafted to stay.</span>
            </h1>
            <p className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Hand-finished sofas, sculptural chairs and stone tables — designed for the homes of those who notice the smallest details.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/shop" className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm uppercase tracking-[0.2em] hover:shadow-gold transition-all duration-500">
                Explore Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-3 border border-border glass px-8 py-4 rounded-full text-sm uppercase tracking-[0.2em] hover:border-primary transition-colors">
                Our Studio
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
        >
          Scroll
        </motion.div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-32">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Categories</div>
            <h2 className="font-display text-5xl md:text-6xl max-w-xl">Pieces with a place.</h2>
          </div>
          <p className="text-muted-foreground max-w-md">From sculptural seating to grounded stone surfaces — every category, considered.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link key={cat} to="/shop" search={{ category: cat } as any} className="group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden glass hover-lift"
              >
                <img
                  src={CATEGORY_IMAGES[cat]}
                  alt={`${cat} category`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 flex items-end p-5">
                  <span className="relative font-display text-xl md:text-2xl leading-tight">{CATEGORY_LABELS[cat]}</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Featured</div>
            <h2 className="font-display text-5xl md:text-6xl">Selected pieces.</h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-32 text-center">
        <div className="gold-divider mx-auto mb-10" />
        <p className="font-display text-3xl md:text-5xl leading-[1.2] italic">
          "We don't make furniture for rooms.<br/>
          We make it for the <span className="text-gradient-gold">years</span> a room becomes a home."
        </p>
        <div className="mt-8 text-xs uppercase tracking-[0.3em] text-muted-foreground">— The MaisonOr Studio</div>
      </section>
    </PageTransition>
  );
}
