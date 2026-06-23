"use client"

import Link from "next/link"
import { useState } from "react"
import { Globe, MessageCircle, Camera, Briefcase, Mail, ArrowRight, Loader2 } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export function Footer() {
  const { user } = useAuth()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      await api.post('/newsletter/subscribe', { email })
      setMessage("Thanks for subscribing!")
      setEmail("")
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || "Failed to subscribe.")
    } finally {
      setLoading(false)
    }
  }

  if (user?.role === 'PROVIDER') {
    return null
  }

  return (
    <footer className="bg-[#F9F8F6] pt-20 pb-12 border-t-8 border-black text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          
          {/* Brand & About */}
          <div className="space-y-6 lg:col-span-1">
            <Link href="/" className="font-black font-serif text-4xl tracking-tighter text-black uppercase flex items-center">
              Read<span className="text-[#202940]">More</span>
            </Link>
            <p className="text-slate-700 text-sm leading-relaxed font-serif">
              The modern platform for physical and digital journalism. Build your reading habit, your way.
            </p>
            <div className="flex items-center gap-4 pt-4">
              {[MessageCircle, Globe, Camera, Briefcase].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors duration-300 shadow-[2px_2px_0px_0px_#06202B] active:translate-y-0.5 active:shadow-none">
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-black mb-6 tracking-widest text-xs uppercase border-b-2 border-black pb-2">Platform</h3>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-wider font-sans">
              <li><Link href="/catalog" className="hover:text-[#202940] hover:underline decoration-2 underline-offset-4 transition-all flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#202940]" /> Build a Bundle</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#202940] hover:underline decoration-2 underline-offset-4 transition-all flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#202940]" /> My Dashboard</Link></li>
              <li><Link href="/publishers" className="hover:text-[#202940] hover:underline decoration-2 underline-offset-4 transition-all flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#202940]" /> For Publishers</Link></li>
              <li><Link href="/provider-dashboard" className="hover:text-[#202940] hover:underline decoration-2 underline-offset-4 transition-all flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#202940]" /> Provider Portal</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-black mb-6 tracking-widest text-xs uppercase border-b-2 border-black pb-2">Company</h3>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-wider font-sans">
              <li><Link href="#" className="hover:text-[#202940] hover:underline decoration-2 underline-offset-4 transition-all flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#202940]" /> About Us</Link></li>
              <li><Link href="#" className="hover:text-[#202940] hover:underline decoration-2 underline-offset-4 transition-all flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#202940]" /> Careers</Link></li>
              <li><Link href="#" className="hover:text-[#202940] hover:underline decoration-2 underline-offset-4 transition-all flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#202940]" /> Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-[#202940] hover:underline decoration-2 underline-offset-4 transition-all flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#202940]" /> Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="font-black mb-6 tracking-widest text-xs uppercase border-b-2 border-black pb-2">Stay Updated</h3>
            <p className="text-sm text-slate-700 mb-6 font-serif">
              Get the latest curated bundles and publisher news delivered to your inbox.
            </p>
            <form className="space-y-3" onSubmit={handleSubscribe}>
              {message && <div className="text-green-600 text-xs font-bold uppercase tracking-wider">{message}</div>}
              {error && <div className="text-red-600 text-xs font-bold uppercase tracking-wider">{error}</div>}
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address..." 
                className="w-full bg-white border-2 border-black text-black placeholder:text-slate-500 h-12 px-4 focus:outline-none focus:ring-0 focus:border-[#202940] font-serif"
                required
                suppressHydrationWarning
              />
              <button disabled={loading} type="submit" suppressHydrationWarning className="w-full bg-black hover:bg-[#202940] text-white font-bold h-12 uppercase tracking-widest text-xs flex items-center justify-center gap-2 border-2 border-black hover:border-[#202940] shadow-[4px_4px_0px_0px_#06202B] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:shadow-[4px_4px_0px_0px_#06202B] disabled:active:translate-y-0">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t-4 border-black flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-bold uppercase tracking-widest text-black">
          <p>© {new Date().getFullYear()} ReadMore Media Inc.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-[#202940] transition-colors">Sitemap</Link>
            <Link href="#" className="hover:text-[#202940] transition-colors">Accessibility</Link>
          </div>
        </div>
        
      </div>
    </footer>
  )
}
