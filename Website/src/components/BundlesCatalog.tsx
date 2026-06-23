"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const bundles = [
  {
    id: "bundle-1",
    name: "The Executive Daily",
    description: "The Hindu (Mon-Fri) + Business Standard (Sat-Sun)",
    price: "₹499",
    period: "/month",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop",
    popular: true,
    accent: "bg-blue-600",
    textAccent: "text-blue-600",
    hoverBg: "hover:bg-blue-700"
  },
  {
    id: "bundle-2",
    name: "Regional Connect",
    description: "Times of India + Daily Thanthi (All Days)",
    price: "₹349",
    period: "/month",
    image: "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1000&auto=format&fit=crop",
    popular: false,
    accent: "bg-amber-500",
    textAccent: "text-amber-600",
    hoverBg: "hover:bg-amber-600"
  },
  {
    id: "bundle-3",
    name: "The Weekend Reader",
    description: "Sunday Times + The Economist (Print edition)",
    price: "₹899",
    period: "/month",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1000&auto=format&fit=crop",
    popular: false,
    accent: "bg-rose-600",
    textAccent: "text-rose-600",
    hoverBg: "hover:bg-rose-700"
  }
]

export function BundlesCatalog() {
  return (
    <section className="py-24 bg-[#eeeeee] border-b border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b-4 border-black pb-6"
        >
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black font-serif uppercase tracking-tighter text-black mb-2">
              Curated Collections
            </h2>
            <p className="text-lg text-slate-600 font-serif italic">
              Hand-picked combinations based on popular reading habits.
            </p>
          </div>
          <button className="uppercase tracking-widest text-xs font-bold border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors bg-white shadow-[4px_4px_0px_0px_#202940] active:translate-y-1 active:shadow-none">
            View All Catalogs
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bundles.map((bundle, index) => (
            <motion.div 
              key={bundle.id} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group border-2 border-black bg-white flex flex-col shadow-[4px_4px_0px_0px_#202940] hover:shadow-[12px_12px_0px_0px_#202940] hover:-translate-y-2 transition-all duration-300 relative"
            >
              <div className="relative aspect-video overflow-hidden border-b-2 border-black bg-slate-100">
                <Image 
                  src={bundle.image} 
                  alt={bundle.name} 
                  fill 
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                
                {bundle.popular && (
                  <div className={`absolute top-0 right-0 ${bundle.accent} text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border-b-2 border-l-2 border-black`}>
                    Editor's Choice
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1 relative">
                
                {/* Decorative colored line */}
                <div className={`absolute top-0 left-0 w-full h-1 ${bundle.accent}`} />
                
                <h3 className="text-2xl font-black text-black mb-2 font-serif leading-tight group-hover:underline decoration-2 underline-offset-4">{bundle.name}</h3>
                <p className="text-slate-600 text-sm mb-6 flex-1 font-serif">{bundle.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-black/20 mt-auto">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-black ${bundle.textAccent}`}>{bundle.price}</span>
                    <span className="text-slate-500 text-xs font-serif italic">{bundle.period}</span>
                  </div>
                  <button className={`border-2 border-black text-black bg-white text-xs font-bold tracking-widest uppercase px-4 py-2 ${bundle.hoverBg} hover:text-white transition-colors shadow-[2px_2px_0px_0px_#202940] active:translate-y-0.5 active:shadow-none`}>
                    Subscribe
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
