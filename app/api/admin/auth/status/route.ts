import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin-session')

  if (adminSession?.value === 'true') {
    return NextResponse.json({ 
      success: true,
      authenticated: true 
    })
  }

  return NextResponse.json({ 
    success: false,
    authenticated: false,
    message: 'No autenticado'
  }, { 
    status: 401 
  })
}
