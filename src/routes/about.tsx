import { createFileRoute } from "@tanstack/react-router";
import { Mail, Linkedin, Github } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { TEAM, SUPERVISORS } from "@/lib/site-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — PapayaPulse" },
      {
        name: "description",
        content: "Meet the team of researchers and supervisors building PapayaPulse.",
      },
      { property: "og:title", content: "About Us — PapayaPulse" },
      {
        property: "og:description",
        content: "The minds behind a smart farming framework for papaya cultivation.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell
      breadcrumbs={[{ label: "About Us" }]}
      eyebrow="The Team"
      title="People behind the pulse"
      description="A four-person research team supported by experienced supervisors, united by a shared mission to bring AI to smallholder agriculture."
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-20 space-y-16">
        <section>
          <h2 className="text-xs uppercase tracking-[0.2em] text-primary mb-6">Researchers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((m, i) => (
              <PersonCard key={m.email} {...m} delay={i * 0.08} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-[0.2em] text-primary mb-6">Supervisors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
            {SUPERVISORS.map((m, i) => (
              <PersonCard key={m.email} {...m} delay={i * 0.08} large />
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
  delay,
  large = false,
}: {
  name: string;
  role: string;
  email: string;
  image: string;
  delay: number;
  large?: boolean;
}) {
  return (
    <div
      className="group glass rounded-3xl overflow-hidden hover-lift"
      style={{ animation: `fade-up 0.6s ease-out ${delay}s both` }}
    >
      <div className={`relative ${large ? "aspect-[4/3]" : "aspect-square"} overflow-hidden`}>
        <img
          src={image}
          alt={name}
          loading="lazy"
          width={512}
          height={512}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-lg">{name}</h3>
        <p className="text-xs text-primary uppercase tracking-wider mt-1">{role}</p>
        <div className="flex items-center gap-2 mt-4">
          <a
            href={`mailto:${email}`}
            className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:bg-primary/15 hover:border-primary/30 transition"
            aria-label={`Email ${name}`}
          >
            <Mail className="h-4 w-4" />
          </a>
          <a
            href="#"
            className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:bg-primary/15 hover:border-primary/30 transition"
            aria-label={`${name} on LinkedIn`}
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href="#"
            className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:bg-primary/15 hover:border-primary/30 transition"
            aria-label={`${name} on GitHub`}
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
