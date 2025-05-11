"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock, ArrowRight, Check } from "lucide-react"
import { motion } from "framer-motion"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubscribed(true)
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false)
        setEmail("")
      }, 3000)
    }, 1000)
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter banner */}
      <div className="bg-red-700 py-10 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="max-w-md">
              <h3 className="mb-2 text-2xl font-bold">Suscríbase a Nuestro Boletín</h3>
              <p className="text-red-100">
                Reciba ofertas exclusivas, recetas y noticias sobre nuevos productos directamente en su bandeja de
                entrada.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md flex-1">
              <div className="relative flex w-full items-center">
                <Input
                  type="email"
                  placeholder="Su correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 flex-1 rounded-l-md border-red-600 bg-white/10 px-4 text-white placeholder:text-red-100 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  disabled={isLoading || isSubscribed}
                  required
                />
                <Button
                  type="submit"
                  className="h-12 rounded-l-none rounded-r-md bg-yellow-500 px-6 text-black hover:bg-yellow-400"
                  disabled={isLoading || isSubscribed}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                      Enviando...
                    </span>
                  ) : isSubscribed ? (
                    <span className="flex items-center">
                      <Check className="mr-2 h-4 w-4" />
                      ¡Suscrito!
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Suscribirse
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Supermercado Kin</h3>
            <p className="mb-4 text-sm">
              Su destino para productos de calidad en Beccar. Ofrecemos una amplia selección de
              productos.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="group text-gray-400 transition-colors hover:text-white">
                <Facebook className="h-5 w-5 transition-transform group-hover:scale-110" />
              </Link>
              <Link href="#" className="group text-gray-400 transition-colors hover:text-white">
                <Instagram className="h-5 w-5 transition-transform group-hover:scale-110" />
              </Link>
              <Link href="#" className="group text-gray-400 transition-colors hover:text-white">
                <Twitter className="h-5 w-5 transition-transform group-hover:scale-110" />
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <motion.li
                className="flex items-start"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <MapPin className="mr-2 mt-0.5 h-4 w-4 text-red-500" />
                <span>Av Sucre 2865 Beccar-cp1643</span>
              </motion.li>
              <motion.li
                className="flex items-center"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Phone className="mr-2 h-4 w-4 text-red-500" />
                <span>+54 11 4747-4567</span>
              </motion.li>
              <motion.li
                className="flex items-center"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Mail className="mr-2 h-4 w-4 text-red-500" />
                <span>info@supermercadokin.com</span>
              </motion.li>
              <motion.li
                className="flex items-center"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Clock className="mr-2 h-4 w-4 text-red-500" />
                <span>Lun-Sáb: 9:00-20:00, Dom: 10:00-18:00</span>
              </motion.li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: "Inicio", href: "/" },
                { name: "Productos", href: "/products" },
                { name: "Sobre Nosotros", href: "/about" },
                { name: "Contacto", href: "/contact" },
                { name: "Blog", href: "/blog" },
                { name: "Preguntas Frecuentes", href: "/faq" },
              ].map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link href={link.href} className="flex items-center hover:text-white hover:underline">
                    <ArrowRight className="mr-2 h-3 w-3" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Horario de Atención</h3>
            <ul className="space-y-2 text-sm">
              {[
                { day: "Lunes", hours: "9:00 - 20:00" },
                { day: "Martes", hours: "9:00 - 20:00" },
                { day: "Miércoles", hours: "9:00 - 20:00" },
                { day: "Jueves", hours: "9:00 - 20:00" },
                { day: "Viernes", hours: "9:00 - 20:00" },
                { day: "Sábado", hours: "9:00 - 20:00" },
                { day: "Domingo", hours: "10:00 - 18:00" },
              ].map((schedule, index) => (
                <li key={index} className="flex justify-between">
                  <span>{schedule.day}</span>
                  <span>{schedule.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Supermercado Kin. Todos los derechos reservados.</p>
          <p className="mt-1 text-xs text-gray-400">Papiweb desarrollos informaticos</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link href="/privacy" className="hover:text-white hover:underline">
              Política de Privacidad
            </Link>
            <Link href="/terms" className="hover:text-white hover:underline">
              Términos de Servicio
            </Link>
            <Link href="/shipping" className="hover:text-white hover:underline">
              Política de Envíos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
