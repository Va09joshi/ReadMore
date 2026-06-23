"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Edit3, Newspaper, Users, BarChart3, ArrowLeft } from "lucide-react"

export default function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navLinks = [
    { name: "Analytics", href: "/provider-dashboard", icon: BarChart3 },
    { name: "New Title", href: "/provider-dashboard/new-title", icon: Edit3 },
    { name: "Catalog", href: "/provider-dashboard/catalog", icon: Newspaper },
    { name: "Subscribers", href: "/provider-dashboard/subscribers", icon: Users },
  ]

  return (
    <div className="flex min-h-[calc(100vh-88px)] bg-[#F9F8F6] items-start">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r-4 border-black bg-white shrink-0 hidden md:flex flex-col sticky top-[88px] h-[calc(100vh-88px)] z-10">
        <div className="p-6 border-b-4 border-black bg-white shrink-0">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-black font-bold text-xs uppercase tracking-widest transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </Link>
          <h2 className="font-black font-serif text-2xl uppercase tracking-tighter text-black">
            Workspace
          </h2>
        </div>

        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-4 font-black uppercase tracking-widest text-xs transition-all border-2 mb-2 ${isActive
                  ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_#06202B] translate-x-1"
                  : "border-transparent text-slate-500 hover:text-black hover:border-black hover:bg-[#F9F8F6]"
                  }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            )
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="md:hidden border-b-4 border-black bg-white p-4 flex items-center justify-between sticky top-0 z-20">
          <Link href="/" className="text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-black font-serif uppercase tracking-tighter">Workspace</span>
          <div className="w-5" /> {/* Spacer */}
        </div>

        {/* Children Rendered Here */}
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
