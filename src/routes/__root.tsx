import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { IntroLoader } from "@/components/IntroLoader";
import { isCustomerAuthed } from "@/lib/customer-auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-gradient-gold">404</h1>
        <h2 className="mt-4 text-xl">This page has wandered off</h2>
        <p className="mt-2 text-sm text-muted-foreground">The piece you're looking for isn't part of this collection.</p>
        <Link to="/" className="mt-8 inline-flex items-center justify-center rounded-full border border-primary px-6 py-3 text-xs uppercase tracking-[0.25em] text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MaisonOr — Luxury Modern Furniture" },
      { name: "description", content: "Hand-finished luxury furniture: sofas, chairs, tables, beds and cabinets for the modern home." },
      { property: "og:title", content: "MaisonOr — Luxury Modern Furniture" },
      { property: "og:description", content: "Hand-finished luxury furniture for the modern home." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const path = useRouterState({ select: r => r.location.pathname });
  const navigate = useNavigate();
  const isAdmin = path.startsWith("/admin");
  const isAuthPage = path === "/login" || path === "/register";
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    const id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);

  useEffect(() => {
    const sync = () => setAuthed(isCustomerAuthed());
    sync();
    window.addEventListener("maisonor:auth", sync);
    return () => window.removeEventListener("maisonor:auth", sync);
  }, []);

  // Gate customer area: redirect to /login if unauthenticated and not on auth/admin pages.
  useEffect(() => {
    if (authed === false && !isAuthPage && !isAdmin) {
      navigate({ to: "/login" });
    }
  }, [authed, isAuthPage, isAdmin, navigate]);

  if (isAdmin) {
    return (
      <>
        <Outlet />
        <Toaster theme="dark" position="top-right" />
      </>
    );
  }

  if (isAuthPage) {
    return (
      <>
        <main className="min-h-screen">
          <Outlet />
        </main>
        <Toaster theme="dark" position="top-right" />
      </>
    );
  }

  if (authed !== true) {
    // brief blank during gate check / before redirect
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <>
      <IntroLoader />
      <SiteHeader />
      <main className="min-h-screen pt-20">
        <Outlet />
      </main>
      <SiteFooter />
      <WhatsAppButton />
      <Toaster theme="dark" position="top-right" />
    </>
  );
}
