'use client'
import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { startVapiCall, stopVapiCall, subscribeCallState, onVapiEvent } from '@/lib/vapi'
import { Mic, Loader2, PhoneOff } from 'lucide-react'

type CallState = 'idle' | 'connecting' | 'active' | 'ending'
const CONNECT_TIMEOUT_MS = 20_000

export function AIVoiceButton() {
  const { locale } = useI18n()
  const [state, setState] = useState<CallState>('idle')
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const unsubState = subscribeCallState((active) => {
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
      setState(active ? 'active' : 'idle')
    })
    const unsubError = onVapiEvent('error', () => {
      setError(locale === 'hi'
        ? 'Vapi असिस्टेंट से कनेक्ट नहीं हो पाया। कृपया Vapi डैशबोर्ड में असिस्टेंट को पब्लिश करें और Public Key वेरीफाई करें।'
        : 'Could not connect to Vapi assistant. Publish the assistant in Vapi dashboard and verify the Public Key.')
      setState('idle')
    })
    return () => {
      unsubState()
      unsubError()
      stopVapiCall()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [locale])

  const toggle = async () => {
    setError(null)
    if (state === 'active' || state === 'connecting') {
      setState('ending')
      stopVapiCall()
      setState('idle')
      return
    }
    setState('connecting')
    timeoutRef.current = setTimeout(() => {
      if (state === 'connecting') {
        stopVapiCall()
        setError(locale === 'hi'
          ? 'कॉल कनेक्ट नहीं हो पाया (20 सेकंड टाइमआउट)। Vapi असिस्टेंट को पब्लिश करें या Public Key चेक करें।'
          : 'Call connection timed out (20s). Publish the assistant or check the Public Key.')
        setState('idle')
      }
    }, CONNECT_TIMEOUT_MS)
    try {
      await startVapiCall()
    } catch (e) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setError(locale === 'hi'
        ? 'कॉल शुरू नहीं हो पाया। Vapi सेटअप चेक करें — असिस्टेंट पब्लिश है? Public Key सही है?'
        : 'Could not start the call. Check Vapi setup — is the assistant published? Is the Public Key correct?')
      setState('idle')
    }
  }

  const label = state === 'active'
    ? locale === 'hi' ? 'AI से बात हो रही है… समाप्त करें' : 'Talking to AI… tap to end'
    : state === 'connecting'
      ? locale === 'hi' ? 'Vapi से कनेक्ट हो रहा है…' : 'Connecting to Vapi…'
      : locale === 'hi' ? 'AI सहायक से बात करें' : 'Talk to AI assistant'

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {error && (
        <div className="max-w-[260px] rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive shadow-lg">{error}</div>
      )}
      <div className="flex items-center gap-2">
        <span className="hidden rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium shadow-md ring-1 ring-border backdrop-blur sm:inline-block">{label}</span>
        <button
          type="button"
          onClick={toggle}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all ${
            state === 'active' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
        >
          {state === 'active' && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-40" />}
          {state === 'connecting' || state === 'ending' ? <Loader2 className="h-6 w-6 animate-spin" /> : state === 'active' ? <PhoneOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </button>
      </div>
      {state === 'active' && (
        <span className="flex items-center gap-1.5 rounded-full bg-red-600/10 px-2.5 py-1 text-[11px] font-medium text-red-600 ring-1 ring-red-600/30">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" /></span>
          {locale === 'hi' ? 'लाइव' : 'LIVE'}
        </span>
      )}
    </div>
  )
}
