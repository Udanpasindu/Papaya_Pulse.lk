import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, FileText, Trash2, Download } from "lucide-react";
import { DOCUMENTS } from "@/lib/site-data";

interface Doc {
  name: string;
  size: string;
  date: string;
  category: string;
}

export const Route = createFileRoute("/admin/documents")({
  component: DocumentsAdmin,
});

const CATEGORIES = ["Charter", "Proposal", "Progress", "Final", "Member Report"] as const;

function DocumentsAdmin() {
  const [docs, setDocs] = useState<Doc[]>([
    ...DOCUMENTS.charter.map((d) => ({ ...d, category: "Charter" })),
    ...DOCUMENTS.proposal.map((d) => ({ ...d, category: "Proposal" })),
    ...DOCUMENTS.progress.map((d) => ({ ...d, category: "Progress" })),
    ...DOCUMENTS.final.map((d) => ({ ...d, category: "Final" })),
    ...DOCUMENTS.members.map((d) => ({ name: d.name, size: d.size, date: "—", category: "Member Report" })),
  ]);
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Charter");
  const [drag, setDrag] = useState(false);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const fresh: Doc[] = Array.from(files).map((f) => ({
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      date: new Date().toISOString().slice(0, 10),
      category: cat,
    }));
    setDocs([...fresh, ...docs]);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Files</div>
        <h1 className="font-display font-bold text-3xl">Manage Documents</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Upload PDFs and make them downloadable from the public site.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Category</label>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value as (typeof CATEGORIES)[number])}
            className="px-4 py-2 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            onFiles(e.dataTransfer.files);
          }}
          className={`block rounded-2xl border-2 border-dashed cursor-pointer transition p-10 text-center ${
            drag ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/40"
          }`}
        >
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
          <div className="text-sm font-medium">Drop PDFs here or click to browse</div>
          <div className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX up to 50MB</div>
        </label>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between">
          <h2 className="font-display font-bold text-base">All Documents</h2>
          <span className="text-xs text-muted-foreground">{docs.length} files</span>
        </div>
        <div className="divide-y divide-border/30">
          {docs.map((d, i) => (
            <div key={`${d.name}-${i}`} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{d.name}</div>
                <div className="text-xs text-muted-foreground">
                  {d.category} · {d.size} · {d.date}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="h-9 w-9 rounded-lg glass hover:bg-primary/15 transition flex items-center justify-center">
                  <Download className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDocs(docs.filter((_, j) => j !== i))}
                  className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition flex items-center justify-center"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
