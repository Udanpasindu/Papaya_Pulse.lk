import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Home,
  BookOpen,
  Calendar,
  FileText,
  Presentation,
  Users,
  LogOut,
  Leaf,
  Menu,
  X,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — PapayaPulse" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/home", label: "Home Content", icon: Home },
  { to: "/admin/domain", label: "Domain", icon: BookOpen },
  { to: "/admin/milestones", label: "Milestones", icon: Calendar },
  { to: "/admin/documents", label: "Documents", icon: FileText },
  { to: "/admin/presentations", label: "Presentations", icon: Presentation },
  { to: "/admin/team", label: "Team", icon: Users },
];

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const ok = sessionStorage.getItem("pp_admin") === "1";
      setAuthed(ok);
      if (!ok) navigate({ to: "/admin/login" });
    } catch {
      navigate({ to: "/admin/login" });
    }
  }, [navigate]);

  useEffect(() => setOpen(false), [location.pathname]);

  const logout = () => {
    try {
      sessionStorage.removeItem("pp_admin");
    } catch {
      /* ignore */
    }
    navigate({ to: "/admin/login" });
  };

  if (authed === null)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        Loading...
      </div>
    );
  if (!authed) return null;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 glass-strong border-r border-border/40 p-4 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-leaf flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-base">PapayaPulse</div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                Admin
              </div>
            </div>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden h-9 w-9 rounded-lg glass flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-1">
          {NAV.map((item) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to as "/admin"}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                  active
                    ? "bg-primary/15 text-foreground border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
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
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
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

      {open && (
        <div onClick={() => setOpen(false)} className="lg:hidden fixed inset-0 bg-black/60 z-30" />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 glass-strong border-b border-border/40 px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden h-9 w-9 rounded-lg glass flex items-center justify-center"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="text-xs text-muted-foreground font-mono ml-auto">
            Logged in as <span className="text-primary">admin</span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
