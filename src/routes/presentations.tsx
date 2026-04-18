import { createFileRoute } from "@tanstack/react-router";
import { Presentation, Download, Eye, Calendar } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { PRESENTATIONS } from "@/lib/site-data";

export const Route = createFileRoute("/presentations")({
  head: () => ({
    meta: [
      { title: "Presentations — PapayaPulse" },
      {
        name: "description",
        content: "Slide decks for proposal, progress presentations and final defense.",
      },
      { property: "og:title", content: "Presentations — PapayaPulse" },
      {
        property: "og:description",
        content: "Slide previews and downloads for every project presentation.",
      },
    ],
  }),
  component: PresentationsPage,
});

function PresentationsPage() {
  return (
    <PageShell
      breadcrumbs={[{ label: "Presentations" }]}
      eyebrow="Slide Decks"
      title="Every presentation, archived"
      description="Preview and download the slides used at every assessment milestone."
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {PRESENTATIONS.map((p, i) => (
            <article
              key={p.id}
              className="group glass rounded-3xl overflow-hidden hover-lift"
              style={{ animation: `fade-up 0.6s ease-out ${i * 0.08}s both` }}
            >
              {/* Slide preview */}
              <div className="aspect-[16/10] relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
                <div className="absolute inset-0 grid-bg opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="glass-strong rounded-2xl px-6 py-8 text-center max-w-[80%]">
                    <Presentation className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      PapayaPulse
                    </div>
                    <div className="font-display font-bold text-lg leading-tight">{p.title}</div>
                  </div>
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full glass-strong text-[10px] font-mono">
                  {p.slides} slides
                </div>
              </div>
              <div className="p-5 sm:p-6 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-lg">{p.title}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(p.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="h-10 w-10 rounded-lg glass hover:bg-white/10 flex items-center justify-center transition">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="h-10 w-10 rounded-lg bg-primary/15 hover:bg-primary text-primary hover:text-primary-foreground flex items-center justify-center transition">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
