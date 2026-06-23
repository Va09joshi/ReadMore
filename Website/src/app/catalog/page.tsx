"use client"

import { useState, useEffect } from "react"
import { Filter, Plus, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import api from "@/lib/api"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

interface Product {
  _id: string;
  title: string;
  type: string;
  price: number;
  images?: string[];
  provider?: {
    companyName: string;
  };
}

const fallbacks = [
  { image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop", lang: "English" },
  { image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c1590f?q=80&w=600&auto=format&fit=crop", lang: "English" },
  { image: "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=600&auto=format&fit=crop", lang: "Hindi" },
  { image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=600&auto=format&fit=crop", lang: "English" },
  { image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop", lang: "English" },
  { image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=600&auto=format&fit=crop", lang: "Tamil" },
]

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState<string | null>(null)
  
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedFrequencies, setSelectedFrequencies] = useState<string[]>([])
  
  const { addToCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products')
        const rawProducts = res.data?.data || res.data || []
        
        // Consistently map fallback properties so filtering doesn't scramble them
        const mappedProducts = rawProducts.map((pub: any, index: number) => {
          const fb = fallbacks[index % fallbacks.length];
          return {
            ...pub,
            language: pub.language || fb.lang,
            frequency: pub.type === 'MAGAZINE' ? 'Monthly' : 'Daily',
            displayImage: pub.images && pub.images.length > 0 ? pub.images[0] : fb.image
          }
        })
        setProducts(mappedProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleAddToCart = async (productId: string, language: string, frequency: string) => {
    if (!user) {
      window.location.href = '/sign-in';
      return;
    }
    if (user?.role === 'PROVIDER') return;
    setAddingId(productId)
    try {
      await addToCart(productId, 1, language, frequency)
    } catch (error) {
      console.error("Failed to add to cart")
    } finally {
      setAddingId(null)
    }
  }

  const handleLangToggle = (lang: string) => {
    setSelectedLanguages(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang])
  }

  const handleFreqToggle = (freq: string) => {
    setSelectedFrequencies(prev => prev.includes(freq) ? prev.filter(f => f !== freq) : [...prev, freq])
  }

  const filteredProducts = products.filter((p: any) => {
    const langMatch = selectedLanguages.length === 0 || selectedLanguages.includes(p.language)
    const freqMatch = selectedFrequencies.length === 0 || selectedFrequencies.includes(p.frequency)
    return langMatch && freqMatch
  })

  return (
    <div className="bg-[#F9F8F6] min-h-screen pb-24">
      {/* Editorial Header */}
      <div className="border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black font-serif tracking-tighter text-black uppercase mb-4">
            Build Your Bundle
          </h1>
          <p className="text-slate-600 font-serif italic max-w-2xl mx-auto mb-4">
            Mix and match any combination of dailies and magazines. We'll handle the complex delivery logic automatically.
          </p>
          {user?.role === 'PROVIDER' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 border border-orange-300 font-bold text-xs uppercase tracking-widest mt-4">
              Publisher Mode: You are viewing the live catalog. Subscribing is disabled for your account.
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 shrink-0 space-y-8">
            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_#202940] sticky top-28">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-black">
                <Filter className="w-5 h-5" />
                <span className="text-black font-black uppercase tracking-widest text-lg">Filters</span>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-black mb-4 text-xs uppercase tracking-widest font-sans">Language</h3>
                  <div className="space-y-4">
                    {["English", "Hindi", "Tamil", "Marathi"].map(l => {
                      const isChecked = selectedLanguages.includes(l)
                      return (
                        <label key={l} className="flex items-center gap-3 text-sm font-serif cursor-pointer hover:text-[#202940] transition-colors group">
                          <div className={`relative flex items-center justify-center w-5 h-5 border-2 transition-colors ${isChecked ? 'border-[#202940]' : 'border-black group-hover:border-[#202940] bg-white'}`}>
                            <input type="checkbox" className="opacity-0 absolute inset-0 cursor-pointer z-10" checked={isChecked} onChange={() => handleLangToggle(l)} />
                            {isChecked && <div className="absolute inset-0.5 bg-[#202940]" />}
                          </div>
                          {l}
                        </label>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-black mb-4 text-xs uppercase tracking-widest font-sans">Frequency</h3>
                  <div className="space-y-4">
                    {["Daily", "Weekend Only", "Weekly", "Monthly"].map(f => {
                      const isChecked = selectedFrequencies.includes(f)
                      return (
                        <label key={f} className="flex items-center gap-3 text-sm font-serif cursor-pointer hover:text-[#202940] transition-colors group">
                          <div className={`relative flex items-center justify-center w-5 h-5 border-2 transition-colors ${isChecked ? 'border-[#202940]' : 'border-black group-hover:border-[#202940] bg-white'}`}>
                            <input type="checkbox" className="opacity-0 absolute inset-0 cursor-pointer z-10" checked={isChecked} onChange={() => handleFreqToggle(f)} />
                            {isChecked && <div className="absolute inset-0.5 bg-[#202940]" />}
                          </div>
                          {f}
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="w-10 h-10 animate-spin text-slate-500" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 font-serif text-slate-500 italic text-xl">
                No matching products found. Try adjusting your filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((pub: any) => (
                  <div key={pub._id} className="bg-white border-2 border-black flex flex-col group shadow-[4px_4px_0px_0px_#202940] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#202940] transition-all duration-300">
                    <Link href={`/catalog/${pub._id}`} className="flex flex-col flex-1">
                      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden border-b-2 border-black">
                        <Image src={pub.displayImage} alt={pub.title} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-white border border-black text-black text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                            {pub.type || "Publication"}
                          </span>
                          <span className="bg-[#202940] border border-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                            {pub.language}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-black font-serif text-2xl text-black mb-1 uppercase tracking-tighter leading-tight group-hover:text-[#202940] transition-colors line-clamp-2">
                          {pub.title}
                        </h3>
                        <p className="text-[#202940] font-bold text-xs uppercase tracking-widest mb-1">
                          By {pub.provider?.companyName || 'Independent Publisher'}
                        </p>
                        <p className="text-slate-500 font-serif italic text-sm mb-6">Delivery included</p>
                      </div>
                    </Link>
                    
                    <div className="px-5 pb-5 pt-4 border-t-2 border-black/10 border-dashed flex items-center justify-between">
                      <div>
                        <span className="font-black text-2xl text-black tracking-tight">₹{pub.price}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">/mo</span>
                      </div>
                      
                      {user?.role !== 'PROVIDER' && (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(pub._id, pub.language, pub.frequency);
                          }}
                          disabled={addingId === pub._id}
                          className="w-10 h-10 border-2 border-black bg-white hover:bg-black hover:text-white flex items-center justify-center transition-colors disabled:opacity-50 z-10 relative"
                        >
                          {addingId === pub._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
