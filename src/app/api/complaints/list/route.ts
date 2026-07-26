// Admin: list all complaints (requires auth)
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req.headers.get('cookie'))
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const status = req.nextUrl.searchParams.get('status')
  const where = status ? { status } : {}
  const complaints = await db.complaint.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
  return NextResponse.json({ complaints })
}
