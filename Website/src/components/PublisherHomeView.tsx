"use client"

import Link from "next/link"
import { ArrowRight, BarChart3, Edit3, Newspaper, Users } from "lucide-react"

export function PublisherHomeView() {
  return (
    <div className="bg-[#F9F8F6] min-h-screen py-20 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-[#202940]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-orange-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#202940]/10 text-[#202940] font-bold text-[10px] uppercase tracking-widest mb-6 border border-[#202940]/20">
            Publisher Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-serif tracking-tighter text-black uppercase mb-6 leading-[0.9]">
            Manage Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-[#202940] to-black">
              Empire
            </span>
          </h1>
          <p className="text-slate-600 font-serif italic text-lg md:text-xl">
            Welcome to your command center. Reach thousands of daily readers, manage your subscriptions, and analyze your growth.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          
          <Link href="/provider-dashboard/new-title" className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_0px_#06202B] hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#06202B] transition-all group flex flex-col">
            <div className="w-14 h-14 bg-[#f97316] border-2 border-black text-white flex items-center justify-center mb-6">
              <Edit3 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-xl uppercase tracking-tighter mb-2">New Title</h3>
            <p className="text-sm font-serif italic text-slate-500 mb-8 flex-1">
              Launch a brand new newspaper or magazine into the marketplace today.
            </p>
            <div className="text-[#202940] font-bold uppercase tracking-widest text-xs flex items-center gap-2 group-hover:gap-3 transition-all">
              Start Publishing <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link href="/provider-dashboard/catalog" className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_0px_#06202B] hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#06202B] transition-all group flex flex-col">
            <div className="w-14 h-14 bg-[#ec4899] border-2 border-black text-white flex items-center justify-center mb-6">
              <Newspaper className="w-6 h-6" />
            </div>
            <h3 className="font-black text-xl uppercase tracking-tighter mb-2">Catalog</h3>
            <p className="text-sm font-serif italic text-slate-500 mb-8 flex-1">
              View your existing live publications and update daily stock or pricing.
            </p>
            <div className="text-[#202940] font-bold uppercase tracking-widest text-xs flex items-center gap-2 group-hover:gap-3 transition-all">
              Manage Catalog <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link href="/provider-dashboard/subscribers" className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_0px_#06202B] hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#06202B] transition-all group flex flex-col">
            <div className="w-14 h-14 bg-[#3b82f6] border-2 border-black text-white flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-black text-xl uppercase tracking-tighter mb-2">Subscribers</h3>
            <p className="text-sm font-serif italic text-slate-500 mb-8 flex-1">
              See who is reading your content. Manage your active audience base.
            </p>
            <div className="text-[#202940] font-bold uppercase tracking-widest text-xs flex items-center gap-2 group-hover:gap-3 transition-all">
              View Audience <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link href="/provider-dashboard" className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_0px_#06202B] hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#06202B] transition-all group flex flex-col">
            <div className="w-14 h-14 bg-[#10b981] border-2 border-black text-white flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-xl uppercase tracking-tighter mb-2">Analytics</h3>
            <p className="text-sm font-serif italic text-slate-500 mb-8 flex-1">
              Track revenue, calculate earnings, and monitor engagement trends.
            </p>
            <div className="text-[#202940] font-bold uppercase tracking-widest text-xs flex items-center gap-2 group-hover:gap-3 transition-all">
              View Reports <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

        </div>

        {/* Big CTA Banner */}
        <div className="bg-black border-4 border-black p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-[8px_8px_0px_0px_#202940]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
          
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black font-serif tracking-tighter text-white uppercase mb-4">
              Ready to distribute?
            </h2>
            <p className="text-white/70 font-serif italic max-w-lg">
              Head over to your unified dashboard to securely upload your latest editions and dispatch them to thousands of readers.
            </p>
          </div>
          
          <Link href="/provider-dashboard" className="relative z-10 shrink-0 bg-white text-black font-bold uppercase tracking-widest text-sm px-8 py-5 border-2 border-white hover:bg-transparent hover:text-white transition-colors flex items-center gap-3">
            Open Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </div>
  )
}
