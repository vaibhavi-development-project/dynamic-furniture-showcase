import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group block hover-lift"
    >
      <div className="relative overflow-hidden rounded-2xl bg-card aspect-[4/5]">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="text-[10px] uppercase tracking-[0.25em] text-primary glass px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-20 p-6">
          <h3 className="font-display text-2xl text-foreground">{product.name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{product.style} · {product.color}</span>
            <span className="text-primary font-medium">{formatPrice(product.price)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
