"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Save, Upload, Trash2 } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { apiSend } from "@/lib/api";
import type { HomeContentDTO } from "@/types/content";

export default function HomeAdminPage() {
  const { data, loading, error } = useApi<HomeContentDTO>("/api/home", "no-store");
  const [form, setForm] = useState<HomeContentDTO | null>(null);
  const [saved, setSaved] = useState("");
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (data) setForm({ ...data, gallery: data.gallery || [] });
  }, [data]);

  const save = async () => {
    if (!form) return;
    try {
      await apiSend("/api/home", "PUT", form);
      setSaved("Saved successfully.");
    } catch (err) {
      setSaved(err instanceof Error ? err.message : "Save failed.");
    }
  };

  const uploadGallery = async (files: FileList | null) => {
    if (!files || !form) return;
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const result = await apiSend<{ fileUrl: string }>("/api/upload", "POST", formData);
      uploaded.push(result.fileUrl);
    }

    setForm({ ...form, gallery: [...(form.gallery || []), ...uploaded] });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Home</div>
        <h1 className="font-display font-bold text-3xl text-white">Edit Home Content</h1>
      </div>

      {loading && <p className="text-sm text-white/55">Loading home content...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {form && (
        <div className="glass rounded-2xl p-6 space-y-6 border border-white/8">
          <Field label="Project Name" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-white/55">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-input/50 border border-white/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition resize-none text-sm text-white"
            />
          </div>
          <Field label="Hero Image URL" value={form.heroImage} onChange={(v) => setForm({ ...form, heroImage: v })} />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/55">Gallery Section</div>
                <p className="text-sm text-white/55 mt-1">Upload research photos for the home page gallery and then click Save Changes.</p>
              </div>
              <button
                onClick={() => galleryInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-[var(--shadow-glow)]"
              >
                <Upload className="h-4 w-4" /> Upload Images
              </button>
            </div>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => uploadGallery(e.target.files)}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(form.gallery || []).map((src, index) => (
                <div key={`${src}-${index}`} className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
                  <div className="relative aspect-[4/3]">
                    <Image src={src} alt={`Gallery image ${index + 1}`} fill className="object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, gallery: form.gallery.filter((_, i) => i !== index) })}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {(form.gallery || []).length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-5 text-center text-sm text-white/60">
                No gallery images yet. Click Upload Images to add photos.
              </div>
            )}
          </div>

          <button onClick={save} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-leaf text-primary-foreground font-medium text-sm hover:shadow-[var(--shadow-glow)] transition shadow-[var(--shadow-card)]">
            <Save className="h-4 w-4" /> Save Changes
          </button>
          {saved && <p className="text-xs text-white/55">{saved}</p>}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs uppercase tracking-wider text-white/55">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-input/50 border border-white/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition text-sm text-white" />
    </div>
  );
}
