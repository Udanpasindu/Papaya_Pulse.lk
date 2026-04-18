import type { Metadata } from "next";
import "./globals.css";
import { AppChrome } from "@/components/AppChrome";

export const metadata: Metadata = {
  title: "PapayaPulse - Smart Farming Framework for Papaya Cultivation",
  description:
    "PapayaPulse is a research framework using AI for papaya quality grading, growth prediction, disease detection and market price forecasting.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
