"use client";

import { useRef, useState } from "react";
import { Upload, FileText, Trash2, Download } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { apiSend } from "@/lib/api";
import type { DocumentDTO } from "@/types/content";

export default function DocumentsAdminPage() {
  const { data, loading, error, setData } = useApi<DocumentDTO[]>("/api/documents", "no-store");
  const [category, setCategory] = useState("Charter");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const docs = data || [];

  const uploadAndCreate = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const upload = await apiSend<{ fileUrl: string; size: string }>("/api/upload", "POST", formData);
      const created = await apiSend<DocumentDTO>("/api/documents", "POST", {
        title: file.name,
        fileUrl: upload.fileUrl,
        category,
        size: upload.size,
        date: new Date().toISOString().slice(0, 10),
      });
      setData([created, ...docs]);
      setMessage("Document uploaded.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed.");
    }
  };

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      await uploadAndCreate(file);
    }
  };

  const removeDoc = async (id: string | undefined) => {
    if (!id) return;
    await apiSend(`/api/documents/${id}`, "DELETE");
    setData(docs.filter((d) => d._id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Files</div>
        <h1 className="font-display font-bold text-3xl">Manage Documents</h1>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4 border border-white/8">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs uppercase tracking-wider text-white/55">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-2 rounded-lg bg-input/50 border border-white/10 focus:border-primary/40 focus:outline-none text-sm text-white">
            {["Charter", "Proposal", "Progress", "Final", "Member Report"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <button onClick={() => fileInputRef.current?.click()} className="w-full rounded-2xl border-2 border-dashed border-white/12 hover:border-primary/40 p-10 text-center transition bg-white/[0.02]">
          <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
          <div className="text-sm font-medium text-white">Drop PDFs here or click to browse</div>
          <div className="text-xs text-white/55 mt-1">PDF, DOC, DOCX up to 50MB</div>
        </button>
        <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => onFiles(e.target.files)} />
      </div>

      {loading && <p className="text-sm text-white/55">Loading documents...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="glass rounded-2xl overflow-hidden border border-white/8">
        <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between">
          <h2 className="font-display font-bold text-base text-white">All Documents</h2>
          <span className="text-xs text-white/55">{docs.length} files</span>
        </div>
        <div className="divide-y divide-white/8">
          {docs.map((d) => (
            <div key={d._id || d.title} className="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate text-white">{d.title}</div>
                <div className="text-xs text-white/55">{d.category} · {d.size || "-"}</div>
              </div>
              <div className="flex gap-2">
                <a href={d.fileUrl || "#"} target="_blank" className="h-9 w-9 rounded-lg glass hover:bg-primary/15 transition flex items-center justify-center">
                  <Download className="h-3.5 w-3.5" />
                </a>
                <button onClick={() => removeDoc(d._id)} className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition flex items-center justify-center">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
