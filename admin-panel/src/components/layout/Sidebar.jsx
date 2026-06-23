"use client";

import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  ShoppingCart,
  CreditCard,
  Settings,
  Activity,
  Tags,
  MessageSquare,
  LifeBuoy,
  ChevronRight
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Activity Logs", href: "/activity-logs", icon: Activity },
  { name: "Users", href: "/users", icon: Users },
  { name: "Providers", href: "/providers", icon: Building2 },
  { name: "Products", href: "/products", icon: BookOpen },
  { name: "Categories", href: "/categories", icon: Tags },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { name: "Reviews", href: "/reviews", icon: MessageSquare },
  { name: "Support", href: "/support", icon: LifeBuoy },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const { sidebarOpen } = useAppStore();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 shadow-sm",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-slate-200 px-4 bg-white">
        {sidebarOpen ? (
          <span className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-black">M</div>
            Marketplace
          </span>
        ) : (
          <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-black text-sm">M</div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto custom-scrollbar bg-white">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                !sidebarOpen && "justify-center px-0"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
              )} />
              {sidebarOpen && (
                <div className="flex flex-1 items-center justify-between">
                  <span>{item.name}</span>
                  {isActive && <ChevronRight className="h-4 w-4 text-blue-600 opacity-50" />}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
