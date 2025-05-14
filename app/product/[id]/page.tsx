import { notFound } from "next/navigation"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/products/${params.id}`, { cache: "no-store" })
  if (!res.ok) return notFound()
  const product = await res.json()
  if (!product || product.error) return notFound()
  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <img src={product.image} alt={product.name} className="h-64 w-64 object-contain rounded shadow" />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="text-xl text-red-600 font-semibold mb-4">${Number(product.price).toLocaleString()}</div>
          <p className="text-gray-700 mb-4">ID: {product.id}</p>
        </div>
      </div>
    </main>
  )
}
