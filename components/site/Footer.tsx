import Link from "next/link";
import { Leaf, Mail, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/20 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shadow-[var(--shadow-glow)]">
                <Leaf className="h-5 w-5 text-primary" strokeWidth={2.5} />
              </div>
              <span className="font-display font-semibold text-lg text-white">PapayaPulse</span>
            </div>
            <p className="text-sm text-white/68 leading-relaxed">
              A research framework bringing AI-driven precision to papaya cultivation from seedling to market.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="font-medium text-white mb-3">Project</h4>
              <ul className="space-y-2 text-white/68">
                <li><Link href="/domain" className="hover:text-primary transition">Domain</Link></li>
                <li><Link href="/milestones" className="hover:text-primary transition">Milestones</Link></li>
                <li><Link href="/documents" className="hover:text-primary transition">Documents</Link></li>
                <li><Link href="/presentations" className="hover:text-primary transition">Presentations</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-white mb-3">Connect</h4>
              <ul className="space-y-2 text-white/68">
                <li><Link href="/about" className="hover:text-primary transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition">Contact</Link></li>
                <li><Link href="/admin/login" className="hover:text-primary transition">Admin</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/55">© {new Date().getFullYear()} PapayaPulse Research Project. All rights reserved.</p>
          <p className="text-xs text-white/55">Premium research portal</p>
        </div>
      </div>
    </footer>
  );
}
