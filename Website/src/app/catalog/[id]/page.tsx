"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, ArrowLeft, Star, StarHalf, MessageSquare, ShieldCheck, Plus, ShoppingCart, CheckCircle2 } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import api from "@/lib/api"

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { showToast } = useToast()

  const [product, setProduct] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [addingCart, setAddingCart] = useState(false)
  const [userSub, setUserSub] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, revRes, recRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/reviews/product/${id}`).catch(() => ({ data: { data: [] } })),
          api.get('/products').catch(() => ({ data: { data: [] } }))
        ])
        
        setProduct(prodRes.data.data)
        setReviews(revRes.data.data || [])
        
        // Filter out current product and grab 4 random
        const otherProducts = (recRes.data.data || []).filter((p: any) => p._id !== id)
        setRecommendations(otherProducts.slice(0, 4))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id])

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user || user.role === 'PROVIDER') return
      try {
        const res = await api.get('/subscriptions/my-subscriptions')
        const activeSubs = res.data?.data || []
        const existingSub = activeSubs.find((sub: any) => 
          (sub.productId._id === id || sub.productId === id)
        )
        setUserSub(existingSub)
      } catch (err) {
        console.error("Failed to fetch user subscriptions", err)
      }
    }
    fetchSubscriptionStatus()
  }, [id, user])

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/sign-in')
      return
    }
    if (user.role === 'PROVIDER') return
    
    setAddingCart(true)
    try {
      await addToCart(product._id, 1, product.language, product.frequency || 'Daily')
      showToast(`${product.title} added to bundle`, "success")
    } catch (err) {
      console.error(err)
      showToast("Failed to add to bundle", "error")
    } finally {
      setAddingCart(false)
    }
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return router.push('/sign-in')
    
    setSubmittingReview(true)
    try {
      const res = await api.post('/reviews', {
        productId: product._id,
        rating: reviewRating,
        comment: reviewText
      })
      setReviews([res.data.data, ...reviews])
      setReviewText("")
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit review")
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
      </div>
    )
  }

  if (!product) return <div className="min-h-screen pt-32 text-center font-serif text-2xl">Product not found.</div>

  const avgRating = product.averageRating || 0;

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Main Product Info */}
          <div className="lg:col-span-8 space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-widest border-2 border-black">
                  {product.type}
                </span>
                <span className="bg-slate-100 text-slate-700 px-3 py-1 text-xs font-bold uppercase tracking-widest border-2 border-slate-300">
                  {product.language || 'English'}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black font-serif tracking-tighter uppercase leading-none mb-6">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1 text-orange-500">
                  <Star className="w-6 h-6 fill-current" />
                  <span className="text-black font-bold text-xl ml-2">{avgRating.toFixed(1)}</span>
                </div>
                <span className="text-slate-500 font-serif italic text-lg">({reviews.length} reviews)</span>
              </div>
              <p className="text-xl leading-relaxed font-serif text-slate-700">
                {product.description}
              </p>
            </div>

            {/* Publisher Card */}
            <div className="border-4 border-black p-8 bg-white shadow-[8px_8px_0px_0px_#06202B]">
              <h3 className="font-bold uppercase tracking-widest text-xs text-slate-500 mb-2">Published By</h3>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight">{product.provider?.companyName || 'Unknown Publisher'}</h2>
                  <p className="text-sm font-serif italic text-slate-600 mt-2 max-w-md line-clamp-2">
                    {product.provider?.description || 'A verified publishing partner on the platform.'}
                  </p>
                </div>
                <Link 
                  href={`/publisher/${product.provider?._id}`}
                  className="shrink-0 px-6 py-3 border-2 border-black font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors text-center"
                >
                  View Profile
                </Link>
              </div>
            </div>

            {/* Feedback / Reviews */}
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-8 flex items-center gap-3">
                <MessageSquare className="w-8 h-8" /> Customer Feedback
              </h2>

              {/* Submit Review */}
              {user && user.role !== 'PROVIDER' && (
                <form onSubmit={submitReview} className="border-2 border-black p-6 bg-slate-50 mb-12 shadow-[4px_4px_0px_0px_#06202B]">
                  <h4 className="font-bold uppercase tracking-widest text-sm mb-4">Leave a Review</h4>
                  <div className="flex items-center gap-2 mb-4">
                    {[1,2,3,4,5].map(num => (
                      <button 
                        type="button" 
                        key={num} 
                        onClick={() => setReviewRating(num)}
                        className={`p-1 hover:scale-110 transition-transform ${reviewRating >= num ? 'text-orange-500' : 'text-slate-300'}`}
                      >
                        <Star className={`w-8 h-8 ${reviewRating >= num ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    placeholder="Share your thoughts on this publication..."
                    className="w-full border-2 border-black p-4 font-serif focus:outline-none focus:ring-4 ring-black/10 mb-4 min-h-[120px]"
                  />
                  <button 
                    type="submit" 
                    disabled={submittingReview}
                    className="bg-black text-white px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-[#202940] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Review List */}
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-slate-500 font-serif italic py-8 text-center border-2 border-dashed border-slate-300">No reviews yet. Be the first to share your feedback!</p>
                ) : (
                  reviews.map(review => (
                    <div key={review._id} className="border-b-2 border-black pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold uppercase tracking-widest text-sm">{review.userId?.name || 'Anonymous Reader'}</p>
                          <div className="flex items-center gap-1 mt-1 text-orange-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-serif text-slate-700 mt-3">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sticky Purchase Column */}
          <div className="lg:col-span-4">
            <div className="border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_#06202B] sticky top-32">
              <div className="mb-8">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-500 block mb-2">Subscription Price</span>
                <div className="flex items-end gap-2">
                  <span className="text-6xl font-black tracking-tighter">₹{product.price}</span>
                  <span className="text-lg font-bold text-slate-500 pb-2">/ month</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-green-700 bg-green-50 p-4 border-2 border-green-200">
                  <ShieldCheck className="w-5 h-5" /> Verified Publisher
                </div>
                <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-black bg-slate-50 p-4 border-2 border-black">
                  Frequency: {product.frequency || 'Daily'}
                </div>
              </div>

              {user?.role !== 'PROVIDER' ? (
                userSub && userSub.status === 'ACTIVE' ? (
                  <button disabled className="w-full bg-green-100 text-green-700 font-black uppercase tracking-widest text-lg py-5 border-4 border-green-500 shadow-[4px_4px_0px_0px_#22c55e] flex justify-center items-center gap-3">
                    <CheckCircle2 className="w-6 h-6" /> Currently Subscribed
                  </button>
                ) : (
                  <button 
                    onClick={handleAddToCart}
                    disabled={addingCart}
                    className="w-full bg-black text-white font-black uppercase tracking-widest text-lg py-5 hover:bg-[#202940] transition-colors shadow-[4px_4px_0px_0px_#06202B] active:translate-y-1 active:shadow-none flex justify-center items-center gap-3"
                  >
                    {addingCart ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        <ShoppingCart className="w-6 h-6" /> {userSub ? "Renew Subscription" : "Add to Bundle"}
                      </>
                    )}
                  </button>
                )
              ) : (
                <button disabled className="w-full bg-slate-200 text-slate-500 font-black uppercase tracking-widest text-sm py-5 border-2 border-slate-300">
                  Providers cannot purchase
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="border-t-4 border-black pt-16 mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((rec) => (
                <Link key={rec._id} href={`/catalog/${rec._id}`} className="group border-2 border-black bg-white p-6 hover:-translate-y-2 transition-transform shadow-[4px_4px_0px_0px_#06202B]">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1 mb-4 inline-block">
                    {rec.type}
                  </span>
                  <h4 className="font-black text-xl uppercase tracking-tight mb-2 group-hover:underline underline-offset-4">{rec.title}</h4>
                  <p className="font-bold text-slate-600 mb-4 text-sm">₹{rec.price} / mo</p>
                </Link>
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  )
}
