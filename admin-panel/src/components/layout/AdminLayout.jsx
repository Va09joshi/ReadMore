"use client";

import { useAppStore } from "@/store/useAppStore";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function AdminLayout({ children }) {
  const { sidebarOpen, user } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token && pathname !== '/login') {
      router.push('/login');
    } else {
      setIsAuthChecking(false);
    }
  }, [pathname, router]);

  if (isAuthChecking) {
    return <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center font-black uppercase tracking-widest">Loading...</div>;
  }

  if (pathname === '/login') {
    return (
      <main className="min-h-screen bg-[#faf9f6]">
        {children}
      </main>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div
        className={cn(
          "flex flex-col flex-1 overflow-hidden transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#faf9f6]">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
