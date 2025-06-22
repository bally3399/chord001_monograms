"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase, type CartItem } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const whatsappNumber = "https://wa.me/+2347034942471"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        fetchCartItems(user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchCartItems(session.user.id)
      } else {
        setCartItems([])
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchCartItems = async (userId: string) => {
    setLoading(true)
    const { data } = await supabase
      .from("cart")
      .select(`
        *,
        designs (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    setCartItems(data || [])
    setLoading(false)
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    const { error } = await supabase.from("cart").update({ quantity: newQuantity }).eq("id", itemId)

    if (!error) {
      setCartItems((items) => items.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeItem = async (itemId: string) => {
    const { error } = await supabase.from("cart").delete().eq("id", itemId)

    if (!error) {
      setCartItems((items) => items.filter((item) => item.id !== itemId))
      toast({
        title: "Item removed",
        description: "Item removed from your cart.",
      })
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.designs.price || 0) * item.quantity
    }, 0)
  }

  const handleOrder = () => {
    if (cartItems.length === 0) return

    const designIds = cartItems.map((item) => item.design_id).join(", ")
    const message = `Hi, I want to make the designs: ${designIds}`
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, "_blank")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <Card className="w-full max-w-md bg-gray-900 border-gray-700">
          <CardContent className="p-8 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Sign in to view your cart</h2>
            <p className="text-gray-400 mb-6">You need to be logged in to add items to your cart and place orders.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/login" className="flex-1">
                <Button className="w-full bg-white text-black hover:bg-gray-200">Login</Button>
              </Link>
              <Link href="/auth/register" className="flex-1">
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
                  Register
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-48 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-8 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Your cart is empty</h2>
              <p className="text-gray-400 mb-6">Add some designs to get started!</p>
              <Link href="/">
                <Button className="bg-white text-black hover:bg-gray-200">Browse Designs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="bg-gray-900 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={item.designs.image_url || "/placeholder.svg"}
                          alt={item.designs.title}
                          width={120}
                          height={120}
                          className="w-30 h-30 object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{item.designs.title}</h3>
                        {item.designs.description && (
                          <p className="text-gray-400 text-sm mb-3">{item.designs.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-8 w-8 p-0 border-gray-600 text-white hover:bg-gray-800"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0 border-gray-600 text-white hover:bg-gray-800"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center space-x-4">
                            <span className="text-lg font-bold text-white">
                              ${((item.designs.price || 0) * item.quantity).toFixed(2)}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeItem(item.id)}
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-semibold text-white">Total:</span>
                  <span className="text-2xl font-bold text-white">${getTotalPrice().toFixed(2)}</span>
                </div>
                <Button
                  onClick={handleOrder}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3"
                >
                  Order via WhatsApp
                </Button>
                <p className="text-gray-400 text-sm text-center mt-3">
                  You'll be redirected to WhatsApp to complete your order
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
