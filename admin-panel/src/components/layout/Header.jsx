"use client";

import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { toggleSidebar, setUser } = useAppStore();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-6 shadow-sm">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="rounded-md hover:bg-slate-100 text-slate-600">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 items-center gap-4">
        <form className="hidden md:block flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search anywhere..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </form>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100 text-slate-600">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 border-2 border-white" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-9 w-9 rounded-full border border-slate-200 hover:ring-2 hover:ring-slate-200 ml-2 p-0 inline-flex shrink-0 items-center justify-center cursor-pointer focus:outline-none transition-all">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs uppercase">
              AD
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-slate-200">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-medium text-slate-900">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem className="text-slate-600 cursor-pointer hover:bg-slate-50 rounded-md">Profile</DropdownMenuItem>
              <DropdownMenuItem className="text-slate-600 cursor-pointer hover:bg-slate-50 rounded-md">Settings</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem onClick={handleLogout} className="text-rose-600 font-medium cursor-pointer hover:bg-rose-50 rounded-md">Log out</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
