"use client";

import Link from "next/link";
import { FileText, Calendar, Users, Presentation, TrendingUp, CheckCircle2, Mail } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import type { ContactMessageDTO, MilestoneDTO } from "@/types/content";

type AdminSummary = {
  milestones: MilestoneDTO[];
  documents: number;
  presentations: number;
  team: number;
  contacts: number;
};

export default function AdminDashboard() {
  const { data: summary } = useApi<AdminSummary>("/api/admin/summary", "no-store");
  const { data: recentMessages } = useApi<ContactMessageDTO[]>("/api/contact?limit=5", "no-store");

  const milestones = summary?.milestones || [];
  const completedMilestones = milestones.filter((m) => m.status === "completed").length;

  const stats = [
    { label: "Milestones", value: `${completedMilestones}/${milestones.length}`, icon: Calendar, accent: "text-primary" },
    { label: "Documents", value: summary?.documents || 0, icon: FileText, accent: "text-secondary" },
    { label: "Presentations", value: summary?.presentations || 0, icon: Presentation, accent: "text-leaf" },
    { label: "Team Members", value: summary?.team || 0, icon: Users, accent: "text-pulp" },
    { label: "Contact Messages", value: summary?.contacts || 0, icon: Mail, accent: "text-primary" },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Dashboard</div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">Welcome back, admin</h1>
        <p className="text-sm text-white/65 mt-2">Here is what is happening with PapayaPulse today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5 hover-lift border border-white/8">
            <div className="flex items-center justify-between mb-3">
              <s.icon className={`h-5 w-5 ${s.accent}`} />
              <TrendingUp className="h-3.5 w-3.5 text-white/45" />
            </div>
            <div className="text-3xl font-display font-bold text-white">{s.value}</div>
            <div className="text-xs uppercase tracking-wider text-white/55 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 border border-white/8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-white">Quick Manage</h2>
          <span className="text-xs text-white/55">Open editor pages</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link href="/admin/home" className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-white hover:bg-primary/15 transition">
            Home Content + Gallery
          </Link>
          <Link href="/admin/team" className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white hover:bg-white/[0.06] transition">
            Team Members
          </Link>
          <Link href="/admin/domain" className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white hover:bg-white/[0.06] transition">
            Research Flow
          </Link>
          <Link href="/admin/documents" className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white hover:bg-white/[0.06] transition">
            Documents
          </Link>
          <Link href="/admin/presentations" className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white hover:bg-white/[0.06] transition">
            Presentations
          </Link>
          <Link href="/admin/milestones" className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white hover:bg-white/[0.06] transition">
            Milestones
          </Link>
          <Link href="/admin/contact" className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white hover:bg-white/[0.06] transition">
            Contact Messages
          </Link>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-white">Recent Contact Messages</h2>
          <Link href="/admin/contact" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {(recentMessages || []).length === 0 && <div className="text-sm text-white/55">No new contact messages.</div>}
          {(recentMessages || []).map((message) => (
            <div key={message._id || `${message.email}-${message.name}`} className="p-3 rounded-xl bg-white/[0.03] border border-white/8">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{message.name}</p>
                  <p className="text-xs text-white/60 truncate">{message.email}</p>
                </div>
                <span className="text-xs text-white/45 shrink-0">
                  {message.createdAt ? new Date(message.createdAt).toLocaleDateString() : "-"}
                </span>
              </div>
              <p className="text-xs text-white/70 mt-2 line-clamp-2 whitespace-pre-wrap">{message.message}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-white">Recent Milestones</h2>
          <span className="text-xs text-white/55">Live data</span>
        </div>
        <div className="space-y-3">
          {milestones.slice(0, 4).map((m) => (
            <div key={m._id || m.title} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/8">
              <div className="h-9 w-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate text-white">{m.title}</div>
                <div className="text-xs text-white/55">{new Date(m.date).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
