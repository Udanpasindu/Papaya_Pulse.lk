"use client";

import { useState } from "react";
import { Mail, Trash2 } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { apiSend } from "@/lib/api";
import type { ContactMessageDTO } from "@/types/content";

export default function ContactMessagesAdminPage() {
  const { data, loading, error, setData } = useApi<ContactMessageDTO[]>("/api/contact", "no-store");
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string>("");

  const items = data || [];

  const remove = async (id: string | undefined) => {
    if (!id) {
      setMessage("Cannot delete: missing message ID.");
      return;
    }

    try {
      setDeletingId(id);
      setMessage("");
      await apiSend(`/api/contact/${id}`, "DELETE");
      setData((prev) => (prev || []).filter((item) => item._id !== id));
      setMessage("Message deleted.");
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
    <div className="space-y-6 max-w-6xl">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Inbox</div>
        <h1 className="font-display font-bold text-3xl text-white">Contact Messages</h1>
      </div>

      {loading && <p className="text-sm text-white/55">Loading messages...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="glass rounded-2xl overflow-hidden border border-white/8">
        <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between">
          <h2 className="font-display font-bold text-base text-white">All Messages</h2>
          <span className="text-xs text-white/55">{items.length} total</span>
        </div>

        <div className="divide-y divide-white/8">
          {items.length === 0 && <div className="p-6 text-sm text-white/55">No contact messages yet.</div>}

          {items.map((item) => (
            <div key={item._id || `${item.email}-${item.message.slice(0, 24)}`} className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-white/60">{item.email}</p>
                    </div>
                    <p className="text-xs text-white/50">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
                    </p>
                  </div>
                  <p className="text-sm text-white/85 whitespace-pre-wrap">{item.message}</p>
                </div>

                <button
                  onClick={() => remove(item._id)}
                  disabled={deletingId === item._id}
                  className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete message"
                >
                  <Trash2 className="h-4 w-4" />
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