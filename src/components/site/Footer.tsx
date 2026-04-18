import { Link } from "@tanstack/react-router";
import { Leaf, Mail, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border/40 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-leaf flex items-center justify-center">
                <Leaf className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-lg">PapayaPulse</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              A research framework bringing AI-driven precision to papaya cultivation —
              from seedling to market.
            </p>
            <div className="flex gap-2 mt-4">
              {[
                { Icon: Mail, href: "mailto:hello@papayapulse.lk" },
                { Icon: Github, href: "#" },
                { Icon: Linkedin, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:bg-primary/15 hover:border-primary/30 transition"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-3">Project</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/domain" className="hover:text-primary transition">Domain</Link></li>
              <li><Link to="/milestones" className="hover:text-primary transition">Milestones</Link></li>
              <li><Link to="/documents" className="hover:text-primary transition">Documents</Link></li>
              <li><Link to="/presentations" className="hover:text-primary transition">Presentations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-3">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition">Contact</Link></li>
              <li><Link to="/admin/login" className="hover:text-primary transition">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/40">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PapayaPulse Research Project. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            v1.0.0 · Smart Agriculture
          </p>
        </div>
      </div>
    </footer>
  );
}
