"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, ShoppingCart, HeartIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase, type Design } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface DesignCardProps {
  design: Design
  user?: any
}

export default function DesignCard({ design, user }: DesignCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isInCart, setIsInCart] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      checkFavoriteStatus()
      checkCartStatus()
    }
  }, [user, design.id])

  const checkFavoriteStatus = async () => {
    if (!user) return

    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("design_id", design.id)
      .single()

    setIsFavorited(!!data)
  }

  const checkCartStatus = async () => {
    if (!user) return

    const { data } = await supabase.from("cart").select("id").eq("user_id", user.id).eq("design_id", design.id).single()

    setIsInCart(!!data)
  }

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add favorites.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    if (isFavorited) {
      const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("design_id", design.id)

      if (!error) {
        setIsFavorited(false)
        toast({
          title: "Removed from favorites",
          description: "Design removed from your favorites.",
        })
      }
    } else {
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        design_id: design.id,
      })

      if (!error) {
        setIsFavorited(true)
        toast({
          title: "Added to favorites",
          description: "Design added to your favorites.",
        })
      }
    }

    setLoading(false)
  }

  const toggleCart = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    if (isInCart) {
      const { error } = await supabase.from("cart").delete().eq("user_id", user.id).eq("design_id", design.id)

      if (!error) {
        setIsInCart(false)
        toast({
          title: "Removed from cart",
          description: "Design removed from your cart.",
        })
      }
    } else {
      const { error } = await supabase.from("cart").insert({
        user_id: user.id,
        design_id: design.id,
        quantity: 1,
      })

      if (!error) {
        setIsInCart(true)
        toast({
          title: "Added to cart",
          description: "Design added to your cart.",
        })
      }
    }

    setLoading(false)
  }

  return (
    <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors group">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <Image
            src={design.image_url || "/placeholder.svg"}
            alt={design.title}
            width={400}
            height={400}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={toggleFavorite}
                disabled={loading}
                className="bg-white/90 text-black hover:bg-white"
              >
                {isFavorited ? (
                  <HeartIcon className="h-4 w-4 fill-red-500 text-red-500" />
                ) : (
                  <Heart className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={toggleCart}
                disabled={loading}
                className="bg-white/90 text-black hover:bg-white"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2">{design.title}</h3>
          {design.description && <p className="text-gray-400 text-sm mb-3 line-clamp-2">{design.description}</p>}
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-white">${design.price?.toFixed(2) || "N/A"}</span>
            {design.category && (
              <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded hover:bg-gray-400 hover:text-gray-900 transition-colors">
                {design.category}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
