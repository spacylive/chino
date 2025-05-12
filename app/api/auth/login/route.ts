import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json')

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Faltan datos' }, { status: 400 })
    }
    let users: any[] = []
    try {
      const file = await fs.readFile(USERS_PATH, 'utf-8')
      users = JSON.parse(file)
    } catch {
      return NextResponse.json({ success: false, message: 'Usuario no encontrado' }, { status: 404 })
    }
    const user = users.find(u => u.username === username && u.password === password)
    if (!user) {
      return NextResponse.json({ success: false, message: 'Credenciales inválidas' }, { status: 401 })
    }
    // Set cookie for user session (simple, no JWT)
    const response = NextResponse.json({ success: true, message: 'Login exitoso', user: { username: user.username, email: user.email } })
    response.cookies.set('user-session', user.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24
    })
    return response
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Error en el servidor' }, { status: 500 })
  }
}
