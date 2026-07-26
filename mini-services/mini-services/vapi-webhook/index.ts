/**
 * chandra-vapi-webhook — Vapi Voice Complaint webhook mini-service
 * Master Prompt v2.0 §5.4 — adapted to sandbox constraints.
 *
 * Endpoint:   POST /vapi-webhook    — ingest a Vapi call payload, store complaint, mock WhatsApp dispatch
 *             GET  /health          — liveness probe
 *             GET  /                — human-readable HTML doc page
 *
 * Port: 3003 (HARDCODED per spec — not overridable by env)
 *
 * Sandbox adaptations:
 *   - HMAC verification is IMPLEMENTED but SKIPPED in dev mode
 *     (when VAPI_SECRET is unset OR equals literal "dev-secret").
 *   - WhatsApp dispatch is MOCKED: the formatted Hindi message is
 *     written to console + appended to ./whatsapp-outbox.log instead
 *     of calling the real Meta Graph API (no real credentials in sandbox).
 *   - Complaints are stored in the same SQLite DB via Prisma —
 *     @prisma/client is imported directly from the main workspace
 *     node_modules to share the generated client.
 *
 * The frontend calls this service via the gateway as
 *   fetch('/vapi-webhook?XTransformPort=3003', ...)
 * — but this service itself just listens on port 3003 normally.
 */

import { createHmac, timingSafeEqual } from 'node:crypto'
import { appendFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { PrismaClient } from '/home/z/my-project/node_modules/@prisma/client'

// ─── Hardcoded port per spec ──────────────────────────────────────────────
const PORT = 3003

// ─── Resolve paths ─────────────────────────────────────────────────────────
const SERVICE_DIR = dirname(new URL(import.meta.url).pathname)
const OUTBOX_LOG = resolve(SERVICE_DIR, 'whatsapp-outbox.log')

// ─── Env (with safe fallbacks for dev) ─────────────────────────────────────
// Bun loads .env automatically, but we explicitly default DATABASE_URL so the
// service works even if no .env file is present.
process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'file:/home/z/my-project/db/custom.db'

const VAPI_SECRET = process.env.VAPI_SECRET || ''
const VAPI_IP_ALLOWLIST_RAW = process.env.VAPI_IP_ALLOWLIST || ''

// Dev mode = secret unset OR equals the literal "dev-secret".
const DEV_MODE = VAPI_SECRET === '' || VAPI_SECRET === 'dev-secret'

// ─── Prisma client (shared SQLite file with the main portal) ──────────────
const db = new PrismaClient()

// ─── Allowed categories (per prisma schema comment on Complaint.category) ─
const ALLOWED_CATEGORIES = new Set([
  'water',
  'road',
  'school',
  'housing',
  'pension',
  'mgnrega',
  'other',
])

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Extract client IP from x-forwarded-for (Caddy gateway) or Bun's requestIP. */
function getClientIp(req: Request, server: any): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) {
    return xff.split(',')[0].trim()
  }
  const xri = req.headers.get('x-real-ip')
  if (xri) return xri.trim()
  try {
    const ip = server.requestIP(req) as { address: string } | null
    if (ip?.address) return ip.address
  } catch {
    /* ignore — server.requestIP may be unavailable */
  }
  return 'unknown'
}

