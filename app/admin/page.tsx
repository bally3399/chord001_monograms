"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Edit, Trash2, Upload, Star, StarOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase, type Design, type Profile } from "@/lib/supabase"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const [designs, setDesigns] = useState<Design[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDesign, setEditingDesign] = useState<Design | null>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    price: "",
    category: "",
    is_featured: false,
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    // Check if admin access is granted
    const adminAccess = localStorage.getItem("adminAccess")

    if (!adminAccess) {
      router.push("/admin/login")
      return
    }

    fetchDesigns()
  }

  const fetchDesigns = async () => {
    setLoading(true)
    const { data } = await supabase.from("designs").select("*").order("created_at", { ascending: false })

    setDesigns(data || [])
    setLoading(false)
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const imageUrl = await uploadToCloudinary(file)
      setFormData({ ...formData, image_url: imageUrl })
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      handleFileUpload(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.image_url) {
      toast({
        title: "Error",
        description: "Please upload an image or provide an image URL.",
        variant: "destructive",
      })
      return
    }

    const designData = {
      title: formData.title,
      description: formData.description || null,
      image_url: formData.image_url,
      price: formData.price ? Number.parseFloat(formData.price) : null,
      category: formData.category || null,
      is_featured: formData.is_featured,
    }

    let error
    if (editingDesign) {
      const { error: updateError } = await supabase.from("designs").update(designData).eq("id", editingDesign.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase.from("designs").insert(designData)
      error = insertError
    }

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: editingDesign ? "Design updated successfully!" : "Design created successfully!",
      })
      setIsDialogOpen(false)
      resetForm()
      fetchDesigns()
    }
  }

  const handleEdit = (design: Design) => {
    setEditingDesign(design)
    setFormData({
      title: design.title,
      description: design.description || "",
      image_url: design.image_url,
      price: design.price?.toString() || "",
      category: design.category || "",
      is_featured: design.is_featured,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (designId: string) => {
    if (!confirm("Are you sure you want to delete this design?")) return

    const { error } = await supabase.from("designs").delete().eq("id", designId)

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Design deleted successfully!",
      })
      fetchDesigns()
    }
  }

  const toggleFeatured = async (design: Design) => {
    const { error } = await supabase.from("designs").update({ is_featured: !design.is_featured }).eq("id", design.id)

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: `Design ${design.is_featured ? "removed from" : "added to"} featured.`,
      })
      fetchDesigns()
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      price: "",
      category: "",
      is_featured: false,
    })
    setEditingDesign(null)
    setSelectedFile(null)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-gray-200">
                <Plus className="h-4 w-4 mr-2" />
                Add Design
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">{editingDesign ? "Edit Design" : "Add New Design"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pb-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Enter design title"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Enter design description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="image_upload" className="text-white">
                    Design Image
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="image_upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="bg-gray-800 border-gray-600 text-white file:bg-gray-700 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                    />
                    {uploading && <p className="text-blue-400 text-sm">Uploading image...</p>}
                    {formData.image_url && (
                      <div className="mt-2">
                        <img
                          src={formData.image_url || "/placeholder.svg"}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded border border-gray-600"
                        />
                      </div>
                    )}
                    <Input
                      placeholder="Or paste image URL directly"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-white">
                      Price ($)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-white">
                      Category
                    </Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Enter category (e.g., Classic, Modern, Custom)"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked as boolean })}
                  />
                  <Label htmlFor="is_featured" className="text-white">
                    Featured Design
                  </Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                    className="border-gray-600 text-white hover:bg-gray-800 hover:text-gray-400"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading} className="bg-white text-black hover:bg-gray-200">
                    {uploading ? "Uploading..." : editingDesign ? "Update" : "Create"} Design
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => (
            <Card key={design.id} className="bg-gray-900 border-gray-700">
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={design.image_url || "/placeholder.svg"}
                    alt={design.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {design.is_featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                      FEATURED
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{design.title}</h3>
                  {design.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{design.description}</p>
                  )}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-white">${design.price?.toFixed(2) || "N/A"}</span>
                    {design.category && (
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">{design.category}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => toggleFeatured(design)}
                      variant="outline"
                      size="sm"
                      className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white"
                    >
                      {design.is_featured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                    </Button>
                    <Button
                      onClick={() => handleEdit(design)}
                      variant="outline"
                      size="sm"
                      className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(design.id)}
                      variant="outline"
                      size="sm"
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

        {designs.length === 0 && (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-8 text-center">
              <Upload className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No designs yet</h2>
              <p className="text-gray-400 mb-6">Start by adding your first design!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
