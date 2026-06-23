"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, CheckCircle } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export default function SignUpPage() {
  const router = useRouter()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  })
  
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<1 | 2>(1)
  
  const [accountType, setAccountType] = useState<"READER" | "PUBLISHER">("READER")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()
      
      await api.post('/auth/register', {
        name: fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      })

      setStep(2)
      setMessage("Account created! An OTP has been sent to your email to verify your account.")
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || "Registration failed. Please check your details and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await api.post('/auth/verify-otp', { email: formData.email, otp })

      const token = res.data?.data?.accessToken;
      const user = res.data?.data;

      if (token && user) {
        login(token, user)
        if (accountType === 'PUBLISHER') {
          router.push('/publishers/register')
        } else {
          router.push('/')
        }
      } else {
        setError("Invalid response from server. Please try again.")
      }
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || "Invalid OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#06202B]">
        
        <div className="text-center mb-8 border-b-2 border-black pb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-serif font-black text-4xl tracking-tighter text-black uppercase mb-2">
            Read<span className="text-[#202940]">More</span>
          </Link>
          <div className="uppercase tracking-widest text-[10px] font-bold text-slate-500">
            Subscribe Today
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-500 text-red-700 p-3 mb-6 text-sm font-sans">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-50 border border-green-500 text-green-700 p-3 mb-6 text-sm font-sans">
            {message}
          </div>
        )}

        {step === 1 ? (
          <>
            {/* Account Type Selector */}
            <div className="mb-6">
              <label className="block font-sans font-bold uppercase tracking-wider text-xs text-black mb-3 text-center">
                What brings you here?
              </label>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setAccountType("READER")}
                  className={`flex-1 py-3 px-4 border-2 font-bold text-sm transition-all ${accountType === "READER" ? "border-black bg-black text-white shadow-[4px_4px_0px_0px_#06202B] translate-y-0" : "border-slate-200 bg-white text-slate-500 hover:border-black hover:text-black"}`}
                >
                  To Read
                </button>
                <button 
                  type="button"
                  onClick={() => setAccountType("PUBLISHER")}
                  className={`flex-1 py-3 px-4 border-2 font-bold text-sm transition-all ${accountType === "PUBLISHER" ? "border-black bg-black text-white shadow-[4px_4px_0px_0px_#06202B] translate-y-0" : "border-slate-200 bg-white text-slate-500 hover:border-black hover:text-black"}`}
                >
                  To Publish
                </button>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans font-bold uppercase tracking-wider text-xs text-black mb-2">
                    First Name
                  </label>
                  <input 
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border-2 border-black p-3 font-serif focus:outline-none focus:ring-0 focus:border-[#202940]"
                  />
                </div>
                <div>
                  <label className="block font-sans font-bold uppercase tracking-wider text-xs text-black mb-2">
                    Last Name
                  </label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border-2 border-black p-3 font-serif focus:outline-none focus:ring-0 focus:border-[#202940]"
                  />
                </div>
              </div>

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
                <label className="block font-sans font-bold uppercase tracking-wider text-xs text-black mb-2">
                  Mobile Number
                </label>
                <input 
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border-2 border-black p-3 font-serif focus:outline-none focus:ring-0 focus:border-[#202940]"
                  placeholder="+1234567890"
                />
              </div>
              
              <div>
                <label className="block font-sans font-bold uppercase tracking-wider text-xs text-black mb-2">
                  Password
                </label>
                <input 
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full bg-white border-2 border-black p-3 font-serif focus:outline-none focus:ring-0 focus:border-[#202940]"
                  placeholder="••••••••"
                />
              </div>

              <button 
                disabled={loading}
                className="w-full bg-black text-white font-bold uppercase tracking-widest text-sm py-4 border-2 border-black hover:bg-[#202940] hover:border-[#202940] transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#06202B] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:active:translate-y-0 disabled:shadow-[4px_4px_0px_0px_#06202B]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block font-sans font-bold uppercase tracking-wider text-xs text-black mb-2">
                Enter OTP
              </label>
              <input 
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full bg-white border-2 border-black p-3 font-serif focus:outline-none focus:ring-0 focus:border-[#202940] tracking-[0.5em] text-center text-lg"
                placeholder="000000"
                maxLength={6}
              />
              <p className="text-xs text-slate-500 mt-2 text-center">
                Check your email {formData.email}
              </p>
            </div>

            <button 
              disabled={loading || !otp || otp.length !== 6}
              className="w-full bg-black text-white font-bold uppercase tracking-widest text-sm py-4 border-2 border-black hover:bg-[#202940] hover:border-[#202940] transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#06202B] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:active:translate-y-0 disabled:shadow-[4px_4px_0px_0px_#06202B]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Sign In"}
              {!loading && <CheckCircle className="w-4 h-4" />}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t-2 border-black/20 text-center border-dashed">
          <p className="font-serif text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-black font-bold uppercase tracking-wider text-xs hover:text-[#202940] underline decoration-2 underline-offset-4 ml-1">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
