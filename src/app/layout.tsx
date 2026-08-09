import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Agent Workflow Builder",
  description: "n8n-inspired workflow builder for AI agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen flex overflow-hidden bg-canvas-bg text-foreground relative`}>
        {/* Ambient Orange Glow */}
        <div className="pointer-events-none fixed left-1/2 top-[-20%] -translate-x-1/2 w-[800px] h-[600px] bg-primary-500/10 blur-[120px] rounded-full z-0" />
        
        <div className="z-10 flex h-full w-full">
          <Sidebar />
          <main className="flex-1 h-full overflow-y-auto relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
