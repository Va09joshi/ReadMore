"use client"

import { ArrowRight, BarChart3, Newspaper, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function PublishersPage() {
  return (
    <div className="bg-[#eeeeee] min-h-screen relative overflow-hidden border-b-8 border-black">
      
      {/* Hero */}
      <section className="pt-24 pb-20 relative z-10 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="uppercase tracking-[0.2em] text-xs font-bold text-slate-500 font-serif mb-6"
          >
            B2B Distribution Network
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black font-serif tracking-tighter mb-8 text-black leading-[1.05] uppercase"
          >
            Digitize your delivery. <br />
            <span className="italic font-light text-slate-600">Reach millions.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 font-serif max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Join the platform that is redefining how readers consume physical and digital journalism. You write the news, we handle the logistics and subscriptions.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/publishers/register" className="bg-black hover:bg-[#202940] text-white px-8 py-4 uppercase tracking-widest text-sm font-bold transition-colors flex items-center justify-center border border-black hover:border-[#202940]">
              Start Selling <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <button className="bg-transparent border border-black text-black px-8 py-4 uppercase tracking-widest text-sm font-bold hover:bg-black hover:text-white transition-colors">
              Talk to Sales
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 border-2 border-black bg-white shadow-[8px_8px_0px_0px_#06202B] hover:-translate-y-2 transition-transform duration-300 group"
            >
              <div className="w-14 h-14 bg-[#3b82f6] text-white flex items-center justify-center mb-8 border border-black group-hover:opacity-90 transition-opacity">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black font-serif text-black mb-4 uppercase tracking-tighter">Zero Logistics Setup</h3>
              <p className="text-slate-700 font-serif leading-relaxed text-sm">
                Simply connect your existing local vendor network or use our centralized distribution hubs to scale instantly.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 border-2 border-black bg-white shadow-[8px_8px_0px_0px_#06202B] hover:-translate-y-2 transition-transform duration-300 group"
            >
              <div className="w-14 h-14 bg-[#f97316] text-white flex items-center justify-center mb-8 border border-black group-hover:opacity-90 transition-opacity">
                <Newspaper className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black font-serif text-black mb-4 uppercase tracking-tighter">Digital & Print</h3>
              <p className="text-slate-700 font-serif leading-relaxed text-sm">
                Offer your readers a seamless hybrid experience. Upload PDF editions and ship physical copies from one single dashboard.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 border-2 border-black bg-white shadow-[8px_8px_0px_0px_#06202B] hover:-translate-y-2 transition-transform duration-300 group"
            >
              <div className="w-14 h-14 bg-[#ec4899] text-white flex items-center justify-center mb-8 border border-black group-hover:opacity-90 transition-opacity">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black font-serif text-black mb-4 uppercase tracking-tighter">Audience Insights</h3>
              <p className="text-slate-700 font-serif leading-relaxed text-sm">
                Get deep, actionable analytics on reader retention, regional popularity, and granular digital interaction rates.
              </p>
            </motion.div>

          </div>
        </div>
      </section>
      
    </div>
  )
}