/** Constant-time HMAC-SHA256 hex comparison. Returns true on match. */
function verifyHmac(rawBody: string, signature: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

/** Generate the tracking id: GPCH-<base36 of Date.now(), uppercased>. */
function generateTrackingId(): string {
  return `GPCH-${Date.now().toString(36).toUpperCase()}`
}

/** Safely read a (possibly missing) string field from a nested object. */
function str(val: unknown, fallback = ''): string {
  return typeof val === 'string' && val.length > 0 ? val : fallback
}

/** Normalize a category against the allowed enum; default to 'other'. */
function normalizeCategory(val: unknown): string {
  const c = typeof val === 'string' ? val.trim().toLowerCase() : ''
  return ALLOWED_CATEGORIES.has(c) ? c : 'other'
}

/** Append a WhatsApp mock message to console + outbox log file. */
function mockWhatsAppDispatch(msg: string): void {
  const stamp = new Date().toISOString()
  const block = `\n[${stamp}]\n${msg}\n---\n`
  // 1) console
  console.log('[vapi-webhook] WhatsApp outbox (mock dispatch):')
  console.log(msg)
  console.log('---')
  // 2) append to log file
  try {
    mkdirSync(SERVICE_DIR, { recursive: true })
    appendFileSync(OUTBOX_LOG, block, 'utf8')
  } catch (e) {
    console.error(`[vapi-webhook] failed to append outbox log:`, e)
  }
}

// ─── JSON helpers (manual, so we keep the RAW body for HMAC) ──────────────
function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  })
}

// ─── Webhook handler ──────────────────────────────────────────────────────
async function handleWebhook(req: Request, server: any): Promise<Response> {
  // ─── 1. IP allowlist check ──────────────────────────────────────────────
  const clientIp = getClientIp(req, server)
  if (VAPI_IP_ALLOWLIST_RAW.trim().length > 0) {
    const allowlist = VAPI_IP_ALLOWLIST_RAW
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const allowed =
      allowlist.includes('*') ||
      allowlist.some((allowed) => clientIp === allowed || clientIp.endsWith(`.${allowed}`))
    if (!allowed) {
      console.warn(`[vapi-webhook] 403 IP not in allowlist: ${clientIp}`)
      return json({ ok: false, error: 'IP not allowed', ip: clientIp }, 403)
    }
  } else {
    console.warn(
      '[vapi-webhook] WARNING: VAPI_IP_ALLOWLIST not set — allowing all IPs (dev only).',
    )
  }

  // ─── 2. Read raw body (preserve for HMAC) ──────────────────────────────
  const rawBody = await req.text()

  // ─── 3. HMAC-SHA256 verify ──────────────────────────────────────────────
  if (DEV_MODE) {
    const reason = VAPI_SECRET === '' ? 'VAPI_SECRET unset' : 'VAPI_SECRET=dev-secret'
    console.warn(
      `[vapi-webhook] WARNING: DEV MODE — HMAC verification SKIPPED (${reason}).`,
    )
  } else {
    const sig = req.headers.get('x-vapi-signature') || ''
    if (!sig) {
      console.warn('[vapi-webhook] 401 missing x-vapi-signature header')
      return json({ ok: false, error: 'Missing signature' }, 401)
    }
    if (!verifyHmac(rawBody, sig, VAPI_SECRET)) {
      console.warn('[vapi-webhook] 401 HMAC signature mismatch')
      return json({ ok: false, error: 'Invalid signature' }, 401)
    }
  }

  // ─── 4. Parse JSON payload ──────────────────────────────────────────────
  let payload: any
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return json({ ok: false, error: 'Invalid JSON body' }, 400)
  }

  // Vapi structure: { message: { call: { id, customer: { number }, transcript, analysis: { structuredData } } } }
  const call = payload?.message?.call
  if (!call || typeof call !== 'object' || !call.id) {
    console.warn('[vapi-webhook] 400 missing message.call.id in payload')
    return json({ ok: false, error: 'Missing message.call.id' }, 400)
  }

  const vapiCallId = str(call.id)
  const callerPhone = str(call?.customer?.number)
  const transcript = str(call?.transcript)
  const structured = (call?.analysis?.structuredData || {}) as Record<string, unknown>
  const callerName = str(structured.caller_name, 'अनाम')
  const callReason = str(structured.call_reason, transcript)
  const category = normalizeCategory(structured.category)

  if (!callReason) {
    return json({ ok: false, error: 'Missing call_reason / transcript' }, 400)
  }

  // ─── 5. Idempotency check on vapiCallId ────────────────────────────────
  try {
    const existing = await db.complaint.findFirst({
      where: { vapiCallId },
      select: { id: true, trackingId: true },
    })
    if (existing) {
      console.log(
        `[vapi-webhook] DEDUPED — complaint already exists for vapiCallId=${vapiCallId} (trackingId=${existing.trackingId})`,
      )
      return json({ ok: true, deduped: true })
    }
  } catch (e) {
    console.error('[vapi-webhook] DB error during dedup check:', e)
    return json({ ok: false, error: 'Database error' }, 500)
  }

  // ─── 6. Generate tracking ID ───────────────────────────────────────────
  const trackingId = generateTrackingId()

  // ─── 7. Build initial timeline entry ───────────────────────────────────
  const nowIso = new Date().toISOString()
  const timeline = [
    {
      status: 'Pending',
      ts: nowIso,
      note: 'AI voice assistant filed complaint',
      by: 'vapi-assistant',
    },
  ]

  // ─── 8. Insert complaint ───────────────────────────────────────────────
  try {
    await db.complaint.create({
      data: {
        trackingId,
        vapiCallId,
        callerName,
        callerPhone,
        callReason,
        category,
        status: 'Pending',
        rawTranscript: transcript,
        timeline: JSON.stringify(timeline),
      },
    })
  } catch (e) {
    console.error('[vapi-webhook] DB insert failed:', e)
    return json({ ok: false, error: 'Failed to insert complaint' }, 500)
  }

  // ─── 9. Mock WhatsApp dispatch (console + outbox log) ──────────────────
  const waMsg = [
    '🔔 नई शिकायत दर्ज!',
    `नाम: ${callerName}`,
    `फ़ोन: ${callerPhone}`,
    `श्रेणी: ${category}`,
    `ट्रैकिंग आईडी: ${trackingId}`,
    `शिकायत: ${callReason}`,
  ].join('\n')
  mockWhatsAppDispatch(waMsg)

  // ─── 10. Return success ────────────────────────────────────────────────
  console.log(
    `[vapi-webhook] OK — complaint inserted: trackingId=${trackingId} vapiCallId=${vapiCallId} category=${category}`,
  )
  return json({ ok: true, tracking_id: trackingId })
}

