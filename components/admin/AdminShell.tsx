"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Home,
  BookOpen,
  Calendar,
  FileText,
  Presentation,
  Users,
  Mail,
  LogOut,
  Leaf,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/home", label: "Home Content", icon: Home },
  { to: "/admin/domain", label: "Domain", icon: BookOpen },
  { to: "/admin/milestones", label: "Milestones", icon: Calendar },
  { to: "/admin/documents", label: "Documents", icon: FileText },
  { to: "/admin/presentations", label: "Presentations", icon: Presentation },
  { to: "/admin/contact", label: "Contact Messages", icon: Mail },
  { to: "/admin/team", label: "Team", icon: Users },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 border-r border-white/10 bg-black/30 backdrop-blur-xl p-4 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shadow-[var(--shadow-glow)]">
              <Leaf className="h-5 w-5 text-primary" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-base text-white">PapayaPulse</div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-white/55">Admin</div>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden h-9 w-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        <nav className="space-y-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                href={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                  active
                    ? "bg-primary/15 text-white border border-primary/20"
                    : "text-white/65 hover:text-white hover:bg-white/6"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/65 hover:text-white hover:bg-white/6 transition"
          >
            <Home className="h-4 w-4" /> View Site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {open && <div onClick={() => setOpen(false)} className="lg:hidden fixed inset-0 bg-black/60 z-30" />}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <button onClick={() => setOpen(true)} className="lg:hidden h-9 w-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
            <Menu className="h-4 w-4 text-white" />
          </button>
          <div className="text-xs text-white/55 font-mono ml-auto">Logged in as <span className="text-primary">admin</span></div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
