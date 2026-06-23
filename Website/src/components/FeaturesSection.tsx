"use client"

import { Calendar, Users, Globe, PauseCircle } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    title: "Flexible Delivery Days",
    description: "Receive The Hindu on weekdays and Business Standard only on weekends. You control exactly what arrives and when.",
    icon: Calendar,
    color: "bg-blue-600"
  },
  {
    title: "Family Profiles",
    description: "Different members can choose different magazines under one account. Dad gets Forbes, mom gets Vogue.",
    icon: Users,
    color: "bg-emerald-600"
  },
  {
    title: "Local Language Bundles",
    description: "Combine English dailies with regional newspapers in one seamless package. Stay connected to your roots.",
    icon: Globe,
    color: "bg-amber-500"
  },
  {
    title: "Easy Vacation Pauses",
    description: "Going out of town? Skip delivery during vacations with a single tap. No more calling vendors.",
    icon: PauseCircle,
    color: "bg-rose-600"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white border-b border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-b-4 border-black pb-6 mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black font-serif text-black tracking-tighter uppercase">
            The Modern Standard
          </h2>
          <p className="text-lg text-slate-600 font-serif mt-2 italic">
            Absolute flexibility. Zero hassle. The future of print media distribution.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group border-t border-black pt-6"
            >
              <div className={`w-12 h-12 ${feature.color} text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border border-black`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-black mb-3 font-serif leading-tight">
                {feature.title}
              </h3>
              <p className="text-slate-700 leading-relaxed font-serif text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
