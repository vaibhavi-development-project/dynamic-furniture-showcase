import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { adminLogin } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin-login")({
  head: () => ({ meta: [{ title: "Admin Sign In — MaisonOr" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (adminLogin(user.trim(), pass)) {
      navigate({ to: "/admin" });
    } else {
      setErr("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-md glass-strong rounded-2xl p-10 border border-border/40">
        <Link to="/" className="block text-center font-display text-3xl mb-2">
          Maison<span className="text-gradient-gold">Or</span>
        </Link>
        <div className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
          Admin Console
        </div>

        <div className="flex items-center justify-center mb-6">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Lock size={18} />
          </div>
        </div>

        <h1 className="text-center font-display text-2xl mb-1">Restricted Access</h1>
        <p className="text-center text-xs text-muted-foreground mb-8">For admin staff only</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Username</label>
            <input
              value={user}
              onChange={e => setUser(e.target.value)}
              autoComplete="username"
              className="mt-2 w-full bg-background/50 border border-border/60 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Password</label>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              autoComplete="current-password"
              className="mt-2 w-full bg-background/50 border border-border/60 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>

          {err && <div className="text-xs text-red-400 text-center">{err}</div>}

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-full text-xs uppercase tracking-[0.25em] hover:shadow-gold transition-all"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] text-muted-foreground tracking-wider">
          Demo: admin / maisonor2026 — replace with MongoDB auth when wiring backend.
        </p>
      </div>
    </div>
  );
}
