"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2 } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export default function SignInPage() {
  const router = useRouter()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await api.post('/auth/login', formData)

      const token = res.data?.data?.accessToken;
      const user = res.data?.data;

      if (token && user) {
        login(token, user)
        router.push('/')
      } else {
        setError("Invalid response from server. Please try again.")
      }
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || "Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#06202B]">
        
        <div className="text-center mb-8 border-b-2 border-black pb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-serif font-black text-4xl tracking-tighter text-black uppercase mb-2">
            Read<span className="text-[#202940]">More</span>
          </Link>
          <div className="uppercase tracking-widest text-[10px] font-bold text-slate-500">
            Digital Access Portal
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-500 text-red-700 p-3 mb-6 text-sm font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-sans font-bold uppercase tracking-wider text-xs text-black mb-2">
              Email Address
            </label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white border-2 border-black p-3 font-serif focus:outline-none focus:ring-0 focus:border-[#202940]"
              placeholder="reader@example.com"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-sans font-bold uppercase tracking-wider text-xs text-black">
                Password
              </label>
              <Link href="#" className="font-serif italic text-xs text-slate-500 hover:text-[#202940] hover:underline decoration-2 underline-offset-4">
                Forgot?
              </Link>
            </div>
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-white border-2 border-black p-3 font-serif focus:outline-none focus:ring-0 focus:border-[#202940]"
              placeholder="••••••••"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-black text-white font-bold uppercase tracking-widest text-sm py-4 border-2 border-black hover:bg-[#202940] hover:border-[#202940] transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#06202B] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:active:translate-y-0 disabled:shadow-[4px_4px_0px_0px_#06202B]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-black/20 text-center border-dashed">
          <p className="font-serif text-sm text-slate-600">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-black font-bold uppercase tracking-wider text-xs hover:text-[#202940] underline decoration-2 underline-offset-4 ml-1">
              Subscribe Now
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
