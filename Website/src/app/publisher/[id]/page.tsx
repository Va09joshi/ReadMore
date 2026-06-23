"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, ArrowLeft, ExternalLink, Mail, Building2, ShoppingCart } from "lucide-react"
import api from "@/lib/api"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

export default function PublisherProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { addToCart } = useCart()

  const [provider, setProvider] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchPublisherData = async () => {
      try {
        const res = await api.get(`/providers/${id}`)
        setProvider(res.data.data.provider)
        setProducts(res.data.data.products)
      } catch (err) {
        console.error("Failed to load publisher", err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchPublisherData()
  }, [id])

  const handleAddToCart = async (product: any) => {
    if (!user) {
      router.push('/sign-in')
      return
    }
    if (user.role === 'PROVIDER') return
    
    setAddingId(product._id)
    try {
      await addToCart(product._id, 1, product.language, product.frequency || 'Daily')
    } catch (err) {
      console.error(err)
    } finally {
      setAddingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
      </div>
    )
  }

  if (!provider) return <div className="min-h-screen pt-32 text-center font-serif text-2xl">Publisher not found.</div>

  return (
    <div className="bg-[#F9F8F6] min-h-screen pb-24">
      
      {/* Breadcrumb / Back */}
      <div className="border-b-4 border-black bg-white pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/catalog" className="inline-flex items-center gap-2 text-black font-bold uppercase tracking-widest text-xs hover:underline underline-offset-4 decoration-2">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Publisher Hero Profile */}
        <div className="border-4 border-black bg-white p-8 md:p-16 mb-16 shadow-[16px_16px_0px_0px_#06202B]">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-32 h-32 shrink-0 bg-black text-white flex items-center justify-center font-black text-6xl uppercase border-4 border-black">
              {provider.companyName.charAt(0)}
            </div>
            
            <div className="flex-1">
              <h1 className="text-5xl md:text-7xl font-black font-serif tracking-tighter uppercase leading-none mb-6">
                {provider.companyName}
              </h1>
              <p className="text-xl leading-relaxed font-serif text-slate-700 mb-8 max-w-3xl">
                {provider.description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                {provider.website && (
                  <a href={provider.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-100 border-2 border-black px-4 py-2 font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors">
                    <ExternalLink className="w-4 h-4" /> Website
                  </a>
                )}
                {provider.email && (
                  <a href={`mailto:${provider.email}`} className="flex items-center gap-2 bg-slate-100 border-2 border-black px-4 py-2 font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors">
                    <Mail className="w-4 h-4" /> Contact
                  </a>
                )}
                <div className="flex items-center gap-2 bg-green-50 border-2 border-green-700 text-green-800 px-4 py-2 font-bold uppercase tracking-widest text-xs">
                  <Building2 className="w-4 h-4" /> Verified Partner
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Publisher's Catalog */}
        <div className="mb-12 flex items-center justify-between border-b-4 border-black pb-4">
          <h2 className="text-4xl font-black uppercase tracking-tighter">Publications by {provider.companyName}</h2>
          <span className="font-bold font-serif italic text-slate-500">{products.length} Items Available</span>
        </div>

        {products.length === 0 ? (
          <div className="p-16 border-4 border-dashed border-slate-300 text-center">
            <p className="font-serif text-xl text-slate-500">This publisher has no active publications yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(pub => {
              const colors = ['bg-blue-600', 'bg-amber-500', 'bg-rose-600', 'bg-[#06202B]'];
              const accentColor = colors[pub._id.charCodeAt(0) % colors.length];

              return (
                <div key={pub._id} className="group relative bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_#06202B] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#06202B] transition-all flex flex-col h-full">
                  <div className={`absolute top-0 left-0 w-full h-2 ${accentColor}`} />
                  
                  <Link href={`/catalog/${pub._id}`} className="flex-1 block pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-widest text-white ${accentColor} px-2 py-0.5 border border-black`}>
                        {pub.type}
                      </span>
                    </div>
                    
                    <h3 className="font-black text-2xl uppercase tracking-tight mb-2 leading-tight group-hover:underline underline-offset-4 decoration-2">
                      {pub.title}
                    </h3>
                    
                    <p className="text-sm font-serif text-slate-500 line-clamp-2 mb-6">
                      {pub.description}
                    </p>
                  </Link>

                  <div className="border-t-2 border-dashed border-black/20 pt-4 flex items-center justify-between mt-auto">
                    <div>
                      <p className="font-black text-2xl">₹{pub.price}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">/ month</p>
                    </div>
                    
                    {user?.role !== 'PROVIDER' && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          handleAddToCart(pub)
                        }}
                        disabled={addingId === pub._id}
                        className="w-12 h-12 border-2 border-black bg-white hover:bg-black hover:text-white flex items-center justify-center transition-colors disabled:opacity-50"
                      >
                        {addingId === pub._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
