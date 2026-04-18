import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Leaf } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/domain", label: "Domain" },
  { to: "/milestones", label: "Milestones" },
  { to: "/documents", label: "Documents" },
  { to: "/presentations", label: "Presentations" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 sm:px-5 py-3 transition-all duration-500 ${
            scrolled ? "glass-strong shadow-card" : "glass"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-md rounded-full group-hover:bg-primary/50 transition" />
              <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-leaf flex items-center justify-center">
                <Leaf className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-base tracking-tight">PapayaPulse</div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground hidden sm:block">
                Smart Farming
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    active
                      ? "text-foreground bg-white/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/admin/login"
              className="ml-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-primary to-leaf text-primary-foreground hover:shadow-[var(--shadow-glow)] transition-shadow"
            >
              Admin
            </Link>
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden h-10 w-10 rounded-xl glass flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            open ? "max-h-[600px] opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          <div className="glass-strong rounded-2xl p-3 shadow-card">
            {NAV.map((item, i) => {
              const active =
                item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block px-4 py-3 rounded-xl text-sm transition-all ${
                    active
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                  style={{ animation: open ? `fade-up 0.4s ease-out ${i * 0.04}s both` : undefined }}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/admin/login"
              className="block mt-2 px-4 py-3 rounded-xl text-sm font-medium text-center bg-gradient-to-r from-primary to-leaf text-primary-foreground"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
