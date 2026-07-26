'use client'
import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollReveal } from './ScrollReveal'
import {
  Scale,
  ChevronRight,
  ArrowDown,
  Mic,
  Building2,
  Users,
  ExternalLink,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  HourglassIcon,
  BarChart3,
  Droplets,
  Zap,
  Route,
  Home,
  ListChecks,
} from 'lucide-react'

/* ─── Stats API response shape ─── */
interface StatsData {
  complaints: {
    total: number
    pending: number
    inProgress: number
    resolved: number
    rejected: number
  }
  images: number
  scrapedRecords: number
}

/* ─── Escalation steps ─── */
const escalationSteps = [
  {
    step: 1,
    badgeVariant: 'number-badge' as const,
    titleHi: 'शिकायत दर्ज',
    titleEn: 'File Complaint',
    officerHi: 'नागरिक / Citizen',
    officerEn: 'Citizen',
    slaHi: null,
    slaEn: null,
    channels: [
      { icon: Mic, labelHi: 'AI वॉइस लाइन', labelEn: 'AI Voice Line', detail: '+91 96510 35021' },
      { icon: Building2, labelHi: 'पंचायत कार्यालय', labelEn: 'Panchayat Office', detailHi: 'पंचायत भवन, चंद्रा', detailEn: 'Panchayat Bhawan, Chandra' },
      { icon: Users, labelHi: 'प्रधान से मिलकर', labelEn: 'Meet Pradhan', detailHi: 'सोम-शुक्र 10-5 बजे', detailEn: 'Mon-Fri 10-5' },
    ],
    borderClass: '',
  },
  {
    step: 2,
    badgeVariant: 'number-badge-green' as const,
    titleHi: 'प्रथम स्तर समाधान',
    titleEn: 'Level-1 Resolution',
    officerHi: 'ग्राम प्रधान',
    officerEn: 'Gram Pradhan',
    slaHi: '7 कार्य दिवस',
    slaEn: '7 working days',
    channels: [],
    borderClass: 'accent-border-left',
  },
  {
    step: 3,
    badgeVariant: 'number-badge' as const,
    titleHi: 'द्वितीय स्तर — BDO',
    titleEn: 'Level-2 — BDO',
    officerHi: 'BDO शंकरगढ़',
    officerEn: 'BDO Shankargarh',
    slaHi: '15 कार्य दिवस',
    slaEn: '15 working days',
    channels: [],
    borderClass: '',
  },
  {
    step: 4,
    badgeVariant: 'number-badge-green' as const,
    titleHi: 'तृतीय स्तर — DM',
    titleEn: 'Level-3 — DM',
    officerHi: 'जनपद प्रयागराज DM',
    officerEn: 'DM Prayagraj',
    slaHi: '30 कार्य दिवस',
    slaEn: '30 working days',
    channels: [],
    borderClass: 'green-border-left',
  },
]

/* ─── SLA categories ─── */
const slaCategories = [
  { id: 'water', icon: Droplets, labelHi: 'जल', labelEn: 'Water', slaHi: '48 घंटे', slaEn: '48 hours', value: 48, max: 720, colorClass: 'bg-amber-500' },
  { id: 'electricity', icon: Zap, labelHi: 'बिजली', labelEn: 'Electricity', slaHi: '48 घंटे', slaEn: '48 hours', value: 48, max: 720, colorClass: 'bg-amber-500' },
  { id: 'roads', icon: Route, labelHi: 'सड़क', labelEn: 'Roads', slaHi: '7 दिन', slaEn: '7 days', value: 168, max: 720, colorClass: 'bg-primary' },
  { id: 'housing', icon: Home, labelHi: 'आवास', labelEn: 'Housing', slaHi: '15 दिन', slaEn: '15 days', value: 360, max: 720, colorClass: 'bg-foreground/60' },
  { id: 'general', icon: ListChecks, labelHi: 'सामान्य', labelEn: 'General', slaHi: '7 दिन', slaEn: '7 days', value: 168, max: 720, colorClass: 'bg-primary' },
]

