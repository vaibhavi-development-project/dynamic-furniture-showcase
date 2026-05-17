import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { getContact, saveContact, type ContactInfo } from "@/lib/data";

export const Route = createFileRoute("/admin/contact")({
  component: AdminContact,
});

const schema = z.object({
  phone: z.string().trim().min(1).max(50),
  whatsapp: z.string().trim().min(1).max(50),
  email: z.string().trim().email().max(255),
  address: z.string().trim().min(1).max(500),
});

function AdminContact() {
  const [c, setC] = useState<ContactInfo | null>(null);
  useEffect(() => { setC(getContact()); }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!c) return;
    const parsed = schema.safeParse(c);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    saveContact(c);
    toast.success("Contact info updated");
  };

  if (!c) return null;
  return (
    <div className="p-10 max-w-2xl">
      <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Settings</div>
      <h1 className="font-display text-4xl mb-2">Contact Info</h1>
      <p className="text-muted-foreground mb-10">These details appear in the footer, contact page, and WhatsApp button.</p>

      <form onSubmit={submit} className="glass rounded-2xl p-8 space-y-5">
        <Input label="Phone" value={c.phone} onChange={v => setC({ ...c, phone: v })} />
        <Input label="WhatsApp Number (digits only, with country code)" value={c.whatsapp} onChange={v => setC({ ...c, whatsapp: v })} />
        <Input label="Email" value={c.email} onChange={v => setC({ ...c, email: v })} />
        <div>
          <Label>Address</Label>
          <textarea rows={3} value={c.address} onChange={e => setC({ ...c, address: e.target.value })} className="w-full bg-input/40 border border-border rounded-lg px-4 py-3 mt-2 outline-none focus:border-primary resize-none" />
        </div>
        <button type="submit" className="px-8 py-3 rounded-full bg-primary text-primary-foreground text-sm uppercase tracking-[0.2em] hover:shadow-gold">
          Save Changes
        </button>
      </form>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{children}</span>;
}
function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input value={value} onChange={e => onChange(e.target.value)} className="w-full bg-input/40 border border-border rounded-lg px-4 py-3 mt-2 outline-none focus:border-primary" />
    </label>
  );
}
