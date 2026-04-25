"use client";

import { useRef, useState } from "react";
import { Upload, Presentation, Trash2, Eye, Download, X } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { apiSend } from "@/lib/api";
import type { PresentationDTO } from "@/types/content";

const CHUNK_SIZE = 2 * 1024 * 1024;
const CHUNK_CONCURRENCY = 3;

export default function PresentationsAdminPage() {
  const { data, loading, error, setData } = useApi<PresentationDTO[]>("/api/presentations", "no-store");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<PresentationDTO | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const items = data || [];

  const canPreviewPdf = (item: PresentationDTO) => {
    const mime = String(item.mimeType || "").toLowerCase();
    const title = String(item.title || "").toLowerCase();
    const url = String(item.fileUrl || "").toLowerCase();
    return mime.includes("pdf") || title.endsWith(".pdf") || url.startsWith("data:application/pdf") || url.includes("/api/presentations/file/");
  };

  const uploadPresentation = async (file: File) => {
    try {
      setMessage("");
      setUploading(true);

      const uploadId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));
      const sendChunk = async (index: number) => {
        const start = index * CHUNK_SIZE;
        const end = Math.min(file.size, start + CHUNK_SIZE);
        const chunk = file.slice(start, end);
        const formData = new FormData();
        formData.append("uploadId", uploadId);
        formData.append("index", String(index));
        formData.append("totalChunks", String(totalChunks));
        formData.append("title", file.name);
        formData.append("type", "General");
        formData.append("date", new Date().toISOString().slice(0, 10));
        formData.append("slides", "0");
        formData.append("originalName", file.name);
        formData.append("mimeType", file.type || "application/octet-stream");
        formData.append("chunk", chunk, file.name);

        const res = await fetch("/api/presentations/upload/chunk", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const raw = await res.text();
        let json: { success?: boolean; message?: string } | null = null;
        if (raw) {
          try {
            json = JSON.parse(raw) as { success?: boolean; message?: string };
          } catch {
            json = null;
          }
        }

        if (!res.ok || !json?.success) {
          throw new Error(json?.message || `Upload chunk failed (${res.status}).`);
        }
      };

      for (let startIndex = 0; startIndex < totalChunks; startIndex += CHUNK_CONCURRENCY) {
        const batch = Array.from({ length: Math.min(CHUNK_CONCURRENCY, totalChunks - startIndex) }, (_, offset) => startIndex + offset);
        await Promise.all(batch.map((index) => sendChunk(index)));
        setMessage(`Uploading ${file.name}... ${Math.min(startIndex + batch.length, totalChunks)}/${totalChunks}`);
      }

      const created = await apiSend<PresentationDTO>("/api/presentations/upload/complete", "POST", { uploadId });
      setData((prev) => [created, ...(prev || [])]);
      setMessage("Presentation uploaded.");
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

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      await uploadPresentation(file);
    }
  };

  const removeItem = async (id: string | undefined) => {
    if (!id) {
      setMessage("Cannot delete: missing presentation ID.");
      return;
    }
    try {
      setMessage("");
      setDeletingId(id);
      await apiSend(`/api/presentations/${id}`, "DELETE");
      setData((prev) => (prev || []).filter((p) => p._id !== id));
      setMessage("Presentation deleted.");
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
        <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Slides</div>
        <h1 className="font-display font-bold text-3xl">Manage Presentations</h1>
      </div>

      <div className="glass rounded-2xl p-6">
        <button onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full rounded-2xl border-2 border-dashed border-border/60 hover:border-primary/40 cursor-pointer transition p-8 text-center disabled:opacity-50 disabled:cursor-not-allowed">
          <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
          <div className="text-sm font-medium">{uploading ? "Uploading..." : "Upload presentation"}</div>
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
            <div className="p-4 space-y-3">
              <div className="w-full px-3 py-2 rounded-lg bg-input/50 border border-border text-sm font-medium truncate">{p.title}</div>
              <div className="flex items-center justify-between gap-2">
                <div className="px-3 py-2 rounded-lg bg-input/50 border border-border text-xs flex-1">{p.date || "-"}</div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSelectedFile(p)}
                    className="h-8 w-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition flex items-center justify-center"
                    title="Preview presentation"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <a
                    href={p.fileUrl || "#"}
                    download={p.title || "presentation"}
                    className="h-8 w-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition flex items-center justify-center"
                    title="Download presentation"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={() => removeItem(p._id)}
                    disabled={deletingId === p._id}
                    className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}

      {/* Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 animate-in fade-in duration-200">
          <div className="w-[calc(100vw-1rem)] h-[calc(100vh-2rem)] max-w-full flex flex-col bg-card rounded-2xl border border-border shadow-2xl animate-in zoom-in-95 duration-200">
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
              {canPreviewPdf(selectedFile) ? (
                <iframe
                  src={selectedFile.fileUrl}
                  width="100%"
                  height="100%"
                  className="w-full h-full border-none"
                  title="PDF preview"
                />
              ) : selectedFile.fileUrl ? (
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
    </div>
  );
}
