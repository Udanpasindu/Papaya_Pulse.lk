"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { apiSend } from "@/lib/api";
import type { DomainContentDTO } from "@/types/content";

export default function DomainAdminPage() {
  const { data, loading, error } = useApi<DomainContentDTO>("/api/domain", "no-store");
  const [form, setForm] = useState<DomainContentDTO | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        literature: data.literature || [],
        researchGap: data.researchGap || [],
        problem: data.problem || "",
        proposedSolution: data.proposedSolution || "",
        researchApproach: data.researchApproach || "",
        systemArchitecture: data.systemArchitecture || "",
        objectives: data.objectives || [],
        methodology: data.methodology || [],
        technologies: data.technologies || [],
      });
    }
  }, [data]);

  const save = async () => {
    if (!form || saving) return;
    try {
      setSaving(true);
      setMessage("");
      await apiSend("/api/domain", "PUT", form);
      setMessage("Saved successfully.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Domain</div>
          <h1 className="font-display font-bold text-3xl text-white">Edit Domain Sections</h1>
        </div>
        {loading && <p className="text-sm text-white/55">Loading domain content...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Domain</div>
        <h1 className="font-display font-bold text-3xl text-white">Edit Domain Sections</h1>
      </div>

      {loading && <p className="text-sm text-white/55">Loading domain content...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <Section title="Literature Survey">
        <MultilineField
          value={form.literature}
          onChange={(items) => setForm({ ...form, literature: items })}
          placeholder="One literature point per line"
        />
      </Section>

      <Section title="Research Gap">
        <MultilineField
          value={form.researchGap}
          onChange={(items) => setForm({ ...form, researchGap: items })}
          placeholder="One gap per line"
        />
      </Section>

      <Section title="Research Problem">
        <textarea
          value={form.problem}
          onChange={(e) => setForm({ ...form, problem: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-input/50 border border-white/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition resize-none text-sm text-white"
        />
      </Section>

      <Section title="Proposed Solution">
        <textarea
          value={form.proposedSolution}
          onChange={(e) => setForm({ ...form, proposedSolution: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-input/50 border border-white/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition resize-none text-sm text-white"
        />
      </Section>

      <Section title="Research Approach">
        <textarea
          value={form.researchApproach}
          onChange={(e) => setForm({ ...form, researchApproach: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-input/50 border border-white/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition resize-none text-sm text-white"
        />
      </Section>

      <Section title="System Architecture">
        <textarea
          value={form.systemArchitecture}
          onChange={(e) => setForm({ ...form, systemArchitecture: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-input/50 border border-white/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition resize-none text-sm text-white"
        />
      </Section>

      <Section title="Objectives">
        <div className="space-y-2">
          {form.objectives.map((objective, index) => (
            <div key={`${objective}-${index}`} className="flex gap-3">
              <input
                value={objective}
                onChange={(e) =>
                  setForm({
                    ...form,
                    objectives: form.objectives.map((item, itemIndex) =>
                      itemIndex === index ? e.target.value : item,
                    ),
                  })
                }
                className="flex-1 px-4 py-3 rounded-xl bg-input/50 border border-white/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition text-sm text-white"
              />
              <button
                onClick={() => setForm({ ...form, objectives: form.objectives.filter((_, itemIndex) => itemIndex !== index) })}
                className="h-11 w-11 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition flex items-center justify-center shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setForm({ ...form, objectives: [...form.objectives, "New objective"] })}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm hover:bg-white/10 transition text-white"
        >
          <Plus className="h-4 w-4" /> Add Objective
        </button>
      </Section>

      <Section title="Methodology">
        <div className="space-y-3">
          {form.methodology.map((item, index) => (
            <div key={`${item.phase}-${index}`} className="grid md:grid-cols-[220px_1fr_auto] gap-3 items-start">
              <input
                value={item.phase}
                onChange={(e) =>
                  setForm({
                    ...form,
                    methodology: form.methodology.map((method, methodIndex) =>
                      methodIndex === index ? { ...method, phase: e.target.value } : method,
                    ),
                  })
                }
                className="px-4 py-3 rounded-xl bg-input/50 border border-white/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition text-sm text-white"
                placeholder="Phase"
              />
              <textarea
                value={item.desc}
                onChange={(e) =>
                  setForm({
                    ...form,
                    methodology: form.methodology.map((method, methodIndex) =>
                      methodIndex === index ? { ...method, desc: e.target.value } : method,
                    ),
                  })
                }
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-input/50 border border-white/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition resize-none text-sm text-white"
                placeholder="Description"
              />
              <button
                onClick={() => setForm({ ...form, methodology: form.methodology.filter((_, methodIndex) => methodIndex !== index) })}
                className="h-11 w-11 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition flex items-center justify-center shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setForm({ ...form, methodology: [...form.methodology, { phase: "New phase", desc: "Describe the step" }] })}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm hover:bg-white/10 transition text-white"
        >
          <Plus className="h-4 w-4" /> Add Phase
        </button>
      </Section>

      <Section title="Technologies Used">
        <MultilineField
          value={form.technologies}
          onChange={(items) => setForm({ ...form, technologies: items })}
          placeholder="One technology per line"
        />
      </Section>

      <button
        onClick={save}
        type="button"
        disabled={saving}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-leaf text-primary-foreground font-medium text-sm hover:shadow-[var(--shadow-glow)] transition shadow-[var(--shadow-card)] cursor-pointer relative z-10 pointer-events-auto disabled:opacity-70"
      >
        <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save All Changes"}
      </button>
      {message && <p className="text-xs text-white/55">{message}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6 space-y-2 border border-white/8">
      <h2 className="font-display font-bold text-lg mb-2 text-white">{title}</h2>
      {children}
    </div>
  );
}

function MultilineField({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  return (
    <textarea
      value={value.join("\n")}
      onChange={(e) => onChange(e.target.value.split("\n").map((item) => item.trim()).filter(Boolean))}
      rows={5}
      className="w-full px-4 py-3 rounded-xl bg-input/50 border border-white/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition resize-none text-sm text-white"
      placeholder={placeholder}
    />
  );
}