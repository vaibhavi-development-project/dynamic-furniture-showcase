import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { getProducts, upsertProduct, deleteProduct, CATEGORIES, type Product, type Category } from "@/lib/data";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.enum(CATEGORIES as unknown as [Category, ...Category[]]),
  price: z.number().min(0),
  color: z.string().trim().min(1).max(50),
  style: z.string().trim().min(1).max(50),
  size: z.string().trim().min(1).max(50),
  description: z.string().trim().min(1).max(2000),
  image: z.string().trim().min(1),
});

const empty: Omit<Product, "id"> = { name: "", category: "Sofas", price: 0, color: "", style: "", size: "", description: "", image: "", featured: false };

function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const refresh = () => setItems(getProducts());
  useEffect(() => { refresh(); }, []);

  const remove = (id: string) => {
    if (!confirm("Delete this product?")) return;
    deleteProduct(id);
    refresh();
    toast.success("Product deleted");
  };

  return (
    <div className="p-10">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Catalogue</div>
          <h1 className="font-display text-4xl">Products</h1>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full text-xs uppercase tracking-[0.2em] hover:shadow-gold transition"
        >
          <Plus size={14} /> New Product
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sidebar-accent/50 text-muted-foreground text-xs uppercase tracking-[0.2em]">
            <tr>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Color</th>
              <th className="text-left p-4">Style</th>
              <th className="text-right p-4">Price</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id} className="border-t border-border/40 hover:bg-sidebar-accent/30">
                <td className="p-4 flex items-center gap-3">
                  <img src={p.image} alt="" className="h-10 w-10 rounded object-cover" />
                  <span>{p.name}</span>
                </td>
                <td className="p-4 text-muted-foreground">{p.category}</td>
                <td className="p-4 text-muted-foreground">{p.color}</td>
                <td className="p-4 text-muted-foreground">{p.style}</td>
                <td className="p-4 text-right text-primary">₹{p.price.toLocaleString("en-IN")}</td>
                <td className="p-4 text-right">
                  <div className="inline-flex gap-2">
                    <button onClick={() => setEditing(p)} className="p-2 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary"><Pencil size={14} /></button>
                    <button onClick={() => remove(p.id)} className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editing || creating) && (
        <ProductDrawer
          initial={editing ?? { id: `p${Date.now()}`, ...empty }}
          isNew={creating}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={(p) => {
            const parsed = schema.safeParse(p);
            if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
            upsertProduct(p);
            refresh();
            toast.success(creating ? "Product created" : "Product updated");
            setEditing(null); setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function ProductDrawer({ initial, isNew, onClose, onSave }: { initial: Product; isNew: boolean; onClose: () => void; onSave: (p: Product) => void }) {
  const [p, setP] = useState<Product>(initial);
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP(prev => ({ ...prev, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl h-full overflow-y-auto bg-card border-l border-border p-8 animate-fade-up">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl">{isNew ? "New Product" : "Edit Product"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-sidebar-accent rounded"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <Input label="Name" value={p.name} onChange={v => set("name", v)} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <select value={p.category} onChange={e => set("category", e.target.value as Category)} className="w-full bg-input/40 border border-border rounded-lg px-4 py-3 mt-2 outline-none focus:border-primary">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <Input label="Price (USD)" type="number" value={String(p.price)} onChange={v => set("price", Number(v) || 0)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Color" value={p.color} onChange={v => set("color", v)} />
            <Input label="Style" value={p.style} onChange={v => set("style", v)} />
            <Input label="Size" value={p.size} onChange={v => set("size", v)} />
          </div>
          <Input label="Image URL" value={p.image} onChange={v => set("image", v)} />
          {p.image && <img src={p.image} alt="" className="w-full aspect-video object-cover rounded-lg" />}
          <div>
            <Label>Description</Label>
            <textarea rows={4} value={p.description} onChange={e => set("description", e.target.value)} className="w-full bg-input/40 border border-border rounded-lg px-4 py-3 mt-2 outline-none focus:border-primary resize-none" />
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={!!p.featured} onChange={e => set("featured", e.target.checked)} className="accent-primary" />
            Featured on home page
          </label>
        </div>
        <div className="mt-8 flex gap-3">
          <button onClick={onClose} className="flex-1 px-6 py-3 rounded-full border border-border text-sm uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={() => onSave(p)} className="flex-1 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm uppercase tracking-[0.2em] hover:shadow-gold">Save</button>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{children}</span>;
}
function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-input/40 border border-border rounded-lg px-4 py-3 mt-2 outline-none focus:border-primary" />
    </label>
  );
}
