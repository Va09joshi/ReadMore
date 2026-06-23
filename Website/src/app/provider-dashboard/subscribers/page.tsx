"use client"

import { useState, useEffect } from "react"
import { Loader2, Users, FileText, CalendarDays } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export default function SubscribersPage() {
  const { user } = useAuth()
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await api.get('/providers/subscribers')
        setSubscribers(res.data?.data || [])
      } catch (err) {
        console.error("Failed to fetch subscribers", err)
      } finally {
        setLoading(false)
      }
    }
    if (user?.role === 'PROVIDER') {
      fetchSubscribers()
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-10 h-10 animate-spin text-slate-500" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black font-serif tracking-tighter text-black uppercase mb-2">
          Audience & Subscribers
        </h1>
        <p className="text-slate-600 font-serif italic text-lg mb-12">
          Manage your reader base and active subscriptions.
        </p>
      </div>

      {subscribers.length === 0 ? (
        <div className="bg-white border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_#06202B]">
          <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-6 border-2 border-black">
            <Users className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">No Subscribers Yet</h2>
          <p className="text-slate-600 font-serif italic">
            You don't have any active subscribers at the moment. Publish more content to build your audience!
          </p>
        </div>
      ) : (
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#06202B] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="p-4 font-bold uppercase tracking-widest text-xs border-r border-slate-800">Reader</th>
                  <th className="p-4 font-bold uppercase tracking-widest text-xs border-r border-slate-800">Publication</th>
                  <th className="p-4 font-bold uppercase tracking-widest text-xs border-r border-slate-800">Details</th>
                  <th className="p-4 font-bold uppercase tracking-widest text-xs border-r border-slate-800">Status</th>
                  <th className="p-4 font-bold uppercase tracking-widest text-xs">Next Billing</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {subscribers.map((sub: any) => (
                  <tr key={sub._id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Reader */}
                    <td className="p-4 border-r-2 border-black">
                      <p className="font-black text-black uppercase tracking-tight">{sub.userId?.name || 'Unknown User'}</p>
                      <p className="font-serif italic text-sm text-slate-500">{sub.userId?.email || 'N/A'}</p>
                    </td>

                    {/* Publication */}
                    <td className="p-4 border-r-2 border-black">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="font-bold text-sm uppercase tracking-widest">{sub.productId?.title}</span>
                      </div>
                      <span className="inline-block bg-slate-100 px-2 py-0.5 border border-black text-[10px] font-bold uppercase tracking-widest">
                        {sub.productId?.type}
                      </span>
                    </td>

                    {/* Details (Language/Freq) */}
                    <td className="p-4 border-r-2 border-black">
                      <p className="font-bold text-sm text-slate-800 uppercase tracking-widest mb-1">{sub.frequency || 'Daily'}</p>
                      <p className="font-serif text-sm text-slate-500 italic">{sub.language || 'English'}</p>
                    </td>

                    {/* Status */}
                    <td className="p-4 border-r-2 border-black">
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-2 border-black inline-block
                        ${sub.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                          sub.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}
                      `}>
                        {sub.status}
                      </span>
                    </td>

                    {/* Next Billing */}
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <CalendarDays className="w-4 h-4" />
                        <span className="font-bold font-serif">
                          {new Date(sub.endDate).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
