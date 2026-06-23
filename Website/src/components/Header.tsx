"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ShoppingCart, User, Menu, LogOut, X, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import api from "@/lib/api"

export function Header() {
  const { user, logout } = useAuth()
  const { cart } = useCart()

  const navLinks = [
    { name: "Home", href: "/" },
    ...(user?.role !== 'PROVIDER' ? [{ name: "Build Bundle", href: "/catalog" }] : []),
    ...(user && user.role !== 'PROVIDER' ? [{ name: "My Dashboard", href: "/dashboard" }] : []),
  ]

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await api.get(`/products?search=${encodeURIComponent(searchQuery)}`)
        setSearchResults(res.data?.data || [])
      } catch (err) {
        console.error("Search failed", err)
      } finally {
        setIsSearching(false)
      }
    }, 400) // 400ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F9F8F6] border-b-4 border-black transition-all duration-300 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <button className="lg:hidden text-black hover:text-[#202940]">
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="font-serif font-black text-xl tracking-widest text-black flex items-center uppercase">
            Read<span className="text-[#202940]">More</span>
          </Link>
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsSearchOpen(true)}>
              <Search className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 font-sans uppercase tracking-widest text-xs font-bold">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-black hover:text-[#202940] transition-colors pb-1 border-b-2 border-transparent hover:border-[#202940]">
              {link.name}
            </Link>
          ))}
          <div className="h-4 w-px bg-black/20" />
          {user?.role === 'PROVIDER' ? (
            <Link href="/provider-dashboard" className="text-[#202940] hover:text-black transition-colors pb-1 border-b-2 border-transparent hover:border-black">
              Publisher Dashboard
            </Link>
          ) : (
            <Link href="/publishers" className="text-[#202940] hover:text-black transition-colors pb-1 border-b-2 border-transparent hover:border-black">
              For Publishers
            </Link>
          )}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-6 font-sans uppercase tracking-wider text-xs font-bold">
          <button onClick={() => setIsSearchOpen(true)} className="text-black hover:text-[#202940] transition-colors flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
          
          <div className="h-4 w-px bg-black/20" />

          {/* Dynamic Auth Links */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link href={user.role === 'PROVIDER' ? "/provider-dashboard" : "/dashboard"} className="flex items-center gap-2 text-slate-700 hover:text-black transition-colors">
                <div className="bg-slate-200 p-1.5 rounded-full border border-slate-300">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-bold">Hi, {user.name.split(' ')[0]}</span>
              </Link>
              <button onClick={logout} className="text-black hover:text-red-600 transition-colors flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link href="/sign-in" className="text-black hover:text-[#202940] transition-colors flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}
          
          {/* Brutalist Cart Button */}
          {user?.role !== 'PROVIDER' && (
            <Link href="/cart" className="bg-black hover:bg-[#202940] text-white px-5 py-3 transition-colors flex items-center gap-2 border-2 border-black hover:border-[#202940] shadow-[4px_4px_0px_0px_#06202B] active:translate-y-1 active:shadow-none">
              <ShoppingCart className="w-4 h-4" />
              <span>Cart ({cart.length})</span>
            </Link>
          )}
        </div>

      </div>

      {/* Brutalist Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-in fade-in duration-200">
          <div className="border-b-4 border-black p-6 bg-[#F9F8F6]">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <Search className="w-8 h-8 text-black shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search publications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-4xl font-black font-serif uppercase tracking-tighter outline-none placeholder:text-slate-300 text-black"
              />
              <button 
                onClick={closeSearch}
                className="w-12 h-12 flex items-center justify-center border-2 border-black hover:bg-black hover:text-white transition-colors shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#eeeeee] p-6">
            <div className="max-w-4xl mx-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 animate-spin text-black" />
                </div>
              ) : searchQuery && searchResults.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-serif text-2xl italic text-slate-500">No publications found matching "{searchQuery}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {searchResults.map(result => (
                    <Link
                      key={result._id}
                      href={`/catalog/${result._id}`}
                      onClick={closeSearch}
                      className="group bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_#06202B] hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_#06202B] transition-all flex items-start justify-between gap-4"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5 border border-black mb-2 inline-block">
                          {result.type}
                        </span>
                        <h3 className="font-black text-xl uppercase tracking-tight group-hover:underline decoration-2 underline-offset-4">{result.title}</h3>
                        <p className="font-serif italic text-sm text-slate-500 line-clamp-1 mt-1">{result.provider?.companyName || 'Verified Publisher'}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="font-black text-xl text-black">₹{result.price}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
