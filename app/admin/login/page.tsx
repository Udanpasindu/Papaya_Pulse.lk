"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, User, ArrowRight, Leaf, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@papayapulse.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setErr(json.message || "Invalid credentials.");
        return;
      }
      router.push("/admin");
    } catch {
      setErr("Unable to login right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-background">
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shadow-[var(--shadow-glow)]">
            <Leaf className="h-5 w-5 text-primary" strokeWidth={2.5} />
          </div>
          <div className="leading-tight text-left">
            <div className="font-display font-bold text-lg text-white">PapayaPulse</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/55">Admin Portal</div>
          </div>
        </Link>

        <div className="rounded-3xl p-6 sm:p-8 bg-card border border-white/8 shadow-[var(--shadow-card)]">
          <h1 className="font-display font-bold text-2xl mb-1 text-white">Welcome back</h1>
          <p className="text-sm text-white/65 mb-6">Sign in to manage content, files and team.</p>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-white/55">Email</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/45" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-input/50 border border-white/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition text-sm text-white"
                  placeholder="admin@papayapulse.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-white/55">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/45" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-input/50 border border-white/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition text-sm text-white"
                  placeholder="******"
                />
              </div>
            </div>

            {err && <p className="text-xs text-destructive">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        </div>

          <Link href="/" className="block text-center mt-6 text-xs text-white/55 hover:text-white transition">
          Back to website
        </Link>
      </div>
    </div>
  );
}
