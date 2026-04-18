import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  Calendar,
  Users,
  Presentation,
  TrendingUp,
  Eye,
  Download,
  CheckCircle2,
} from "lucide-react";
import { MILESTONES, DOCUMENTS, TEAM, PRESENTATIONS } from "@/lib/site-data";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const completedMilestones = MILESTONES.filter((m) => m.status === "completed").length;
  const totalDocs =
    DOCUMENTS.charter.length +
    DOCUMENTS.proposal.length +
    DOCUMENTS.progress.length +
    DOCUMENTS.final.length +
    DOCUMENTS.members.length;

  const stats = [
    { label: "Milestones", value: `${completedMilestones}/${MILESTONES.length}`, icon: Calendar, accent: "text-primary" },
    { label: "Documents", value: totalDocs, icon: FileText, accent: "text-secondary" },
    { label: "Presentations", value: PRESENTATIONS.length, icon: Presentation, accent: "text-leaf" },
    { label: "Team Members", value: TEAM.length, icon: Users, accent: "text-pulp" },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Dashboard</div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl">Welcome back, admin</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Here's what's happening with PapayaPulse today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="glass rounded-2xl p-5 hover-lift"
            style={{ animation: `fade-up 0.5s ease-out ${i * 0.06}s both` }}
          >
            <div className="flex items-center justify-between mb-3">
              <s.icon className={`h-5 w-5 ${s.accent}`} />
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-display font-bold">{s.value}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick activity grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg">Recent Milestones</h2>
            <span className="text-xs text-muted-foreground">Last updated today</span>
          </div>
          <div className="space-y-3">
            {MILESTONES.slice(0, 4).map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-border/30"
              >
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                    m.status === "completed"
                      ? "bg-primary/15 text-primary"
                      : m.status === "in-progress"
                        ? "bg-secondary/15 text-secondary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(m.date).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                    m.status === "completed"
                      ? "bg-primary/15 text-primary"
                      : m.status === "in-progress"
                        ? "bg-secondary/15 text-secondary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {m.status.replace("-", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg mb-5">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Add new milestone", icon: Calendar },
              { label: "Upload document", icon: FileText },
              { label: "Add presentation", icon: Presentation },
              { label: "Edit team member", icon: Users },
              { label: "Preview website", icon: Eye },
              { label: "Export all data", icon: Download },
            ].map((a) => (
              <button
                key={a.label}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
              >
                <a.icon className="h-4 w-4 text-primary" />
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
