"use client";

import { Presentation, Download, Eye, Calendar } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useApi } from "@/hooks/use-api";
import type { PresentationDTO } from "@/types/content";

export default function PresentationsPage() {
  const { data, loading, error } = useApi<PresentationDTO[]>("/api/presentations");

  return (
    <PageShell
      breadcrumbs={[{ label: "Presentations" }]}
      eyebrow="Slide Decks"
      title="Every presentation, archived"
      description="Preview and download the slides used at every assessment milestone."
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        {loading && <p className="text-sm text-muted-foreground">Loading presentations...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {(data || []).map((p) => (
            <article key={p._id || p.title} className="group rounded-3xl overflow-hidden border border-border bg-card shadow-[var(--shadow-card)] hover-lift">
              <div className="aspect-[16/10] relative overflow-hidden bg-gradient-to-br from-card via-muted to-card">
                <div className="absolute inset-0 grid-bg opacity-18" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-2xl px-6 py-8 text-center max-w-[80%] bg-white/92 border border-border shadow-[var(--shadow-card)]">
                    <Presentation className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">PapayaPulse</div>
                    <div className="font-display font-bold text-lg leading-tight">{p.title}</div>
                  </div>
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 border border-border text-[10px] font-mono shadow-sm">
                  {p.slides || 0} slides
                </div>
              </div>
              <div className="p-5 sm:p-6 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-lg">{p.title}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-foreground/65">
                    <Calendar className="h-3 w-3" />
                    {p.date
                      ? new Date(p.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={p.fileUrl || "#"} target="_blank" className="h-10 w-10 rounded-lg border border-border bg-card hover:bg-muted/60 flex items-center justify-center transition">
                    <Eye className="h-4 w-4" />
                  </a>
                  <a href={p.fileUrl || "#"} target="_blank" className="h-10 w-10 rounded-lg bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center transition">
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
