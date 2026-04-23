"use client";

import { useState } from "react";
import {
  ChevronDown,
  BookOpen,
  Target,
  Lightbulb,
  ListChecks,
  Workflow,
  Cpu,
  Code2,
} from "lucide-react";
import type { IconType } from "react-icons";
import { FaAws } from "react-icons/fa";
import {
  SiPython,
  SiTensorflow,
  SiPytorch,
  SiOpencv,
  SiFastapi,
  SiReact,
  SiTypescript,
  SiPostgresql,
  SiDocker,
  SiGoogle,
  SiFacebook,
} from "react-icons/si";
import { PageShell } from "@/components/site/PageShell";
import { useApi } from "@/hooks/use-api";
import type { DomainContentDTO } from "@/types/content";

const TECH_ICON_MAP: Record<string, { icon: IconType; color: string }> = {
  python: { icon: SiPython, color: "#3776AB" },
  tensorflow: { icon: SiTensorflow, color: "#FF6F00" },
  pytorch: { icon: SiPytorch, color: "#EE4C2C" },
  opencv: { icon: SiOpencv, color: "#5C3EE8" },
  fastapi: { icon: SiFastapi, color: "#009688" },
  react: { icon: SiReact, color: "#61DAFB" },
  typescript: { icon: SiTypescript, color: "#3178C6" },
  postgresql: { icon: SiPostgresql, color: "#4169E1" },
  docker: { icon: SiDocker, color: "#2496ED" },
  aws: { icon: FaAws, color: "#FF9900" },
  "edge tpu": { icon: SiGoogle, color: "#4285F4" },
  prophet: { icon: SiFacebook, color: "#0866FF" },
};

function getTechIcon(name: string) {
  const key = name.trim().toLowerCase();
  return TECH_ICON_MAP[key] || { icon: Code2, color: "#14d2d6" };
}

function TechnologyTag({ name }: { name: string }) {
  const { icon: Icon, color } = getTechIcon(name);

  return (
    <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl glass text-sm font-mono hover:border-primary/40 transition">
      <Icon className="h-5 w-5" style={{ color }} />
      <span className="text-[15px] leading-none">{name}</span>
    </span>
  );
}

export default function DomainPage() {
  const { data, loading, error } = useApi<DomainContentDTO>("/api/domain");

  return (
    <PageShell
      breadcrumbs={[{ label: "Domain" }]}
      eyebrow="Research Domain"
      title="The science behind the system"
      description="A grounded look at the literature, the gap we're closing, and the approach driving PapayaPulse."
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6 sm:space-y-8 pb-20">
        {loading && <p className="text-sm text-muted-foreground">Loading domain content...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {data && (
          <>
            <Expandable icon={BookOpen} title="Literature Survey" subtitle="40+ peer-reviewed papers reviewed" defaultOpen>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{data.literature.join(" ")}</p>
            </Expandable>

            <Expandable icon={Target} title="Research Gap" subtitle="What existing work misses">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{data.researchGap.join(" ")}</p>
            </Expandable>

            <Expandable icon={Lightbulb} title="Research Problem" subtitle="The driving question">
              <p className="text-base leading-relaxed text-foreground/90">{data.problem}</p>
            </Expandable>

            <Expandable icon={ListChecks} title="Research Objectives" subtitle="5 core deliverables">
              <ol className="space-y-3">
                {data.objectives.map((l, i) => (
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
                {data.methodology.map((m, i) => (
                  <li key={m.phase} className="ml-6 relative">
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
                {data.technologies.map((t) => (
                  <TechnologyTag key={t} name={t} />
                ))}
              </div>
            </div>
          </>
        )}
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
    <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-[var(--shadow-card)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 p-6 sm:p-8 text-left hover:bg-muted/50 transition"
      >
        <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-lg sm:text-xl">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-500 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 pl-[88px] sm:pl-[104px] text-foreground/78">{children}</div>
        </div>
      </div>
    </div>
  );
}
