import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getContact, type ContactInfo } from "@/lib/data";

export function SiteFooter() {
  const [c, setC] = useState<ContactInfo | null>(null);
  useEffect(() => {
    setC(getContact());
    const onUpdate = () => setC(getContact());
    window.addEventListener("maisonor:data", onUpdate);
    return () => window.removeEventListener("maisonor:data", onUpdate);
  }, []);

  return (
    <footer className="border-t border-border/40 mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="font-display text-3xl">Maison<span className="text-gradient-gold">Or</span></div>
          <p className="mt-4 text-muted-foreground max-w-sm leading-relaxed">
            Luxury furniture, made to last. Hand-finished pieces for homes that pay attention to detail.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-primary mb-5">Explore</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-foreground">Collection</Link></li>
            <li><Link to="/about" className="hover:text-foreground">Our Studio</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-primary mb-5">Reach us</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>{c?.phone}</li>
            <li>{c?.email}</li>
            <li className="leading-relaxed">{c?.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground tracking-widest uppercase">
        © {new Date().getFullYear()} MaisonOr · Crafted in India with intention
      </div>
    </footer>
  );
}
