export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  if (!cloudName) {
    throw new Error(
      "Cloudinary cloud name not configured. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to your .env.local file",
    )
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "chord001_designs") // You'll need to create this preset in Cloudinary

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error.message)
    }

    return data.secure_url
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    throw error
  }
}
