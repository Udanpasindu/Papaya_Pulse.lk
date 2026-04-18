"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
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
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl p-6 space-y-4 border border-border bg-card shadow-[var(--shadow-card)]">
              <ContactRow icon={Mail} label="Email" value="hello@papayapulse.lk" href="mailto:hello@papayapulse.lk" />
              <ContactRow icon={Phone} label="Phone" value="+94 71 234 5678" href="tel:+94712345678" />
              <ContactRow icon={MapPin} label="Location" value="Colombo, Sri Lanka" />
            </div>
          </div>

          <form onSubmit={submit} className="lg:col-span-3 rounded-3xl p-6 sm:p-8 space-y-4 border border-border bg-card shadow-[var(--shadow-card)]">
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

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const Wrapper: React.ElementType = href ? "a" : "div";
  return (
    <Wrapper href={href} className="flex items-center gap-4 group">
      <div className="h-11 w-11 rounded-xl bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </Wrapper>
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
