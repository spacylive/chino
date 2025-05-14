"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

const categories = [
  {
    id: 1,
    name: "Productos Frescos",
    image: "/images/super1.jpg",
    slug: "productos-frescos",
    count: 48,
  },
  {
    id: 2,
    name: "Salsas y Aceites",
    image: "/images/super3.jpg",
    slug: "salsas-aceites",
    count: 36,
  },
  {
    id: 3,
    name: "Tés y Bebidas",
    image: "/images/super6.jpg",
    slug: "tes-bebidas",
    count: 24,
  },
  {
    id: 4,
    name: "Productos Secos",
    image: "/images/super9.png",
    slug: "productos-secos",
    count: 52,
  },
  {
    id: 5,
    name: "Alimentos Congelados",
    image: "/images/dragon01.jpg",
    slug: "alimentos-congelados",
    count: 30,
  },
  {
    id: 6,
    name: "Artículos Especiales",
    image: "/images/super-dragon.png",
    slug: "articulos-especiales",
    count: 18,
  },
]

export default function CategoriesSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [products, setProducts] = useState<any[]>([])

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => setProducts(data.slice(0, 6)))
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Compre en <span className="text-red-600">Supermercado Universo</span>
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="overflow-hidden rounded-lg">
                <div className="aspect-square animate-pulse bg-gray-200"></div>
                <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          >
            {products.map((product: any) => (
              <motion.div
                key={product.id}
                variants={item}
                whileHover={{ scale: 1.08 }}
                className="transition-transform duration-300"
              >
                <Card className="overflow-hidden rounded-lg shadow hover:shadow-lg border-0 bg-white transition-all duration-300 hover:ring-4 hover:ring-red-200">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-3 text-center">
                    <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">${Number(product.price).toLocaleString()}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
