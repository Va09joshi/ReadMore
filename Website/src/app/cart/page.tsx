"use client"

import Link from "next/link"
import { ArrowRight, Trash2, ArrowLeft, Minus, Plus, Loader2 } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

export default function CartPage() {
  const { cart, loading, removeFromCart, updateQuantity } = useCart()
  const { user } = useAuth()

  // Assuming item.product is populated. If it's just an ID from the backend, 
  // you might need to fetch the product details separately.
  const subtotal = cart.reduce((acc, item) => {
    const price = item.price || item.product?.price || 0;
    return acc + (price * item.quantity);
  }, 0)

  const tax = subtotal * 0.18; // Example 18% tax
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-[#F9F8F6] pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 border-b-4 border-black pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-serif uppercase tracking-tighter text-black mb-2">
              Your Bundle
            </h1>
            <p className="text-slate-600 font-serif italic">
              Review your customized subscription package before checkout.
            </p>
          </div>
          <Link href="/catalog" className="hidden sm:flex text-black font-bold uppercase tracking-wider text-xs hover:text-[#202940] hover:underline decoration-2 underline-offset-4 items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Continue Browsing
          </Link>
        </div>

        {!user ? (
          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#06202B] text-center">
            <p className="font-serif text-lg mb-4">Please sign in to view your cart.</p>
            <Link href="/sign-in" className="inline-flex bg-black text-white font-bold uppercase tracking-widest text-sm py-3 px-6 border-2 border-black hover:bg-[#202940]">
              Sign In
            </Link>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
          </div>
        ) : cart.length === 0 ? (
           <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#06202B] text-center">
            <p className="font-serif text-lg mb-4">Your cart is currently empty.</p>
            <Link href="/catalog" className="inline-flex bg-black text-white font-bold uppercase tracking-widest text-sm py-3 px-6 border-2 border-black hover:bg-[#202940]">
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              
              {cart.map((item: any, index: number) => {
                const product = item.product || {};
                const price = item.price || product.price || 0;
                const colors = ['bg-blue-600', 'bg-amber-500', 'bg-rose-600', 'bg-[#06202B]'];
                const accentColor = colors[index % colors.length];

                return (
                  <div key={item._id || index} className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_#06202B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative group">
                    {/* Decorative top strip */}
                    <div className={`absolute top-0 left-0 w-full h-1 ${accentColor}`} />
                    
                    <div className="flex-1 pt-2">
                      <div className="flex flex-col gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-widest text-white ${accentColor} px-2 py-0.5 border border-black`}>
                            {product.type || 'Publication'}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700 bg-slate-100 px-2 py-0.5 border border-slate-300">
                            {item.language || 'English'}
                          </span>
                        </div>
                        <h3 className="font-black text-2xl font-serif text-black uppercase tracking-tight">{product.title || 'Unknown Product'}</h3>
                        <p className="text-sm font-serif text-slate-500 italic">{item.frequency || 'Daily'} Issue</p>
                      </div>

                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between border-t-2 border-dashed border-black/20 sm:border-0 pt-4 sm:pt-0">
                      <div className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-100 border-2 border-slate-300 px-3 py-1">
                        1 Subscription
                      </div>

                      <div className="text-right">
                        <p className="font-black text-2xl text-black">₹{price}</p>
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">/month</p>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Mobile Continue Shopping */}
              <Link href="/catalog" className="sm:hidden flex text-black font-bold uppercase tracking-wider text-xs hover:text-[#202940] hover:underline decoration-2 underline-offset-4 items-center justify-center gap-2 mt-8 border-2 border-black py-4 bg-white shadow-[2px_2px_0px_0px_#06202B]">
                <ArrowLeft className="w-4 h-4" /> Continue Browsing
              </Link>

            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#06202B] sticky top-8">
                <h2 className="font-black font-serif text-2xl uppercase tracking-tighter text-black mb-6 border-b-2 border-black pb-2">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 font-serif text-sm border-b-2 border-dashed border-black/20 pb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Subtotal ({cart.length} items)</span>
                    <span className="font-bold text-black">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Delivery Fee</span>
                    <span className="font-bold text-[#202940] uppercase tracking-widest text-[10px]">Free</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Estimated Tax</span>
                    <span className="font-bold text-black">₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <span className="font-bold uppercase tracking-widest text-xs">Total</span>
                  <div className="text-right">
                    <span className="font-black text-4xl text-black leading-none block">₹{total.toFixed(2)}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Billed Monthly</span>
                  </div>
                </div>

                <Link href="/checkout" className="w-full bg-black text-white font-bold uppercase tracking-widest text-sm py-4 border-2 border-black hover:bg-[#202940] hover:border-[#202940] transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#06202B] active:translate-y-1 active:shadow-none mb-4">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                
                <div className="text-center flex items-center justify-center gap-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Secure 256-bit SSL Encryption
                </div>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
