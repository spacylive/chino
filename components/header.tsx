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
                      <div className="relative h-8 w-8 overflow-hidden rounded-full bg-red-600">
                        <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                          K
                        </div>
                      </div>
                      <span className="text-xl font-bold text-red-600">Supermercado Kin</span>
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
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-red-600">
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">K</div>
              </div>
              <span className="text-xl font-bold text-red-600">Supermercado Kin</span>
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
            </nav>
          </div>

          <div
            className={cn(
              "hidden flex-1 items-center justify-center px-8 transition-all md:flex",
              searchFocused ? "md:px-0" : "md:px-8",
            )}
          >
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-10 pr-10 transition-all focus-visible:ring-red-500"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <Button size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700">
                Buscar
              </Button>
            </div>
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input type="search" placeholder="Buscar productos..." className="pl-10 pr-10" />
            <Button size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
