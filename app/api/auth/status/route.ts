import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const userSession = cookieStore.get('user-session')
  if (userSession) {
    return NextResponse.json({ success: true, authenticated: true, username: userSession.value })
  }
  return NextResponse.json({ success: false, authenticated: false }, { status: 401 })
}
