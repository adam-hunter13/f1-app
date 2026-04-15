import type { Metadata } from "next";
import "./globals.css";
import { TeamProvider } from "@/lib/TeamContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "F1 Box Box",
  description: "Your Formula 1 dashboard — live standings, races, and results",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TeamProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-white/10 py-6 text-center text-xs text-white/30 font-mono-f1 tracking-widest uppercase">
              F1 Box Box &nbsp;·&nbsp; Data via Jolpica / Ergast API &nbsp;·&nbsp; Not affiliated with Formula 1
            </footer>
          </div>
        </TeamProvider>
      </body>
    </html>
  );
}
