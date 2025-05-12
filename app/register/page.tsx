"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.username || !form.email || !form.password || !form.confirm) {
      toast({ title: "Completa todos los campos", variant: "destructive" })
      return
    }
    if (form.password !== form.confirm) {
      toast({ title: "Las contraseñas no coinciden", variant: "destructive" })
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({ title: "Registro exitoso", description: "Ya puedes iniciar sesión." })
      router.push("/login")
    }, 1200)
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-3xl font-bold mb-4">Registrarse</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="username">Usuario</Label>
          <Input id="username" name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="confirm">Repetir Contraseña</Label>
          <Input id="confirm" name="confirm" type="password" value={form.confirm} onChange={handleChange} required />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Registrando..." : "Registrarse"}
        </Button>
      </form>
    </main>
  )
}
