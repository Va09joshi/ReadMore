"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import api from "@/lib/api"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

interface Product {
  _id: string;
  title: string;
  category: any;
  type: string;
  price: number;
  description: string;
  images?: string[];
  provider?: {
    _id: string;
    companyName: string;
  };
}

// Fallback images based on index
const fallbacks = [
  { image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop", accent: "bg-blue-600", textAccent: "text-blue-600" },
  { image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=600&auto=format&fit=crop", accent: "bg-[#06202B]", textAccent: "text-[#06202B]" },
  { image: "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=600&auto=format&fit=crop", accent: "bg-amber-500", textAccent: "text-amber-600" },
  { image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=600&auto=format&fit=crop", accent: "bg-rose-600", textAccent: "text-rose-600" }
];

export function ShopGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState<string | null>(null)
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  
  const { cart, addToCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products')
        // adjust to your API response format
        setProducts(res.data?.data || res.data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user || user.role === 'PROVIDER') return
      try {
        const res = await api.get('/subscriptions/my-subscriptions')
        setSubscriptions(res.data?.data || [])
      } catch (err) {
        console.error("Failed to fetch user subscriptions", err)
      }
    }
    fetchSubscriptions()
  }, [user])

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      window.location.href = '/sign-in';
      return;
    }
    if (user?.role === 'PROVIDER') return;
    setAddingId(productId)
    try {
      await addToCart(productId, 1)
    } catch (error) {
      console.error("Failed to add to cart")
    } finally {
      setAddingId(null)
    }
  }

  return (
    <section className="py-24 border-b border-black bg-[#eeeeee]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="border-b-4 border-black pb-4 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black font-serif uppercase tracking-tighter text-black mb-2">
              The Newsstand
            </h2>
            <p className="text-lg text-slate-600 font-serif italic">
              Individual publications to build your perfect bundle.
            </p>
          </div>
          <button className="uppercase tracking-widest text-xs font-bold border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-colors bg-white shadow-[4px_4px_0px_0px_#06202B] active:translate-y-1 active:shadow-none">
            View All Content
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 font-serif text-slate-500 italic">
            No products available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => {
              const fb = fallbacks[index % fallbacks.length];
              const imgSrc = product.images && product.images.length > 0 ? product.images[0] : fb.image;
              const inCart = cart.some((item: any) => item.product?._id === product._id || item.product === product._id);
              const userSub = subscriptions.find((sub: any) => sub.productId?._id === product._id || sub.productId === product._id);
              const isActive = userSub && userSub.status === 'ACTIVE';
              const isRenew = userSub && (userSub.status === 'EXPIRED' || userSub.status === 'CANCELLED');
              
              return (
                <motion.div 
                  key={product._id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="border-2 border-black flex flex-col group bg-white shadow-[4px_4px_0px_0px_#06202B] hover:shadow-[8px_8px_0px_0px_#06202B] hover:-translate-y-1 transition-all duration-300 relative"
                >
                  <Link href={`/catalog/${product._id}`} className="flex flex-col flex-1">
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden border-b-2 border-black">
                      <Image 
                        src={imgSrc} 
                        alt={product.title} 
                        fill 
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-all duration-700" 
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                      
                      <div className="absolute top-0 left-0 flex">
                        <span className="bg-white border-b-2 border-r-2 border-black text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1.5">
                          {product.type || "Daily"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1 relative">
                      
                      {/* Decorative colored line */}
                      <div className={`absolute top-0 left-0 w-full h-1 ${fb.accent}`} />
                      
                      <p className="text-xs font-bold text-[#202940] uppercase tracking-widest mb-2 font-serif pt-1 line-clamp-1">
                        {product.provider?.companyName || "Partner Publisher"}
                      </p>
                      <h3 className="font-black text-xl text-black mb-4 font-serif leading-tight group-hover:underline decoration-2 underline-offset-4 line-clamp-2">
                        {product.title}
                      </h3>
                    </div>
                  </Link>

                  <div className="px-5 pb-5 pt-4 border-t-2 border-dashed border-black/20 flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className={`font-black text-2xl ${fb.textAccent}`}>₹{product.price}</span>
                        <span className="text-slate-500 text-xs font-serif italic">/mo</span>
                      </div>
                      <button 
                        onClick={() => handleAddToCart(product._id)}
                        disabled={addingId === product._id || inCart || isActive}
                        className={`h-10 px-5 border-2 border-black flex items-center justify-center transition-colors uppercase text-xs tracking-widest font-bold shadow-[2px_2px_0px_0px_#06202B] active:translate-y-0.5 active:shadow-none disabled:opacity-50 ${(inCart || isActive) ? 'bg-green-100 text-green-700 border-green-500' : 'bg-white hover:bg-black hover:text-white'}`}
                      >
                        {addingId === product._id ? <Loader2 className="w-4 h-4 animate-spin" /> : (isActive ? "Subscribed" : inCart ? "In Cart" : isRenew ? "Renew" : "Subscribe")}
                      </button>
                    </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
