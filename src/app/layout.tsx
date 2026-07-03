import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "promptc OS · AI Secret Sauce Wiki",
  description:
    "Interactive wiki-walkthrough and knowledge base of AI prompts, modifiers, animals, design combos, skill stacks, monetization recipes, and ecosystem blueprints. Mobile-first. Copy-paste ready.",
  keywords: [
    "AI prompts", "prompt engineering", "design combos", "skill stacks",
    "monetization", "MCP", "agentic tools", "workflow patterns", "promptc OS",
  ],
  authors: [{ name: "promptc OS · powerUP" }],
  openGraph: {
    title: "promptc OS · AI Secret Sauce Wiki",
    description: "Interactive wiki of AI prompts, design combos, skill stacks, monetization recipes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${dmSans.variable} ${dmMono.variable} ${bebas.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
