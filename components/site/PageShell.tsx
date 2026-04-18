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
      <main className="flex-1 pt-24">
        {(breadcrumbs || title) && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 mb-8 sm:mb-12">
            <div className="rounded-[28px] border border-white/10 bg-black/20 backdrop-blur-md shadow-[var(--shadow-card)] px-5 sm:px-8 py-6 sm:py-8">
              {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
              {eyebrow && (
                <div className="inline-flex items-center gap-2 px-3 py-1 mt-5 rounded-full bg-white/8 border border-white/10 text-xs uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  {eyebrow}
                </div>
              )}
              {title && (
                <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-white">
                  {title}
                </h1>
              )}
              {description && (
                <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/70 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </section>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}
