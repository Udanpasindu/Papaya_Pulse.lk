import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Presentation, Trash2, Edit3 } from "lucide-react";
import { PRESENTATIONS } from "@/lib/site-data";

type P = (typeof PRESENTATIONS)[number];

export const Route = createFileRoute("/admin/presentations")({
  component: PresentationsAdmin,
});

function PresentationsAdmin() {
  const [items, setItems] = useState<P[]>([...PRESENTATIONS]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Slides</div>
        <h1 className="font-display font-bold text-3xl">Manage Presentations</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Upload PPT/PDF slide decks for each milestone.
        </p>
      </div>

      <div className="glass rounded-2xl p-6">
        <label className="block rounded-2xl border-2 border-dashed border-border/60 hover:border-primary/40 cursor-pointer transition p-8 text-center">
          <input type="file" accept=".pdf,.ppt,.pptx" className="hidden" />
          <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
          <div className="text-sm font-medium">Upload presentation</div>
          <div className="text-xs text-muted-foreground mt-1">PDF, PPT or PPTX</div>
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((p, i) => (
          <div key={p.id} className="glass rounded-2xl overflow-hidden">
            <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 via-card to-secondary/10 relative">
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Presentation className="h-10 w-10 text-primary opacity-80" />
              </div>
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full glass-strong text-[10px] font-mono">
                {p.slides} slides
              </div>
            </div>
            <div className="p-4 space-y-2">
              <input
                value={p.title}
                onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                className="w-full px-3 py-2 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-sm font-medium"
              />
              <div className="flex items-center justify-between gap-2">
                <input
                  type="date"
                  value={p.date}
                  onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)))}
                  className="px-3 py-2 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-xs flex-1"
                />
                <button className="h-9 w-9 rounded-lg glass hover:bg-primary/15 transition flex items-center justify-center">
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setItems(items.filter((_, j) => j !== i))}
                  className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition flex items-center justify-center"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
