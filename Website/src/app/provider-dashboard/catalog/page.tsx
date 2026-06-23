"use client"

import { useState, useEffect } from "react"
import { Loader2, Edit2, Trash2, X } from "lucide-react"
import api from "@/lib/api"
import Image from "next/image"

export default function PublisherCatalogPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [updateImageFile, setUpdateImageFile] = useState<File | null>(null)
  const [updateImagePreview, setUpdateImagePreview] = useState<string | null>(null)

  const fetchCatalog = async () => {
    try {
      const res = await api.get('/providers/catalog')
      setProducts(res.data?.data || [])
    } catch (err) {
      console.error("Failed to fetch catalog", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCatalog()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this publication? This action cannot be undone.")) {
      return
    }
    
    setIsDeleting(id)
    try {
      await api.delete(`/products/${id}`)
      setProducts(products.filter(p => p._id !== id))
    } catch (err) {
      console.error("Failed to delete", err)
      alert("Failed to delete publication")
    } finally {
      setIsDeleting(null)
    }
  }

  const handleUpdateImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUpdateImageFile(file)
      setUpdateImagePreview(URL.createObjectURL(file))
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    try {
      let uploadedImageUrl = editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images[0] : null;

      // Upload new image if selected
      if (updateImageFile) {
        const uploadData = new FormData();
        uploadData.append('image', updateImageFile);
        
        const uploadRes = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        uploadedImageUrl = uploadRes.data?.data?.url;
      }

      const res = await api.put(`/products/${editingProduct._id}`, {
        title: editingProduct.title,
        description: editingProduct.description,
        price: Number(editingProduct.price),
        images: uploadedImageUrl ? [uploadedImageUrl] : []
      })
      
      // Update the local state
      setProducts(products.map(p => p._id === editingProduct._id ? res.data.data : p))
      setEditingProduct(null)
      setUpdateImageFile(null)
      setUpdateImagePreview(null)
    } catch (err) {
      console.error("Failed to update", err)
      alert("Failed to update publication")
    } finally {
      setIsUpdating(false)
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
    <div className="max-w-5xl mx-auto py-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black font-serif tracking-tighter text-black uppercase mb-2">
          Catalog Management
        </h1>
        <p className="text-slate-600 font-serif italic text-lg">
          View, edit, and manage your active publications.
        </p>
      </div>

      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#06202B] overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">No Publications Yet</h2>
            <p className="text-slate-500 font-serif italic max-w-lg mx-auto">
              You haven't added any titles to the marketplace yet. Head over to the New Title tab to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-4 border-black bg-[#F9F8F6]">
                  <th className="p-4 font-bold uppercase tracking-widest text-xs text-black">Publication</th>
                  <th className="p-4 font-bold uppercase tracking-widest text-xs text-black">Type</th>
                  <th className="p-4 font-bold uppercase tracking-widest text-xs text-black">Price</th>
                  <th className="p-4 font-bold uppercase tracking-widest text-xs text-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b-2 border-black/10 hover:bg-slate-50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-slate-200 border border-black relative shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <Image src={product.images[0]} alt={product.title} fill className="object-cover" unoptimized />
                          ) : null}
                        </div>
                        <div>
                          <div className="font-black font-serif text-lg leading-tight">{product.title}</div>
                          <div className="text-xs text-slate-500 font-serif italic line-clamp-1">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-bold uppercase tracking-widest text-slate-600">
                      {product.type}
                    </td>
                    <td className="p-4 font-black text-lg">
                      ₹{product.price}
                      <span className="text-xs text-slate-500 ml-1 font-bold tracking-widest uppercase">/mo</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditingProduct(product)}
                          className="w-10 h-10 flex items-center justify-center border-2 border-black bg-white hover:bg-[#202940] hover:text-white transition-colors shadow-[2px_2px_0px_0px_#06202B] active:translate-y-0.5 active:shadow-none"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          disabled={isDeleting === product._id}
                          className="w-10 h-10 flex items-center justify-center border-2 border-black bg-white hover:bg-red-600 hover:text-white transition-colors shadow-[2px_2px_0px_0px_#06202B] active:translate-y-0.5 active:shadow-none disabled:opacity-50"
                          title="Delete"
                        >
                          {isDeleting === product._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#06202B] w-full max-w-lg p-6 relative">
            <button 
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Edit Publication</h2>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                <input 
                  type="text" 
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-3 focus:outline-none focus:border-[#202940] focus:ring-1 focus:ring-[#202940]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Price (₹/mo)</label>
                <input 
                  type="number" 
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-3 focus:outline-none focus:border-[#202940] focus:ring-1 focus:ring-[#202940]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea 
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-3 focus:outline-none focus:border-[#202940] focus:ring-1 focus:ring-[#202940] resize-none h-24"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Update Cover Image</label>
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <input 
                      type="file" accept="image/*" onChange={handleUpdateImageChange}
                      className="w-full bg-slate-50 border border-slate-200 p-3 focus:outline-none focus:border-[#202940] focus:ring-1 focus:ring-[#202940] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-slate-800 cursor-pointer"
                    />
                    <p className="text-xs text-slate-500 mt-2 font-serif italic">Leave empty to keep existing cover.</p>
                  </div>
                  {(updateImagePreview || (editingProduct.images && editingProduct.images[0])) && (
                    <div className="w-16 h-20 shrink-0 border border-black bg-slate-100 overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={updateImagePreview || editingProduct.images[0]} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="bg-black hover:bg-slate-800 text-white font-bold h-12 px-8 flex-1 border-2 border-black shadow-[4px_4px_0px_0px_#06202B] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingProduct(null)
                    setUpdateImageFile(null)
                    setUpdateImagePreview(null)
                  }}
                  className="bg-white hover:bg-slate-100 text-black font-bold h-12 px-8 border-2 border-black shadow-[4px_4px_0px_0px_#06202B] active:translate-y-1 active:shadow-none transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
