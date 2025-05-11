"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Eye, Star } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const products = [
  {
    id: 1,
    name: "Arroz Jazmín Premium",
    price: 24.99,
    originalPrice: 29.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Granos",
    isNew: true,
    rating: 4.8,
    reviews: 124,
    slug: "arroz-jazmin-premium",
    stock: 15,
  },
  {
    id: 2,
    name: "Vino Shaoxing Añejo",
    price: 39.99,
    originalPrice: null,
    image: "/placeholder.svg?height=400&width=400",
    category: "Vinos de Cocina",
    isNew: false,
    rating: 4.5,
    reviews: 86,
    slug: "vino-shaoxing-anejo",
    stock: 8,
  },
  {
    id: 3,
    name: "Salsa de Soja Artesanal",
    price: 18.5,
    originalPrice: 22.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Salsas",
    isNew: true,
    rating: 4.9,
    reviews: 203,
    slug: "salsa-soja-artesanal",
    stock: 20,
  },
  {
    id: 4,
    name: "Selección de Tés Premium",
    price: 45.0,
    originalPrice: null,
    image: "/placeholder.svg?height=400&width=400",
    category: "Té",
    isNew: false,
    rating: 4.7,
    reviews: 156,
    slug: "seleccion-tes-premium",
    stock: 12,
  },
  {
    id: 5,
    name: "Caja Regalo Mooncake Lujo",
    price: 68.99,
    originalPrice: 79.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Regalos",
    isNew: true,
    rating: 4.9,
    reviews: 48,
    slug: "caja-mooncake-lujo",
    stock: 5,
  },
  {
    id: 6,
    name: "Abulón Seco",
    price: 129.99,
    originalPrice: null,
    image: "/placeholder.svg?height=400&width=400",
    category: "Productos Secos",
    isNew: false,
    rating: 4.6,
    reviews: 32,
    slug: "abulon-seco",
    stock: 3,
  },
  {
    id: 7,
    name: "Nido de Pájaro",
    price: 199.99,
    originalPrice: 249.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Especialidades",
    isNew: false,
    rating: 4.8,
    reviews: 18,
    slug: "nido-pajaro",
    stock: 2,
  },
  {
    id: 8,
    name: "Raíz de Ginseng",
    price: 89.99,
    originalPrice: null,
    image: "/placeholder.svg?height=400&width=400",
    category: "Hierbas",
    isNew: true,
    rating: 4.7,
    reviews: 64,
    slug: "raiz-ginseng",
    stock: 7,
  },
  {
    id: 9,
    name: "Oferta Especial 1",
    price: 15.99,
    originalPrice: 19.99,
    image: "/images/oferta1.png",
    category: "Ofertas",
    isNew: true,
    rating: 4.6,
    reviews: 21,
    slug: "oferta-especial-1",
    stock: 10,
  },
  {
    id: 10,
    name: "Oferta Especial 2",
    price: 12.49,
    originalPrice: 16.99,
    image: "/images/oferta2.png",
    category: "Ofertas",
    isNew: false,
    rating: 4.4,
    reviews: 15,
    slug: "oferta-especial-2",
    stock: 8,
  },
  {
    id: 11,
    name: "Oferta Especial 3",
    price: 18.99,
    originalPrice: 22.99,
    image: "/images/oferta3.png",
    category: "Ofertas",
    isNew: true,
    rating: 4.7,
    reviews: 19,
    slug: "oferta-especial-3",
    stock: 6,
  },
  {
    id: 12,
    name: "Oferta Especial 5",
    price: 9.99,
    originalPrice: 13.99,
    image: "/images/oferta5.png",
    category: "Ofertas",
    isNew: false,
    rating: 4.2,
    reviews: 11,
    slug: "oferta-especial-5",
    stock: 12,
  },
]

export default function FeaturedProducts() {
  const [wishlist, setWishlist] = useState<number[]>([])
  const [addedToCart, setAddedToCart] = useState<number[]>([])
  const [visibleProducts, setVisibleProducts] = useState(4)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const addToCart = (productId: number) => {
    if (!addedToCart.includes(productId)) {
      setAddedToCart((prev) => [...prev, productId])

      // Reset the "added" state after animation
      setTimeout(() => {
        setAddedToCart((prev) => prev.filter((id) => id !== productId))
      }, 2000)
    }
  }

  const showMoreProducts = () => {
    setVisibleProducts((prev) => Math.min(prev + 4, products.length))
  }

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
                <div className="aspect-square animate-pulse bg-gray-200"></div>
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
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {products.slice(0, visibleProducts).map((product) => (
              <motion.div key={product.id} variants={item}>
                <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="relative">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Quick action buttons */}
                    <div className="absolute right-2 top-2 flex flex-col gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/80 text-gray-800 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                        onClick={() => toggleWishlist(product.id)}
                      >
                        <Heart
                          className={cn(
                            "h-4 w-4 transition-colors",
                            wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "",
                          )}
                        />
                        <span className="sr-only">Añadir a favoritos</span>
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/80 text-gray-800 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                        onClick={() => (window.location.href = `/product/${product.slug}`)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Vista rápida</span>
                      </Button>
                    </div>

                    {/* Badges */}
                    <div className="absolute left-2 top-2 flex flex-col gap-2">
                      {product.isNew && <Badge className="bg-yellow-500 text-black hover:bg-yellow-600">Nuevo</Badge>}
                      {product.originalPrice && (
                        <Badge className="bg-red-500 hover:bg-red-600">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off
                        </Badge>
                      )}
                      {product.stock <= 5 && (
                        <Badge variant="outline" className="border-orange-500 bg-white text-orange-500">
                          ¡Pocas unidades!
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-1 text-sm text-gray-500">{product.category}</div>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="mb-2 text-lg font-medium text-gray-900 transition-colors hover:text-red-600">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="mb-2 flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : i < product.rating
                                  ? "fill-yellow-400/50 text-yellow-400"
                                  : "text-gray-300",
                            )}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-gray-500">({product.reviews})</span>
                    </div>

                    <div className="flex items-center">
                      <div className="text-lg font-bold text-red-600">${product.price.toFixed(2)}</div>
                      {product.originalPrice && (
                        <div className="ml-2 text-sm text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
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

        {visibleProducts < products.length && (
          <div className="mt-12 flex justify-center">
            <Button
              onClick={showMoreProducts}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            >
              Cargar Más Productos
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
