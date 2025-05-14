import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const PRODUCTS_PATH = path.join(process.cwd(), 'public', 'data', 'products.json')

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const file = await fs.readFile(PRODUCTS_PATH, 'utf-8')
    const products = JSON.parse(file)
    const product = products.find((p: any) => p.id === params.id)
    if (!product) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
