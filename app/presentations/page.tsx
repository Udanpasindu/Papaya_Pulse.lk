"use client";

import { useState } from "react";
import { Presentation, Download, Eye, Calendar, X } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useApi } from "@/hooks/use-api";
import type { PresentationDTO } from "@/types/content";

export default function PresentationsPage() {
  const { data, loading, error } = useApi<PresentationDTO[]>("/api/presentations");
  const [selectedFile, setSelectedFile] = useState<PresentationDTO | null>(null);

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
                  <button
                    onClick={() => setSelectedFile(p)}
                    className="h-10 w-10 rounded-lg border border-border bg-card hover:bg-muted/60 flex items-center justify-center transition"
                    title="Preview presentation"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <a
                    href={p.fileUrl || "#"}
                    download={p.title || "presentation"}
                    className="h-10 w-10 rounded-lg bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center transition"
                    title="Download presentation"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-card rounded-2xl border border-border shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div>
                <h2 className="font-display font-bold text-xl">{selectedFile.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedFile.date
                    ? new Date(selectedFile.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-2 hover:bg-muted rounded-lg transition"
                title="Close preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden bg-black/40 rounded-b-2xl">
              {selectedFile.fileUrl && selectedFile.fileUrl.startsWith("data:application/pdf") ? (
                <iframe
                  src={selectedFile.fileUrl}
                  width="100%"
                  height="100%"
                  className="w-full h-full border-none"
                  title="PDF preview"
                />
              ) : selectedFile.fileUrl && selectedFile.fileUrl.startsWith("data:") ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <Presentation className="h-16 w-16 text-primary/40 mb-4" />
                  <p className="text-muted-foreground mb-4">Preview not available for this file type</p>
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = selectedFile.fileUrl || "#";
                      link.download = selectedFile.title || "presentation";
                      link.click();
                    }}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition inline-flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download File
                  </button>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <Presentation className="h-16 w-16 text-primary/40 mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {selectedFile.fileUrl ? "Unable to preview this file" : "No file available"}
                  </p>
                  {selectedFile.fileUrl && (
                    <a
                      href={selectedFile.fileUrl}
                      download={selectedFile.title || "presentation"}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition inline-flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download File
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/50 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition"
              >
                Close
              </button>
              {selectedFile.fileUrl && (
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = selectedFile.fileUrl || "#";
                    link.download = selectedFile.title || "presentation";
                    link.click();
                  }}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition inline-flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
