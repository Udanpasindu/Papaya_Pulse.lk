"use client";

import { useMemo, useState } from "react";
import { FileText, Download, Search } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useApi } from "@/hooks/use-api";
import type { DocumentDTO } from "@/types/content";

export default function DocumentsPage() {
  const { data, loading, error } = useApi<DocumentDTO[]>("/api/documents");
  const [q, setQ] = useState("");

  const grouped = useMemo(() => {
    const map = new Map<string, DocumentDTO[]>();
    const term = q.toLowerCase();
    (data || []).forEach((doc) => {
      const pass = !term || doc.title.toLowerCase().includes(term) || doc.category.toLowerCase().includes(term);
      if (!pass) return;
      const key = doc.category || "Other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push(doc);
    });
    return Array.from(map.entries());
  }, [data, q]);

  return (
    <PageShell
      breadcrumbs={[{ label: "Documents" }]}
      eyebrow="Document Library"
      title="Research deliverables"
      description="All project documents in one place - searchable and downloadable."
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-[var(--shadow-card)]"
          />
        </div>

        {loading && <p className="text-sm text-muted-foreground">Loading documents...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="space-y-8">
          {grouped.map(([category, docs]) => (
            <section key={category}>
              <h2 className="font-display font-bold text-2xl mb-3">{category}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {docs.map((d) => (
                  <article key={d._id || d.title} className="group rounded-2xl p-4 sm:p-5 flex items-center gap-4 border border-border bg-card shadow-[var(--shadow-card)] hover-lift">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{d.title}</div>
                      <div className="text-xs text-foreground/65">{d.size || "-"} {d.date ? `· ${d.date}` : ""}</div>
                    </div>
                    <a
                      href={d.fileUrl || "#"}
                      target="_blank"
                      className="h-10 w-10 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground flex items-center justify-center transition"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
