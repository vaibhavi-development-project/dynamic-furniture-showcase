import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, ShoppingBag } from "lucide-react";
import { getCurrentCustomer, logoutCustomer, type Customer } from "@/lib/customer-auth";
import { getCartCount, onCartChange } from "@/lib/cart";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Collection" },
  { to: "/about", label: "Our Studio" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<Customer | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const path = useRouterState({ select: r => r.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sync = () => setUser(getCurrentCustomer());
    sync();
    window.addEventListener("maisonor:auth", sync);
    return () => window.removeEventListener("maisonor:auth", sync);
  }, []);

  useEffect(() => {
    const sync = () => setCartCount(getCartCount());
    sync();
    return onCartChange(sync);
  }, []);

  useEffect(() => { setOpen(false); setMenuOpen(false); }, [path]);

  const handleLogout = () => {
    logoutCustomer();
    toast.success("Signed out");
    navigate({ to: "/login" });
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "glass-strong border-b border-border/40" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-3">
          <span className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/40 shadow-gold" />
          <span className="font-display text-2xl tracking-wide">Maison<span className="text-gradient-gold">Or</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {NAV.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="relative text-sm uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3 relative">
          {user && (
            <Link
              to="/cart"
              className="relative inline-flex items-center justify-center h-10 w-10 rounded-full border border-border/60 hover:border-primary text-muted-foreground hover:text-primary transition"
              aria-label="Bag"
            >
              <ShoppingBag size={15} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center shadow-gold">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <>
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition px-3 py-2 rounded-full border border-border/60 hover:border-primary"
              >
                <User size={14} />
                <span className="max-w-[120px] truncate">{user.name.split(" ")[0]}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 glass-strong border border-border/40 rounded-xl p-2 shadow-2xl">
                  <div className="px-3 py-2 border-b border-border/30 mb-1">
                    <div className="text-sm">{user.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/login" className="text-xs uppercase tracking-[0.2em] text-primary hover:underline">Sign in</Link>
          )}
        </div>

        <button onClick={() => setOpen(o => !o)} className="md:hidden text-foreground p-2" aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass-strong border-t border-border/40">
          <nav className="px-6 py-6 flex flex-col gap-5">
            {NAV.map(item => (
              <Link key={item.to} to={item.to} className="text-sm uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/cart" className="text-sm uppercase tracking-[0.2em] text-foreground">
                  Bag {cartCount > 0 && <span className="text-primary">({cartCount})</span>}
                </Link>
                <button onClick={handleLogout} className="text-left text-sm uppercase tracking-[0.2em] text-primary">
                  Sign out ({user.name.split(" ")[0]})
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm uppercase tracking-[0.2em] text-primary">Sign in</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
