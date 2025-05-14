"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Eye, Star } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [addedToCart, setAddedToCart] = useState<string[]>([])
  const [visibleProducts, setVisibleProducts] = useState(8)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => {
        setProducts(data.slice(0, 8))
        setIsLoading(false)
      })
  }, [])

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId])
  }

  const addToCart = (productId: string) => {
    if (!addedToCart.includes(productId)) {
      setAddedToCart(prev => [...prev, productId])
      setTimeout(() => {
        setAddedToCart(prev => prev.filter(id => id !== productId))
      }, 2000)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h2 className="text-3xl font-bold text-gray-900">
            Productos <span className="text-red-600">Destacados</span>
          </h2>
          <Link href="/products">
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
              Ver Todos los Productos
            </Button>
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square animate-pulse bg-gray-200 rounded-2xl"></div>
                <CardContent className="p-4">
                  <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                  <div className="mb-4 h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200"></div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {products.map(product => (
              <motion.div
                key={product.id}
                variants={item}
                whileHover={{ scale: 1.08 }}
                className="transition-transform duration-300"
              >
                <Card className="group overflow-hidden rounded-2xl shadow-lg border-0 bg-white transition-all duration-300 hover:shadow-2xl hover:ring-4 hover:ring-red-200">
                  <div className="relative">
                    <div className="aspect-square overflow-visible rounded-2xl border border-gray-100 bg-gray-50 transition-all duration-500">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-56 w-56 mx-auto object-cover rounded-2xl shadow-lg border-2 border-white group-hover:scale-110 group-hover:brightness-105 group-hover:shadow-2xl group-hover:border-red-400 transition-all duration-500 bg-gradient-to-br from-gray-100 to-gray-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute right-3 top-3 flex flex-col gap-2 z-10">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/80 text-gray-800 opacity-0 shadow group-hover:opacity-100 hover:bg-white"
                        onClick={() => toggleWishlist(product.id)}
                      >
                        <Heart className={cn("h-4 w-4 transition-colors", wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "")}/>
                        <span className="sr-only">Añadir a favoritos</span>
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/80 text-gray-800 opacity-0 shadow group-hover:opacity-100 hover:bg-white"
                        onClick={() => (window.location.href = `/product/${product.slug || product.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Vista rápida</span>
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-1 text-xs text-gray-500 uppercase tracking-wide font-semibold">{product.category || "Producto"}</div>
                    <Link href={`/product/${product.slug || product.id}`}>
                      <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors hover:text-red-600 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mb-2 flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < Math.floor(product.rating || 4)
                                ? "fill-yellow-400 text-yellow-400"
                                : i < (product.rating || 4)
                                  ? "fill-yellow-400/50 text-yellow-400"
                                  : "text-gray-300",
                            )}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-gray-500">({product.reviews || 0})</span>
                    </div>
                    <div className="flex items-center">
                      <div className="text-lg font-bold text-red-600">${Number(product.price).toFixed(2)}</div>
                      {product.originalPrice && (
                        <div className="ml-2 text-sm text-gray-500 line-through">
                          ${Number(product.originalPrice).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className={cn(
                        "relative w-full overflow-hidden transition-all",
                        addedToCart.includes(product.id)
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700",
                      )}
                      onClick={() => addToCart(product.id)}
                    >
                      <span
                        className={cn(
                          "absolute inset-0 flex items-center justify-center transition-all duration-300",
                          addedToCart.includes(product.id) ? "translate-y-0" : "translate-y-full",
                        )}
                      >
                        ¡Añadido!
                      </span>
                      <span
                        className={cn(
                          "flex items-center justify-center transition-all duration-300",
                          addedToCart.includes(product.id) ? "-translate-y-full" : "translate-y-0",
                        )}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" /> Añadir al Carrito
                      </span>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
