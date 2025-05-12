"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Primero intenta login admin
    let adminRes = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    if (adminRes.ok) {
      toast({ title: "Bienvenido administrador", description: "Acceso al panel de administración" })
      setIsLoading(false)
      router.push("/admin")
      return
    }
    // Si no es admin, intenta login usuario normal
    let userRes = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    if (userRes.ok) {
      toast({ title: "Login exitoso", description: "Bienvenido a tu cuenta" })
      setIsLoading(false)
      router.push("/account")
      return
    }
    // Si ambos fallan, mostrar error
    setIsLoading(false)
    setError("Usuario o contraseña incorrectos")
    toast({ title: "Error de acceso", description: "Usuario o contraseña incorrectos", variant: "destructive" })
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
      <form className="w-full max-w-md space-y-6 bg-white rounded shadow p-8" onSubmit={handleLogin}>
        <h1 className="text-2xl font-bold text-center mb-2">Iniciar Sesión</h1>
        <div>
          <Label htmlFor="username">Usuario</Label>
          <Input id="username" name="username" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Ingresando..." : "Ingresar"}
        </Button>
        <div className="text-center text-sm mt-2">
          ¿No tienes cuenta? <a href="/register" className="text-blue-600 hover:underline">Regístrate</a>
        </div>
      </form>
    </div>
  )
}
