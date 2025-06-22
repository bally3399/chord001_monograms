import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Types
export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export interface Design {
  id: string
  title: string
  description: string | null
  image_url: string
  price: number | null
  category: string | null
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  design_id: string
  created_at: string
  designs: Design
}

export interface CartItem {
  id: string
  user_id: string
  design_id: string
  quantity: number
  created_at: string
  updated_at: string
  designs: Design
}