// ─── HTML doc page (for curious browser visitors) ────────────────────────
const HTML_DOC = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Vapi Webhook Service — Gram Panchayat Chandra</title>
  <style>
    :root { color-scheme: light dark; }
    body {
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Devanagari", sans-serif;
      max-width: 880px; margin: 0 auto; padding: 32px 20px 80px; line-height: 1.6;
      background: #fafaf9; color: #1c1917;
    }
    @media (prefers-color-scheme: dark) { body { background: #0c0a09; color: #fafaf9; } }
    h1 { font-size: 1.6rem; margin: 0 0 4px; }
    h2 { font-size: 1.15rem; margin: 28px 0 8px; border-bottom: 1px solid #78716c33; padding-bottom: 4px; }
    .sub { color: #78716c; font-size: 0.9rem; margin-bottom: 8px; }
    code, pre {
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
      background: #e7e5e4; padding: 2px 6px; border-radius: 4px; font-size: 0.86rem;
    }
    @media (prefers-color-scheme: dark) { code, pre { background: #1c1917; } }
    pre {
      padding: 14px 16px; overflow-x: auto; border-radius: 8px; line-height: 1.45;
      white-space: pre-wrap; word-break: break-word;
    }
    table { border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 0.9rem; }
    th, td { border: 1px solid #78716c55; padding: 8px 10px; text-align: left; vertical-align: top; }
    th { background: #e7e5e4; }
    @media (prefers-color-scheme: dark) { th { background: #1c1917; } }
    .badge {
      display: inline-block; padding: 2px 10px; border-radius: 999px;
      background: #16a34a; color: white; font-size: 0.74rem; font-weight: 600; margin-left: 6px;
    }
    .back { display: inline-block; margin-top: 28px; text-decoration: none; color: #16a34a; font-weight: 600; }
    .grid { display: grid; gap: 12px; grid-template-columns: 1fr; }
    @media (min-width: 700px) { .grid { grid-template-columns: 1fr 1fr; } }
    .card { border: 1px solid #78716c44; border-radius: 10px; padding: 14px 16px; }
    .card h3 { margin: 0 0 6px; font-size: 0.98rem; }
    .card p { margin: 0; font-size: 0.86rem; color: #78716c; }
    @media (prefers-color-scheme: dark) { .card p { color: #a8a29e; } }
  </style>
</head>
<body>
  <h1>Vapi Voice-Complaint Webhook <span class="badge">port 3003</span></h1>
  <p class="sub">Gram Panchayat Chandra — Digital Governance Portal · Master Prompt v2.0 §5.4</p>

  <p>यह सेवा Vapi वॉइस कॉल से आने वाली शिकायतों को स्वीकार करती है, HMAC-SHA256 से सत्यापित करती है,
  SQLite डेटाबेस (Prisma <code>Complaint</code> मॉडल) में दर्ज करती है, और एक WhatsApp सूचना (mock) भेजती है।
  Sandbox मोड में WhatsApp डिस्पैच को कंसोल + <code>whatsapp-outbox.log</code> में लॉग किया जाता है।</p>

  <h2>Endpoints</h2>
  <table>
    <tr><th>Method</th><th>Path</th><th>Description</th></tr>
    <tr><td><code>POST</code></td><td><code>/vapi-webhook</code></td><td>Receive a Vapi call payload, verify HMAC, dedupe by <code>call.id</code>, insert complaint, mock WhatsApp dispatch.</td></tr>
    <tr><td><code>GET</code></td><td><code>/health</code></td><td>Liveness probe → <code>{ ok, service, port, ts }</code></td></tr>
    <tr><td><code>GET</code></td><td><code>/</code></td><td>This documentation page.</td></tr>
  </table>

  <h2>POST /vapi-webhook — request flow</h2>
  <ol>
    <li><b>IP allowlist</b> — <code>VAPI_IP_ALLOWLIST</code> env (comma-separated). If empty in dev, allow all but log a warning. Reject 403 if client IP not in allowlist.</li>
    <li><b>HMAC-SHA256 verify</b> — header <code>x-vapi-signature</code> must equal <code>HMAC-SHA256(rawBody, VAPI_SECRET)</code> using <code>crypto.timingSafeEqual</code>. In dev (secret unset OR <code>dev-secret</code>) verification is SKIPPED.</li>
    <li><b>Idempotency</b> — if <code>Complaint.vapiCallId</code> already exists, return <code>{ ok: true, deduped: true }</code>.</li>
    <li><b>Insert</b> — tracking id <code>GPCH-&lt;base36(Date.now())&gt;</code>, parse <code>message.call</code> → <code>id</code>, <code>customer.number</code>, <code>transcript</code>, <code>analysis.structuredData.{caller_name, call_reason, category}</code>. Default category <code>other</code>. Status <code>Pending</code>.</li>
    <li><b>Mock WhatsApp dispatch</b> — formatted Hindi message logged to console AND appended to <code>whatsapp-outbox.log</code>.</li>
    <li><b>Return</b> <code>{ ok: true, tracking_id }</code>.</li>
  </ol>

  <h2>Expected payload shape (Vapi)</h2>
  <pre>{
  "message": {
    "call": {
      "id": "call-abc-123",
      "customer": { "number": "+919876543210" },
      "transcript": "नमस्कार...शिकायत: हैंडपंप खराब",
      "analysis": {
        "structuredData": {
          "caller_name": "रामावतार",
          "call_reason": "हैंडपंप खराब है",
          "category": "water"
        }
      }
    }
  }
}</pre>

  <h2>Mock WhatsApp outbox message</h2>
  <pre>🔔 नई शिकायत दर्ज!
नाम: रामावतार
फ़ोन: +919876543210
श्रेणी: water
ट्रैकिंग आईडी: GPCH-LXYZ123
शिकायत: हैंडपंप खराब है</pre>

  <h2>Test with curl (dev mode — no HMAC needed)</h2>
  <pre>curl -s -X POST http://localhost:3003/vapi-webhook \\
  -H 'Content-Type: application/json' \\
  -d '{"message":{"call":{"id":"test-call-001","customer":{"number":"+919651035099"},"transcript":"नमस्कार...शिकायत: हैंडपंप खराब","analysis":{"structuredData":{"caller_name":"रामावतार","call_reason":"हैंडपंप खराब है","category":"water"}}}}}'</pre>

  <p>First call returns <code>{ "ok": true, "tracking_id": "GPCH-..." }</code>.
  A second call with the same <code>id</code> returns <code>{ "ok": true, "deduped": true }</code> (idempotency).</p>

  <h2>Health check</h2>
  <pre>curl -s http://localhost:3003/health
# → {"ok":true,"service":"vapi-webhook","port":3003,"ts":"2026-07-25T..."}</pre>

  <h2>Environment variables</h2>
  <div class="grid">
    <div class="card">
      <h3><code>VAPI_SECRET</code></h3>
      <p>HMAC-SHA256 secret shared with Vapi. If unset OR <code>dev-secret</code>, verification is skipped (dev mode).</p>
    </div>
    <div class="card">
      <h3><code>VAPI_IP_ALLOWLIST</code></h3>
      <p>Comma-separated allowed client IPs. If empty, all IPs are allowed (dev only, with warning).</p>
    </div>
    <div class="card">
      <h3><code>DATABASE_URL</code></h3>
      <p>SQLite path. Defaults to <code>file:/home/z/my-project/db/custom.db</code> (shared with main portal).</p>
    </div>
    <div class="card">
      <h3>Port</h3>
      <p>Hardcoded <code>3003</code> — not overridable by env (per spec).</p>
    </div>
  </div>

  <a class="back" href="/?XTransformPort=3000">← वापस मुख्य पोर्टल पर जाएँ / Back to main portal</a>
</body>
</html>`

// ─── Bun server ───────────────────────────────────────────────────────────
const server = Bun.serve({
  port: PORT,
  async fetch(req, server) {
    const url = new URL(req.url)
    const path = url.pathname

    // GET /health
    if (req.method === 'GET' && path === '/health') {
      return json({
        ok: true,
        service: 'vapi-webhook',
        port: PORT,
        ts: new Date().toISOString(),
      })
    }

    // GET / → HTML doc page
    if (req.method === 'GET' && (path === '/' || path === '')) {
      return new Response(HTML_DOC, {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      })
    }

    // POST /vapi-webhook → main webhook
    if (req.method === 'POST' && path === '/vapi-webhook') {
      return handleWebhook(req, server)
    }

    // 404
    return json({ ok: false, error: 'Not Found', path }, 404)
  },
  error(err) {
    console.error('[vapi-webhook] uncaught server error:', err)
    return json({ ok: false, error: 'Internal Server Error' }, 500)
  },
})

console.log(`[vapi-webhook] listening on http://localhost:${PORT}`)
console.log(
  `[vapi-webhook] dev_mode=${DEV_MODE} (HMAC ${DEV_MODE ? 'SKIPPED' : 'ENABLED'}) | ` +
    `IP allowlist ${VAPI_IP_ALLOWLIST_RAW ? 'ENABLED' : 'OPEN (dev)'}`,
)
console.log(`[vapi-webhook] DATABASE_URL=${process.env.DATABASE_URL}`)
console.log(`[vapi-webhook] outbox log: ${OUTBOX_LOG}`)

// Graceful shutdown — close Prisma connection
process.on('SIGINT', () => {
  console.log('[vapi-webhook] SIGINT — shutting down...')
  db.$disconnect().finally(() => process.exit(0))
})
process.on('SIGTERM', () => {
  console.log('[vapi-webhook] SIGTERM — shutting down...')
  db.$disconnect().finally(() => process.exit(0))
})

export { server }
