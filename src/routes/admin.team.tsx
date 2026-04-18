import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Edit3, Trash2, ImageIcon, Plus } from "lucide-react";
import { TEAM, SUPERVISORS } from "@/lib/site-data";

type Person = { name: string; role: string; email: string; image: string };

export const Route = createFileRoute("/admin/team")({
  component: TeamAdmin,
});

function TeamAdmin() {
  const [team, setTeam] = useState<Person[]>([...TEAM]);
  const [sup, setSup] = useState<Person[]>([...SUPERVISORS]);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Team</div>
        <h1 className="font-display font-bold text-3xl">Manage Team Members</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Update names, roles, emails and profile images.
        </p>
      </div>

      <Section title="Researchers" people={team} setPeople={setTeam} />
      <Section title="Supervisors" people={sup} setPeople={setSup} />
    </div>
  );
}

function Section({
  title,
  people,
  setPeople,
}: {
  title: string;
  people: Person[];
  setPeople: (p: Person[]) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-xl">{title}</h2>
        <button
          onClick={() =>
            setPeople([
              ...people,
              { name: "New Member", role: "Role", email: "email@example.com", image: people[0]?.image ?? "" },
            ])
          }
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm hover:bg-primary/15 hover:border-primary/30 transition"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {people.map((p, i) => (
          <div key={i} className="glass rounded-2xl p-4 flex gap-4">
            <div className="relative h-20 w-20 rounded-xl overflow-hidden shrink-0 group">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer">
                <ImageIcon className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <input
                value={p.name}
                onChange={(e) => setPeople(people.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                className="w-full px-3 py-1.5 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-sm font-medium"
              />
              <input
                value={p.role}
                onChange={(e) => setPeople(people.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))}
                className="w-full px-3 py-1.5 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-xs text-muted-foreground"
              />
              <input
                value={p.email}
                onChange={(e) => setPeople(people.map((x, j) => (j === i ? { ...x, email: e.target.value } : x)))}
                className="w-full px-3 py-1.5 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-xs font-mono"
              />
            </div>
            <div className="flex flex-col gap-2">
              <button className="h-8 w-8 rounded-lg glass hover:bg-primary/15 hover:text-primary transition flex items-center justify-center">
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setPeople(people.filter((_, j) => j !== i))}
                className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition flex items-center justify-center"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