/* ─── Filing channels ─── */
const filingChannels = [
  {
    id: 'voice',
    icon: Mic,
    titleHi: 'AI वॉइस लाइन',
    titleEn: 'AI Voice Line',
    descHi: '+91 96510 35021 — 24×7 उपलब्ध, हिंदी में शिकायत दर्ज करें',
    descEn: '+91 96510 35021 — Available 24×7, file complaints in Hindi',
    detail: '+91 96510 35021',
    glow: true,
  },
  {
    id: 'office',
    icon: Building2,
    titleHi: 'पंचायत कार्यालय',
    titleEn: 'Panchayat Office',
    descHi: 'ग्राम पंचायत कार्यालय, चंद्रा — सोम-शुक्र 10-5 बजे',
    descEn: 'Gram Panchayat Office, Chandra — Mon-Fri 10-5',
    detailHi: 'पंचायत भवन, चंद्रा',
    detailEn: 'Panchayat Bhawan, Chandra',
    glow: false,
  },
  {
    id: 'meeting',
    icon: Users,
    titleHi: 'प्रधान से सोम-शुक्र 10-5 बजे',
    titleEn: 'Meet Pradhan Mon-Fri 10-5',
    descHi: 'प्रधान जी से सोमवार-शुक्रवार 10:00-5:00 बजे व्यक्तिगत मिलकर शिकायत दर्ज करें',
    descEn: 'Meet the Pradhan personally Mon-Fri 10-5 to file a complaint',
    detailHi: 'सोम-शुक्र 10:00–5:00 बजे',
    detailEn: 'Mon-Fri 10:00–5:00 PM',
    glow: false,
  },
]

