import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, BookOpen, Target, Lightbulb, ListChecks, Workflow, Cpu } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { DOMAIN } from "@/lib/site-data";

export const Route = createFileRoute("/domain")({
  head: () => ({
    meta: [
      { title: "Research Domain — PapayaPulse" },
      {
        name: "description",
        content:
          "Literature survey, research gap, problem statement, objectives, methodology and technologies behind PapayaPulse.",
      },
      { property: "og:title", content: "Research Domain — PapayaPulse" },
      {
        property: "og:description",
        content: "Detailed research domain of the PapayaPulse smart farming framework.",
      },
    ],
  }),
  component: DomainPage,
});

function DomainPage() {
  return (
    <PageShell
      breadcrumbs={[{ label: "Domain" }]}
      eyebrow="Research Domain"
      title="The science behind the system"
      description="A grounded look at the literature, the gap we're closing, and the approach driving PapayaPulse."
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6 sm:space-y-8 pb-20">
        <Expandable
          icon={BookOpen}
          title="Literature Survey"
          subtitle="40+ peer-reviewed papers reviewed"
          defaultOpen
        >
          <ul className="space-y-3">
            {DOMAIN.literature.map((l, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {l}
              </li>
            ))}
          </ul>
        </Expandable>

        <Expandable icon={Target} title="Research Gap" subtitle="What existing work misses">
          <ul className="space-y-3">
            {DOMAIN.gap.map((l, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                {l}
              </li>
            ))}
          </ul>
        </Expandable>

        <Expandable icon={Lightbulb} title="Research Problem" subtitle="The driving question">
          <p className="text-base leading-relaxed text-foreground/90">{DOMAIN.problem}</p>
        </Expandable>

        <Expandable icon={ListChecks} title="Research Objectives" subtitle="5 core deliverables">
          <ol className="space-y-3">
            {DOMAIN.objectives.map((l, i) => (
              <li key={i} className="flex gap-4 text-sm text-muted-foreground">
                <span className="font-mono text-xs text-primary shrink-0 w-6">0{i + 1}</span>
                <span>{l}</span>
              </li>
            ))}
          </ol>
        </Expandable>

        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Workflow className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl">Methodology</h3>
              <p className="text-xs text-muted-foreground">5-phase research pipeline</p>
            </div>
          </div>
          <ol className="relative border-l border-primary/20 ml-2 space-y-6">
            {DOMAIN.methodology.map((m, i) => (
              <li
                key={m.phase}
                className="ml-6 relative"
                style={{ animation: `fade-up 0.5s ease-out ${i * 0.08}s both` }}
              >
                <span className="absolute -left-[33px] top-1 h-5 w-5 rounded-full bg-card border-2 border-primary flex items-center justify-center text-[10px] font-mono text-primary">
                  {i + 1}
                </span>
                <h4 className="font-medium text-base">{m.phase}</h4>
                <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-secondary/15 flex items-center justify-center">
              <Cpu className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl">Technologies Used</h3>
              <p className="text-xs text-muted-foreground">Stack powering the framework</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {DOMAIN.technologies.map((t, i) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-lg glass text-sm font-mono hover:border-primary/40 transition"
                style={{ animation: `scale-in 0.4s ease-out ${i * 0.03}s both` }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Expandable({
  icon: Icon,
  title,
  subtitle,
  children,
  defaultOpen = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass rounded-3xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 p-6 sm:p-8 text-left hover:bg-white/[0.02] transition"
      >
        <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-lg sm:text-xl">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-500 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 pl-[88px] sm:pl-[104px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
