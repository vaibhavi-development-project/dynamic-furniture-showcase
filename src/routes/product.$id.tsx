import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Heart } from "lucide-react";
import { toast } from "sonner";
import { getProduct, type Product } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { addToCart } from "@/lib/cart";
import { Viewer3D } from "@/components/Viewer3D";
import { PageTransition } from "@/components/PageTransition";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Product — MaisonOr` },
      { name: "description", content: `View product ${params.id} on MaisonOr.` },
    ],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="max-w-3xl mx-auto px-6 py-32 text-center">
      <h1 className="font-display text-5xl">Piece not found</h1>
      <Link to="/shop" className="mt-8 inline-block text-primary">Back to collection</Link>
    </div>
  ),
});

function ProductPage() {
  const { id } = Route.useParams();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    const p = getProduct(id);
    setProduct(p ?? null);
  }, [id]);

  if (product === undefined) return <div className="min-h-[60vh]" />;
  if (product === null) throw notFound();

  return (
    <PageTransition>
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary">
          <ArrowLeft size={14} /> Back to Collection
        </Link>

        <div className="mt-8 grid lg:grid-cols-2 gap-12">
          {/* Visual */}
          <div className="space-y-4">
            {show3D ? <Viewer3D product={product} /> : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-square rounded-2xl overflow-hidden glass-strong"
              >
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </motion.div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShow3D(false)}
                className={`flex-1 px-4 py-3 rounded-full text-xs uppercase tracking-[0.2em] border transition ${!show3D ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-primary"}`}
              >Photograph</button>
              <button
                onClick={() => setShow3D(true)}
                className={`flex-1 px-4 py-3 rounded-full text-xs uppercase tracking-[0.2em] border transition ${show3D ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-primary"}`}
              >360° View</button>
            </div>
          </div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:pl-6"
          >
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">{product.category}</div>
            <h1 className="font-display text-5xl md:text-6xl leading-tight">{product.name}</h1>
            <div className="mt-6 text-3xl text-gradient-gold font-display">{formatPrice(product.price)}</div>
            <div className="gold-divider my-8" />
            <p className="text-muted-foreground leading-relaxed text-lg">{product.description}</p>

            <dl className="mt-10 grid grid-cols-2 gap-6">
              <Spec label="Style" value={product.style} />
              <Spec label="Color" value={product.color} />
              <Spec label="Size" value={product.size} />
              <Spec label="Category" value={product.category} />
            </dl>

            <div className="mt-10 flex gap-3">
              <button
                onClick={() => { addToCart(product.id); toast.success(`${product.name} added to bag`); }}
                className="flex-1 inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm uppercase tracking-[0.2em] hover:shadow-gold transition-all duration-500"
              >
                <ShoppingBag size={16} /> Add to Bag
              </button>
              <button
                onClick={() => toast("Saved to favourites")}
                className="h-14 w-14 inline-flex items-center justify-center rounded-full glass border border-border hover:border-primary transition"
                aria-label="Favorite"
              >
                <Heart size={16} />
              </button>
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Hand-finished · 10-year structural warranty · White-glove delivery
            </p>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}
