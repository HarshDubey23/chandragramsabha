// Image upload API — allows admins to upload new images with Sharp processing.
// P0 from master improvement doc §3.3.
// Accepts multipart form data, processes with Sharp (resize max 1200px, WebP,
// generates 300px + 600px thumbnails), stores in /public/uploads/, creates
// ImageAsset DB record with category + bilingual captions + public toggle.
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { logActivity } from '@/lib/audit'
import sharp from 'sharp'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req.headers.get('cookie'))
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'invalid_form' }, { status: 400 })
  }

  const file = form.get('file')
  const category = (form.get('category') as string) || 'infrastructure.other'
  const hiCaption = (form.get('hiCaption') as string) || 'नई अपलोड की गई तस्वीर'
  const enCaption = (form.get('enCaption') as string) || 'Newly uploaded photograph'
  const isPublic = form.get('isPublic') === 'true' || form.get('isPublic') === null

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'missing_file' }, { status: 400 })
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'not_an_image' }, { status: 400 })
  }
  // 10MB max
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'file_too_large' }, { status: 413 })
  }

  const buf = Buffer.from(await file.arrayBuffer())
  const id = crypto.randomUUID()
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  fs.mkdirSync(uploadsDir, { recursive: true })

  try {
    // Process with Sharp: main image (max 1200px wide, WebP q80)
    const main = await sharp(buf)
      .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()
    const mainPath = path.join(uploadsDir, `${id}.webp`)
    fs.writeFileSync(mainPath, main)

    // Thumbnail 600px
    const thumb600 = await sharp(buf)
      .resize({ width: 600, height: 600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer()
    fs.writeFileSync(path.join(uploadsDir, `${id}-600.webp`), thumb600)

    // Thumbnail 300px
    const thumb300 = await sharp(buf)
      .resize({ width: 300, height: 300, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 70 })
      .toBuffer()
    fs.writeFileSync(path.join(uploadsDir, `${id}-300.webp`), thumb300)

    const url = `/uploads/${id}.webp`
    const imageId = 'up_' + id.replace(/-/g, '').slice(0, 16)
    const sha = crypto.createHash('sha256').update(buf).digest('hex')

    const asset = await db.imageAsset.create({
      data: {
        imageId,
        filename: file.name,
        url,
        sha256: sha,
        category,
        subcategory: null,
        hiCaption,
        enCaption,
        schemeLogos: JSON.stringify([]),
        purpose: 'asset-evidence',
        chatContext: JSON.stringify({
          uploadedBy: user.email,
          uploadedAt: new Date().toISOString(),
          originalSize: file.size,
        }),
        exif: null,
        geoInferred: null,
        facesDetected: 0,
        piiFlag: false,
        confidence: 1.0,
        isPublic,
      },
    })

    await logActivity({
      adminId: user.id,
      action: 'upload',
      entityType: 'image',
      entityId: imageId,
      after: { category, hiCaption, enCaption, isPublic, url },
      ip: req.headers.get('x-forwarded-for')?.split(',')[0] || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
    })

    return NextResponse.json({ ok: true, image: asset, url, thumbnails: { large: `/uploads/${id}-600.webp`, small: `/uploads/${id}-300.webp` } })
  } catch (e) {
    console.error('upload error', e)
    return NextResponse.json({ error: 'processing_failed', detail: String(e).slice(0, 200) }, { status: 500 })
  }
}


