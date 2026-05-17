import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { registerCustomer } from "@/lib/customer-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create Account — MaisonOr" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    if (password.length < 6) { setErr("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await registerCustomer(name, email, password);
      toast.success("Account created");
      navigate({ to: "/" });
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md glass-strong rounded-2xl p-10 border border-border/40">
        <Link to="/" className="block text-center font-display text-3xl mb-2">
          Maison<span className="text-gradient-gold">Or</span>
        </Link>
        <div className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
          Join the Studio
        </div>
        <h1 className="text-center font-display text-3xl mb-2">Create your account</h1>
        <p className="text-center text-xs text-muted-foreground mb-8">Members enjoy private collections & previews</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Full name" value={name} onChange={setName} autoComplete="name" />
          <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" />
          {err && <div className="text-xs text-red-400 text-center">{err}</div>}
          <button disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-full text-xs uppercase tracking-[0.25em] hover:shadow-gold transition-all disabled:opacity-60">
            {loading ? "Creating…" : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Already a member?{" "}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
        <p className="mt-3 text-center text-[10px] text-muted-foreground/70 tracking-wider">
          Admin staff? <Link to="/login" className="text-primary hover:underline">Sign in as Admin</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", autoComplete }: { label: string; value: string; onChange: (v: string) => void; type?: string; autoComplete?: string }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete={autoComplete}
        required
        className="mt-2 w-full bg-background/50 border border-border/60 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary"
      />
    </div>
  );
}
