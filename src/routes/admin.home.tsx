import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { SITE } from "@/lib/site-data";

export const Route = createFileRoute("/admin/home")({
  component: HomeAdmin,
});

function HomeAdmin() {
  const [data, setData] = useState({ name: SITE.name, tagline: SITE.tagline, abstract: SITE.abstract });
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Home</div>
        <h1 className="font-display font-bold text-3xl">Edit Home Content</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Change the headline, tagline and abstract shown on the homepage.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <Field label="Project Name" value={data.name} onChange={(v) => setData({ ...data, name: v })} />
        <Field label="Tagline" value={data.tagline} onChange={(v) => setData({ ...data, tagline: v })} />
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Abstract</label>
          <textarea
            value={data.abstract}
            onChange={(e) => setData({ ...data, abstract: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-input/50 border border-border focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition resize-none text-sm"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={save}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-leaf text-primary-foreground font-medium text-sm hover:shadow-[var(--shadow-glow)] transition"
          >
            <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save Changes"}
          </button>
          <button
            onClick={() => setData({ name: SITE.name, tagline: SITE.tagline, abstract: SITE.abstract })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-sm hover:bg-white/10 transition"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-input/50 border border-border focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition text-sm"
      />
    </div>
  );
}
