"use client"
import HeroSection from "@/components/hero-section"
import CategoriesSection from "@/components/categories-section"
import FeaturedProducts from "@/components/featured-products"
import VideoOffers from "@/components/video-offers"
import Footer from "@/components/footer"

export type PhotoItem = {
  id: string
  src: string
  alt: string
}

export type HolderConfig = {
  id: string
  width: number
  height: number
  borderWidth: number
  borderColor: string
  borderRadius: number
  shadow: "none" | "sm" | "md" | "lg" | "xl"
  padding: number
  backgroundColor: string
}

export type LayoutConfig = {
  id: string
  name: string
  columns: number
  gap: number
  holders: HolderConfig[]
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <VideoOffers className="mb-12" />
        <CategoriesSection />
        <FeaturedProducts />
      </div>
      <Footer />
    </main>
  )
}
