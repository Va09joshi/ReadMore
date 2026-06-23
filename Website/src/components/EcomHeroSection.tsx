"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Newspaper, Globe, Calendar, TrendingUp, BookOpen, ShieldCheck, Zap, Languages, CheckCircle2, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const editions = [
  {
    id: 0,
    vol: "Vol. I No. 1",
    region: "National Edition",
    date: "Monday, June 23, 2026",
    mainHeadline: "India's First Marketplace For Print Media Subscriptions",
    leadParagraph: "Connecting millions of readers with thousands of publishers. Subscribe to your favorite papers or list your publications to reach a nationwide audience.",
    column1Title: "For Subscribers",
    column1: "Manage all your newspaper and magazine subscriptions in one place. Mix and match titles, set vacation pauses, and pay a single monthly bill. Never deal with cash payments to local vendors again.",
    column2Title: "For Publishers",
    column2: "Reach readers beyond your traditional distribution network. List your publications on ReadMore to acquire new subscribers, manage recurring billing automatically, and access real-time readership analytics.",
    sidebarTitle: "The ReadMore Network",
    stats: [
      { icon: Users, label: "2.5M+ Active Readers", color: "bg-blue-600" },
      { icon: Newspaper, label: "500+ Partner Publishers", color: "bg-amber-500" },
      { icon: Globe, label: "Pan-India Delivery Network", color: "bg-rose-600" },
    ],
    image: "/images/platform_news.png",
    imageCaption: "A platform built to modernize India's print media distribution",
    pullQuote: "\"A single platform that solves the distribution headache for publishers and the management hassle for readers.\"",
    pullQuoteAuthor: "— The Media Times",
  },
  {
    id: 1,
    vol: "Vol. I No. 2",
    region: "Reader Edition",
    date: "Monday, June 23, 2026",
    mainHeadline: "Subscribe Once. Read Everything. Delivered Daily.",
    leadParagraph: "Build your perfect morning reading bundle. Choose from over 500+ national dailies, regional papers, and premium magazines.",
    column1Title: "Curate Your Bundle",
    column1: "Want The Hindu on weekdays and Mint on weekends? No problem. Add Forbes India to your monthly delivery? Done. Our flexible bundling lets you create the exact reading diet your family needs.",
    column2Title: "Complete Control",
    column2: "Going out of town? Hit 'Pause' on your app and deliveries stop instantly until you return. No wasted papers, no paying for what you didn't read. Switch your selected papers anytime.",
    sidebarTitle: "Reader Benefits",
    stats: [
      { icon: Calendar, label: "Flexible Delivery Days", color: "bg-emerald-600" },
      { icon: ShieldCheck, label: "One Unified Monthly Bill", color: "bg-purple-600" },
      { icon: CheckCircle2, label: "Guaranteed 7 AM Delivery", color: "bg-teal-600" },
    ],
    image: "/images/morning_news.png",
    imageCaption: "Your favorite daily newspapers delivered fresh every morning",
    pullQuote: "\"I cancelled three separate vendor payments and replaced them with one ReadMore bundle. Saves me so much time.\"",
    pullQuoteAuthor: "— Priya Sharma, Subscriber",
  },
  {
    id: 2,
    vol: "Vol. I No. 3",
    region: "Publisher Edition",
    date: "Monday, June 23, 2026",
    mainHeadline: "Digitize Your Print Distribution & Grow Your Readership",
    leadParagraph: "Join India's largest print media marketplace. We handle the subscription management, billing, and logistics so you can focus on journalism.",
    column1Title: "Automated Management",
    column1: "Say goodbye to manual ledger keeping. Our platform handles recurring payments, tracks active subscribers, manages vacation pauses, and processes renewals automatically. Get paid on time, every time.",
    column2Title: "Expand Your Reach",
    column2: "Your publication gets listed in front of millions of active readers looking for quality content. Use our analytics dashboard to understand reader demographics and track subscription growth in real-time.",
    sidebarTitle: "Publisher Features",
    stats: [
      { icon: TrendingUp, label: "Real-time Analytics Dashboard", color: "bg-indigo-600" },
      { icon: Zap, label: "Automated Recurring Billing", color: "bg-orange-500" },
      { icon: BookOpen, label: "Nationwide Reader Access", color: "bg-pink-600" },
    ],
    image: "/images/printing_press.png",
    imageCaption: "Empowering publishers with modern distribution tools",
    pullQuote: "\"Listing our regional paper on ReadMore increased our out-of-state subscriptions by 40% in just three months.\"",
    pullQuoteAuthor: "— Daily Thanthi Distribution Team",
  },
]

