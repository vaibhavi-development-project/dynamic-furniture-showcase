import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, Tag, Phone, Home, LogOut } from "lucide-react";
import { isAdminAuthed, adminLogout } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — MaisonOr" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/contact", label: "Contact Info", icon: Phone },
];

function AdminLayout() {
  const path = useRouterState({ select: r => r.location.pathname });
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const ok = isAdminAuthed();
    setAuthed(ok);
    if (!ok) navigate({ to: "/admin-login" });
  }, [navigate]);

  if (!authed) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 border-r border-border/40 bg-sidebar/60 backdrop-blur-xl flex flex-col">
        <div className="p-6 border-b border-border/40">
          <div className="font-display text-2xl">Maison<span className="text-gradient-gold">Or</span></div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Admin Console</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to as any}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                  active ? "bg-primary/15 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon size={16} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border/40 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent">
            <Home size={16} /> Back to Site
          </Link>
          <button
            onClick={() => { adminLogout(); navigate({ to: "/admin-login" }); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
