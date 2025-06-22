import Link from "next/link"
import { Instagram, MessageCircle } from "lucide-react"

const whatsappNumber = "https://wa.me/+2347034942471?text=Hello%20Chord001%20Monograms%2C%20I%27m%20interested%20in%20your%20services";
const instagramHandle = "https://www.instagram.com/chord_001?utm_source=qr"
const tiktokHandle = "https://www.tiktok.com/@chord001"

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-.1z" />
    </svg>
)

export default function Footer() {
  return (
      <footer className="bg-black border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex-1 max-w-md">
              <h3 className="text-2xl font-bold text-white mb-4">Chord001 Monograms</h3>
              <p className="text-gray-400 leading-relaxed">
                Creating personalized and artistic monogram pieces that tell your unique story. Each design is crafted
                with passion and attention to detail, bringing your vision to life through beautiful typography and
                creative artistry.
              </p>
              <div className="mt-6">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} Chord001 Monograms. All rights reserved.
                </p>
              </div>
            </div>

            <div className="flex flex-col  items-start md:items-end gap-4">
              <Link href="/about" className="text-white hover:text-gray-400 transition-colors font-medium text-lg">
                About Us
              </Link>

              <a
                  href={whatsappNumber}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-gray-400 transition-colors"
                  title="Contact us on WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">WhatsApp</span>
              </a>

              <a
                  href={instagramHandle}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-gray-400 transition-colors"
                  title="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
                <span className="font-medium">Instagram</span>
              </a>

              <a
                  href={tiktokHandle}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-gray-400 transition-colors"
                  title="Follow us on TikTok"
              >
                <TikTokIcon className="h-5 w-5" />
                <span className="font-medium">TikTok</span>
              </a>

              <div className="text-right mt-4">
                <p className="text-gray-400 text-sm">Get in touch for custom designs</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
  )
}
