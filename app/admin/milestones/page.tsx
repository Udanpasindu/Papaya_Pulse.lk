"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { apiSend } from "@/lib/api";
import type { MilestoneDTO } from "@/types/content";

export default function MilestonesAdminPage() {
  const { data, loading, error, setData } = useApi<MilestoneDTO[]>("/api/milestones", "no-store");
  const [message, setMessage] = useState("");

  const items = data || [];

  const createMilestone = async () => {
    try {
      const created = await apiSend<MilestoneDTO>("/api/milestones", "POST", {
        title: "New Milestone",
        date: new Date().toISOString().slice(0, 10),
        description: "Describe this milestone.",
        marks: 0,
        weight: "0%",
        status: "upcoming",
      });
      setData([...(items || []), created]);
      setMessage("Milestone added.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to add milestone.");
    }
  };

  const saveMilestone = async (id: string | undefined, payload: MilestoneDTO) => {
    if (!id) return;
    try {
      await apiSend(`/api/milestones/${id}`, "PUT", payload);
      setMessage("Milestone updated.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Update failed.");
    }
  };

  const removeMilestone = async (id: string | undefined) => {
    if (!id) return;
    try {
      await apiSend(`/api/milestones/${id}`, "DELETE");
      setData(items.filter((x) => x._id !== id));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Milestones</div>
          <h1 className="font-display font-bold text-3xl">Manage Milestones</h1>
        </div>
        <button onClick={createMilestone} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-leaf text-primary-foreground font-medium text-sm hover:shadow-[var(--shadow-glow)] transition">
          <Plus className="h-4 w-4" /> New Milestone
        </button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading milestones...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-3">
        {items.map((m, i) => (
          <div key={m._id || i} className="glass rounded-2xl p-5">
            <div className="grid lg:grid-cols-[1fr_auto_auto] gap-3 items-start">
              <div className="space-y-2">
                <input
                  defaultValue={m.title}
                  onBlur={(e) => saveMilestone(m._id, { ...m, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-sm font-medium"
                />
                <textarea
                  defaultValue={m.description}
                  onBlur={(e) => saveMilestone(m._id, { ...m, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-xs resize-none text-muted-foreground"
                />
              </div>
              <input type="date" defaultValue={m.date} onBlur={(e) => saveMilestone(m._id, { ...m, date: e.target.value })} className="px-3 py-2 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-xs w-36" />
              <button onClick={() => removeMilestone(m._id)} className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition flex items-center justify-center">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
