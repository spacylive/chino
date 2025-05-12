"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, User, MapPin, Phone, Menu, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchError, setSearchError] = useState("")

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!searchTerm.trim()) {
      setSearchError("Por favor ingrese un término de búsqueda.")
      return
    }
    setSearchError("")
    window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`
  }

  // Demo cart count update
  useEffect(() => {
    // Simulate cart update after page load
    const timer = setTimeout(() => {
      setCartCount(3)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-white shadow-md" : "bg-white",
      )}
    >
      {/* Top bar with address and contact info */}
      <div className="bg-red-700 py-1 text-white">
        <div className="container mx-auto flex flex-col items-center justify-between px-4 sm:flex-row">
          <div className="flex items-center text-xs sm:text-sm">
            <MapPin className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            <span>Av Sucre 2865 Beccar-cp1643</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm">
            <Phone className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            <span>+54 11 4747-4567</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild className="mr-2 lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b py-4">
                    <div className="flex items-center gap-2">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-yellow-400 shadow-lg bg-white">
                        <img src="/images/dragon01.jpg" alt="Logo Universo" className="h-full w-full object-cover" />
                      </div>
                      <span className="text-2xl font-extrabold text-gradient bg-gradient-to-r from-red-600 via-yellow-400 to-red-700 bg-clip-text text-transparent drop-shadow-lg tracking-wide">
                        Supermercado Universo
                      </span>
                    </div>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                  </div>
                  <nav className="flex-1 space-y-2 overflow-auto py-6">
                    <Link href="/" className="block rounded-md px-4 py-2 hover:bg-gray-100">
                      Inicio
                    </Link>
                    <Link href="/products" className="block rounded-md px-4 py-2 hover:bg-gray-100">
                      Productos
                    </Link>
                    <Link href="/categories" className="block rounded-md px-4 py-2 hover:bg-gray-100">
                      Categorías
                    </Link>
                    <Link href="/offers" className="block rounded-md px-4 py-2 hover:bg-gray-100">
                      Ofertas
                    </Link>
                    <Link href="/about" className="block rounded-md px-4 py-2 hover:bg-gray-100">
                      Sobre Nosotros
                    </Link>
                    <Link href="/contact" className="block rounded-md px-4 py-2 hover:bg-gray-100">
                      Contacto
                    </Link>
                    <a
                      href="https://chinadaily.com.cn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-md px-4 py-2 hover:bg-gray-100 text-blue-700 font-semibold"
                    >
                      Blog
                    </a>
                  </nav>
                  <div className="border-t py-4">
                    <div className="space-y-3">
                      <Link href="/login" className="block rounded-md px-4 py-2 hover:bg-gray-100">
                        Iniciar Sesión
                      </Link>
                      <Link href="/register" className="block rounded-md px-4 py-2 hover:bg-gray-100">
                        Registrarse
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-yellow-400 shadow-lg bg-white">
                <img src="/images/dragon01.jpg" alt="Logo Universo" className="h-full w-full object-cover" />
              </div>
              <span className="text-2xl font-extrabold text-gradient bg-gradient-to-r from-red-600 via-yellow-400 to-red-700 bg-clip-text text-transparent drop-shadow-lg tracking-wide">
                Supermercado Universo
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="ml-8 hidden lg:flex lg:items-center lg:space-x-4">
              <Link href="/" className="text-sm font-medium text-gray-700 transition-colors hover:text-red-600">
                Inicio
              </Link>
              <Link href="/products" className="text-sm font-medium text-gray-700 transition-colors hover:text-red-600">
                Productos
              </Link>
              <Link
                href="/categories"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-red-600"
              >
                Categorías
              </Link>
              <Link href="/offers" className="text-sm font-medium text-gray-700 transition-colors hover:text-red-600">
                Ofertas
              </Link>
              <a
                href="https://chinadaily.com.cn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors font-semibold"
              >
                Blog
              </a>
            </nav>
          </div>

          <div
            className={cn(
              "hidden flex-1 items-center justify-center px-8 transition-all md:flex",
              searchFocused ? "md:px-0" : "md:px-8",
            )}
          >
            <form onSubmit={handleSearch} className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-500" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-12 pr-12 py-2 rounded-full border-2 border-yellow-400 focus:border-red-600 focus:ring-2 focus:ring-red-200 shadow-sm bg-white/80 text-gray-800 placeholder:text-gray-400"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value)
                  setSearchError("")
                }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                autoComplete="off"
              />
              <Button
                size="sm"
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-yellow-400 to-red-600 text-white font-bold shadow-md hover:from-yellow-500 hover:to-red-700 transition-all duration-200"
              >
                Buscar
              </Button>
            </form>
            {searchError && (
              <div className="text-xs text-red-600 mt-1 font-semibold animate-pulse">{searchError}</div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Mi cuenta</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/login" className="flex w-full cursor-pointer items-center">
                    Iniciar Sesión
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register" className="flex w-full cursor-pointer items-center">
                    Registrarse
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex w-full cursor-pointer items-center">
                    Mi Cuenta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="flex w-full cursor-pointer items-center">
                    Mis Pedidos
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="relative" onClick={() => (window.location.href = "/cart")}>
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Carrito de compras</span>
              <span
                className={cn(
                  "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white transition-all",
                  cartCount > 0 ? "scale-100" : "scale-0",
                )}
              >
                {cartCount}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="border-t py-2 md:hidden">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-500" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="pl-12 pr-12 py-2 rounded-full border-2 border-yellow-400 focus:border-red-600 focus:ring-2 focus:ring-red-200 shadow-sm bg-white/80 text-gray-800 placeholder:text-gray-400"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value)
                setSearchError("")
              }}
              autoComplete="off"
            />
            <Button
              size="sm"
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-yellow-400 to-red-600 text-white font-bold shadow-md hover:from-yellow-500 hover:to-red-700 transition-all duration-200"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
          {searchError && (
            <div className="text-xs text-red-600 mt-1 font-semibold animate-pulse">{searchError}</div>
          )}
        </div>
      </div>
    </header>
  )
}
