"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Activity, ChevronDown, Code2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useApi } from "@/hooks/use-api";
import type { DomainContentDTO, HomeContentDTO } from "@/types/content";

const TECH_ICON_MAP: Record<string, string> = {
  python: "python",
  tensorflow: "tensorflow",
  pytorch: "pytorch",
  opencv: "opencv",
  fastapi: "fastapi",
  react: "react",
  typescript: "typescript",
  postgresql: "postgresql",
  docker: "docker",
  aws: "amazonaws",
  "edge tpu": "google",
  prophet: "meta",
};

function getTechIconUrl(name: string) {
  const key = name.trim().toLowerCase();
  const slug = TECH_ICON_MAP[key];
  if (!slug) return "";
  return `https://cdn.simpleicons.org/${slug}/14d2d6`;
}

function TechnologyTag({ name }: { name: string }) {
  const [iconError, setIconError] = useState(false);
  const iconUrl = getTechIconUrl(name);

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/12 border border-primary/20 text-xs text-white/90">
      {!iconError && iconUrl ? (
        <img
          src={iconUrl}
          alt={`${name} icon`}
          className="h-3.5 w-3.5 object-contain"
          onError={() => setIconError(true)}
        />
      ) : (
        <Code2 className="h-3.5 w-3.5 text-primary" />
      )}
      <span>{name}</span>
    </span>
  );
}

