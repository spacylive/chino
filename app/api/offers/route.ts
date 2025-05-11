// Endpoint para leer y actualizar el JSON de ofertas
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DATA_PATH = path.join(process.cwd(), "data", "offers.json")

export async function GET() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true })
    fs.writeFileSync(DATA_PATH, "[]")
  }
  const data = fs.readFileSync(DATA_PATH, "utf-8")
  return NextResponse.json(JSON.parse(data))
}

export async function POST(req: Request) {
  const offer = await req.json()
  let offers = []
  if (fs.existsSync(DATA_PATH)) {
    offers = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"))
  }
  offers.push(offer)
  fs.writeFileSync(DATA_PATH, JSON.stringify(offers, null, 2))
  return NextResponse.json({ success: true })
}
