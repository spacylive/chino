import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Nota: En producción, estas credenciales deberían estar en variables de ambiente
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Crear una cookie de sesión
      const response = NextResponse.json({ 
        success: true, 
        message: 'Autenticación exitosa'
      })
      
      // En producción, usa opciones más seguras para la cookie
      response.cookies.set('admin-session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 horas
      })

      return response
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Credenciales inválidas'
    }, { status: 401 })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Error en el servidor'
    }, { status: 500 })
  }
}