export function EcomHeroSection() {
  const [currentPage, setCurrentPage] = useState(0)
  const nextPage = () => setCurrentPage((prev) => (prev + 1) % editions.length)
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + editions.length) % editions.length)

  const active = editions[currentPage]

  const fadeIn: any = {
    hidden: { opacity: 0, y: 12 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
    }),
  }

  return (
    <section className="bg-[#F9F8F6] pt-8 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-black font-black uppercase tracking-tighter text-2xl md:text-3xl leading-none mb-1" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
              Featured Bundles
            </h2>
            <p className="text-slate-500 italic text-sm md:text-base" style={{ fontFamily: 'Georgia, serif' }}>
              Explore our curated newspaper collections.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 border border-slate-300 px-3 py-1 rounded-full">
              Page {currentPage + 1} of {editions.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={prevPage}
                className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                suppressHydrationWarning
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextPage}
                className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                suppressHydrationWarning
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Newspaper Canvas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="bg-white border-2 border-black relative"
          >

            {/* ═══ Masthead ═══ */}
            <div className="border-b border-black">
              {/* Top meta bar */}
              <div className="flex justify-between items-center text-[9px] sm:text-[10px] uppercase tracking-[0.15em] px-6 md:px-10 py-2 border-b border-black/30 text-slate-400 font-sans">
                <span className="font-semibold">{active.vol}</span>
                <span className="font-semibold hidden sm:inline">Est. 2026</span>
                <span className="font-semibold">{active.region}</span>
              </div>

              {/* Title */}
              <div className="px-6 md:px-10 py-6 md:py-10 text-center">
                <h1
                  className="text-6xl sm:text-7xl md:text-[110px] lg:text-[130px] font-black tracking-[-0.05em] uppercase leading-[0.82] text-[#202940]"
                  style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
                >
                  READMORE
                </h1>
              </div>

              {/* Sub-title bar */}
              <div className="flex justify-between items-center text-[9px] sm:text-[10px] uppercase tracking-[0.15em] px-6 md:px-10 py-2 border-t border-black/30 text-slate-400 font-sans">
                <span>Premium Newspaper & Magazine Subscriptions</span>
                <span className="hidden md:inline">{active.date}</span>
              </div>
            </div>

            {/* ═══ Main Content Grid ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-12">

              {/* ──── Left: Main Story Area (8 cols) ──── */}
              <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-black flex flex-col">

                {/* Headline */}
                <motion.div
                  custom={0}
                  variants={fadeIn}
                  initial="hidden"
                  animate="show"
                  className="px-6 md:px-10 pt-6 md:pt-8 pb-4 border-b border-black"
                >
                  <h2
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black leading-[1] tracking-tight text-black"
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  >
                    {active.mainHeadline}
                  </h2>
                  <p className="mt-4 text-base md:text-lg text-slate-700 leading-relaxed max-w-3xl" style={{ fontFamily: 'Georgia, serif' }}>
                    {active.leadParagraph}
                  </p>
                </motion.div>

                {/* Two-column article body */}
                <motion.div
                  custom={1}
                  variants={fadeIn}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black/20"
                >
                  <div className="px-6 md:px-10 py-6">
                    <h3 className="font-black text-sm uppercase tracking-widest text-[#202940] mb-3 font-sans">{active.column1Title}</h3>
                    <p className="text-[13px] md:text-sm text-slate-700 leading-[1.7] text-justify" style={{ fontFamily: 'Georgia, serif' }}>
                      <span className="font-black text-4xl float-left mr-2 mt-0.5 leading-[0.8] text-[#202940]" style={{ fontFamily: '"Playfair Display", serif' }}>
                        {active.column1.charAt(0)}
                      </span>
                      {active.column1.slice(1)}
                    </p>
                  </div>
                  <div className="px-6 md:px-10 py-6">
                    <h3 className="font-black text-sm uppercase tracking-widest text-[#202940] mb-3 font-sans">{active.column2Title}</h3>
                    <p className="text-[13px] md:text-sm text-slate-700 leading-[1.7] text-justify" style={{ fontFamily: 'Georgia, serif' }}>
                      <span className="font-black text-4xl float-left mr-2 mt-0.5 leading-[0.8] text-[#202940]" style={{ fontFamily: '"Playfair Display", serif' }}>
                        {active.column2.charAt(0)}
                      </span>
                      {active.column2.slice(1)}
                    </p>
                  </div>
                </motion.div>

                {/* Image + Pull Quote row */}
                <motion.div
                  custom={2}
                  variants={fadeIn}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-[1fr_280px] border-t border-black/20 flex-1"
                >
                  <div className="relative h-[250px] md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-black/20">
                    <Image
                      src={active.image}
                      alt="Newspaper delivery"
                      fill
                      unoptimized
                      priority
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-12 pb-3 px-4">
                      <p className="text-white/80 text-[10px] font-sans uppercase tracking-wider">{active.imageCaption}</p>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center bg-[#F9F8F6]">
                    <blockquote
                      className="text-base md:text-lg italic leading-relaxed text-slate-800 mb-4"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {active.pullQuote}
                    </blockquote>
                    <cite className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 not-italic">
                      {active.pullQuoteAuthor}
                    </cite>
                  </div>
                </motion.div>
              </div>

              {/* ──── Right Sidebar (4 cols) ──── */}
              <div className="lg:col-span-4">

                {/* Stats section */}
                <motion.div
                  custom={1}
                  variants={fadeIn}
                  initial="hidden"
                  animate="show"
                  className="p-6 md:p-8 border-b border-black/20"
                >
                  <h3
                    className="font-black text-xl uppercase tracking-tight mb-6 text-black border-b-2 border-[#202940] pb-2 inline-block"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    {active.sidebarTitle}
                  </h3>
                  <div className="space-y-5">
                    {active.stats.map((stat, idx) => {
                      const Icon = stat.icon
                      return (
                        <div key={idx} className="flex items-center gap-4 group cursor-default">
                          <div className={`w-10 h-10 ${stat.color} text-white flex items-center justify-center rounded-sm shrink-0 group-hover:scale-110 transition-transform`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-sm text-black uppercase tracking-tight">{stat.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>

                {/* CTA Box */}
                <motion.div
                  custom={2}
                  variants={fadeIn}
                  initial="hidden"
                  animate="show"
                  className="p-6 md:p-8 bg-[#202940] text-white"
                >
                  <h3 className="font-black text-2xl uppercase tracking-tight mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Start Reading Today
                  </h3>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    Browse 50+ publications. Pick your bundle. Get your first week free.
                  </p>
                  <Link
                    href="/catalog"
                    className="block w-full bg-white text-[#202940] font-bold text-center uppercase tracking-widest text-xs py-4 hover:bg-slate-100 transition-colors mb-3"
                  >
                    Browse Catalog →
                  </Link>
                  <Link
                    href="/publishers"
                    className="block w-full border border-white/40 text-white font-bold text-center uppercase tracking-widest text-xs py-4 hover:bg-white/10 transition-colors"
                  >
                    For Publishers
                  </Link>
                </motion.div>

                {/* Quick links / ticker */}
                <motion.div
                  custom={3}
                  variants={fadeIn}
                  initial="hidden"
                  animate="show"
                  className="p-6 md:p-8 border-t border-black/20"
                >
                  <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4 font-sans">Latest Updates</h4>
                  <ul className="space-y-3 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                    <li className="flex gap-2 items-start">
                      <span className="text-[#202940] font-black text-lg leading-none mt-0.5">•</span>
                      <span className="text-slate-700">Times of India now available for subscription in all editions</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-[#202940] font-black text-lg leading-none mt-0.5">•</span>
                      <span className="text-slate-700">Hindustan Times weekend bundle — 20% off this month</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-[#202940] font-black text-lg leading-none mt-0.5">•</span>
                      <span className="text-slate-700">Family plans now support up to 5 profiles per household</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-[#202940] font-black text-lg leading-none mt-0.5">•</span>
                      <span className="text-slate-700">Same-day delivery launched in 12 new cities across India</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
