// Admin: update complaint status (with audit log + timeline append)
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser, requireRole } from '@/lib/auth'
import { logActivity } from '@/lib/audit'

export async function POST(req: NextRequest) {
  const user = await requireRole(req.headers.get('cookie'), 'secretary')
  if (!user) return NextResponse.json({ error: 'unauthorized', message: 'संपादक या उच्च अनुमति आवश्यक' }, { status: 403 })

  const body = await req.json()
  const { trackingId, status, resolutionNote, assignedToId } = body
  if (!trackingId || !status) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 })
  }
  const valid = ['Pending', 'InProgress', 'Resolved', 'Rejected']
  if (!valid.includes(status)) {
    return NextResponse.json({ error: 'invalid status' }, { status: 400 })
  }

  const existing = await db.complaint.findUnique({ where: { trackingId } })
  if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  // Append to timeline
  const oldTimeline = existing.timeline ? JSON.parse(existing.timeline) : []
  const newEntry = {
    status,
    ts: new Date().toISOString(),
    note: resolutionNote || `Status changed to ${status}`,
    by: user.id,
  }
  const newTimeline = [...oldTimeline, newEntry]

  const updated = await db.complaint.update({
    where: { trackingId },
    data: {
      status,
      resolutionNote: resolutionNote ?? existing.resolutionNote,
      resolvedAt: status === 'Resolved' || status === 'Rejected' ? new Date() : existing.resolvedAt,
      assignedToId: assignedToId ?? existing.assignedToId,
      timeline: JSON.stringify(newTimeline),
    },
  })

  await logActivity({
    adminId: user.id,
    action: 'update',
    entityType: 'complaint',
    entityId: trackingId,
    before: { status: existing.status, resolutionNote: existing.resolutionNote },
    after: { status, resolutionNote },
    ip: req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || undefined,
    userAgent: req.headers.get('user-agent') || undefined,
  })

  return NextResponse.json({ ok: true, complaint: updated })
}
