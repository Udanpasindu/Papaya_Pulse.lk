import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, User, ArrowRight, Leaf, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — PapayaPulse" },
      { name: "description", content: "Admin login for the PapayaPulse content system." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState("admin");
  const [pass, setPass] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    setTimeout(() => {
      if (user === "admin" && pass === "admin") {
        try {
          sessionStorage.setItem("pp_admin", "1");
        } catch {
          /* ignore */
        }
        navigate({ to: "/admin" });
      } else {
        setErr("Invalid credentials. Try admin / admin.");
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-blob" />
      <div
        className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-secondary/15 blur-3xl animate-blob"
        style={{ animationDelay: "5s" }}
      />

      <div className="relative w-full max-w-md" style={{ animation: "fade-up 0.6s ease-out both" }}>
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-leaf flex items-center justify-center">
            <Leaf className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="leading-tight text-left">
            <div className="font-display font-bold text-lg">PapayaPulse</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Admin Portal
            </div>
          </div>
        </Link>

        <div className="glass-strong rounded-3xl p-6 sm:p-8 shadow-[var(--shadow-elegant)]">
          <h1 className="font-display font-bold text-2xl mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to manage content, files and team.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-input/50 border border-border focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition text-sm"
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-input/50 border border-border focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition text-sm"
                  placeholder="••••••"
                />
              </div>
            </div>

            {err && <p className="text-xs text-destructive">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-leaf text-primary-foreground font-medium hover:shadow-[var(--shadow-glow)] transition disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-3 rounded-xl bg-secondary/10 border border-secondary/20 text-xs text-muted-foreground">
            <span className="text-secondary font-medium">Demo:</span> use <code className="font-mono">admin</code>{" "}
            / <code className="font-mono">admin</code>.
          </div>
        </div>

        <Link
          to="/"
          className="block text-center mt-6 text-xs text-muted-foreground hover:text-foreground transition"
        >
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
