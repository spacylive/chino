import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const PRODUCTS_PATH = path.join(process.cwd(), 'public', 'data', 'products.json')

export async function GET() {
  try {
    const file = await fs.readFile(PRODUCTS_PATH, 'utf-8')
    const products = JSON.parse(file)
    return NextResponse.json(products)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.formData()
    const name = data.get('name') as string
    const price = data.get('price') as string
    const image = data.get('image') as File
    if (!name || !price || !image) {
      return NextResponse.json({ success: false, message: 'Faltan datos' }, { status: 400 })
    }
    // Guardar imagen en /public/images
    const buffer = Buffer.from(await image.arrayBuffer())
    const filename = `${Date.now()}-${image.name}`.replace(/\s+/g, '-')
    const filepath = path.join(process.cwd(), 'public', 'images', filename)
    await fs.writeFile(filepath, buffer)
    // Guardar producto
    let products = []
    try {
      const file = await fs.readFile(PRODUCTS_PATH, 'utf-8')
      products = JSON.parse(file)
    } catch { products = [] }
    // Generar id único usando timestamp y nombre
    const uniqueId = `${Date.now()}-${name.replace(/\s+/g, '').toLowerCase()}`
    const newProduct = { id: uniqueId, name, price, image: `/images/${filename}` }
    products.push(newProduct)
    await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2))
    return NextResponse.json({ success: true, product: newProduct })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Error en el servidor' }, { status: 500 })
  }
}
