"use client"

import { Check } from "lucide-react"
import { motion } from "framer-motion"

const plans = [
  {
    name: "Weekend Reader",
    price: "₹199",
    period: "/mo",
    description: "Perfect for catching up on days off.",
    features: ["Any 2 weekend dailies", "Digital magazine access", "Cancel anytime"],
    highlight: false,
    cta: "Select Plan",
  },
  {
    name: "Family Bundle",
    price: "₹599",
    period: "/mo",
    description: "The complete package for the whole house.",
    features: ["Up to 4 physical dailies", "2 Monthly Magazines", "4 Digital Profiles", "Vacation skip support"],
    highlight: true,
    cta: "Build Family Plan",
  },
  {
    name: "Digital + Print",
    price: "₹349",
    period: "/mo",
    description: "For the dedicated daily reader.",
    features: ["1 English + 1 Regional daily publisher", "Unlimited Digital Access", "Ad-free app experience"],
    highlight: false,
    cta: "Select Plan",
  },
]

export function SubscriptionSection() {
  return (
    <section className="py-24 bg-white border-b-8 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16 border-b-2 border-black pb-8"
        >
          <div className="uppercase tracking-[0.2em] text-xs font-bold text-slate-500 font-serif mb-4">
            Subscription Tiers
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-serif text-black uppercase tracking-tighter mb-4">
            Transparent Pricing
          </h2>
          <p className="text-lg text-slate-600 font-serif italic">
            Start with a base plan and customize your publications. No hidden delivery fees.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.name} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className={`relative flex flex-col p-8 border-2 border-black bg-white ${plan.highlight ? 'shadow-[12px_12px_0px_0px_#202940] md:-translate-y-4' : 'shadow-[8px_8px_0px_0px_#202940]'}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#202940] text-white text-[10px] font-bold uppercase tracking-widest py-1 px-4 border border-black">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6 border-b border-slate-200 pb-6">
                <h3 className="text-2xl font-black text-black mb-2 font-serif uppercase">{plan.name}</h3>
                <p className="text-slate-600 text-sm font-serif italic">{plan.description}</p>
              </div>
              
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-black text-black">{plan.price}</span>
                <span className="text-slate-500 font-serif italic">{plan.period}</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="mt-1 bg-black text-white p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-slate-800 font-serif text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full h-12 uppercase tracking-widest text-xs font-bold border transition-colors ${plan.highlight ? 'bg-[#202940] hover:bg-black text-white border-[#202940]' : 'bg-black hover:bg-[#202940] text-white border-black'}`}
                suppressHydrationWarning
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  )
}
