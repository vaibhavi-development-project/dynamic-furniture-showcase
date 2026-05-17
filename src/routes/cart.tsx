import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getCart, updateQty, removeFromCart, onCartChange, clearCart, type CartItem } from "@/lib/cart";
import { getProduct, type Product } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { PageTransition } from "@/components/PageTransition";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Bag — MaisonOr" }] }),
  component: CartPage,
});

function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(getCart());
    sync();
    return onCartChange(sync);
  }, []);

  const rows = items
    .map(i => ({ item: i, product: getProduct(i.productId) }))
    .filter((r): r is { item: CartItem; product: Product } => !!r.product);

  const subtotal = rows.reduce((n, r) => n + r.product.price * r.item.qty, 0);

  return (
    <PageTransition>
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Session Bag</div>
        <h1 className="font-display text-5xl md:text-6xl mb-10">Your Bag</h1>

        {rows.length === 0 ? (
          <div className="glass-strong rounded-2xl p-16 text-center border border-border/40">
            <ShoppingBag size={32} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-6">Your bag is empty.</p>
            <Link to="/shop" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full text-xs uppercase tracking-[0.25em] hover:shadow-gold transition">
              Discover the Collection
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              {rows.map(({ item, product }, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="glass rounded-2xl p-4 flex gap-5 items-center border border-border/40"
                >
                  <Link to="/product/$id" params={{ id: product.id }} className="shrink-0">
                    <img src={product.image} alt={product.name} className="h-28 w-28 object-cover rounded-xl" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-primary">{product.category}</div>
                    <Link to="/product/$id" params={{ id: product.id }} className="block font-display text-xl truncate hover:text-primary transition">
                      {product.name}
                    </Link>
                    <div className="text-xs text-muted-foreground mt-1">{product.color} · {product.style}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(product.id, item.qty - 1)} className="h-8 w-8 rounded-full border border-border hover:border-primary inline-flex items-center justify-center" aria-label="Decrease">
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(product.id, item.qty + 1)} className="h-8 w-8 rounded-full border border-border hover:border-primary inline-flex items-center justify-center" aria-label="Increase">
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="w-28 text-right font-display text-lg text-primary">
                    {formatPrice(product.price * item.qty)}
                  </div>
                  <button
                    onClick={() => { removeFromCart(product.id); toast("Removed from bag"); }}
                    className="h-9 w-9 rounded-full text-muted-foreground hover:text-red-400 inline-flex items-center justify-center"
                    aria-label="Remove"
                  >
                    <Trash2 size={15} />
                  </button>
                </motion.div>
              ))}
              <button onClick={() => { clearCart(); toast("Bag cleared"); }} className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-red-400 mt-2">
                Clear bag
              </button>
            </div>

            <aside className="glass-strong rounded-2xl p-8 border border-border/40 h-fit sticky top-28">
              <h2 className="font-display text-2xl mb-6">Summary</h2>
              <div className="space-y-3 text-sm">
                <Row label="Subtotal" value={formatPrice(subtotal)} />
                <Row label="Shipping" value="White-glove delivery" />
                <Row label="GST" value="Calculated at checkout" />
              </div>
              <div className="gold-divider my-6" />
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Total</span>
                <span className="font-display text-3xl text-gradient-gold">{formatPrice(subtotal)}</span>
              </div>
              <button
                onClick={() => toast.success("Checkout coming soon")}
                className="mt-8 w-full bg-primary text-primary-foreground py-4 rounded-full text-xs uppercase tracking-[0.25em] hover:shadow-gold transition"
              >
                Proceed to Checkout
              </button>
              <Link to="/shop" className="mt-3 block text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary">
                Continue browsing
              </Link>
            </aside>
          </div>
        )}
      </section>
    </PageTransition>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
