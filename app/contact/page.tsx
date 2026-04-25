"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { apiSend } from "@/lib/api";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setLoading(true);
    setError("");

    try {
      await apiSend("/api/contact", "POST", {
        name: form.name,
        email: form.email,
        message: `${form.subject ? `[${form.subject}] ` : ""}${form.message}`,
      });
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      breadcrumbs={[{ label: "Contact" }]}
      eyebrow="Get In Touch"
      title="Let's talk research"
      description="Questions, collaborations or feedback - we'd love to hear from you."
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={submit} className="rounded-3xl p-6 sm:p-8 space-y-4 border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Your name" />
              <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@example.com" />
            </div>
            <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} placeholder="What's this about?" />
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={6}
                placeholder="Tell us more..."
                className="w-full px-4 py-3 rounded-xl bg-muted/60 border border-border focus:border-primary/40 focus:ring-2 focus:ring-primary/20 focus:outline-none transition resize-none text-sm"
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={sent || loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-leaf text-primary-foreground font-medium hover:shadow-[var(--shadow-glow)] transition disabled:opacity-70"
            >
              {sent ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Message sent
                </>
              ) : (
                <>
                  Send Message <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-muted/60 border border-border focus:border-primary/40 focus:ring-2 focus:ring-primary/20 focus:outline-none transition text-sm"
      />
    </div>
  );
}