export default function HomePage() {
  const { data, loading, error } = useApi<HomeContentDTO>("/api/home", "no-store");
  const { data: domain } = useApi<DomainContentDTO>("/api/domain", "no-store");

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero data={data} loading={loading} error={error} />
        <ResearchFlow domain={domain} />
        <Stats data={data} />
        <Features data={data} />
        <Gallery images={data?.gallery || []} />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Hero({ data, loading, error }: { data: HomeContentDTO | null; loading: boolean; error: string }) {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={data?.heroImage || "/assets/hero-papaya.jpg"}
          alt="Smart papaya farm with AI overlays"
          className="w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/48 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(20,210,214,0.12),transparent_42%)]" />
        <div className="absolute inset-0 grid-bg opacity-12" />
      </div>

      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/18 blur-3xl animate-blob" />
      <div
        className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl animate-blob"
        style={{ animationDelay: "5s" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 w-full">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <Sparkles className="h-3 w-3" />
            Smart Agriculture Research
          </div>

          <h1 className="mt-6 text-5xl sm:text-7xl md:text-8xl font-display font-bold tracking-tight leading-[0.95]">
            <span className="text-white">{data?.title || "PapayaPulse"}</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed">
            {loading ? "Loading content..." : error ? error : data?.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/domain"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-[var(--shadow-card)] hover:opacity-90 transition-all"
            >
              View Research
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/milestones"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white font-medium backdrop-blur-md shadow-[var(--shadow-card)] hover:bg-white/15 transition"
            >
              <Activity className="h-4 w-4" />
              Explore Features
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </div>
    </section>
  );
}

function Stats({ data }: { data: HomeContentDTO | null }) {
  const stats = data?.stats || [];
  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass-strong rounded-3xl p-6 sm:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white">
                  {s.value}
                </div>
                <div className="mt-2 text-xs sm:text-sm uppercase tracking-[0.15em] text-white/55">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Features({ data }: { data: HomeContentDTO | null }) {
  const modules = data?.features || [];
  return (
    <section className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/8 border border-white/10 text-xs uppercase tracking-[0.18em] text-white/80 mb-4 backdrop-blur-md">
            Core Modules
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight leading-[1.05]">
            Four AI modules.
            <br />
            <span className="text-gradient">One unified framework.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {modules.map((m) => (
            <div key={m.id} className="group relative rounded-3xl overflow-hidden border border-white/10 bg-card shadow-[var(--shadow-card)] hover-lift cursor-pointer">
              <div className="aspect-[16/10] overflow-hidden relative">
                <Image
                  src={m.image}
                  alt={m.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${m.accent} mix-blend-overlay`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-black/8 to-transparent" />
              </div>
              <div className="p-6 sm:p-8 relative -mt-14 bg-gradient-to-b from-card/5 to-card/95 backdrop-blur-sm">
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2">{m.short}</div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold mb-3">{m.title}</h3>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResearchFlow({ domain }: { domain: DomainContentDTO | null }) {
  const steps = [
    { title: "Literature Survey", value: (domain?.literature || []).join(" "), type: "paragraph" as const },
    { title: "Research Gap", value: (domain?.researchGap || []).join(" "), type: "paragraph" as const },
    { title: "Research Problem", value: domain?.problem || "", type: "text" as const },
    { title: "Proposed Solution", value: domain?.proposedSolution || "", type: "text" as const },
    { title: "Research Objectives", value: domain?.objectives || [], type: "chips" as const },
    { title: "Research Approach", value: domain?.researchApproach || "", type: "text" as const },
    { title: "System Architecture", value: domain?.systemArchitecture || "", type: "text" as const },
    { title: "Methodology", value: domain?.methodology || [], type: "timeline" as const },
    { title: "Technologies Used", value: domain?.technologies || [], type: "tags" as const },
  ];

  return (
    <section className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/8 border border-white/10 text-xs uppercase tracking-[0.18em] text-white/80 mb-4 backdrop-blur-md">
            Research Flow
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight leading-[1.05] text-white">
            From survey to system.
            <br />
            <span className="text-gradient">A full research story.</span>
          </h2>
          <p className="mt-5 text-sm sm:text-base text-white/65 max-w-2xl">
            The home page now walks through the research in sequence so visitors can understand the problem, solution and execution path in one flow.
          </p>
        </div>

        <div className="max-w-6xl space-y-5 sm:space-y-6">
          {steps.map((step, index) => (
            <div key={step.title} className="group rounded-3xl border border-white/10 bg-card/90 p-6 sm:p-8 shadow-[var(--shadow-card)] hover-lift">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/8 border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/75">
                  Step {index + 1}
                </div>
                <div className="h-9 w-9 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-display font-bold">
                  0{index + 1}
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">{step.title}</h3>

              {step.type === "text" && (
                <p className="text-sm sm:text-base text-white/68 leading-relaxed">{step.value}</p>
              )}

              {step.type === "paragraph" && <p className="text-sm sm:text-base text-white/68 leading-relaxed">{step.value}</p>}

              {step.type === "chips" && (
                <div className="flex flex-wrap gap-2">
                  {step.value.map((item: string) => (
                    <span key={item} className="px-3 py-1 rounded-full bg-white/8 border border-white/10 text-xs text-white/75">
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {step.type === "timeline" && (
                <div className="space-y-3">
                  {step.value.map((item: { phase: string; desc: string }) => (
                    <div key={item.phase} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <div className="text-sm font-medium text-white mb-1">{item.phase}</div>
                      <p className="text-sm text-white/65 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {step.type === "tags" && (
                <div className="flex flex-wrap gap-2">
                  {step.value.map((item: string) => (
                    <TechnologyTag key={item} name={item} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ images }: { images: string[] }) {
  return (
    <section className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/8 border border-white/10 text-xs uppercase tracking-[0.18em] text-white/80 mb-4 backdrop-blur-md">
            Research Gallery
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight leading-[1.05] text-white">
            Field work,
            <br />
            <span className="text-gradient">dataset and progress photos.</span>
          </h2>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {images.slice(0, 8).map((src, index) => (
              <div key={`${src}-${index}`} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card shadow-[var(--shadow-card)] hover-lift">
                <div className="relative aspect-[4/3]">
                  <img
                    src={src}
                    alt={`Research gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/12 to-transparent" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/[0.02] p-8 sm:p-10 text-center">
            <p className="text-white/80 text-sm sm:text-base">No gallery images yet.</p>
            <p className="text-white/55 text-xs sm:text-sm mt-2">Admin can upload images from Admin / Home / Gallery.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-16 text-center border border-white/10 bg-gradient-to-br from-card via-muted to-background shadow-[var(--shadow-card)]">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/12 blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight">
              Cultivating the
              <br />
              <span className="text-gradient">future of farming.</span>
            </h2>
            <p className="mt-6 text-base sm:text-lg text-white/70 max-w-xl mx-auto">
              Explore our research, methodology, and the team behind PapayaPulse.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                href="/about"
                className="px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-[var(--shadow-card)] hover:opacity-90 transition-all"
              >
                Meet the Team
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white font-medium backdrop-blur-md shadow-[var(--shadow-card)] hover:bg-white/15 transition"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
