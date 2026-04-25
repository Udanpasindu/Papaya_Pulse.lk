import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Activity, ChevronDown } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SITE, MODULES, STATS } from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PapayaPulse — Smart Farming Framework for Papaya Cultivation" },
      {
        name: "description",
        content:
          "PapayaPulse is a research framework using AI for papaya quality grading, growth prediction, disease detection and market price forecasting.",
      },
      { property: "og:title", content: "PapayaPulse — Smart Farming Framework" },
      {
        property: "og:description",
        content: "AI-driven research framework for data-driven papaya cultivation.",
      },
      { property: "og:image", content: SITE.hero },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: SITE.hero },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={SITE.hero}
          alt="Smart papaya farm with AI overlays"
          className="w-full h-full object-cover opacity-40"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background" />
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      {/* Animated blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-blob" />
      <div
        className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-secondary/15 blur-3xl animate-blob"
        style={{ animationDelay: "5s" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 w-full">
        <div className="max-w-4xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs uppercase tracking-[0.18em] text-primary"
            style={{ animation: "fade-up 0.6s ease-out both" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <Sparkles className="h-3 w-3" />
            Smart Agriculture Research
          </div>

          <h1
            className="mt-6 text-5xl sm:text-7xl md:text-8xl font-display font-bold tracking-tight leading-[0.95]"
            style={{ animation: "fade-up 0.7s ease-out 0.1s both" }}
          >
            <span className="text-gradient">Papaya</span>
            <span className="text-foreground">Pulse</span>
          </h1>

          <p
            className="mt-6 text-xl sm:text-2xl md:text-3xl text-foreground/85 max-w-3xl leading-tight font-light"
            style={{ animation: "fade-up 0.7s ease-out 0.2s both" }}
          >
            {SITE.tagline}
          </p>

          <p
            className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed"
            style={{ animation: "fade-up 0.7s ease-out 0.3s both" }}
          >
            {SITE.abstract}
          </p>

          <div
            className="mt-10 flex flex-wrap gap-3"
            style={{ animation: "fade-up 0.7s ease-out 0.4s both" }}
          >
            <Link
              to="/domain"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-leaf text-primary-foreground font-medium hover:shadow-[var(--shadow-glow-strong)] transition-all"
            >
              View Research
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/"
              hash="core-modules"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass-strong text-foreground font-medium hover:bg-white/10 transition"
            >
              <Activity className="h-4 w-4" />
              Explore Features
            </Link>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        style={{ animation: "fade-in 1s ease-out 1s both" }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass-strong rounded-3xl p-6 sm:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="text-center"
                style={{ animation: `fade-up 0.6s ease-out ${i * 0.08}s both` }}
              >
                <div className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-gradient">
                  {s.value}
                </div>
                <div className="mt-2 text-xs sm:text-sm uppercase tracking-[0.15em] text-muted-foreground">
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

function Features() {
  return (
    <section id="core-modules" className="relative py-16 sm:py-28 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs uppercase tracking-[0.18em] text-primary mb-4">
            Core Modules
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight leading-[1.05]">
            Four AI modules.
            <br />
            <span className="text-gradient">One unified framework.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {MODULES.map((m, i) => (
            <div
              key={m.id}
              className="group relative glass rounded-3xl overflow-hidden hover-lift cursor-pointer"
              style={{ animation: `fade-up 0.7s ease-out ${i * 0.1}s both` }}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={m.image}
                  alt={m.title}
                  loading="lazy"
                  width={768}
                  height={480}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${m.accent} mix-blend-overlay`} />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              </div>
              <div className="p-6 sm:p-8 -mt-20 relative">
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2">
                  {m.short}
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold mb-3">{m.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {m.desc}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative glass-strong rounded-3xl overflow-hidden p-8 sm:p-16 text-center">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/15 blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight">
              Cultivating the
              <br />
              <span className="text-gradient">future of farming.</span>
            </h2>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              Explore our research, methodology, and the team behind PapayaPulse.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                to="/about"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-leaf text-primary-foreground font-medium hover:shadow-[var(--shadow-glow-strong)] transition-all"
              >
                Meet the Team
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl glass text-foreground font-medium hover:bg-white/10 transition"
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
