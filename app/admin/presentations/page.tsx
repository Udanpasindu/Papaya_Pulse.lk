"use client";

import { useRef, useState } from "react";
import { Upload, Presentation, Trash2 } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { apiSend } from "@/lib/api";
import type { PresentationDTO } from "@/types/content";

export default function PresentationsAdminPage() {
  const { data, loading, error, setData } = useApi<PresentationDTO[]>("/api/presentations", "no-store");
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const items = data || [];

  const uploadPresentation = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploaded = await apiSend<{ fileUrl: string }>("/api/upload", "POST", formData);
      const created = await apiSend<PresentationDTO>("/api/presentations", "POST", {
        title: file.name,
        fileUrl: uploaded.fileUrl,
        type: "General",
        date: new Date().toISOString().slice(0, 10),
        slides: 0,
      });
      setData([created, ...items]);
      setMessage("Presentation uploaded.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed.");
    }
  };

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      await uploadPresentation(file);
    }
  };

  const removeItem = async (id: string | undefined) => {
    if (!id) return;
    await apiSend(`/api/presentations/${id}`, "DELETE");
    setData(items.filter((p) => p._id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Slides</div>
        <h1 className="font-display font-bold text-3xl">Manage Presentations</h1>
      </div>

      <div className="glass rounded-2xl p-6">
        <button onClick={() => fileRef.current?.click()} className="w-full rounded-2xl border-2 border-dashed border-border/60 hover:border-primary/40 cursor-pointer transition p-8 text-center">
          <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
          <div className="text-sm font-medium">Upload presentation</div>
          <div className="text-xs text-muted-foreground mt-1">PDF, PPT or PPTX</div>
        </button>
        <input ref={fileRef} type="file" accept=".pdf,.ppt,.pptx" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading presentations...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((p) => (
          <div key={p._id || p.title} className="glass rounded-2xl overflow-hidden">
            <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 via-card to-secondary/10 relative">
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Presentation className="h-10 w-10 text-primary opacity-80" />
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="w-full px-3 py-2 rounded-lg bg-input/50 border border-border text-sm font-medium">{p.title}</div>
              <div className="flex items-center justify-between gap-2">
                <div className="px-3 py-2 rounded-lg bg-input/50 border border-border text-xs flex-1">{p.date || "-"}</div>
                <button onClick={() => removeItem(p._id)} className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition flex items-center justify-center">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
