"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlayCircle, PauseCircle, Loader2 } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [addresses, setAddresses] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketMessage, setTicketMessage] = useState("")
  const [submittingTicket, setSubmittingTicket] = useState(false)
  const [ticketError, setTicketError] = useState("")
  const [ticketSuccess, setTicketSuccess] = useState("")

  useEffect(() => {
    if (!user) {
      router.push('/sign-in')
      return
    }

    const fetchDashboardData = async () => {
      try {
        const [subRes, orderRes, addrRes, ticketRes] = await Promise.all([
          api.get('/subscriptions/my-subscriptions').catch(() => ({ data: { data: [] } })),
          api.get('/orders/my-orders').catch(() => ({ data: { data: [] } })),
          api.get('/addresses').catch(() => ({ data: { data: [] } })),
          api.get('/support/my-tickets').catch(() => ({ data: { data: [] } }))
        ])

        setSubscriptions(subRes.data?.data || [])
        setOrders(orderRes.data?.data || [])
        setAddresses(addrRes.data?.data || [])
        setTickets(ticketRes.data?.data || [])
      } catch (err) {
        console.error("Error fetching dashboard data", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, router])

  const togglePause = async (id: string) => {
    try {
      await api.patch(`/subscriptions/${id}/toggle-pause`)
      setSubscriptions(prev => prev.map(sub => 
        sub._id === id ? { ...sub, paused: !sub.paused } : sub
      ))
    } catch (err) {
      console.error("Failed to toggle pause", err)
    }
  }

  const pauseAll = async () => {
    try {
      const activeSubs = subscriptions.filter(s => !s.paused)
      await Promise.all(activeSubs.map(s => api.patch(`/subscriptions/${s._id}/toggle-pause`)))
      setSubscriptions(prev => prev.map(sub => ({ ...sub, paused: true })))
    } catch (err) {
      console.error("Failed to pause all", err)
    }
  }

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingTicket(true)
    setTicketError("")
    setTicketSuccess("")
    try {
      const res = await api.post('/support', { subject: ticketSubject, message: ticketMessage })
      setTickets([res.data.data, ...tickets])
      setTicketSubject("")
      setTicketMessage("")
      setTicketSuccess("Support ticket submitted successfully. Our team will contact you soon.")
      setTimeout(() => setTicketSuccess(""), 5000)
    } catch (err: any) {
      setTicketError(err.response?.data?.message || "Failed to submit ticket")
    } finally {
      setSubmittingTicket(false)
    }
  }

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#202940]" />
      </div>
    )
  }

  return (
    <div className="bg-[#F9F8F6] min-h-screen pb-24">
      {/* Header */}
      <div className="border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black font-serif tracking-tighter text-black uppercase mb-4">
            Reader Dashboard
          </h1>
          <p className="text-slate-600 font-serif italic max-w-2xl mx-auto">
            Manage your subscriptions, recent orders, and delivery schedules.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1 space-y-12">
            
            {/* Subscriptions Table */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-black uppercase tracking-widest font-sans">Active Subscriptions</h2>
                <button 
                  onClick={pauseAll}
                  disabled={subscriptions.every(s => s.paused)}
                  className="px-4 py-2 border-2 border-black bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                >
                  {subscriptions.every(s => s.paused) && subscriptions.length > 0 ? "All Paused" : "Pause All Deliveries"}
                </button>
              </div>

              <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_#202940] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-black bg-slate-50">
                      <th className="p-4 font-bold uppercase tracking-widest text-xs text-black w-2/5">Publication</th>
                      <th className="p-4 font-bold uppercase tracking-widest text-xs text-black">Ends On</th>
                      <th className="p-4 font-bold uppercase tracking-widest text-xs text-black">Status</th>
                      <th className="p-4 font-bold uppercase tracking-widest text-xs text-black text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500 font-serif italic border-b border-slate-200">
                          You don't have any active subscriptions yet.
                        </td>
                      </tr>
                    ) : (
                      subscriptions.map((sub) => (
                        <tr key={sub._id} className={`border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors ${sub.paused ? 'bg-orange-50/50 hover:bg-orange-50' : ''}`}>
                          <td className="p-4 font-black font-serif text-lg uppercase tracking-tight text-[#202940]">
                            {sub.productId?.title || 'Premium Subscription'}
                          </td>
                          <td className="p-4 font-mono text-sm text-slate-600">
                            {new Date(sub.endDate).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 border ${sub.paused ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-green-100 text-green-700 border-green-300'}`}>
                              {sub.paused ? 'Paused' : 'Active'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => togglePause(sub._id)}
                              className={`inline-flex items-center gap-2 px-3 py-1.5 border-2 font-bold uppercase tracking-widest text-[10px] transition-colors ${sub.paused ? 'border-[#202940] text-[#202940] hover:bg-[#202940] hover:text-white' : 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'}`}
                            >
                              {sub.paused ? <PlayCircle className="w-3 h-3" /> : <PauseCircle className="w-3 h-3" />}
                              {sub.paused ? 'Resume' : 'Pause'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Orders Table */}
            <div>
              <h2 className="text-2xl font-black text-black uppercase tracking-widest font-sans mb-6">Recent Orders</h2>
              <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_#202940] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-black bg-slate-50">
                      <th className="p-4 font-bold uppercase tracking-widest text-xs text-black">Order ID</th>
                      <th className="p-4 font-bold uppercase tracking-widest text-xs text-black">Date</th>
                      <th className="p-4 font-bold uppercase tracking-widest text-xs text-black">Amount</th>
                      <th className="p-4 font-bold uppercase tracking-widest text-xs text-black">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500 font-serif italic border-b border-slate-200">
                          No recent orders.
                        </td>
                      </tr>
                    ) : (
                      orders.slice(0, 5).map((order) => (
                        <tr key={order._id} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-mono text-xs text-slate-500">
                            #{order._id.slice(-8).toUpperCase()}
                          </td>
                          <td className="p-4 font-mono text-sm text-slate-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 font-black text-black">
                            ₹{order.totalAmount}
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 border bg-slate-100 text-slate-700 border-slate-300">
                              {order.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Support Tickets Section */}
            <div>
              <h2 className="text-2xl font-black text-black uppercase tracking-widest font-sans mb-6">Support Tickets</h2>
              <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_#202940] p-6 mb-8">
                <h3 className="font-bold text-black uppercase tracking-widest text-sm mb-4">Create a new ticket</h3>
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  {ticketSuccess && <div className="p-3 bg-green-100 text-green-800 text-sm font-bold border border-green-300">{ticketSuccess}</div>}
                  {ticketError && <div className="p-3 bg-red-100 text-red-800 text-sm font-bold border border-red-300">{ticketError}</div>}
                  <div>
                    <input 
                      type="text" 
                      placeholder="Subject" 
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full border-2 border-black p-3 text-sm focus:outline-none focus:ring-0 focus:border-[#202940]"
                    />
                  </div>
                  <div>
                    <textarea 
                      placeholder="How can we help you?" 
                      required
                      rows={3}
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      className="w-full border-2 border-black p-3 text-sm focus:outline-none focus:ring-0 focus:border-[#202940] resize-none"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={submittingTicket}
                    className="bg-black text-white px-6 py-3 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#202940] transition-colors disabled:opacity-50"
                  >
                    {submittingTicket && <Loader2 className="w-4 h-4 animate-spin" />} Submit Ticket
                  </button>
                </form>
              </div>

              {tickets.length > 0 && (
                <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_#202940] overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-black bg-slate-50">
                        <th className="p-4 font-bold uppercase tracking-widest text-xs text-black">Ticket ID</th>
                        <th className="p-4 font-bold uppercase tracking-widest text-xs text-black">Subject</th>
                        <th className="p-4 font-bold uppercase tracking-widest text-xs text-black">Status</th>
                        <th className="p-4 font-bold uppercase tracking-widest text-xs text-black">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => (
                        <tr key={ticket._id} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-mono text-xs text-slate-500">#{ticket._id.slice(-6).toUpperCase()}</td>
                          <td className="p-4 font-serif text-sm font-bold text-black">{ticket.subject}</td>
                          <td className="p-4">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 border bg-slate-100 text-slate-700 border-slate-300">
                              {ticket.status}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-xs text-slate-600">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Addresses */}
          <div className="w-full lg:w-80 shrink-0 space-y-8">
            <div>
              <h2 className="text-2xl font-black text-black uppercase tracking-widest font-sans mb-6">Saved Addresses</h2>
              <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_#202940]">
                {addresses.length === 0 ? (
                  <p className="text-sm text-slate-500 italic font-serif">No addresses saved.</p>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <div key={addr._id} className="p-4 border-2 border-slate-200 hover:border-black transition-colors">
                        <p className="font-bold text-black uppercase tracking-widest text-xs mb-2">Delivery Address</p>
                        <p className="text-sm text-slate-600 font-serif">{addr.addressLine1}</p>
                        {addr.addressLine2 && <p className="text-sm text-slate-600 font-serif">{addr.addressLine2}</p>}
                        <p className="text-sm text-slate-600 font-serif">{addr.city}, {addr.state} {addr.pincode}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
