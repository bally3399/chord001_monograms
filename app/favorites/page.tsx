"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase, type Favorite } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        fetchFavorites(user.id)
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
        fetchFavorites(session.user.id)
      } else {
        setFavorites([])
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchFavorites = async (userId: string) => {
    setLoading(true)
    const { data } = await supabase
      .from("favorites")
      .select(`
        *,
        designs (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    setFavorites(data || [])
    setLoading(false)
  }

  const removeFavorite = async (favoriteId: string) => {
    const { error } = await supabase.from("favorites").delete().eq("id", favoriteId)

    if (!error) {
      setFavorites((favorites) => favorites.filter((fav) => fav.id !== favoriteId))
      toast({
        title: "Removed from favorites",
        description: "Design removed from your favorites.",
      })
    }
  }

  const moveToCart = async (designId: string, favoriteId: string) => {
    if (!user) return

    // Add to cart
    const { error: cartError } = await supabase.from("cart").insert({
      user_id: user.id,
      design_id: designId,
      quantity: 1,
    })

    if (cartError) {
      if (cartError.code === "23505") {
        // Unique constraint violation
        toast({
          title: "Already in cart",
          description: "This design is already in your cart.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add to cart.",
          variant: "destructive",
        })
      }
      return
    }

    // Remove from favorites
    await removeFavorite(favoriteId)

    toast({
      title: "Moved to cart",
      description: "Design moved from favorites to cart.",
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <Card className="w-full max-w-md bg-gray-900 border-gray-700">
          <CardContent className="p-8 text-center">
            <Heart className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Sign in to view favorites</h2>
            <p className="text-gray-400 mb-6">You need to be logged in to save and view your favorite designs.</p>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">My Favorites</h1>

        {favorites.length === 0 ? (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-8 text-center">
              <Heart className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No favorites yet</h2>
              <p className="text-gray-400 mb-6">Start adding designs to your favorites!</p>
              <Link href="/">
                <Button className="bg-white text-black hover:bg-gray-200">Browse Designs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <Card key={favorite.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={favorite.designs.image_url || "/placeholder.svg"}
                      alt={favorite.designs.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{favorite.designs.title}</h3>
                    {favorite.designs.description && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{favorite.designs.description}</p>
                    )}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-white">
                        ${favorite.designs.price?.toFixed(2) || "N/A"}
                      </span>
                      {favorite.designs.category && (
                        <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded">
                          {favorite.designs.category}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => moveToCart(favorite.design_id, favorite.id)}
                        className="flex-1 bg-white text-black hover:bg-gray-200"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Move to Cart
                      </Button>
                      <Button
                        onClick={() => removeFavorite(favorite.id)}
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
