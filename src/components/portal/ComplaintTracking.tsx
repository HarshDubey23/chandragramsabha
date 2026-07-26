'use client'
import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { useUI } from '@/lib/ui-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Phone, Mic, ArrowLeft, Clock, CheckCircle2, AlertCircle, XCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CitizenFeedback } from './CitizenFeedback'

interface ComplaintResponse {
  trackingId: string
  callerName: string
  callReason: string
  category: string
  status: string
  createdAt: string
  resolvedAt: string | null
  resolutionNote: string | null
  timeline: { status: string; ts: string; note: string; by: string }[]
}

const STATUS_CONFIG: Record<string, { hi: string; en: string; icon: React.ElementType; color: string; step: number }> = {
  Pending: { hi: 'लंबित', en: 'Pending', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200', step: 0 },
  InProgress: { hi: 'प्रगति पर', en: 'In Progress', icon: Loader2, color: 'text-blue-600 bg-blue-50 border-blue-200', step: 1 },
  Resolved: { hi: 'हल हो गया', en: 'Resolved', icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200', step: 2 },
  Rejected: { hi: 'अस्वीकृत', en: 'Rejected', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200', step: -1 },
}

const CATEGORIES: Record<string, { hi: string; en: string }> = {
  water: { hi: 'जल', en: 'Water' },
  road: { hi: 'सड़क', en: 'Road' },
  school: { hi: 'विद्यालय', en: 'School' },
  housing: { hi: 'आवास', en: 'Housing' },
  pension: { hi: 'पेंशन', en: 'Pension' },
  mgnrega: { hi: 'मनरेगा', en: 'MGNREGA' },
  other: { hi: 'अन्य', en: 'Other' },
}

export function ComplaintTracking() {
  const { locale } = useI18n()
  const { setView } = useUI()
  const [trackingId, setTrackingId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ComplaintResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTrack = async () => {
    const id = trackingId.trim().toUpperCase()
    if (!id) {
      setError(locale === 'hi' ? 'कृपया ट्रैकिंग आईडी दर्ज करें' : 'Please enter a tracking ID')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const r = await fetch(`/api/complaints/track?id=${encodeURIComponent(id)}`)
      if (!r.ok) {
        if (r.status === 404) setError(locale === 'hi' ? 'इस ट्रैकिंग आईडी से कोई शिकायत नहीं मिली' : 'No complaint found for this tracking ID')
        else setError(locale === 'hi' ? 'सर्वर त्रुटि' : 'Server error')
        return
      }
      const data = await r.json()
      setResult(data)
    } catch {
      setError(locale === 'hi' ? 'नेटवर्क त्रुटि' : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const statusCfg = result ? STATUS_CONFIG[result.status] : null

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-[70vh]">
      <Button variant="ghost" size="sm" className="mb-4 gap-1.5" onClick={() => setView('home')}>
        <ArrowLeft className="h-4 w-4" />
        {locale === 'hi' ? 'मुख्य पर वापस' : 'Back to Home'}
      </Button>

      <div className="max-w-3xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            {locale === 'hi' ? 'शिकायत ट्रैकिंग' : 'Complaint Tracking'}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {locale === 'hi' ? 'अपनी शिकायत की स्थिति देखें' : 'Check the status of your complaint'}
          </p>
        </div>

        {/* Search card */}
        <Card className="mb-6 border-primary/30">
          <CardContent className="p-5">
            <label className="text-sm font-medium block mb-2">
              {locale === 'hi' ? 'ट्रैकिंग आईडी दर्ज करें' : 'Enter your Tracking ID'}
            </label>
            <div className="flex gap-2">
              <Input
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                placeholder={locale === 'hi' ? 'जैसे: GPCH-XXXX' : 'e.g., GPCH-XXXX'}
                className="font-mono uppercase"
                autoCapitalize="characters"
              />
              <Button onClick={handleTrack} disabled={loading} className="gap-1.5 shrink-0">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {locale === 'hi' ? 'ट्रैक करें' : 'Track'}
              </Button>
            </div>
            {error && (
              <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <div className="mt-3 text-[11px] text-muted-foreground">
              {locale === 'hi'
                ? 'डेमो आईडी: GPCH-DEMO001, GPCH-DEMO002, GPCH-DEMO003'
                : 'Demo IDs: GPCH-DEMO001, GPCH-DEMO002, GPCH-DEMO003'}
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result && statusCfg && (
          <Card className="border-border/70">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle className="text-lg font-mono">{result.trackingId}</CardTitle>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="outline" className="text-[10px]">
                      {CATEGORIES[result.category] ? (locale === 'hi' ? CATEGORIES[result.category].hi : CATEGORIES[result.category].en) : result.category}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {locale === 'hi' ? 'दर्ज: ' : 'Filed: '}
                      {new Date(result.createdAt).toLocaleString(locale === 'hi' ? 'hi-IN' : 'en-IN')}
                    </span>
                  </div>
                </div>
                <Badge className={cn('gap-1 border', statusCfg.color)}>
                  <statusCfg.icon className={cn('h-3.5 w-3.5', result.status === 'InProgress' && 'animate-spin')} />
                  {locale === 'hi' ? statusCfg.hi : statusCfg.en}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* complaint details */}
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                    {locale === 'hi' ? 'नाम' : 'Name'}
                  </div>
                  <div className="font-medium">{result.callerName}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                    {locale === 'hi' ? 'श्रेणी' : 'Category'}
                  </div>
                  <div className="font-medium">
                    {CATEGORIES[result.category] ? (locale === 'hi' ? CATEGORIES[result.category].hi : CATEGORIES[result.category].en) : result.category}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                    {locale === 'hi' ? 'शिकायत विवरण' : 'Complaint Details'}
                  </div>
                  <div className="text-sm text-foreground/80 leading-relaxed bg-secondary/40 rounded p-3">
                    {result.callReason}
                  </div>
                </div>
                {result.resolutionNote && (
                  <div className="sm:col-span-2">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                      {locale === 'hi' ? 'समाधान टिप्पणी' : 'Resolution Note'}
                    </div>
                    <div className="text-sm text-foreground/80 leading-relaxed bg-green-50 border border-green-200 rounded p-3">
                      {result.resolutionNote}
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
                  {locale === 'hi' ? 'समय-रेखा' : 'Timeline'}
                </div>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
                  {result.timeline.map((entry, i) => {
                    const cfg = STATUS_CONFIG[entry.status] || STATUS_CONFIG.Pending
                    return (
                      <div key={i} className="relative">
                        <div className={cn('absolute -left-[1.15rem] top-1 h-3 w-3 rounded-full border-2 border-background', cfg.color.split(' ')[1])} />
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <Badge variant="outline" className={cn('text-[10px]', cfg.color)}>
                            <cfg.icon className="h-2.5 w-2.5" />
                            {locale === 'hi' ? cfg.hi : cfg.en}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(entry.ts).toLocaleString(locale === 'hi' ? 'hi-IN' : 'en-IN')}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/70">{entry.note}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Citizen Feedback — only shown when complaint is Resolved */}
              {result.status === 'Resolved' && (
                <CitizenFeedback trackingId={result.trackingId} />
              )}
            </CardContent>
          </Card>
        )}

        {/* New complaint CTA */}
        {!result && (
          <Card className="border-accent/40 bg-accent/5 mt-6">
            <CardContent className="p-5 flex items-center gap-4 flex-wrap">
              <div className="h-12 w-12 rounded-full bg-accent text-accent-foreground grid place-items-center shrink-0">
                <Mic className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">
                  {locale === 'hi' ? 'नई शिकायत दर्ज करें' : 'File a New Complaint'}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {locale === 'hi'
                    ? 'प्रधान जी उपलब्ध नहीं हैं? AI वॉइस सहायक से शिकायत दर्ज करें।'
                    : 'Pradhan unavailable? File a complaint with the AI voice assistant.'}
                </p>
              </div>
              <Button asChild className="gap-1.5">
                <a href="tel:+919651035021">
                  <Phone className="h-4 w-4" />
                  {locale === 'hi' ? 'कॉल करें' : 'Call'}
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
