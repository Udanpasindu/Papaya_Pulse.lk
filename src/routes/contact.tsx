import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — PapayaPulse" },
      {
        name: "description",
        content: "Get in touch with the PapayaPulse research team.",
      },
      { property: "og:title", content: "Contact — PapayaPulse" },
      {
        property: "og:description",
        content: "Reach out by form, email or phone.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 3500);
  };

  return (
    <PageShell
      breadcrumbs={[{ label: "Contact" }]}
      eyebrow="Get In Touch"
      title="Let's talk research"
      description="Questions, collaborations or feedback — we'd love to hear from you."
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Contact info & email template UI */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-3xl p-6 space-y-4">
              <ContactRow icon={Mail} label="Email" value="hello@papayapulse.lk" href="mailto:hello@papayapulse.lk" />
              <ContactRow icon={Phone} label="Phone" value="+94 71 234 5678" href="tel:+94712345678" />
              <ContactRow icon={MapPin} label="Location" value="Colombo, Sri Lanka" />
            </div>

            {/* Email template preview */}
            <div className="glass rounded-3xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border/40 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                </div>
                <span className="text-xs text-muted-foreground ml-2 font-mono">inbox › PapayaPulse</span>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">PapayaPulse Team</div>
                    <div className="text-xs text-muted-foreground">to you</div>
                  </div>
                  <div className="text-xs text-muted-foreground">Now</div>
                </div>
                <div className="font-medium">Re: Your inquiry</div>
                <p className="text-muted-foreground leading-relaxed">
                  Thanks for reaching out! Our team typically responds within 24 hours during weekdays.
                  We're excited to chat about your interest in PapayaPulse 🌱
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="glass rounded-3xl overflow-hidden h-48 relative">
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full animate-pulse-glow" />
                  <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-primary to-leaf flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Sri Lanka · 6.93°N 79.85°E
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="lg:col-span-3 glass rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="Your name"
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="you@example.com"
              />
            </div>
            <Field
              label="Subject"
              value={form.subject}
              onChange={(v) => setForm({ ...form, subject: v })}
              placeholder="What's this about?"
            />
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={6}
                placeholder="Tell us more..."
                className="w-full px-4 py-3 rounded-xl bg-input/50 border border-border focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition resize-none text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={sent}
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
        className="w-full px-4 py-3 rounded-xl bg-input/50 border border-border focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition text-sm"
      />
    </div>
  );
}
