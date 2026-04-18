import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, CheckCircle2, Clock, Circle, Filter } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { MILESTONES } from "@/lib/site-data";

export const Route = createFileRoute("/milestones")({
  head: () => ({
    meta: [
      { title: "Milestones — PapayaPulse" },
      {
        name: "description",
        content: "Project timeline: proposal, progress presentations, final assessment and viva.",
      },
      { property: "og:title", content: "Milestones — PapayaPulse" },
      {
        property: "og:description",
        content: "Track the research project's milestones, dates and assessment marks.",
      },
    ],
  }),
  component: MilestonesPage,
});

const FILTERS = ["all", "completed", "in-progress", "upcoming"] as const;

function MilestonesPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const items = MILESTONES.filter((m) => filter === "all" || m.status === filter);

  return (
    <PageShell
      breadcrumbs={[{ label: "Milestones" }]}
      eyebrow="Project Timeline"
      title="From proposal to viva"
      description="A transparent view of every assessment milestone in the research project."
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-20">
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider transition ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.replace("-", " ")}
            </button>
          ))}
        </div>

        <ol className="relative border-l-2 border-primary/20 ml-3 space-y-6">
          {items.map((m, i) => (
            <li
              key={m.id}
              className="ml-8 relative"
              style={{ animation: `fade-up 0.5s ease-out ${i * 0.08}s both` }}
            >
              <span
                className={`absolute -left-[44px] top-2 h-7 w-7 rounded-full flex items-center justify-center border-2 ${
                  m.status === "completed"
                    ? "bg-primary border-primary"
                    : m.status === "in-progress"
                      ? "bg-card border-secondary"
                      : "bg-card border-muted"
                }`}
              >
                {m.status === "completed" && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />
                )}
                {m.status === "in-progress" && (
                  <Clock className="h-3.5 w-3.5 text-secondary animate-pulse" />
                )}
                {m.status === "upcoming" && <Circle className="h-3 w-3 text-muted-foreground" />}
              </span>
              <div className="glass rounded-2xl p-5 sm:p-6 hover-lift">
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
                    <div className="text-2xl font-display font-bold text-gradient">
                      {m.marks ? `${m.marks}/20` : "—"}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Weight {m.weight}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.description}</p>
                <div className="mt-3 inline-flex items-center gap-2">
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
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
              </div>
            </li>
          ))}
        </ol>

        {items.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No milestones in this category.
          </p>
        )}
      </div>
    </PageShell>
  );
}
