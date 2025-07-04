# Chord001 Monograms

A modern monogram design platform built with Next.js, Supabase, and Cloudinary.

## Environment Setup

1. Copy the `.env.local` file and fill in your actual values:

\`\`\`bash
cp .env.local .env.local
\`\`\`

2. Update the following environment variables:

### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)

### Cloudinary Configuration
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `NEXT_PUBLIC_CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### Admin Configuration
- `ADMIN_PASSWORD`: Password for admin access (default: chord001admin2024)

### Contact Information
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: Your WhatsApp number (without +)
- `NEXT_PUBLIC_INSTAGRAM_HANDLE`: Your Instagram username

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up your environment variables in `.env.local`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Set up your Supabase database using the SQL scripts in the `scripts/` folder

5. Create a Cloudinary upload preset named `chord001_designs`

## Features

- User authentication and registration
- Admin dashboard for design management
- Image upload with Cloudinary integration
- Shopping cart and favorites functionality
- WhatsApp integration for orders
- Responsive design with dark theme

#   c h o r d 0 0 1 _ m o n o g r a m s  
 