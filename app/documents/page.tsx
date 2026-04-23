"use client";

import { useMemo, useState } from "react";
import { FileText, Download, Search, Eye, X } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useApi } from "@/hooks/use-api";
import type { DocumentDTO } from "@/types/content";

export default function DocumentsPage() {
  const { data, loading, error } = useApi<DocumentDTO[]>("/api/documents");
  const [q, setQ] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<DocumentDTO | null>(null);

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

  const downloadDoc = (doc: DocumentDTO) => {
    const url = doc.fileUrl || "";
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = doc.title || "document";
    link.rel = "noreferrer";
    link.click();
  };

  const canPreviewPdf = (doc: DocumentDTO) => {
    const mime = String(doc.mimeType || "").toLowerCase();
    const title = String(doc.title || "").toLowerCase();
    const url = String(doc.fileUrl || "").toLowerCase();
    return mime.includes("pdf") || title.endsWith(".pdf") || url.startsWith("data:application/pdf");
  };

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
                    <button
                      onClick={() => setSelectedDoc(d)}
                      className="h-10 w-10 rounded-lg border border-border bg-card hover:bg-muted/60 flex items-center justify-center transition"
                      title="Preview document"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => downloadDoc(d)}
                      className="h-10 w-10 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground flex items-center justify-center transition"
                      title="Download document"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 animate-in fade-in duration-200">
          <div className="w-[calc(100vw-1rem)] h-[calc(100vh-2rem)] max-w-full flex flex-col bg-card rounded-2xl border border-border shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border/50">
              <div>
                <h2 className="font-display font-bold text-xl">{selectedDoc.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{selectedDoc.date || ""}</p>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 hover:bg-muted rounded-lg transition"
                title="Close preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden bg-black/40 rounded-b-2xl">
              {canPreviewPdf(selectedDoc) ? (
                <iframe
                  src={selectedDoc.fileUrl}
                  width="100%"
                  height="100%"
                  className="w-full h-full border-none"
                  title="Document preview"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <FileText className="h-16 w-16 text-primary/40 mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {selectedDoc.fileUrl ? "Preview is available for PDF files only." : "No file available."}
                  </p>
                  {selectedDoc.fileUrl && (
                    <button
                      onClick={() => downloadDoc(selectedDoc)}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition inline-flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download File
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
