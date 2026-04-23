"use client";

import { useRef, useState } from "react";
import { Upload, FileText, Trash2, Download, Eye, X } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { apiSend } from "@/lib/api";
import type { DocumentDTO } from "@/types/content";

export default function DocumentsAdminPage() {
  const { data, loading, error, setData } = useApi<DocumentDTO[]>("/api/documents", "no-store");
  const [category, setCategory] = useState("Charter");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string>("");
  const [selectedDoc, setSelectedDoc] = useState<DocumentDTO | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const docs = data || [];

  const uploadAndCreate = async (file: File) => {
    try {
      setMessage("");
      setUploading(true);

      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.length; i += 1) {
        binary += String.fromCharCode(bytes[i]);
      }
      const dataUrl = `data:${file.type || "application/octet-stream"};base64,${btoa(binary)}`;

      const created = await apiSend<DocumentDTO>("/api/documents", "POST", {
        title: file.name,
        fileUrl: dataUrl,
        category,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        date: new Date().toISOString().slice(0, 10),
      });
      setData((prev) => [created, ...(prev || [])]);
      setMessage("Document uploaded.");
    } catch (err) {
      const text = err instanceof Error ? err.message : "Upload failed.";
      if (text.toLowerCase().includes("unauthorized")) {
        window.location.href = "/admin/login";
        return;
      }
      setMessage(text);
    } finally {
      setUploading(false);
    }
  };

  const downloadDoc = (doc: DocumentDTO) => {
    const url = doc.fileUrl || "";
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = doc.title || "document";
    link.rel = "noreferrer";
    link.click();
  };

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      await uploadAndCreate(file);
    }
  };

  const removeDoc = async (id: string | undefined) => {
    if (!id) {
      setMessage("Cannot delete: missing document ID.");
      return;
    }
    try {
      setMessage("");
      setDeletingId(id);
      await apiSend(`/api/documents/${id}`, "DELETE");
      setData((prev) => (prev || []).filter((d) => d._id !== id));
      setMessage("Document deleted.");
    } catch (err) {
      const text = err instanceof Error ? err.message : "Delete failed.";
      if (text.toLowerCase().includes("unauthorized")) {
        window.location.href = "/admin/login";
        return;
      }
      setMessage(text);
    } finally {
      setDeletingId("");
    }
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

        <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full rounded-2xl border-2 border-dashed border-white/12 hover:border-primary/40 p-10 text-center transition bg-white/[0.02] disabled:opacity-50 disabled:cursor-not-allowed">
          <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
          <div className="text-sm font-medium text-white">{uploading ? "Uploading..." : "Drop PDFs here or click to browse"}</div>
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
                <button
                  onClick={() => setSelectedDoc(d)}
                  className="h-9 w-9 rounded-lg glass hover:bg-primary/15 transition flex items-center justify-center"
                  title="Preview document"
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => downloadDoc(d)}
                  className="h-9 w-9 rounded-lg glass hover:bg-primary/15 transition flex items-center justify-center"
                  title="Download document"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => removeDoc(d._id)} disabled={deletingId === d._id} className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}

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
              {selectedDoc.fileUrl && selectedDoc.fileUrl.startsWith("data:application/pdf") ? (
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
    </div>
  );
}
