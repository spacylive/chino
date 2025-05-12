"use client"
import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function AdminProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)

  // Cargar productos al montar
  React.useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(setProducts)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData()
    if (nameRef.current) formData.append("name", nameRef.current.value)
    if (priceRef.current) formData.append("price", priceRef.current.value)
    if (imageRef.current && imageRef.current.files?.[0]) formData.append("image", imageRef.current.files[0])
    const res = await fetch("/api/products", { method: "POST", body: formData })
    const data = await res.json()
    setIsLoading(false)
    if (data.success) {
      setProducts(p => [...p, data.product])
      toast({ title: "Producto agregado", description: data.product.name })
      if (nameRef.current) nameRef.current.value = ""
      if (priceRef.current) priceRef.current.value = ""
      if (imageRef.current) imageRef.current.value = ""
    } else {
      toast({ title: "Error", description: data.message, variant: "destructive" })
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Administrar Productos</h1>
      <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" name="name" ref={nameRef} required />
        </div>
        <div>
          <Label htmlFor="price">Precio</Label>
          <Input id="price" name="price" type="number" min="0" step="0.01" ref={priceRef} required />
        </div>
        <div>
          <Label htmlFor="image">Imagen</Label>
          <Input id="image" name="image" type="file" accept="image/*" ref={imageRef} required />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Agregando..." : "Agregar Producto"}
        </Button>
      </form>
      <h2 className="text-xl font-semibold mb-4">Productos existentes</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {products.map(product => (
          <div key={product.id} className="border rounded p-4 flex flex-col items-center">
            <img src={product.image} alt={product.name} className="h-32 object-contain mb-2" />
            <div className="font-bold">{product.name}</div>
            <div className="text-gray-600">${product.price}</div>
          </div>
        ))}
        {products.length === 0 && <div className="text-gray-500">No hay productos registrados.</div>}
      </div>
    </main>
  )
}
