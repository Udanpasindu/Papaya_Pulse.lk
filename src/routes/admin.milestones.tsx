import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Edit3, Calendar } from "lucide-react";
import { MILESTONES } from "@/lib/site-data";

type Milestone = (typeof MILESTONES)[number];

export const Route = createFileRoute("/admin/milestones")({
  component: MilestonesAdmin,
});

function MilestonesAdmin() {
  const [items, setItems] = useState<Milestone[]>([...MILESTONES]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Milestones</div>
          <h1 className="font-display font-bold text-3xl">Manage Milestones</h1>
          <p className="text-sm text-muted-foreground mt-2">Add, edit or delete milestone entries.</p>
        </div>
        <button
          onClick={() =>
            setItems([
              ...items,
              {
                id: `new-${Date.now()}`,
                title: "New Milestone",
                date: new Date().toISOString().slice(0, 10),
                description: "Describe this milestone.",
                marks: 0,
                weight: "0%",
                status: "upcoming",
              },
            ])
          }
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-leaf text-primary-foreground font-medium text-sm hover:shadow-[var(--shadow-glow)] transition"
        >
          <Plus className="h-4 w-4" /> New Milestone
        </button>
      </div>

      <div className="space-y-3">
        {items.map((m, i) => (
          <div key={m.id} className="glass rounded-2xl p-5">
            <div className="grid lg:grid-cols-[1fr_auto_auto_auto] gap-3 items-start">
              <div className="space-y-2">
                <input
                  value={m.title}
                  onChange={(e) =>
                    setItems(items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-sm font-medium"
                />
                <textarea
                  value={m.description}
                  onChange={(e) =>
                    setItems(items.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))
                  }
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-xs resize-none text-muted-foreground"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="date"
                    value={m.date}
                    onChange={(e) =>
                      setItems(items.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)))
                    }
                    className="pl-8 pr-2 py-2 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-xs w-36"
                  />
                </div>
                <input
                  type="number"
                  value={m.marks}
                  onChange={(e) =>
                    setItems(items.map((x, j) => (j === i ? { ...x, marks: Number(e.target.value) } : x)))
                  }
                  placeholder="Marks"
                  className="px-3 py-2 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-xs w-36"
                />
              </div>
              <select
                value={m.status}
                onChange={(e) =>
                  setItems(items.map((x, j) => (j === i ? { ...x, status: e.target.value } : x)))
                }
                className="px-3 py-2 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-xs"
              >
                <option value="upcoming">Upcoming</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <div className="flex gap-2">
                <button className="h-9 w-9 rounded-lg glass hover:bg-primary/15 hover:text-primary transition flex items-center justify-center">
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
