// Endpoint para subir archivos multimedia (imágenes/videos)
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  const type = formData.get("type") as string // "image" | "video" | "thumbnail"
  if (!file || !type) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
  }
  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const dir = path.join(process.cwd(), "media", `${type}s`)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const filePath = path.join(dir, fileName)
  fs.writeFileSync(filePath, buffer)
  return NextResponse.json({ path: `/media/${type}s/${fileName}` })
}
