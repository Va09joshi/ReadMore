"use client"

import { EcomHeroSection } from "@/components/EcomHeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ShopGrid } from "@/components/ShopGrid";

import { PublisherHomeView } from "@/components/PublisherHomeView";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  if (user?.role === 'PROVIDER') {
    return <PublisherHomeView />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#eeeeee] relative overflow-hidden">
      <main className="flex-1 relative z-10">
        <EcomHeroSection />
        <FeaturesSection />
        <ShopGrid />

      </main>
    </div>
  );
}
