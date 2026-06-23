"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, Store, Clock, CheckCircle } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export default function PublisherRegisterPage() {
  const router = useRouter()
  const { user, login } = useAuth()
  
  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    gstNumber: "",
    website: "",
    email: "",
    phone: ""
  })
  
  const [loading, setLoading] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [error, setError] = useState("")
  const [providerStatus, setProviderStatus] = useState<"NONE" | "PENDING" | "APPROVED">("NONE")

  // Check if user already has a provider application
  useEffect(() => {
    if (!user) {
      setCheckingStatus(false)
      return
    }

    const checkStatus = async () => {
      try {
        const res = await api.get('/providers/status')
        const status = res.data?.data?.status
        setProviderStatus(status)
        
        if (status === 'APPROVED') {
          router.push('/provider-dashboard')
        }
      } catch (err) {
        console.error(err)
      } finally {
        setCheckingStatus(false)
      }
    }
    checkStatus()
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await api.post('/providers/create', formData)
      setProviderStatus("PENDING")
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || "Registration failed. Please check your details and try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#06202B] text-center">
          <Store className="w-12 h-12 mx-auto mb-4 text-[#202940]" />
          <h2 className="text-2xl font-black font-serif uppercase tracking-tight text-black mb-4">Account Required</h2>
          <p className="text-slate-600 font-serif mb-8">
            You must have a user account before you can register as a publisher.
          </p>
          <div className="flex flex-col gap-4">
            <Link href="/sign-up" className="bg-black text-white font-bold uppercase tracking-widest text-sm py-4 border-2 border-black hover:bg-[#202940] transition-colors shadow-[4px_4px_0px_0px_#06202B] active:translate-y-1 active:shadow-none text-center">
              Create an Account
            </Link>
            <Link href="/sign-in" className="text-black font-bold uppercase tracking-wider text-xs hover:text-[#202940] underline decoration-2 underline-offset-4">
              I already have one (Sign In)
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-slate-500" />
      </div>
    )
  }

  // PENDING state — application submitted, waiting for admin
  if (providerStatus === "PENDING") {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#06202B] text-center">
          <div className="w-16 h-16 bg-amber-100 border-2 border-amber-500 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black font-serif uppercase tracking-tight text-black mb-4">
            Application Under Review
          </h2>
          <p className="text-slate-600 font-serif mb-4 leading-relaxed">
            Your publisher application has been submitted successfully. Our admin team is currently reviewing your details.
          </p>
          <p className="text-slate-500 font-serif text-sm mb-8 italic">
            You will receive an email notification once your application has been approved. This usually takes 1-2 business days.
          </p>
          <div className="border-t-2 border-dashed border-black/20 pt-6">
            <Link href="/" className="text-black font-bold uppercase tracking-wider text-xs hover:text-[#202940] underline decoration-2 underline-offset-4">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] py-20 px-4">
      <div className="max-w-2xl mx-auto bg-white border-2 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_#06202B]">
        
        <div className="mb-10 border-b-2 border-black pb-6">
          <div className="uppercase tracking-widest text-[10px] font-bold text-slate-500 mb-2">
            Publisher Network
          </div>
          <h1 className="font-serif font-black text-4xl tracking-tighter text-black uppercase">
            Create Provider Profile
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-500 text-red-700 p-4 mb-8 text-sm font-sans flex items-start gap-3">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block font-sans font-bold uppercase tracking-wider text-xs text-black mb-2">
                Company Name
              </label>
              <input 
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full bg-white border-2 border-black p-3 font-serif focus:outline-none focus:ring-0 focus:border-[#202940]"
                placeholder="Global Press Ltd."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-sans font-bold uppercase tracking-wider text-xs text-black mb-2">
                Description
              </label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full bg-white border-2 border-black p-3 font-serif focus:outline-none focus:ring-0 focus:border-[#202940] resize-none"
                placeholder="Leading publisher of international news and investigative journalism..."
              />
            </div>

            <div>
              <label className="block font-sans font-bold uppercase tracking-wider text-xs text-black mb-2">
                GST Number
              </label>
              <input 
                type="text" 
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                required
                className="w-full bg-white border-2 border-black p-3 font-serif focus:outline-none focus:ring-0 focus:border-[#202940]"
                placeholder="GST123456789"
              />
            </div>

            <div>
              <label className="block font-sans font-bold uppercase tracking-wider text-xs text-black mb-2">
                Website
              </label>
              <input 
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full bg-white border-2 border-black p-3 font-serif focus:outline-none focus:ring-0 focus:border-[#202940]"
                placeholder="https://globalpress.com"
              />
            </div>

            <div>
              <label className="block font-sans font-bold uppercase tracking-wider text-xs text-black mb-2">
                Business Email
              </label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white border-2 border-black p-3 font-serif focus:outline-none focus:ring-0 focus:border-[#202940]"
                placeholder="contact@globalpress.com"
              />
            </div>

            <div>
              <label className="block font-sans font-bold uppercase tracking-wider text-xs text-black mb-2">
                Business Phone
              </label>
              <input 
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-white border-2 border-black p-3 font-serif focus:outline-none focus:ring-0 focus:border-[#202940]"
                placeholder="+1987654321"
              />
            </div>
          </div>

          <div className="pt-6">
            <button 
              disabled={loading}
              className="w-full bg-black text-white font-bold uppercase tracking-widest text-sm py-4 border-2 border-black hover:bg-[#202940] hover:border-[#202940] transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#06202B] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:active:translate-y-0 disabled:shadow-[4px_4px_0px_0px_#06202B]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
            <p className="text-center text-xs text-slate-500 font-serif mt-4 italic">
              By submitting, you agree to our Publisher Terms of Service.
            </p>
          </div>
        </form>

      </div>
    </div>
  )
}
