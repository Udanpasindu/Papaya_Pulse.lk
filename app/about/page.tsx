"use client";

import Image from "next/image";
import { Mail, Linkedin, Github } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useApi } from "@/hooks/use-api";
import type { TeamMemberDTO } from "@/types/content";

export default function AboutPage() {
  const { data, loading, error } = useApi<TeamMemberDTO[]>("/api/team", "no-store");

  const researchers = (data || []).slice(0, 4);
  const supervisors = (data || []).slice(4);

  return (
    <PageShell
      breadcrumbs={[{ label: "About Us" }]}
      eyebrow="The Team"
      title="People behind the pulse"
      description="A four-person research team supported by experienced supervisors, united by a shared mission to bring AI to smallholder agriculture."
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-20 space-y-16">
        {loading && <p className="text-sm text-muted-foreground">Loading team...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        <section>
          <h2 className="text-xs uppercase tracking-[0.2em] text-primary mb-6">Researchers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {researchers.map((m) => (
              <PersonCard key={m._id || m.email} {...m} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-[0.2em] text-primary mb-6">Supervisors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
            {supervisors.map((m) => (
              <PersonCard key={m._id || m.email} {...m} large />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function PersonCard({
  name,
  role,
  email,
  image,
  large = false,
}: {
  name: string;
  role: string;
  email: string;
  image: string;
  large?: boolean;
}) {
  return (
    <div className="group rounded-3xl overflow-hidden border border-border bg-card shadow-[var(--shadow-card)] hover-lift">
      <div className={`relative ${large ? "aspect-[4/3]" : "aspect-square"} overflow-hidden`}>
        <Image src={image || "/assets/team-1.jpg"} alt={name} fill className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/8 to-transparent" />
      </div>
      <div className="p-5 bg-gradient-to-b from-card to-muted/70">
        <h3 className="font-display font-bold text-lg">{name}</h3>
        <p className="text-xs text-primary uppercase tracking-wider mt-1">{role}</p>
        <div className="flex items-center gap-2 mt-4">
          <a href={`mailto:${email}`} className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:bg-primary/15 hover:border-primary/30 transition" aria-label={`Email ${name}`}>
            <Mail className="h-4 w-4" />
          </a>
          <a href="#" className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:bg-primary/15 hover:border-primary/30 transition">
            <Linkedin className="h-4 w-4" />
          </a>
          <a href="#" className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:bg-primary/15 hover:border-primary/30 transition">
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
