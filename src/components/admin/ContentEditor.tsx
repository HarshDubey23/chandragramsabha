'use client'
// Content Editor — admin can edit dynamic portal data (village stats, infrastructure,
// education, health, schemes, SHG, emergency contacts) without code changes.
// Master doc §4.3. Each section has a structured JSON editor with save.
import { useEffect, useState, useCallback } from 'react'
import { useI18n } from '@/lib/i18n'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Database, Save, Loader2, RefreshCw, Edit3, Check, X, AlertCircle } from 'lucide-react'

interface SectionMeta {
  key: string
  hi: string
  en: string
  icon: string
  description: string
}

const SECTIONS: SectionMeta[] = [
  { key: 'village_stats', hi: 'ग्राम आँकड़े', en: 'Village Stats', icon: 'users', description: 'Population, households, literacy, workers' },
  { key: 'infrastructure', hi: 'आधारभूत संरचना', en: 'Infrastructure', icon: 'building', description: 'Roads, water, power, sanitation' },
  { key: 'education', hi: 'शिक्षा', en: 'Education', icon: 'graduation', description: 'School, anganwadi, enrollment, literacy' },
  { key: 'health', hi: 'स्वास्थ्य', en: 'Health', icon: 'heart', description: 'Sub-center, PHC, immunization, maternal care' },
  { key: 'schemes_coverage', hi: 'योजना कवरेज', en: 'Scheme Coverage', icon: 'briefcase', description: 'MGNREGA, PMAY-G, JJM, pension, SBM-G' },
  { key: 'shg_directory', hi: 'स्व-सहायता समूह', en: 'SHG Directory', icon: 'users', description: 'Self-help groups, members, savings' },
  { key: 'emergency_contacts', hi: 'आपातकालीन संपर्क', en: 'Emergency Contacts', icon: 'phone', description: 'Police, ambulance, PHC, utilities' },
]

export function ContentEditor() {
  const { locale } = useI18n()
  const isHi = locale === 'hi'
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [data, setData] = useState<unknown>(null)
  const [editText, setEditText] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)

  const load = useCallback(async (key: string) => {
    setLoading(true)
    setDirty(false)
    try {
      const r = await fetch(`/api/content/${key}`)
      if (!r.ok) {
        if (r.status === 404) {
          setData({})
          setEditText('{}')
        }
        throw new Error('not_found')
      }
      const d = await r.json()
      setData(d.data)
      setEditText(JSON.stringify(d.data, null, 2))
      setUpdatedAt(d.updatedAt || null)
    } catch {
      setData({})
      setEditText('{}')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeKey) load(activeKey)
  }, [activeKey, load])

  const handleSave = async () => {
    if (!activeKey) return
    // Validate JSON
    let parsed: unknown
    try {
      parsed = JSON.parse(editText)
    } catch (e) {
      toast.error(isHi ? 'अमान्य JSON' : 'Invalid JSON', { description: (e as Error).message })
      return
    }
    setSaving(true)
    try {
      const r = await fetch(`/api/content/${activeKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: parsed }),
      })
      if (!r.ok) throw new Error('save_failed')
      const d = await r.json()
      setUpdatedAt(d.updatedAt)
      setDirty(false)
      setData(parsed)
      toast.success(isHi ? 'सामग्री सहेजी गई!' : 'Content saved!')
    } catch (e) {
      toast.error(isHi ? 'सहेजने में विफल' : 'Save failed', { description: (e as Error).message })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (data) setEditText(JSON.stringify(data, null, 2))
    setDirty(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold section-heading flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          {isHi ? 'सामग्री संपादक' : 'Content Editor'}
        </h2>
        <p className="text-xs text-muted-foreground mt-2">
          {isHi
            ? 'ग्राम के आँकड़े, आधारभूत संरचना, शिक्षा, स्वास्थ्य आदि संपादित करें — कोई कोड परिवर्तन नहीं।'
            : 'Edit village stats, infrastructure, education, health etc. — no code changes needed.'}
        </p>
      </div>

      {/* Section selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {SECTIONS.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveKey(s.key)}
            className={`p-3 rounded-lg border text-left transition-all ${
              activeKey === s.key
                ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary/20'
                : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/50'
            }`}
          >
            <div className="text-xs font-semibold leading-tight">
              {isHi ? s.hi : s.en}
            </div>
            <div className="text-[9px] text-muted-foreground mt-1 line-clamp-2 leading-tight">
              {s.description}
            </div>
          </button>
        ))}
      </div>

      {/* Editor */}
      {activeKey && (
        <Card className="border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">
                  {SECTIONS.find(s => s.key === activeKey)?.[isHi ? 'hi' : 'en']}
                </h3>
                <Badge variant="outline" className="text-[9px] font-mono">{activeKey}</Badge>
                {updatedAt && (
                  <span className="text-[10px] text-muted-foreground">
                    {isHi ? 'अपडेट: ' : 'Updated: '}
                    {new Date(updatedAt).toLocaleString(isHi ? 'hi-IN' : 'en-IN')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {dirty && (
                  <Badge className="text-[9px] bg-amber-500/20 text-amber-700 border-amber-400/40 gap-1">
                    <AlertCircle className="h-2.5 w-2.5" />
                    {isHi ? 'असहेजा' : 'Unsaved'}
                  </Badge>
                )}
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={handleReset} disabled={!dirty || saving}>
                  <X className="h-3 w-3" />
                  {isHi ? 'रद्द' : 'Revert'}
                </Button>
                <Button size="sm" className="h-7 text-xs gap-1 glow-saffron" onClick={handleSave} disabled={!dirty || saving}>
                  {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                  {isHi ? 'सहेजें' : 'Save'}
                </Button>
              </div>
            </div>

            {loading ? (
              <Skeleton className="h-96 rounded-lg" />
            ) : (
              <textarea
                value={editText}
                onChange={(e) => { setEditText(e.target.value); setDirty(true) }}
                className="w-full h-96 p-3 font-mono text-xs bg-secondary/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y custom-scroll"
                spellCheck={false}
                dir="ltr"
              />
            )}
            <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-600" />
                {isHi ? 'JSON प्रारूप — संपादित करें और सहेजें। पोर्टल तुरंत अपडेट होगा।' : 'JSON format — edit and save. Portal updates instantly.'}
              </span>
              <span className="font-mono">{editText.length} chars</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
