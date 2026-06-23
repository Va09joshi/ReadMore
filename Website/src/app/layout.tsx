import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";

const urbanist = Urbanist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReadMore | Premium Newspaper & Magazine Subscriptions",
  description: "Customize your newspaper deliveries. Flexible schedules, family profiles, and local language bundles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${urbanist.className} min-h-screen bg-white text-slate-900 antialiased flex flex-col selection:bg-blue-500/30`}>
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
