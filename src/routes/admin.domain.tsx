import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { DOMAIN } from "@/lib/site-data";

export const Route = createFileRoute("/admin/domain")({
  component: DomainAdmin,
});

function DomainAdmin() {
  const [problem, setProblem] = useState(DOMAIN.problem);
  const [objectives, setObjectives] = useState<string[]>(DOMAIN.objectives);
  const [techs, setTechs] = useState<string[]>(DOMAIN.technologies);
  const [newTech, setNewTech] = useState("");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Domain</div>
        <h1 className="font-display font-bold text-3xl">Edit Domain Sections</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manage the research problem, objectives and technologies.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-2">
        <h2 className="font-display font-bold text-lg mb-2">Research Problem</h2>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-input/50 border border-border focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition resize-none text-sm"
        />
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-display font-bold text-lg mb-4">Objectives</h2>
        <ol className="space-y-2">
          {objectives.map((o, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-xs text-primary mt-3.5 w-5">0{i + 1}</span>
              <input
                value={o}
                onChange={(e) => setObjectives(objectives.map((x, j) => (i === j ? e.target.value : x)))}
                className="flex-1 px-4 py-3 rounded-xl bg-input/50 border border-border focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition text-sm"
              />
              <button
                onClick={() => setObjectives(objectives.filter((_, j) => j !== i))}
                className="h-11 w-11 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition flex items-center justify-center shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ol>
        <button
          onClick={() => setObjectives([...objectives, "New objective"])}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm hover:bg-white/10 transition"
        >
          <Plus className="h-4 w-4" /> Add Objective
        </button>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-display font-bold text-lg mb-4">Technologies</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {techs.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-2 pl-3 pr-1 py-1 rounded-lg glass text-sm font-mono"
            >
              {t}
              <button
                onClick={() => setTechs(techs.filter((x) => x !== t))}
                className="h-6 w-6 rounded-md hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition flex items-center justify-center"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            placeholder="e.g. Kubernetes"
            className="flex-1 px-4 py-2.5 rounded-xl bg-input/50 border border-border focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition text-sm"
          />
          <button
            onClick={() => {
              if (newTech.trim()) {
                setTechs([...techs, newTech.trim()]);
                setNewTech("");
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:shadow-[var(--shadow-glow)] transition inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-leaf text-primary-foreground font-medium text-sm hover:shadow-[var(--shadow-glow)] transition">
        <Save className="h-4 w-4" /> Save All Changes
      </button>
    </div>
  );
}
