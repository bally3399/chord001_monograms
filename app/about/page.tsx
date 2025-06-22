import Image from "next/image"
import { Heart, Palette, Users, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">About Chord001 Designs</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover the story behind our passion for creating unique, personalized monogram designs that celebrate
            individuality and artistic expression.
          </p>
        </div>

        {/* Owner Profile */}
        <div className="bg-gray-900 rounded-2xl p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="Chord001 Designer"
                width={200}
                height={200}
                className="rounded-full border-4 border-gray-700"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-4">Meet the Designer</h2>
              <p className="text-white mb-6 leading-relaxed">
                Welcome to Chord001 Designs! I'm a passionate monogram designer with over 5 years of experience in
                creating personalized artistic pieces. What started as a hobby has grown into a mission to help people
                express their unique identity through beautiful, custom monogram designs.
              </p>
              <p className="text-white leading-relaxed">
                Every design tells a story, and I believe that your monogram should be as unique as you are. From
                classic elegance to modern minimalism, I craft each piece with meticulous attention to detail and a deep
                appreciation for the art of typography and design.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Story</h2>
          <div className="bg-gray-900 rounded-xl p-8">
            <p className="text-white mb-6 leading-relaxed">
              Chord001 Designs was born from a simple belief: that everyone deserves to have something uniquely theirs.
              It all started in 2019 when I began experimenting with different lettering styles and decorative elements,
              creating monograms for friends and family.
            </p>
            <p className="text-white mb-6 leading-relaxed">
              What began as a creative outlet quickly evolved into something much more meaningful. I discovered that
              monograms aren't just decorative elements – they're personal statements, family legacies, and artistic
              expressions all rolled into one. Each design carries the weight of someone's identity and story.
            </p>
            <p className="text-white leading-relaxed">
              Today, Chord001 Designs has grown into a trusted name in personalized monogram artistry, serving customers
              worldwide who appreciate the perfect blend of traditional craftsmanship and contemporary design.
            </p>
          </div>
        </div>

        {/* Design Philosophy */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Design Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-xl p-6">
              <Palette className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Creative Inspiration</h3>
              <p className="text-white">
                Drawing inspiration from classical typography, nature, architecture, and contemporary art, each design
                is a unique fusion of timeless elegance and modern creativity.
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6">
              <Heart className="h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Personal Touch</h3>
              <p className="text-white">
                Every monogram is crafted with care and attention to detail, ensuring that your personal style and
                preferences are reflected in the final design.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Users className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Customer-Centric</h3>
              <p className="text-white">
                Your satisfaction is our priority. We work closely with each client to ensure their vision comes to
                life.
              </p>
            </div>
            <div className="text-center">
              <Award className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Quality Excellence</h3>
              <p className="text-white">
                We never compromise on quality. Each design undergoes rigorous review to meet our high standards.
              </p>
            </div>
            <div className="text-center">
              <Palette className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Artistic Innovation</h3>
              <p className="text-white">
                We continuously explore new techniques and styles to offer fresh, innovative designs that stand out.
              </p>
            </div>
          </div>
        </div>

        {/* Future Plans */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Looking Forward</h2>
          <p className="text-white mb-6 leading-relaxed max-w-2xl mx-auto">
            As we continue to grow, our commitment remains the same: creating exceptional monogram designs that
            celebrate individuality and artistic expression. We're excited to expand our collection, introduce new
            design categories, and serve even more customers worldwide.
          </p>
          <p className="text-white leading-relaxed">
            Thank you for being part of the Chord001 Designs journey. Together, we're creating something beautiful.
          </p>
        </div>
      </div>
    </div>
  )
}