export function GrievanceSection() {
  const { locale } = useI18n()
  const isHi = locale === 'hi'

  /* ─── Fetch live stats ─── */
  const [stats, setStats] = useState<StatsData | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data: StatsData) => {
        setStats(data)
        setStatsLoading(false)
      })
      .catch(() => setStatsLoading(false))
  }, [])

  const complaintStats = stats?.complaints ?? { total: 0, pending: 0, inProgress: 0, resolved: 0, rejected: 0 }

  return (
    <section id="grievance" className="section-rail border-b border-border/60 bg-secondary/20 py-16 md:py-20">
      <div className="container mx-auto px-4">

        {/* ─── Header ─── */}
        <ScrollReveal delay={0.1}>
          <div className="mb-10">
            <Badge variant="outline" className="mb-3 gap-1.5">
              <Scale className="h-3 w-3" />
              {isHi ? 'शिकायत निवारण' : 'Grievance Redressal'} / {isHi ? 'Grievance Redressal' : 'शिकायत निवारण'}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold section-heading text-gradient-tricolor">
              {isHi ? 'शिकायत निवारण प्रणाली' : 'Grievance Redressal Mechanism'} / {isHi ? 'Grievance Redressal Mechanism' : 'शिकायत निवारण प्रणाली'}
            </h2>
            <p className="text-sm text-muted-foreground mt-4 max-w-2xl">
              {isHi
                ? 'ग्राम पंचायत चंद्रा में शिकायत दर्ज, ट्रैक एवं समाधान की पूरी प्रणाली'
                : 'Complete system for filing, tracking, and resolving complaints in Gram Panchayat Chandra'}
            </p>
          </div>
        </ScrollReveal>

        {/* ─── Escalation Flowchart ─── */}
        <ScrollReveal delay={0.15}>
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-semibold">
                {isHi ? 'शिकायत उन्नयन प्रणाली / Escalation Hierarchy' : 'शिकायत उन्नयन प्रणाली / Escalation Hierarchy'}
              </h3>
            </div>

            {/* Horizontal chain on md+, vertical on mobile */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0">
              {escalationSteps.map((s, i) => (
                <div key={s.step} className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0 w-full md:w-auto">
                  {/* Step card */}
                  <ScrollReveal delay={0.2 + i * 0.1}>
                    <Card className={`border-border/70 hover-lift-large w-full md:w-[220px] lg:w-[240px] ${s.borderClass}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <span className={`number-badge ${s.badgeVariant === 'number-badge-green' ? 'number-badge-green' : ''}`}>
                            {s.step}
                          </span>
                          <CardTitle className="text-sm font-semibold leading-tight">
                            {isHi ? s.titleHi : s.titleEn}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 pt-0">
                        {/* Officer */}
                        <div className="text-xs text-foreground/70 flex items-center gap-1.5">
                          <span className="text-muted-foreground font-medium">{isHi ? 'अधिकारी:' : 'Officer:'}</span>
                          <span>{isHi ? s.officerHi : s.officerEn}</span>
                        </div>

                        {/* SLA badge */}
                        {s.slaHi && (
                          <Badge variant="outline" className="text-[10px] h-5 gap-1 bg-primary/5 text-primary border-primary/20">
                            <Clock className="h-3 w-3" />
                            {isHi ? s.slaHi : s.slaEn}
                          </Badge>
                        )}

                        {/* Channels for Step 1 */}
                        {s.channels.length > 0 && (
                          <div className="space-y-1.5 mt-2">
                            {s.channels.map((ch) => {
                              const ChIcon = ch.icon
                              return (
                                <div key={ch.labelEn} className="flex items-center gap-1.5 text-xs text-foreground/70">
                                  <ChIcon className="h-3 w-3 text-primary shrink-0" />
                                  <span className="font-medium">{isHi ? ch.labelHi : ch.labelEn}</span>
                                  {ch.detail && (
                                    <span className="text-muted-foreground">
                                      {ch.detailHi ? (isHi ? ch.detailHi : ch.detailEn) : ch.detail}
                                    </span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </ScrollReveal>

                  {/* Connector arrow between steps */}
                  {i < escalationSteps.length - 1 && (
                    <div className="flex items-center justify-center md:px-1 shrink-0">
                      {/* Horizontal arrow on md+, vertical arrow on mobile */}
                      <div className="hidden md:flex items-center">
                        <ChevronRight className="h-5 w-5 text-primary/60" />
                      </div>
                      <div className="flex md:hidden items-center">
                        <ArrowDown className="h-5 w-5 text-primary/60" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ─── Section divider between flowchart and SLA ─── */}
        <div className="section-divider">
          <span className="section-divider-dot" />
          <span className="section-divider-dot" />
          <span className="section-divider-dot" />
        </div>

        {/* ─── SLA Timeline Card ─── */}
        <ScrollReveal delay={0.25}>
          <div className="mb-12">
            <Card className="border-border/70 hover-lift-large">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base font-semibold">
                    {isHi ? 'समाधान समय-सीमा / Resolution SLAs' : 'समाधान समय-सीमा / Resolution SLAs'}
                  </CardTitle>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {isHi
                    ? 'शिकायत श्रेणी के अनुसार समाधान समय-सीमा (घंटे/दिन)'
                    : 'Resolution timelines by complaint category (hours/days)'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {slaCategories.map((cat) => {
                  const CatIcon = cat.icon
                  const percentage = Math.round((cat.value / cat.max) * 100)
                  return (
                    <div key={cat.id} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <CatIcon className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="text-sm font-medium truncate">
                            {isHi ? cat.labelHi : cat.labelEn} / {isHi ? cat.labelEn : cat.labelHi}
                          </span>
                        </div>
                        <span className="tag-chip shrink-0">
                          {isHi ? cat.slaHi : cat.slaEn}
                        </span>
                      </div>
                      {/* Custom styled progress bar */}
                      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`${cat.colorClass} h-full rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
                {/* Scale legend */}
                <div className="flex items-center gap-4 pt-3 border-t border-border/40 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span>{isHi ? '48 घंटे (तत्काल)' : '48 hours (immediate)'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>{isHi ? '7 दिन (सामान्य)' : '7 days (standard)'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-foreground/60" />
                    <span>{isHi ? '15 दिन (जटिल)' : '15 days (complex)'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* ─── Current Grievance Stats Card ─── */}
        <ScrollReveal delay={0.3}>
          <div className="mb-12">
            <Card className="border-border/70 hover-lift-large indian-border-top tricolor-frame">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base font-semibold">
                    {isHi ? 'वर्तमान शिकायत स्थिति / Current Grievance Stats' : 'वर्तमान शिकायत स्थिति / Current Grievance Stats'}
                  </CardTitle>
                  {/* Live indicator */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <span className="pulse-dot soft-pulse" />
                    <span className="text-xs text-muted-foreground">{isHi ? 'लाइव' : 'Live'}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {statsLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="stat-card shimmer-loading" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Total */}
                    <div className="stat-card">
                      <div className="stat-card-number">{complaintStats.total}</div>
                      <div className="stat-card-label">{isHi ? 'कुल शिकायत / Total' : 'कुल शिकायत / Total'}</div>
                      <ListChecks className="h-4 w-4 text-primary shrink-0 ml-auto" />
                    </div>
                    {/* Pending */}
                    <div className="stat-card category-badge-glow">
                      <div className="stat-card-number text-amber-500">{complaintStats.pending}</div>
                      <div className="stat-card-label">{isHi ? 'लंबित / Pending' : 'लंबित / Pending'}</div>
                      <HourglassIcon className="h-4 w-4 text-amber-500 shrink-0 ml-auto" />
                    </div>
                    {/* In Progress */}
                    <div className="stat-card category-badge-glow">
                      <div className="stat-card-number text-primary">{complaintStats.inProgress}</div>
                      <div className="stat-card-label">{isHi ? 'प्रगति पर / In Progress' : 'प्रगति पर / In Progress'}</div>
                      <AlertCircle className="h-4 w-4 text-primary shrink-0 ml-auto" />
                    </div>
                    {/* Resolved */}
                    <div className="stat-card accent-border-left category-badge-glow">
                      <div className="stat-card-number" style={{ color: 'oklch(0.55 0.14 150)' }}>{complaintStats.resolved}</div>
                      <div className="stat-card-label">{isHi ? 'हल / Resolved' : 'हल / Resolved'}</div>
                      <CheckCircle2 className="h-4 w-4 shrink-0 ml-auto" style={{ color: 'oklch(0.55 0.14 150)' }} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* ─── Complaint Filing Channels Card ─── */}
        <ScrollReveal delay={0.35}>
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Phone className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-semibold">
                {isHi ? 'शिकायत दर्ज के माध्यम / Complaint Filing Channels' : 'शिकायत दर्ज के माध्यम / Complaint Filing Channels'}
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {filingChannels.map((ch) => {
                const ChIcon = ch.icon
                return (
                  <Card
                    key={ch.id}
                    className={`border-border/70 hover-lift-large ${ch.glow ? 'glow-green gradient-border-animate' : ''}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-md grid place-items-center shrink-0 ${ch.glow ? 'bg-primary/15 text-primary' : 'bg-primary/10 text-primary'}`}>
                          <ChIcon className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-sm font-semibold leading-tight">
                          {isHi ? ch.titleHi : ch.titleEn}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      <p className="text-xs text-foreground/70 leading-relaxed">
                        {isHi ? ch.descHi : ch.descEn}
                      </p>
                      {/* Contact / action detail */}
                      <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                        {ch.id === 'voice' && <Phone className="h-3 w-3 shrink-0" />}
                        {ch.id === 'office' && <Building2 className="h-3 w-3 shrink-0" />}
                        {ch.id === 'meeting' && <Users className="h-3 w-3 shrink-0" />}
                        <span>{ch.detailHi ? (isHi ? ch.detailHi : ch.detailEn) : ch.detail}</span>
                      </div>
                      {ch.glow && (
                        <Badge variant="outline" className="text-[10px] h-5 bg-primary/5 text-primary border-primary/20 gap-1">
                          <Mic className="h-3 w-3" />
                          {isHi ? '24×7 उपलब्ध' : '24×7 Available'}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* ─── Footer note ─── */}
        <ScrollReveal delay={0.4}>
          <div className="section-divider">
            <span className="section-divider-dot" />
            <span className="section-divider-dot" style={{ background: 'oklch(0.98 0.01 85)' }} />
            <span className="section-divider-dot" style={{ background: 'oklch(0.55 0.14 150 / 0.6)' }} />
          </div>
          <div className="text-center text-xs text-muted-foreground mt-2">
            <p className="flex items-center justify-center gap-1.5">
              <ExternalLink className="h-3 w-3 shrink-0" />
              <span>
                {isHi
                  ? 'शिकायत निवारण उत्तर प्रदेश सरकार — jansunwai.up.nic.in'
                  : 'Grievance Redressal UP Government — jansunwai.up.nic.in'}
              </span>
            </p>
            <p className="mt-1 text-muted-foreground/60">
              {isHi
                ? 'ग्राम पंचायत चंद्रा — पारदर्शिता एवं जवाबदेही के प्रति समर्पित'
                : 'Gram Panchayat Chandra — committed to transparency and accountability'}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
