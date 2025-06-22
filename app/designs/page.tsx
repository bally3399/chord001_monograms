"use client"

import { useState, useEffect } from "react"
import { supabase, type Design } from "@/lib/supabase"
import DesignCard from "@/components/design-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export default function DesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([])
  const [filteredDesigns, setFilteredDesigns] = useState<Design[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchDesigns()

    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    filterDesigns()
  }, [designs, searchTerm, selectedCategory])

  const fetchDesigns = async () => {
    setLoading(true)
    try {
      const { data } = await supabase.from("designs").select("*").order("created_at", { ascending: false })

      setDesigns(data || [])

      // Extract unique categories
      const uniqueCategories = [...new Set((data || []).map((design) => design.category).filter(Boolean))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.log("Error fetching designs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterDesigns = () => {
    let filtered = designs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (design) =>
          design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          design.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          design.category?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((design) => design.category === selectedCategory)
    }

    setFilteredDesigns(filtered)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">All Designs</h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Explore our complete collection of unique monogram designs crafted with passion and creativity.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search designs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white focus:border-gray-400"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredDesigns.length} of {designs.length} designs
          </p>
        </div>

        {/* Designs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        ) : filteredDesigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDesigns.map((design) => (
              <DesignCard key={design.id} design={design} user={user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white text-xl mb-4">No designs found</p>
            <p className="text-gray-400">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Check back soon for new designs!"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
