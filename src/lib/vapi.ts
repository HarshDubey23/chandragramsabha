type VapiEventHandler = (...args: unknown[]) => void
type EventName = 'call-start' | 'call-end' | 'error' | 'speech-start' | 'speech-end' | 'volume-level'

let vapi: any = null
const handlers = new Map<EventName, Set<VapiEventHandler>>()
let activeCall = false
let notifyState: ((active: boolean) => void) | null = null
let suppressNextError = false

function isMeetingEndedError(e: unknown): boolean {
  const msg = String((e as any)?.message ?? e?.toString?.() ?? e ?? '')
  return /meeting\s*(ended?|has ended|closed|due to ejection)/i.test(msg) || !msg || msg === '[object Object]' || msg === '{}'
}

async function getVapi() {
  if (typeof window === 'undefined') return null
  const key = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY
  if (!key) return null
  if (!vapi) {
    const Vapi = (await import('@vapi-ai/web')).default
    vapi = new (Vapi as any)(key, undefined, { noiseCancellation: false } as any)

    vapi.on('call-start', () => { activeCall = true; notifyState?.(true) })
    vapi.on('call-end', () => { activeCall = false; notifyState?.(false) })

    vapi.on('call-start-progress', (e: unknown) => {
      console.warn('[vapi-progress]', JSON.stringify(e))
    })
    vapi.on('call-start-failed', (e: unknown) => {
      console.warn('[vapi-failed]', JSON.stringify(e))
      for (const fn of (handlers.get('error') || [])) fn(e)
    })
    vapi.on('error', (e: unknown) => {
      const msg = String((e as any)?.message ?? e?.toString?.() ?? e ?? '')
      console.warn('[vapi-error]', msg)
      suppressNextError = suppressNextError || isMeetingEndedError(e)
      if (suppressNextError) { suppressNextError = false; return }
      for (const fn of (handlers.get('error') || [])) fn(e)
    })
  }
  return vapi
}

export function onVapiEvent(event: EventName, handler: VapiEventHandler) {
  if (!handlers.has(event)) handlers.set(event, new Set())
  handlers.get(event)!.add(handler)
  return () => { handlers.get(event)?.delete(handler) }
}

export function subscribeCallState(cb: (active: boolean) => void) {
  notifyState = cb
  return () => { notifyState = null }
}

export function isCallActive() { return activeCall }

export async function startVapiCall(assistantId?: string) {
  const v = await getVapi()
  if (!v) throw new Error('Vapi not configured')
  const id = assistantId || process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID
  if (!id) throw new Error('Assistant ID not configured')
  await v.start(id)
}

export function stopVapiCall() {
  suppressNextError = true
  vapi?.stop()
}
