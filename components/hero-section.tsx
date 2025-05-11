"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Phone, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"

export default function HeroSection() {
  const [scrolled, setScrolled] = useState(false)

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative overflow-hidden py-20 text-white lg:py-28">
      {/* Background image with parallax effect */}
      <div
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{ transform: `translateY(${scrolled ? "5%" : "0"})` }}
      >
        <img
          src="/images/super-dragon.png"
          alt="Dragón chino tradicional"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-red-700/80"></div>
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            <span className="text-yellow-400">Supermercado</span> Kin
          </h1>
          <p className="mb-8 text-lg text-gray-100 md:text-xl">
            Descubra auténticos productos asiáticos de calidad para su experiencia culinaria gourmet
          </p>

          {/* Address and contact information */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8 flex flex-col items-center justify-center gap-4 rounded-lg bg-black/30 backdrop-blur-sm p-4 text-white sm:flex-row"
          >
            <div className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-yellow-400" />
              <span className="font-medium">Av Sucre 2865 Beccar-cp1643</span>
            </div>
            <div className="hidden h-6 border-l border-white/30 sm:block"></div>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-yellow-400" />
              <span>Lun-Sáb: 9:00-20:00</span>
            </div>
            <div className="hidden h-6 border-l border-white/30 sm:block"></div>
            <div className="flex items-center">
              <Phone className="mr-2 h-5 w-5 text-yellow-400" />
              <span>+54 11 4747-4567</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="group relative overflow-hidden bg-yellow-500 text-black transition-all hover:bg-yellow-400"
            >
              <span className="relative z-10">Comprar Ahora</span>
              <span className="absolute bottom-0 left-0 h-full w-0 bg-yellow-600 transition-all duration-300 group-hover:w-full"></span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white transition-all hover:bg-white hover:text-red-800"
            >
              Ver Ofertas
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
          <ChevronDown className="h-8 w-8 text-white/70" />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  )
}
