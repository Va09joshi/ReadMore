"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, TrendingUp, Users, Package, Clock, ShieldX } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export default function PublisherAnalyticsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [providerStatus, setProviderStatus] = useState<"CHECKING" | "NONE" | "PENDING" | "APPROVED">("CHECKING")

  useEffect(() => {
    const init = async () => {
      if (!user) {
        setLoading(false)
        setProviderStatus("NONE")
        return
      }

      try {
        // First check provider status
        const statusRes = await api.get('/providers/status')
        const status = statusRes.data?.data?.status

        if (status === 'APPROVED') {
          setProviderStatus("APPROVED")
          // Now fetch analytics
          try {
            const analyticsRes = await api.get('/providers/analytics')
            setData(analyticsRes.data?.data)
          } catch (err) {
            console.error("Failed to fetch analytics", err)
          }
        } else if (status === 'PENDING') {
          setProviderStatus("PENDING")
        } else {
          setProviderStatus("NONE")
        }
      } catch (err) {
        console.error(err)
        setProviderStatus("NONE")
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-10 h-10 animate-spin text-slate-500" />
      </div>
    )
  }

  // No user or no provider application
  if (providerStatus === "NONE") {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#06202B] text-center">
          <ShieldX className="w-12 h-12 mx-auto mb-4 text-[#202940]" />
          <h2 className="text-2xl font-black font-serif uppercase tracking-tight text-black mb-4">No Publisher Profile</h2>
          <p className="text-slate-600 font-serif mb-8">
            You haven't registered as a publisher yet. Apply now to start publishing.
          </p>
          <Link href="/publishers/register" className="inline-block bg-black text-white font-bold uppercase tracking-widest text-sm py-4 px-8 border-2 border-black hover:bg-[#202940] transition-colors shadow-[4px_4px_0px_0px_#06202B] active:translate-y-1 active:shadow-none">
            Apply as Publisher
          </Link>
        </div>
      </div>
    )
  }

  // Application pending
  if (providerStatus === "PENDING") {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#06202B] text-center">
          <div className="w-16 h-16 bg-amber-100 border-2 border-amber-500 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black font-serif uppercase tracking-tight text-black mb-4">
            Approval Pending
          </h2>
          <p className="text-slate-600 font-serif mb-4 leading-relaxed">
            Your publisher application is under review. Our admin team will verify your details and approve your account.
          </p>
          <p className="text-slate-500 font-serif text-sm mb-8 italic">
            You will receive an email once your application is approved. This usually takes 1-2 business days.
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

  // APPROVED — show the real dashboard
  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black font-serif tracking-tighter text-black uppercase mb-2">
          Analytics & Reports
        </h1>
        <p className="text-slate-600 font-serif italic text-lg">
          Track your revenue and audience engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_#06202B] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_#06202B] transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#10b981] border-2 border-black text-white flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold uppercase tracking-widest text-xs">Total Revenue</h3>
          </div>
          <div className="text-4xl font-black tracking-tighter">
            ₹{data?.totalRevenue || 0}
          </div>
          <p className="text-xs font-serif italic text-slate-500 mt-2">All time earnings</p>
        </div>

        <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_#06202B] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_#06202B] transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#3b82f6] border-2 border-black text-white flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold uppercase tracking-widest text-xs">Active Subscribers</h3>
          </div>
          <div className="text-4xl font-black tracking-tighter">
            {data?.totalSubscribers || 0}
          </div>
          <p className="text-xs font-serif italic text-slate-500 mt-2">Currently subscribed</p>
        </div>

        <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_#06202B] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_#06202B] transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#8b5cf6] border-2 border-black text-white flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold uppercase tracking-widest text-xs">Publications</h3>
          </div>
          <div className="text-4xl font-black tracking-tighter">
            {data?.productsCount || 0}
          </div>
          <p className="text-xs font-serif italic text-slate-500 mt-2">Live in catalog</p>
        </div>
      </div>

      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#06202B]">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Recent Orders</h2>
        
        {data?.orders && data.orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-4 border-black bg-[#F9F8F6]">
                  <th className="p-4 font-bold uppercase tracking-widest text-xs text-black">Order ID</th>
                  <th className="p-4 font-bold uppercase tracking-widest text-xs text-black">Date</th>
                  <th className="p-4 font-bold uppercase tracking-widest text-xs text-black">Status</th>
                  <th className="p-4 font-bold uppercase tracking-widest text-xs text-black">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((order: any) => (
                  <tr key={order._id} className="border-b-2 border-black/10 hover:bg-slate-50">
                    <td className="p-4 font-mono text-sm">{order._id.slice(-8).toUpperCase()}</td>
                    <td className="p-4 text-sm font-serif italic text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="bg-black text-white font-bold uppercase tracking-widest text-[10px] px-2 py-1">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 font-black">₹{order.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 font-serif italic">No orders have been placed yet.</p>
          </div>
        )}
      </div>

    </div>
  )
}
