"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-9 w-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shadow-[var(--shadow-glow)]">
              <Leaf className="h-5 w-5 text-primary" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-base tracking-tight text-white">PapayaPulse</div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-white/55 hidden sm:block">
                Smart Farming
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    active
                      ? "text-white bg-white/10 border border-white/10"
                      : "text-white/65 hover:text-white hover:bg-white/6"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/admin/login"
              className="ml-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition shadow-[var(--shadow-glow)]"
            >
              Admin
            </Link>
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
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
                item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={`block px-4 py-3 rounded-xl text-sm transition-all ${
                    active
                      ? "bg-primary/15 text-white border border-primary/20"
                      : "text-white/65 hover:bg-white/6 hover:text-white"
                  }`}
                  style={{ animation: open ? `fade-up 0.4s ease-out ${i * 0.04}s both` : undefined }}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/admin/login"
              className="block mt-2 px-4 py-3 rounded-xl text-sm font-medium text-center bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
