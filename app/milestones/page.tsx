"use client";

import { useMemo, useState } from "react";
import { Calendar, CheckCircle2, Clock, Circle, Filter, Search } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useApi } from "@/hooks/use-api";
import type { MilestoneDTO } from "@/types/content";

const FILTERS = ["all", "completed", "in-progress", "upcoming"] as const;

export default function MilestonesPage() {
  const { data, loading, error } = useApi<MilestoneDTO[]>("/api/milestones");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const list = data || [];
    return list.filter((m) => {
      const matchesStatus = filter === "all" || m.status === filter;
      const term = q.toLowerCase();
      const matchesQuery = !term || m.title.toLowerCase().includes(term) || m.description.toLowerCase().includes(term);
      return matchesStatus && matchesQuery;
    });
  }, [data, filter, q]);

  return (
    <PageShell
      breadcrumbs={[{ label: "Milestones" }]}
      eyebrow="Project Timeline"
      title="From proposal to viva"
      description="A transparent view of every assessment milestone in the research project."
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-20">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search milestones..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-[var(--shadow-card)]"
          />
        </div>

        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider transition ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.replace("-", " ")}
            </button>
          ))}
        </div>

        {loading && <p className="text-sm text-muted-foreground">Loading milestones...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        <ol className="relative border-l-2 border-primary/20 ml-3 space-y-6">
          {items.map((m) => (
            <li key={m._id || m.title} className="ml-8 relative">
              <span
                className={`absolute -left-[44px] top-2 h-7 w-7 rounded-full flex items-center justify-center border-2 ${
                  m.status === "completed"
                    ? "bg-primary border-primary"
                    : m.status === "in-progress"
                      ? "bg-card border-secondary"
                      : "bg-card border-muted"
                }`}
              >
                {m.status === "completed" && <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />}
                {m.status === "in-progress" && <Clock className="h-3.5 w-3.5 text-secondary animate-pulse" />}
                {m.status === "upcoming" && <Circle className="h-3 w-3 text-muted-foreground" />}
              </span>
              <div className="rounded-2xl p-5 sm:p-6 border border-border bg-card shadow-[var(--shadow-card)] hover-lift">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-display font-bold text-lg sm:text-xl">{m.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(m.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-display font-bold text-gradient">{m.marks ? `${m.marks}/20` : "-"}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Weight {m.weight || "0%"}</div>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">{m.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </PageShell>
  );
}
