import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Lock, User } from "lucide-react";
import { loginCustomer } from "@/lib/customer-auth";
import { adminLogin } from "@/lib/admin-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — MaisonOr" }] }),
  component: LoginPage,
});

type Mode = "customer" | "admin";

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onCustomer = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      await loginCustomer(email, password);
      toast.success("Welcome back");
      navigate({ to: "/" });
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  };

  const onAdmin = (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    if (adminLogin(adminUser.trim(), adminPass)) {
      toast.success("Admin authenticated");
      navigate({ to: "/admin" });
    } else {
      setErr("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md glass-strong rounded-2xl p-10 border border-border/40">
        <Link to="/" className="block text-center font-display text-3xl mb-2">
          Maison<span className="text-gradient-gold">Or</span>
        </Link>
        <div className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
          {mode === "customer" ? "Members only" : "Admin console"}
        </div>

        {/* Mode toggle */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-full border border-border/60 bg-background/40 mb-8">
          <button
            type="button"
            onClick={() => { setMode("customer"); setErr(""); }}
            className={`flex items-center justify-center gap-2 py-2 rounded-full text-[10px] uppercase tracking-[0.25em] transition ${mode === "customer" ? "bg-primary text-primary-foreground shadow-gold" : "text-muted-foreground hover:text-foreground"}`}
          >
            <User size={12} /> Customer
          </button>
          <button
            type="button"
            onClick={() => { setMode("admin"); setErr(""); }}
            className={`flex items-center justify-center gap-2 py-2 rounded-full text-[10px] uppercase tracking-[0.25em] transition ${mode === "admin" ? "bg-primary text-primary-foreground shadow-gold" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Lock size={12} /> Admin
          </button>
        </div>

        {mode === "customer" ? (
          <>
            <h1 className="text-center font-display text-3xl mb-2">Welcome back</h1>
            <p className="text-center text-xs text-muted-foreground mb-8">Sign in to view the collection</p>
            <form onSubmit={onCustomer} className="space-y-4">
              <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
              <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
              {err && <div className="text-xs text-red-400 text-center">{err}</div>}
              <button disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-full text-xs uppercase tracking-[0.25em] hover:shadow-gold transition-all disabled:opacity-60">
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
            <p className="mt-8 text-center text-xs text-muted-foreground">
              New to MaisonOr?{" "}
              <Link to="/register" className="text-primary hover:underline">Create an account</Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-center font-display text-2xl mb-1">Restricted Access</h1>
            <p className="text-center text-xs text-muted-foreground mb-8">For admin staff only</p>
            <form onSubmit={onAdmin} className="space-y-4">
              <Field label="Username" value={adminUser} onChange={setAdminUser} autoComplete="username" />
              <Field label="Password" type="password" value={adminPass} onChange={setAdminPass} autoComplete="current-password" />
              {err && <div className="text-xs text-red-400 text-center">{err}</div>}
              <button className="w-full bg-primary text-primary-foreground py-3 rounded-full text-xs uppercase tracking-[0.25em] hover:shadow-gold transition-all">
                Enter Console
              </button>
            </form>
            <p className="mt-6 text-center text-[10px] text-muted-foreground tracking-wider">
              Demo: admin / maisonor2026 — replace with MongoDB auth.
            </p>
          </>
        )}
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
