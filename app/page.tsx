"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase, type Design } from "@/lib/supabase"
import DesignCard from "@/components/design-card"
import { Button } from "@/components/ui/button"
import { Sparkles, Star, Users, Award } from "lucide-react"

export default function HomePage() {
  const [designs, setDesigns] = useState<Design[]>([])
  const [featuredDesigns, setFeaturedDesigns] = useState<Design[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchDesigns()

    // Get current user
    const getUserAndSetup = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.log("Auth check failed:", error)
      }
    }

    getUserAndSetup()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchDesigns = async () => {
    setLoading(true)
    try {
      // Fetch featured designs
      const { data: featured } = await supabase
        .from("designs")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(3)

      // Fetch latest designs
      const { data: latest } = await supabase
        .from("designs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8)

      setFeaturedDesigns(featured || [])
      setDesigns(latest || [])
    } catch (error) {
      console.log("Error fetching designs:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Sparkles className="h-12 w-12 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Chord001 Monograms</h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
            Creating personalized and artistic monogram pieces that tell your unique story. Each design is crafted with
            passion and attention to detail.
          </p>
          <div className="flex justify-center">
            <Link href="/designs">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-3">
                Explore Designs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Star className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">1000+</h3>
              <p className="text-gray-400">Unique Designs</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">1000+</h3>
              <p className="text-gray-400">Happy Customers</p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">5 Years</h3>
              <p className="text-gray-400">Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Designs */}
      {featuredDesigns.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Featured Designs</h2>
              <p className="text-xl text-white">Our most popular and trending monogram designs</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDesigns.map((design) => (
                <DesignCard key={design.id} design={design} user={user} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Designs */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Latest Designs</h2>
            <p className="text-xl text-white">Discover our newest monogram creations</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : designs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {designs.map((design) => (
                <DesignCard key={design.id} design={design} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white text-xl mb-4">No designs available yet</p>
              <p className="text-gray-400">Check back soon for new designs!</p>
            </div>
          )}

          {designs.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/designs">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  View All Designs
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Create Your Monogram?</h2>
          <p className="text-xl text-white mb-8">
            Join thousands of satisfied customers who have personalized their style with our unique monogram designs.
          </p>
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-3">
                  Get Started
                </Button>
              </Link>
              <Link href="/designs">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-3"
                >
                  View Gallery
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/designs">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-3">
                Browse All Designs
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
