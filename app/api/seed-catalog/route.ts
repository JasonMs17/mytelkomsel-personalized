import { NextResponse } from 'next/server'
import { seedPackageCatalog } from '../../../lib/seed-catalog'

export async function POST(request: Request) {
  try {
    const result = await seedPackageCatalog()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json(
      { error: 'Failed to seed package catalog', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  return NextResponse.json({
    message: 'POST to this endpoint to seed the package catalog',
    endpoint: '/api/seed-catalog',
  })
}
