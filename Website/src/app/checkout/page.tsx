"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Script from "next/script"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import api from "@/lib/api"
import { ArrowLeft, MapPin, Plus, CreditCard, Lock, Loader2, CheckCircle2 } from "lucide-react"

export default function CheckoutPage() {
  const { cart, fetchCart } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()

  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const [showAddAddress, setShowAddAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  })

  const subtotal = cart.reduce((acc, item) => {
    const price = item.price || item.product?.price || 0;
    return acc + (price * item.quantity);
  }, 0)
  const tax = subtotal * 0.18
  const total = subtotal + tax

  useEffect(() => {
    if (!user) {
      router.push('/sign-in')
      return
    }
    
    if (cart.length === 0 && !success) {
      router.push('/cart')
      return
    }

    const fetchAddresses = async () => {
      try {
        const res = await api.get('/addresses')
        const fetchedAddresses = res.data?.data || []
        setAddresses(fetchedAddresses)
        if (fetchedAddresses.length > 0) {
          setSelectedAddressId(fetchedAddresses[0]._id)
        }
      } catch (err) {
        console.error("Failed to fetch addresses", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAddresses()
  }, [user, cart, router, success])

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/addresses', newAddress)
      const added = res.data.data
      setAddresses([...addresses, added])
      setSelectedAddressId(added._id)
      setShowAddAddress(false)
      setNewAddress({ addressLine1: "", addressLine2: "", city: "", state: "", pincode: "", country: "India" })
    } catch (err) {
      console.error("Failed to add address", err)
      showToast("Failed to add address", "error")
    }
  }

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      showToast("Please select a delivery address", "error")
      return
    }

    setSubmitting(true)
    try {
      const { data: { data: orderData } } = await api.post('/orders/razorpay-create');
      
      if (orderData.mock) {
        await finalizeCheckout({ isMock: true, razorpayOrderId: orderData.id });
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'your_razorpay_key_id',
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Newsstand Subscriptions",
        description: "Payment for your active subscriptions",
        order_id: orderData.id,
        handler: async function (response: any) {
          await finalizeCheckout({
            isMock: false,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature
          });
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#202940"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        showToast("Payment Failed", "error");
        setSubmitting(false);
      });
      rzp.open();

    } catch (err) {
      console.error("Checkout failed", err)
      showToast("Checkout failed. Please try again.", "error")
      setSubmitting(false)
    }
  }

  const finalizeCheckout = async (paymentData: any) => {
    try {
      await api.post('/orders/checkout', {
        shippingAddress: selectedAddressId,
        paymentMethod: 'RAZORPAY',
        ...paymentData
      })
      
      await fetchCart() // Refresh cart context
      setSuccess(true)
      showToast("Order Placed Successfully!", "success")
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      console.error("Finalize checkout failed", err)
      showToast("Order could not be confirmed. Please contact support.", "error")
      setSubmitting(false)
    }
  }

  if (loading || success) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center">
        {success ? (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-500">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-black font-serif text-slate-900 mb-2">Order Confirmed!</h1>
            <p className="text-slate-600 font-serif italic">Your subscriptions are now active. Redirecting to dashboard...</p>
          </div>
        ) : (
          <Loader2 className="w-12 h-12 animate-spin text-[#202940]" />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] pt-12 pb-24">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 border-b-4 border-black pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-serif uppercase tracking-tighter text-black mb-2">
              Secure Checkout
            </h1>
          </div>
          <Link href="/cart" className="hidden sm:flex text-black font-bold uppercase tracking-wider text-xs hover:text-[#202940] hover:underline decoration-2 underline-offset-4 items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column - Forms */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Delivery Address */}
            <section>
              <h2 className="text-2xl font-black font-serif uppercase tracking-tight text-black mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-full text-sm">1</span>
                Delivery Address
              </h2>
              
              <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_#202940]">
                {addresses.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {addresses.map(addr => (
                      <label key={addr._id} className={`flex items-start gap-4 p-4 border-2 cursor-pointer transition-colors ${selectedAddressId === addr._id ? 'border-[#202940] bg-[#202940]/5' : 'border-slate-200 hover:border-black'}`}>
                        <input 
                          type="radio" 
                          name="address" 
                          className="mt-1 w-4 h-4 text-[#202940] focus:ring-[#202940]"
                          checked={selectedAddressId === addr._id}
                          onChange={() => setSelectedAddressId(addr._id)}
                        />
                        <div>
                          <p className="font-bold text-slate-900">{user?.name}</p>
                          <p className="text-sm text-slate-600 mt-1">{addr.addressLine1}</p>
                          {addr.addressLine2 && <p className="text-sm text-slate-600">{addr.addressLine2}</p>}
                          <p className="text-sm text-slate-600">{addr.city}, {addr.state} {addr.pincode}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic mb-6 font-serif">No saved addresses found.</p>
                )}

                {!showAddAddress ? (
                  <button onClick={() => setShowAddAddress(true)} className="text-sm font-bold uppercase tracking-widest text-[#202940] hover:text-black flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add New Address
                  </button>
                ) : (
                  <form onSubmit={handleAddAddress} className="border-t-2 border-dashed border-slate-200 pt-6 mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Address Line 1</label>
                        <input type="text" required value={newAddress.addressLine1} onChange={e => setNewAddress({...newAddress, addressLine1: e.target.value})} className="w-full bg-slate-50 border border-slate-300 p-3 focus:outline-none focus:border-[#202940]" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Address Line 2 (Optional)</label>
                        <input type="text" value={newAddress.addressLine2} onChange={e => setNewAddress({...newAddress, addressLine2: e.target.value})} className="w-full bg-slate-50 border border-slate-300 p-3 focus:outline-none focus:border-[#202940]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">City</label>
                        <input type="text" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full bg-slate-50 border border-slate-300 p-3 focus:outline-none focus:border-[#202940]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">State</label>
                        <input type="text" required value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full bg-slate-50 border border-slate-300 p-3 focus:outline-none focus:border-[#202940]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">PIN Code</label>
                        <input type="text" required value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} className="w-full bg-slate-50 border border-slate-300 p-3 focus:outline-none focus:border-[#202940]" />
                      </div>
                    </div>
                    <div className="mt-6 flex gap-4">
                      <button type="submit" className="bg-black text-white px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-[#202940]">Save Address</button>
                      <button type="button" onClick={() => setShowAddAddress(false)} className="bg-slate-200 text-slate-800 px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-slate-300">Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-2xl font-black font-serif uppercase tracking-tight text-black mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-full text-sm">2</span>
                Payment Method
              </h2>
              
              <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_#202940]">
                <div className="flex items-center gap-4 p-4 border-2 border-[#202940] bg-[#202940]/5 mb-6">
                  <CreditCard className="w-6 h-6 text-[#202940]" />
                  <div>
                    <p className="font-bold text-slate-900">Razorpay Secure Checkout</p>
                    <p className="text-sm text-slate-600">Cards, UPI, NetBanking, and more</p>
                  </div>
                </div>

                <div className="text-sm font-serif italic text-slate-500">
                  You will be securely redirected to Razorpay to complete your payment upon booking.
                </div>
              </div>
            </section>

          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-[#202940] text-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#06202B] sticky top-24">
              <h2 className="font-black font-serif text-2xl uppercase tracking-tighter mb-6 border-b-2 border-white/20 pb-4">
                Booking Summary
              </h2>

              <div className="space-y-4 mb-6 font-serif text-sm border-b-2 border-dashed border-white/20 pb-6">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Subtotal ({cart.length} items)</span>
                  <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Delivery Fee</span>
                  <span className="font-bold text-green-400 uppercase tracking-widest text-[10px]">Free</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Estimated Tax</span>
                  <span className="font-bold">₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="font-bold uppercase tracking-widest text-xs text-white/70">Total</span>
                <div className="text-right">
                  <span className="font-black text-4xl leading-none block">₹{total.toFixed(2)}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-white/50">Billed Monthly</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={submitting || !selectedAddressId}
                className="w-full bg-white text-[#202940] font-black uppercase tracking-widest text-sm py-4 border-2 border-transparent hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#202940] disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Pay & Book Order"}
              </button>
              
              <div className="text-center flex items-center justify-center gap-2 text-[10px] uppercase font-bold text-white/50 tracking-wider">
                <Lock className="w-3 h-3" />
                Secure 256-bit SSL Encryption
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
