"use client"
import { useEffect, useState } from "react"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(setProducts)
  }, [])

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Productos</h1>
      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map(product => (
            <button
              key={product.id}
              className="group border rounded-lg p-4 flex flex-col items-center bg-white shadow hover:ring-2 hover:ring-red-400 transition-all"
              onClick={() => window.location.href = `/product/${product.id}`}
              style={{ cursor: 'pointer' }}
            >
              <img src={product.image} alt={product.name} className="h-32 object-contain mb-2 transition-transform duration-300 ease-in-out group-hover:scale-110" />
              <div className="font-bold text-lg">{product.name}</div>
              <div className="text-gray-600 text-base">${product.price}</div>
            </button>
          ))}
        </div>
      )}
    </main>
  )
}
