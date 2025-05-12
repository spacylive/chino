import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json')

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json()
    if (!username || !email || !password) {
      return NextResponse.json({ success: false, message: 'Faltan datos' }, { status: 400 })
    }
    let users: any[] = []
    try {
      const file = await fs.readFile(USERS_PATH, 'utf-8')
      users = JSON.parse(file)
    } catch {
      users = []
    }
    if (users.find(u => u.username === username || u.email === email)) {
      return NextResponse.json({ success: false, message: 'Usuario o email ya registrado' }, { status: 409 })
    }
    users.push({ username, email, password })
    await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2))
    return NextResponse.json({ success: true, message: 'Usuario registrado' })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Error en el servidor' }, { status: 500 })
  }
}
