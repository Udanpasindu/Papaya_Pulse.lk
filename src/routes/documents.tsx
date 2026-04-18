import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Download, Search, Users } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { DOCUMENTS } from "@/lib/site-data";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — PapayaPulse" },
      {
        name: "description",
        content: "Downloadable project documents: charter, proposal, progress reports and final thesis.",
      },
      { property: "og:title", content: "Documents — PapayaPulse" },
      {
        property: "og:description",
        content: "Browse and download all project documents and individual member reports.",
      },
    ],
  }),
  component: DocumentsPage,
});

const SECTIONS = [
  { key: "charter", title: "Project Charter", desc: "Initial scope, governance and team commitment." },
  { key: "proposal", title: "Proposal Document", desc: "Full research proposal submitted to the panel." },
  { key: "progress", title: "Progress Reports", desc: "Periodic progress reports across all phases." },
  { key: "final", title: "Final Documents", desc: "Final thesis and summary deliverables." },
] as const;

function DocumentsPage() {
  const [q, setQ] = useState("");

  const matches = (name: string) => name.toLowerCase().includes(q.toLowerCase());

  return (
    <PageShell
      breadcrumbs={[{ label: "Documents" }]}
      eyebrow="Document Library"
      title="Research deliverables"
      description="All project documents in one place — searchable and downloadable."
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl glass text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
          />
        </div>

        <div className="space-y-8">
          {SECTIONS.map((s) => {
            const docs = (DOCUMENTS[s.key] as { name: string; size: string; date: string }[]).filter(
              (d) => matches(d.name),
            );
            if (q && docs.length === 0) return null;
            return (
              <section key={s.key}>
                <h2 className="font-display font-bold text-2xl mb-1">{s.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {docs.map((d, i) => (
                    <DocCard key={d.name} name={d.name} size={d.size} sub={d.date} delay={i * 0.05} />
                  ))}
                </div>
              </section>
            );
          })}

          <section>
            <div className="flex items-center gap-3 mb-1">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="font-display font-bold text-2xl">Individual Member Reports</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Personal contributions and component-level reports from each team member.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {DOCUMENTS.members
                .filter((d) => matches(d.name))
                .map((d, i) => (
                  <DocCard key={d.name} name={d.name} size={d.size} sub={d.member} delay={i * 0.05} />
                ))}
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}

function DocCard({ name, size, sub, delay }: { name: string; size: string; sub: string; delay: number }) {
  return (
    <div
      className="group glass rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover-lift cursor-pointer"
      style={{ animation: `fade-up 0.5s ease-out ${delay}s both` }}
    >
      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-leaf/10 border border-primary/20 flex items-center justify-center shrink-0">
        <FileText className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{name}</div>
        <div className="text-xs text-muted-foreground">
          {sub} · {size}
        </div>
      </div>
      <button className="h-10 w-10 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground flex items-center justify-center transition">
        <Download className="h-4 w-4" />
      </button>
    </div>
  );
}
