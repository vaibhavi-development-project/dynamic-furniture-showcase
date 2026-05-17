import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { getContact, type ContactInfo } from "@/lib/data";
import { PageTransition } from "@/components/PageTransition";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — MaisonOr" },
      { name: "description", content: "Reach the MaisonOr studio — phone, email, WhatsApp." },
      { property: "og:title", content: "Contact — MaisonOr" },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message required").max(1000),
});

function Contact() {
  const [c, setC] = useState<ContactInfo | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    setC(getContact());
    const sync = () => setC(getContact());
    window.addEventListener("maisonor:data", sync);
    return () => window.removeEventListener("maisonor:data", sync);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    toast.success("Thank you — we will be in touch shortly.");
    setForm({ name: "", email: "", message: "" });
  };

  if (!c) return null;

  return (
    <PageTransition>
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Contact</div>
          <h1 className="font-display text-6xl md:text-7xl">Speak with our studio.</h1>
        </motion.div>

        <div className="mt-16 grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-4">
            <InfoCard icon={<Phone size={18} />} label="Telephone" value={c.phone} href={`tel:${c.phone}`} />
            <InfoCard icon={<MessageCircle size={18} />} label="WhatsApp" value={`+${c.whatsapp}`} href={`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, "")}`} external />
            <InfoCard icon={<Mail size={18} />} label="Email" value={c.email} href={`mailto:${c.email}`} />
            <InfoCard icon={<MapPin size={18} />} label="Showrooms" value={c.address} />
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            onSubmit={submit}
            className="glass-strong rounded-2xl p-8 space-y-5"
          >
            <Field label="Name">
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-input/40 border border-border rounded-lg px-4 py-3 outline-none focus:border-primary transition" />
            </Field>
            <Field label="Email">
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-input/40 border border-border rounded-lg px-4 py-3 outline-none focus:border-primary transition" />
            </Field>
            <Field label="Message">
              <textarea rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full bg-input/40 border border-border rounded-lg px-4 py-3 outline-none focus:border-primary transition resize-none" />
            </Field>
            <button type="submit" className="w-full inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm uppercase tracking-[0.2em] hover:shadow-gold transition-all duration-500">
              Send Message <Send size={14} />
            </button>
          </motion.form>
        </div>
      </section>
    </PageTransition>
  );
}

function InfoCard({ icon, label, value, href, external }: { icon: React.ReactNode; label: string; value: string; href?: string; external?: boolean }) {
  const inner = (
    <div className="glass rounded-2xl p-6 flex items-center gap-5 hover-lift hover:border-primary/40 transition">
      <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
        <div className="mt-1 text-lg">{value}</div>
      </div>
    </div>
  );
  if (!href) return inner;
  return external ? <a href={href} target="_blank" rel="noreferrer">{inner}</a> : <a href={href}>{inner}</a>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
