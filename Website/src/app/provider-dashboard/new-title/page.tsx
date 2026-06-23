"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Loader2, BookOpen } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export default function ProviderDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  const [provider, setProvider] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "NEWSPAPER",
    price: "",
    stock: "100",
    image: "",
    language: "English",
    frequency: "Daily"
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/sign-in')
      return
    }

    if (user.role !== 'PROVIDER') {
      router.push('/publishers/register')
      return
    }

    const fetchProvider = async () => {
      try {
        const res = await api.get('/providers/profile')
        setProvider(res.data?.data || null)
      } catch (err) {
        console.error("Failed to fetch provider profile", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProvider()
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      let uploadedImageUrl = formData.image;

      // 1. Upload image if a file was selected
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        
        const uploadRes = await api.post('/upload', uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        uploadedImageUrl = uploadRes.data?.data?.url;
      }

      // 2. Create the publication
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
      await api.post('/products', {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: uploadedImageUrl ? [uploadedImageUrl] : [],
        slug,
        provider: provider._id,
        language: formData.language,
        frequency: formData.frequency
      })
      setShowAddForm(false)
      setFormData({ title: "", description: "", type: "NEWSPAPER", price: "", stock: "100", image: "", language: "English", frequency: "Daily" })
      setImageFile(null)
      setImagePreview(null)
      alert("Publication created successfully!")
    } catch (err) {
      console.error(err)
      alert("Failed to create publication")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-10 h-10 animate-spin text-slate-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black font-serif tracking-tighter text-black uppercase mb-2">
          Publish New Title
        </h1>
        <p className="text-slate-600 font-serif italic text-lg">
          Add a new daily newspaper or weekly magazine to the global marketplace.
        </p>
      </div>

      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#06202B]">
        {showAddForm ? (
          <form onSubmit={handlePublish} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Publication Title</label>
                <input 
                  type="text" name="title" value={formData.title} onChange={handleChange} required
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-[#202940] focus:ring-1 focus:ring-[#202940]"
                  placeholder="e.g. The Morning Chronicle"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea 
                  name="description" value={formData.description} onChange={handleChange} required rows={3}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-[#202940] focus:ring-1 focus:ring-[#202940] resize-none"
                  placeholder="What is this publication about?"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                <select 
                  name="type" value={formData.type} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-[#202940] focus:ring-1 focus:ring-[#202940]"
                >
                  <option value="NEWSPAPER">Newspaper</option>
                  <option value="MAGAZINE">Magazine</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Subscription Price (₹)</label>
                <input 
                  type="number" name="price" value={formData.price} onChange={handleChange} required min="0"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-[#202940] focus:ring-1 focus:ring-[#202940]"
                  placeholder="299"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Language</label>
                <select 
                  name="language" value={formData.language} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-[#202940] focus:ring-1 focus:ring-[#202940]"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Gujarati">Gujarati</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Frequency</label>
                <select 
                  name="frequency" value={formData.frequency} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-[#202940] focus:ring-1 focus:ring-[#202940]"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Weekend">Weekend</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image Upload</label>
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <input 
                      type="file" accept="image/*" onChange={handleImageChange}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-[#202940] focus:ring-1 focus:ring-[#202940] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-slate-800 cursor-pointer"
                    />
                    <p className="text-xs text-slate-500 mt-2 font-serif italic">Upload a high-quality JPG or PNG.</p>
                  </div>
                  {imagePreview && (
                    <div className="w-24 h-32 shrink-0 border-2 border-black bg-slate-100 overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-4 flex gap-4">
              <button disabled={submitting} type="submit" className="bg-black hover:bg-slate-800 text-white font-bold rounded-xl h-12 px-8 flex-1">
                {submitting ? "Publishing..." : "Publish to Marketplace"}
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl h-12 px-8">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-black shadow-[4px_4px_0px_0px_#06202B]">
              <BookOpen className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-xl font-bold font-serif text-slate-800 mb-2">Ready to publish?</h3>
            <p className="text-slate-500 font-serif italic mb-8 max-w-sm mx-auto">
              Add your publications to the catalog and start accepting subscriptions immediately.
            </p>
            <button onClick={() => setShowAddForm(true)} className="bg-black hover:bg-[#202940] text-white font-bold uppercase tracking-widest text-xs py-4 px-8 border-2 border-black hover:border-[#202940] shadow-[4px_4px_0px_0px_#06202B] active:translate-y-1 active:shadow-none transition-all inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Title
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
