"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"
import { signOut } from "@/lib/auth"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileMenu, setIsMobileMenu] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        fetchCartCount(user.id)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchCartCount(session.user.id)
      } else {
        setCartCount(0)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchCartCount = async (userId: string) => {
    const { data } = await supabase.from("cart").select("quantity").eq("user_id", userId)

    const total = data?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0
    setCartCount(total)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    setIsMobileMenu(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
                href="/"
                className="flex items-center space-x-3 text-2xl font-bold text-white hover:text-gray-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image src="/logo.jpeg" alt="Chord001 Logo" width={40} height={40} className="rounded-sm" />
              <span>Chord001 Monograms</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                  <>
                    <Link href="/cart" className="relative">
                      <Button variant="ghost" size="sm" className="text-white hover:text-gray-400 hover:bg-gray-900">
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                        )}
                      </Button>
                    </Link>
                    <Link href="/favorites">
                      <Button variant="ghost" size="sm" className="text-white hover:text-gray-400 hover:bg-gray-900">
                        Favorites
                      </Button>
                    </Link>
                    <Link href="/admin">
                      <Button variant="ghost" size="sm" className="text-white bg-gray-900 hover:text-gray-400 hover:bg-gray-600">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-white hover:text-gray-400 hover:bg-gray-900">
                          Menu
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                        <DropdownMenuItem className="text-white focus:bg-gray-800 focus:text-gray-400">
                          {user.email}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleSignOut}
                            className="text-white focus:bg-gray-800 focus:text-gray-400 cursor-pointer"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
              ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm" className="text-white hover:text-gray-400 hover:bg-gray-900">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button size="sm" className="bg-white text-black hover:bg-gray-300 hover:text-black">
                        Register
                      </Button>
                    </Link>
                    <Link href="/admin">
                      <Button variant="ghost" size="sm" className="text-white hover:text-gray-400 hover:bg-gray-900">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                  </>
              )}
            </div>

            {/* Hamburger Button for Mobile */}
            <div className="md:hidden flex items-center">
              <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-gray-400 hover:bg-gray-900"
                  onClick={toggleMobileMenu}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="md:hidden bg-gray-800 border-t border-gray-700">
              <div className="flex flex-col space-y-2 px-4 py-4">
                {user ? (
                    <>
                      <Link
                          href="/cart"
                          className="relative flex items-center text-white hover:text-gray-400 hover:bg-gray-900 py-2 px-4 rounded-md"
                          onClick={toggleMobileMenu}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Cart
                        {cartCount > 0 && (
                            <span className="absolute left-6 top-0 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                        )}
                      </Link>
                      <Link
                          href="/favorites"
                          className="text-white hover:text-gray-400 hover:bg-gray-900 py-2 px-4 rounded-md"
                          onClick={toggleMobileMenu}
                      >
                        Favorites
                      </Link>
                      <Link
                          href="/admin"
                          className="text-white hover:text-gray-400 hover:bg-gray-900 py-2 px-4 rounded-md"
                          onClick={toggleMobileMenu}
                      >
                        <User className="h-5 w-5 inline mr-2" />
                        Admin
                      </Link>
                      <div className="text-white py-2 px-4">{user.email}</div>
                      <button
                          onClick={handleSignOut}
                          className="flex items-center text-white hover:text-gray-400 hover:bg-gray-900 py-2 px-4 rounded-md w-full text-left"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </>
                ) : (
                    <>
                      <Link
                          href="/auth/login"
                          className="text-white hover:text-gray-400 hover:bg-gray-900 py-2 px-4 rounded-md"
                          onClick={toggleMobileMenu}
                      >
                        Login
                      </Link>
                      <Link
                          href="/auth/register"
                          className="text-white hover:text-gray-400 hover:bg-gray-900 py-2 px-4 rounded-md"
                          onClick={toggleMobileMenu}
                      >
                        Register
                      </Link>
                      <Link
                          href="/admin"
                          className="text-white hover:text-gray-400 hover:bg-gray-900 py-2 px-4 rounded-md"
                          onClick={toggleMobileMenu}
                      >
                        <User className="h-5 w-5 inline mr-2" />
                        Admin
                      </Link>
                    </>
                )}
              </div>
            </div>
        )}
      </nav>
  )
}