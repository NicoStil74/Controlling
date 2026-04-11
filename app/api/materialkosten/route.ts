import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('/api/materialkosten', {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Backend response was not ok' }, { status: response.status })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ error: 'Failed to connect to api' }, { status: 500 })
  }
}
