import type { Metadata } from "next";
import "./globals.css";
import { TeamProvider } from "@/lib/TeamContext";
import { Sidebar, MobileTopBar, MobileBottomNav } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "F1 Box Box",
  description: "Your Formula 1 dashboard — live standings, races, and results",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TeamProvider>
          <div className="flex min-h-screen">
            {/* Desktop sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen md:ml-[220px]">
              {/* Mobile top bar */}
              <MobileTopBar />

              <main className="flex-1 pt-14 md:pt-0 pb-16 md:pb-0">
                {children}
              </main>

              <footer
                className="py-6 px-6 hidden md:flex items-center justify-between"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <p className="font-mono-f1 text-[9px] tracking-[0.22em] uppercase text-white/15">
                  F1 Box Box · {new Date().getFullYear()}
                </p>
                <p className="font-mono-f1 text-[9px] tracking-[0.18em] uppercase text-white/12">
                  Data via Jolpica / Ergast · Not affiliated with Formula 1
                </p>
              </footer>
            </div>

            {/* Mobile bottom nav */}
            <MobileBottomNav />
          </div>
        </TeamProvider>
      </body>
    </html>
  );
}
