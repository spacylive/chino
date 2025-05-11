"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"

export default function HeroSection() {
  const [scrolled, setScrolled] = useState(false)
  const [showSubscribe, setShowSubscribe] = useState(false)
  const [email, setEmail] = useState("")
  const [subscribeMsg, setSubscribeMsg] = useState("")

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Función para manejar la suscripción
  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    setSubscribeMsg("¡Gracias por suscribirte!")
    setTimeout(() => {
      setShowSubscribe(false)
      setSubscribeMsg("")
      setEmail("")
    }, 2000)
  }

  return (
    <section className="relative overflow-hidden py-20 text-white lg:py-28">
      {/* Background image with parallax effect */}
      <div
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{ transform: `translateY(${scrolled ? "5%" : "0"})` }}
      >
        <img
          src="/images/super.png"
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
            <span className="text-yellow-400">Supermercado</span> Universo
          </h1>
          <p className="mb-8 text-lg text-gray-100 md:text-xl">
            Encontrá las mejores Ofertas en Beccar
          </p>

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
              onClick={() => {
                const ofertasSection = document.getElementById("ofertas");
                if (ofertasSection) {
                  ofertasSection.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = "/offers";
                }
              }}
            >
              Ver Ofertas
            </Button>
            {/* Botón de suscripción */}
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-red-800 border border-yellow-400 hover:bg-yellow-100"
              onClick={() => setShowSubscribe(true)}
            >
              Suscribirse
            </Button>
          </motion.div>

          {/* Modal de suscripción */}
          {showSubscribe && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-white rounded-lg p-8 max-w-sm w-full text-black relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                  onClick={() => setShowSubscribe(false)}
                  aria-label="Cerrar"
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold mb-4 text-red-800">Suscribite a nuestras ofertas</h2>
                <form onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    required
                    placeholder="Tu email"
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-yellow-500"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-yellow-500 text-black hover:bg-yellow-400"
                  >
                    Suscribirme
                  </Button>
                  {subscribeMsg && (
                    <p className="mt-3 text-green-600 text-center">{subscribeMsg}</p>
                  )}
                </form>
              </div>
            </div>
          )}
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
