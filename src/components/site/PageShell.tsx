import { Header } from "./Header";
import { Footer } from "./Footer";
import { Breadcrumbs } from "./Breadcrumbs";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Show breadcrumbs */
  breadcrumbs?: { label: string; to?: string }[];
  /** Eyebrow/badge text above the title */
  eyebrow?: string;
  /** Page title */
  title?: string;
  /** Description under the title */
  description?: string;
}

export function PageShell({ children, breadcrumbs, eyebrow, title, description }: Props) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-28">
        {(breadcrumbs || title) && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 mb-10 sm:mb-14">
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
            {eyebrow && (
              <div
                className="inline-flex items-center gap-2 px-3 py-1 mt-6 rounded-full glass text-xs uppercase tracking-[0.18em] text-primary"
                style={{ animation: "fade-up 0.5s ease-out both" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                {eyebrow}
              </div>
            )}
            {title && (
              <h1
                className="mt-4 text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-gradient"
                style={{ animation: "fade-up 0.6s ease-out 0.05s both" }}
              >
                {title}
              </h1>
            )}
            {description && (
              <p
                className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground"
                style={{ animation: "fade-up 0.6s ease-out 0.1s both" }}
              >
                {description}
              </p>
            )}
          </section>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}
