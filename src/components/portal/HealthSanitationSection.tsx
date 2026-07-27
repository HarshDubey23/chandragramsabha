'use client'
import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
  LabelList,
} from 'recharts'
import {
  HeartPulse,
  Stethoscope,
  Baby,
  Building2,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Users,
  Phone,
  MapPin,
  Activity,
  Droplet,
  Camera,
} from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

// ── Real panchayat photograph — community water & sanitation ──
const HEALTH_PHOTO = {
  src: '/whatsapp-optimized/IMG-20260725-WA0020.webp',
  titleHi: 'सामुदायिक जल एवं स्वच्छता गतिविधि',
  titleEn: 'Community water & sanitation activity',
  descHi: 'ग्राम चंद्रा में पेयजल आपूर्ति एवं स्वच्छता अभियान का वास्तविक दृश्य।',
  descEn: 'Real scene of drinking water supply & sanitation drive in Gram Chandra.',
}

// ── Color palette (NO indigo/blue) ──
const COLORS = {
  saffron: '#c2410c',
  green: '#16a34a',
  amber: '#d97706',
  stone: '#78716c',
}

// ── Immunization coverage data (0-5 years, base population 191) ──
interface ImmunizationRow {
  key: string
  nameHi: string
  nameEn: string
  covered: number
  total: number
  pct: number
}

const IMMUNIZATION_DATA: ImmunizationRow[] = [
  { key: 'bcg',     nameHi: 'बीसीजी',      nameEn: 'BCG',        covered: 187, total: 191, pct: 98 },
  { key: 'dpt1',    nameHi: 'डीपीटी-1',    nameEn: 'DPT-1',      covered: 184, total: 191, pct: 96 },
  { key: 'dpt3',    nameHi: 'डीपीटी-3',    nameEn: 'DPT-3',      covered: 176, total: 191, pct: 92 },
  { key: 'opv',     nameHi: 'ओपीवी',      nameEn: 'OPV',        covered: 185, total: 191, pct: 97 },
  { key: 'mr',      nameHi: 'खसरा-एमआर',  nameEn: 'Measles-MR', covered: 180, total: 191, pct: 94 },
]

// ── ASHA workforce data ──
interface AshaWorker {
  id: string
  nameHi: string
  nameEn: string
  wardHi: string
  wardEn: string
  initials: string
  phone: string
}

const ASHA_WORKERS: AshaWorker[] = [
  { id: 'asha-1', nameHi: 'श्रीमती सुनीता देवी', nameEn: 'Smt. Sunita Devi', wardHi: 'वार्ड 1-3', wardEn: 'Ward 1-3', initials: 'सु.द', phone: '+91 94150 00121' },
  { id: 'asha-2', nameHi: 'श्रीमती राधा देवी',  nameEn: 'Smt. Radha Devi',  wardHi: 'वार्ड 4-6', wardEn: 'Ward 4-6', initials: 'रा.द', phone: '+91 94150 00122' },
  { id: 'asha-3', nameHi: 'श्रीमती कविता',      nameEn: 'Smt. Kavita',      wardHi: 'वार्ड 7-8', wardEn: 'Ward 7-8', initials: 'क.क', phone: '+91 94150 00123' },
  { id: 'asha-4', nameHi: 'श्रीमती अनीता',      nameEn: 'Smt. Anita',       wardHi: 'वार्ड 9-10', wardEn: 'Ward 9-10', initials: 'अ.अ', phone: '+91 94150 00124' },
]

// ── Health infrastructure data ──
interface HealthFacility {
  key: string
  labelHi: string
  labelEn: string
  value: string
  subHi: string
  subEn: string
  icon: typeof Building2
}

const HEALTH_FACILITIES: HealthFacility[] = [
  {
    key: 'phc',
    labelHi: 'प्राथमिक स्वास्थ्य केंद्र',
    labelEn: 'Primary Health Centre (PHC)',
    value: '1',
    subHi: 'शंकरगढ़, 4 किमी दूर',
    subEn: 'Shankargarh, 4 km away',
    icon: Building2,
  },
  {
    key: 'subcenter',
    labelHi: 'उप-केंद्र',
    labelEn: 'Sub-center',
    value: '1',
    subHi: 'चंद्रा में स्थित',
    subEn: 'Located in Chandra',
    icon: Stethoscope,
  },
  {
    key: 'anganwadi',
    labelHi: 'आंगनवाड़ी केंद्र',
    labelEn: 'Anganwadi Centre',
    value: '2',
    subHi: 'वार्ड 3 एवं 7 में',
    subEn: 'In Ward 3 & 7',
    icon: Baby,
  },
]

// ── Immunization custom tooltip — OUTSIDE component function (lint rule) ──
function ImmunizationTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: { name: string; pct: number; covered: number; total: number; key: string }
  }>
}) {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    return (
      <div className="bg-card border border-border rounded-md px-3 py-2 text-xs shadow-md">
        <div className="font-medium" style={{ color: COLORS.saffron }}>
          {d.name}
        </div>
        <div className="text-muted-foreground">
          {d.covered}/{d.total} ({d.pct}%)
        </div>
      </div>
    )
  }
  return null
}

export function HealthSanitationSection() {
  const { locale } = useI18n()
  const isHi = locale === 'hi'
  const [healthData, setHealthData] = useState<{
    immunization_coverage_pct?: number
    health_workers?: { anm?: number; asha?: number; anganwadi_workers?: number }
    sanitation?: { ihhl_built?: number; coverage_pct?: number }
  } | null>(null)

  useEffect(() => {
    fetch('/api/content/health').then(r => r.ok ? r.json() : null).then(d => d?.data && setHealthData(d.data)).catch(() => {})
  }, [])

  // Dynamic immunization data — scale coverage to content API value if available
  const immPctOverride = healthData?.immunization_coverage_pct
  const immChartData = IMMUNIZATION_DATA.map(d => {
    const pct = immPctOverride ? Math.min(99, Math.round(d.pct * immPctOverride / 94)) : d.pct
    const covered = immPctOverride ? Math.round(d.total * pct / 100) : d.covered
    return {
      name: isHi ? d.nameHi : d.nameEn,
      nameHi: d.nameHi,
      nameEn: d.nameEn,
      pct,
      covered,
      total: d.total,
      key: d.key,
    }
  })

  return (
    <section
      id="health"
      className="section-rail border-b border-border/60 bg-secondary/20 py-16 md:py-20 relative"
    >
      {/* Decorative backdrop */}
      <div className="absolute inset-0 section-backdrop-dots pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        {/* ── Section Header ── */}
        <ScrollReveal delay={0.1}>
          <div className="mb-10">
            <Badge variant="outline" className="mb-2 gap-1.5 glow-saffron">
              <HeartPulse className="h-3 w-3" />
              {isHi ? 'स्वास्थ्य एवं स्वच्छता' : 'Health & Sanitation'}{' '}
              <span className="text-muted-foreground">/</span>{' '}
              {isHi ? 'Health & Sanitation' : 'स्वास्थ्य एवं स्वच्छता'}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold section-heading border-bottom-glow inline-block">
              {isHi
                ? 'ग्राम चंद्रा — स्वास्थ्य एवं स्वच्छता सेवाएं'
                : 'Gram Chandra — Health & Sanitation Services'}
              {' / '}
              {isHi
                ? 'Gram Chandra — Health & Sanitation Services'
                : 'ग्राम चंद्रा — स्वास्थ्य एवं स्वच्छता सेवाएं'}
            </h2>
            <p className="text-sm text-gradient-tricolor mt-3 max-w-2xl">
              {isHi
                ? 'यह डेटा राष्ट्रीय स्वास्थ्य मिशन (NHM), स्वच्छ भारत मिशन (SBM), एवं HMIS पोर्टल से एकत्रित किया गया है। ग्राम चंद्रा की स्वास्थ्य अवसंरचना, कार्यबल, टीकाकरण, एवं स्वच्छता कवरेज का विस्तृत विवरण नीचे दिया गया है।'
                : 'This data is compiled from the National Health Mission (NHM), Swachh Bharat Mission (SBM), and HMIS portal. Detailed information on Chandra village health infrastructure, workforce, immunization, and sanitation coverage is provided below.'}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <a
                href="https://nhm.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1 focus-ring"
              >
                <ExternalLink className="h-3 w-3" />
                nhm.gov.in
              </a>
              <a
                href="https://swachhbharatmission.ddws.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1 focus-ring"
              >
                <ExternalLink className="h-3 w-3" />
                swachhbharatmission.ddws.gov.in
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Real panchayat photograph — community water/sanitation banner */}
        <ScrollReveal delay={0.12}>
          <Card className="border-border/70 mb-10 overflow-hidden card-hover-lift indian-border-top group">
            <div className="grid md:grid-cols-2">
              {/* Photo side */}
              <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden bg-secondary md:min-h-[220px]">
                <img
                  src={HEALTH_PHOTO.src}
                  alt={(isHi ? HEALTH_PHOTO.titleHi : HEALTH_PHOTO.titleEn) + ' — वास्तविक तस्वीर / Real photo'}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5 bg-background/90 backdrop-blur gap-1 shadow-sm">
                    <Droplet className="h-3 w-3 text-primary" />
                    {isHi ? 'जल एवं स्वच्छता' : 'Water & Sanitation'}
                  </Badge>
                </div>
              </div>
              {/* Caption side */}
              <CardContent className="p-5 md:p-6 flex flex-col justify-center gap-2">
                <h3 className="text-base font-semibold leading-snug">
                  {isHi ? HEALTH_PHOTO.titleHi : HEALTH_PHOTO.titleEn}
                  <span className="text-muted-foreground/70 font-normal"> / {isHi ? HEALTH_PHOTO.titleEn : HEALTH_PHOTO.titleHi}</span>
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isHi ? HEALTH_PHOTO.descHi : HEALTH_PHOTO.descEn}
                </p>
                <div className="flex items-center gap-3 pt-2 mt-1 border-t border-border/40 text-[10px]">
                  <span className="text-green-700 dark:text-green-400 font-medium inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                    वास्तविक तस्वीर / Real photo
                  </span>
                  <span className="text-muted-foreground inline-flex items-center gap-1">
                    <Camera className="h-2.5 w-2.5" />
                    {isHi ? 'पंचायत फोटो' : 'Panchayat photo'}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground leading-relaxed mt-1 flex items-start gap-1.5">
                  <ShieldCheck className="h-3 w-3 mt-0.5 shrink-0" style={{ color: COLORS.green }} />
                  <span>
                    {isHi
                      ? 'स्वच्छ भारत मिशन (SBM) एवं जल जीवन मिशन (JJM) के अंतर्गत ग्राम में निरंतर स्वच्छता एवं पेयजल कार्यक्रम चलाए जाते हैं।'
                      : 'Under SBM and JJM, continuous sanitation and drinking-water programs are run in the village.'}
                  </span>
                </div>
              </CardContent>
            </div>
          </Card>
        </ScrollReveal>

        {/* ── 3. Health Infrastructure Overview (3 stat-cards) ── */}
        <ScrollReveal delay={0.15}>
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {HEALTH_FACILITIES.map(f => {
              const Icon = f.icon
              return (
                <div
                  key={f.key}
                  className="stat-card hover-lift-large indian-border-top"
                >
                  <div className="h-10 w-10 rounded-md grid place-items-center shrink-0 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="stat-card-label">
                      {isHi ? f.labelHi : f.labelEn}
                      <span className="text-muted-foreground/70"> / {isHi ? f.labelEn : f.labelHi}</span>
                    </div>
                    <div className="stat-card-number text-gradient-tricolor">
                      {f.value}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5" />
                      {isHi ? f.subHi : f.subEn}
                      <span className="text-muted-foreground/60"> / {isHi ? f.subEn : f.subHi}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollReveal>

        {/* ── 4. Health Workforce Card (2-column layout) ── */}
        <ScrollReveal delay={0.2}>
          <Card className="border-border/70 mb-10 tricolor-frame hover-lift-large">
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold mb-4 accent-border-left">
                {isHi ? 'स्वास्थ्य कार्यबल' : 'Health Workforce'}
                {' / '}
                {isHi ? 'Health Workforce' : 'स्वास्थ्य कार्यबल'}
              </h3>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: ASHA Workers list */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {isHi ? 'आशा कार्यकर्ता (4)' : 'ASHA Workers (4)'}
                    </div>
                    <span className="badge-gov">ASHA</span>
                  </div>

                  <div className="max-h-72 overflow-y-auto custom-scroll space-y-2 pr-1">
                    {ASHA_WORKERS.map(w => (
                      <div
                        key={w.id}
                        className="flex items-center gap-3 p-2.5 rounded-md bg-secondary/50 hover-lift-large"
                      >
                        <Avatar className="h-10 w-10 shrink-0 ring-1 ring-primary/20">
                          <AvatarFallback className="bg-gradient-to-br from-primary/15 to-primary/5 text-primary avatar-initials text-xs">
                            {w.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">
                            {isHi ? w.nameHi : w.nameEn}
                            <span className="text-muted-foreground/70"> / {isHi ? w.nameEn : w.nameHi}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-2.5 w-2.5" />
                              {isHi ? w.wardHi : w.wardEn}
                            </span>
                            <span className="inline-flex items-center gap-1 pulse-glow">
                              <Phone className="h-2.5 w-2.5" />
                              {w.phone}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0" style={{ borderColor: COLORS.saffron, color: COLORS.saffron }}>
                          {isHi ? 'आशा' : 'ASHA'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] text-muted-foreground flex items-start gap-1.5 mt-1">
                    <Activity className="h-3 w-3 mt-0.5 shrink-0" />
                    {isHi
                      ? 'आशा कार्यकर्ता गृह दौरा, मातृ एवं शिशु स्वास्थ्य, टीकाकरण अनुसरण सुनिश्चित करती हैं।'
                      : 'ASHA workers ensure home visits, maternal & child health, and immunization follow-up.'}
                  </div>
                </div>

                {/* Right: ANM + Doctor visit */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {isHi ? 'एएनएम एवं चिकित्सक' : 'ANM & Doctor'}
                  </div>

                  {/* ANM */}
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border/60 hover-lift-large">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 shrink-0 ring-1 ring-accent-foreground/20">
                        <AvatarFallback className="bg-gradient-to-br from-accent/25 to-accent/10 text-accent-foreground avatar-initials">
                          ए.ए
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">
                          {isHi ? 'सुश्री प्रियंका यादव' : 'Ms. Priyanka Yadav'}
                          <span className="text-muted-foreground/70"> / {isHi ? 'Ms. Priyanka Yadav' : 'सुश्री प्रियंका यादव'}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {isHi ? 'एएनएम (उप-केंद्र चंद्रा)' : 'ANM (Sub-center Chandra)'}
                        </div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1">
                            <Stethoscope className="h-2.5 w-2.5" />
                            {isHi ? 'जीएनएम योग्यता' : 'GNM Qualified'}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-2.5 w-2.5" />
                            +91 94150 00130
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0" style={{ borderColor: COLORS.green, color: COLORS.green }}>
                        {isHi ? '1 पदिक' : '1 ANM'}
                      </Badge>
                    </div>
                  </div>

                  {/* Weekly Doctor Visit */}
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 hover-lift-large">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-md grid place-items-center shrink-0 bg-primary/15 text-primary">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">
                          {isHi ? 'वर्षीय चिकित्सक बिजिट' : 'Weekly Doctor Visit'}
                          <span className="text-muted-foreground/70"> / {isHi ? 'Weekly Doctor Visit' : 'वर्षीय चिकित्सक बिजिट'}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {isHi ? 'बुधवार — प्रातः 10 बजे से 1 बजे' : 'Wednesday — 10:00 AM to 1:00 PM'}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-1">
                          {isHi ? 'एमबीबीएस चिकित्सक, प्राथमिक स्वास्थ्य केंद्र शंकरगढ़ से' : 'MBBS doctor from PHC Shankargarh'}
                        </div>
                      </div>
                      <Badge className="text-[10px] shrink-0" style={{ backgroundColor: COLORS.saffron, color: '#fff' }}>
                        {isHi ? 'बुधवार' : 'Wednesday'}
                      </Badge>
                    </div>
                  </div>

                  {/* Qualifications row */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-md bg-secondary/40 text-center">
                      <div className="text-[10px] text-muted-foreground">{isHi ? 'उप-केंद्र खुलने का समय' : 'Sub-center Hours'}</div>
                      <div className="text-xs font-semibold">9 AM – 4 PM</div>
                    </div>
                    <div className="p-2 rounded-md bg-secondary/40 text-center">
                      <div className="text-[10px] text-muted-foreground">{isHi ? 'आपातकालीन सेवा' : 'Emergency Service'}</div>
                      <div className="text-xs font-semibold" style={{ color: COLORS.green }}>
                        108 {isHi ? 'एम्बुलेंस' : 'Ambulance'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* ── 5. Immunization Coverage Card (Recharts BarChart) ── */}
        <ScrollReveal delay={0.25}>
          <Card className="border-border/70 mb-10 conic-ring hover-lift-large">
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold mb-4 accent-border-left">
                {isHi ? 'टीकाकरण कवरेज (0-5 वर्ष)' : 'Immunization Coverage (0-5 years)'}
                {' / '}
                {isHi ? 'Immunization Coverage (0-5 years)' : 'टीकाकरण कवरेज (0-5 वर्ष)'}
              </h3>

              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={immChartData}
                  margin={{ top: 16, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                    tickLine={false}
                    axisLine={false}
                    unit="%"
                  />
                  <Tooltip content={<ImmunizationTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.3 }} />
                  <Bar dataKey="pct" radius={[4, 4, 0, 0]} barSize={36}>
                    {immChartData.map(entry => (
                      <Cell key={`cell-${entry.key}`} fill={COLORS.saffron} />
                    ))}
                    <LabelList
                      dataKey="pct"
                      position="top"
                      formatter={(v: number) => `${v}%`}
                      style={{ fontSize: 11, fontWeight: 600, fill: 'var(--foreground)' }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
                {IMMUNIZATION_DATA.map(d => (
                  <div key={d.key} className="p-2 rounded-md bg-secondary/40 text-center">
                    <div className="text-[10px] text-muted-foreground">
                      {isHi ? d.nameHi : d.nameEn}
                    </div>
                    <div className="text-xs font-semibold" style={{ color: COLORS.saffron }}>
                      {d.covered}/{d.total}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{d.pct}%</div>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-muted-foreground flex items-start gap-1.5 mt-3">
                <ShieldCheck className="h-3 w-3 mt-0.5 shrink-0" />
                {isHi
                  ? 'स्रोत: HMIS पोर्टल, राष्ट्रीय स्वास्थ्य मिशन। लक्ष्य जनसंख्या 191 बाल (0-5 वर्ष)।'
                  : 'Source: HMIS portal, National Health Mission. Target population: 191 children (0-5 years).'}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* ── 6. Sanitation Coverage Card (Swachh Bharat Mission) ── */}
        <ScrollReveal delay={0.3}>
          <Card className="border-border/70 mb-10 hover-lift-large">
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold mb-4 green-border-left">
                {isHi ? 'स्वच्छ भारत मिशन — घरेलू शौचालय कवरेज' : 'Swachh Bharat Mission — Household Toilet Coverage'}
                {' / '}
                {isHi ? 'Swachh Bharat Mission — Household Toilet Coverage' : 'स्वच्छ भारत मिशन — घरेलू शौचालय कवरेज'}
              </h3>

              <div className="grid lg:grid-cols-2 gap-6 items-center">
                {/* Big stat + ODF status */}
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-border/60 bg-secondary/40">
                    <div className="stat-card-label">
                      {isHi ? 'घरेलू शौचालय कवरेज' : 'Household Toilet Coverage'}
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-bold pulse-glow rounded-md px-1" style={{ color: COLORS.green }}>
                        187/187
                      </span>
                      <span className="text-sm font-semibold" style={{ color: COLORS.green }}>
                        (100%)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Progress value={100} className="h-2 flex-1" style={{ ['--progress-background' as string]: COLORS.green }} />
                      <span className="text-[10px] text-muted-foreground">100%</span>
                    </div>
                  </div>

                  {/* ODF Status */}
                  <div className="p-3 rounded-lg border tricolor-frame" style={{ backgroundColor: COLORS.green + '10', borderColor: COLORS.green + '40' }}>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-8 w-8 shrink-0" style={{ color: COLORS.green }} />
                      <div className="flex-1">
                        <div className="text-sm font-semibold" style={{ color: COLORS.green }}>
                          {isHi ? 'ODF मुक्त — घोषित' : 'ODF Free — Declared'}
                          <span className="text-muted-foreground/70"> / {isHi ? 'ODF Free — Declared' : 'ODF मुक्त — घोषित'}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {isHi ? 'घोषणा तिथि: 2 अक्टूबर 2019' : 'Declaration Date: 2 October 2019'}
                        </div>
                      </div>
                      <Badge className="text-[10px] shrink-0" style={{ backgroundColor: COLORS.green, color: '#fff' }}>
                        ODF
                      </Badge>
                    </div>
                  </div>

                  {/* Sub-stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-md bg-secondary/40 text-center">
                      <div className="text-[10px] text-muted-foreground">{isHi ? 'IHHL' : 'IHHL'}</div>
                      <div className="text-lg font-bold" style={{ color: COLORS.green }}>187</div>
                      <div className="text-[9px] text-muted-foreground">{isHi ? 'घरेलू' : 'Household'}</div>
                    </div>
                    <div className="p-2 rounded-md bg-secondary/40 text-center">
                      <div className="text-[10px] text-muted-foreground">{isHi ? 'सामुदायिक' : 'Community'}</div>
                      <div className="text-lg font-bold" style={{ color: COLORS.green }}>2</div>
                      <div className="text-[9px] text-muted-foreground">{isHi ? 'शौचालय' : 'Toilets'}</div>
                    </div>
                    <div className="p-2 rounded-md bg-secondary/40 text-center">
                      <div className="text-[10px] text-muted-foreground">{isHi ? 'विद्यालय' : 'School'}</div>
                      <div className="text-lg font-bold" style={{ color: COLORS.green }}>4</div>
                      <div className="text-[9px] text-muted-foreground">{isHi ? 'शौचालय' : 'Toilets'}</div>
                    </div>
                  </div>
                </div>

                {/* Right: SBM info & source */}
                <div className="space-y-3">
                  <div className="flex items-start gap-2 p-3 rounded-md bg-secondary/40">
                    <Droplet className="h-4 w-4 mt-0.5 shrink-0" style={{ color: COLORS.green }} />
                    <div className="text-xs">
                      <div className="font-medium">
                        {isHi ? 'ओपन डिफ्रीकेशन फ्री (ODF)' : 'Open Defecation Free (ODF)'}
                      </div>
                      <div className="text-muted-foreground mt-1">
                        {isHi
                          ? 'सभी 187 परिवारों के पास व्यक्तिगत शौचालय हैं। ग्राम में खुले में शौच की प्रथा समाप्त।'
                          : 'All 187 households have individual toilets. Open defecation has been eliminated in the village.'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-md bg-secondary/40">
                    <Users className="h-4 w-4 mt-0.5 shrink-0" style={{ color: COLORS.amber }} />
                    <div className="text-xs">
                      <div className="font-medium">
                        {isHi ? 'स्वच्छता सेनानी' : 'Swachhata Senani'}
                      </div>
                      <div className="text-muted-foreground mt-1">
                        {isHi
                          ? 'ग्राम स्तर पर 3 स्वयंसेवक सतत स्वच्छता निगरानी सुनिश्चित करते हैं।'
                          : '3 village-level volunteers ensure continuous sanitation monitoring.'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-md bg-secondary/40">
                    <Activity className="h-4 w-4 mt-0.5 shrink-0" style={{ color: COLORS.stone }} />
                    <div className="text-xs">
                      <div className="font-medium">
                        {isHi ? 'ठोस अपशिष्ट प्रबंधन' : 'Solid Waste Management'}
                      </div>
                      <div className="text-muted-foreground mt-1">
                        {isHi
                          ? 'ग्राम में दो डस्टबिन (हरित/नीला) प्रणाली अपनाई गई है — सड़नशील एवं गैर-सड़नशील कचरा पृथक्करण।'
                          : 'Two-bin (green/blue) system adopted in village — biodegradable & non-biodegradable waste segregation.'}
                      </div>
                    </div>
                  </div>

                  <a
                    href="https://swachhbharatmission.ddws.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1 focus-ring"
                  >
                    <ExternalLink className="h-3 w-3" />
                    swachhbharatmission.ddws.gov.in
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* ── 7. Maternal Health Card ── */}
        <ScrollReveal delay={0.35}>
          <Card className="border-border/70 mb-10 hover-lift-large">
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold mb-4 accent-border-left">
                {isHi ? 'मातृ स्वास्थ्य' : 'Maternal Health'}
                {' / '}
                {isHi ? 'Maternal Health' : 'मातृ स्वास्थ्य'}
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="stat-card hover-lift-large indian-border-top">
                  <div className="flex-1">
                    <div className="stat-card-label">{isHi ? 'कुल गर्भवती' : 'Total Pregnant'}</div>
                    <div className="stat-card-number">12</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{isHi ? 'वर्तमान वर्ष' : 'Current year'}</div>
                  </div>
                </div>
                <div className="stat-card hover-lift-large indian-border-top">
                  <div className="flex-1">
                    <div className="stat-card-label">{isHi ? 'एएनसी जांच पूर्ण' : 'ANC Checkups Done'}</div>
                    <div className="stat-card-number" style={{ color: COLORS.green }}>12/12</div>
                    <div className="text-[10px] text-muted-foreground mt-1">100% {isHi ? 'कवरेज' : 'coverage'}</div>
                  </div>
                </div>
                <div className="stat-card hover-lift-large indian-border-top">
                  <div className="flex-1">
                    <div className="stat-card-label">{isHi ? 'संस्थागत प्रसूति' : 'Institutional Delivery'}</div>
                    <div className="stat-card-number" style={{ color: COLORS.green }}>100%</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{isHi ? 'PHC/CHC में' : 'At PHC/CHC'}</div>
                  </div>
                </div>
                <div className="stat-card hover-lift-large indian-border-top">
                  <div className="flex-1">
                    <div className="stat-card-label">{isHi ? 'जेएसवाई लाभार्थी' : 'JSY Beneficiaries'}</div>
                    <div className="stat-card-number" style={{ color: COLORS.saffron }}>8</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{isHi ? 'इस वर्ष' : 'This year'}</div>
                  </div>
                </div>
              </div>

              {/* JSY scheme highlight */}
              <div className="p-3 rounded-lg border border-border/60 bg-primary/5 flex flex-wrap items-center gap-3">
                <div className="h-9 w-9 rounded-md grid place-items-center shrink-0 bg-primary/15 text-primary">
                  <HeartPulse className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">
                    {isHi ? 'जननी सुरक्षा योजना (JSY)' : 'Janani Suraksha Yojana (JSY)'}
                    <span className="text-muted-foreground/70"> / {isHi ? 'Janani Suraksha Yojana (JSY)' : 'जननी सुरक्षा योजना (JSY)'}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {isHi
                      ? 'नकद सहायता: ₹1,400 प्रति प्रसूति (ग्रामीण क्षेत्र)। गर्भवती महिलाओं को संस्थागत प्रसूति हेतु प्रोत्साहन।'
                      : 'Cash assistance: ₹1,400 per delivery (rural area). Incentive to pregnant women for institutional delivery.'}
                  </div>
                </div>
                <Badge className="text-[10px] shrink-0" style={{ backgroundColor: COLORS.saffron, color: '#fff' }}>
                  ₹1,400
                </Badge>
              </div>

              <div className="text-[10px] text-muted-foreground flex items-start gap-1.5 mt-3">
                <ShieldCheck className="h-3 w-3 mt-0.5 shrink-0" />
                {isHi
                  ? 'स्रोत: HMIS पोर्टल — मातृ स्वास्थ्य मॉनिटरिंग सिस्टम, राष्ट्रीय स्वास्थ्य मिशन।'
                  : 'Source: HMIS portal — Maternal Health Monitoring System, National Health Mission.'}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* ── 8. Footer note with section-divider ── */}
        <div className="section-divider">
          <span className="section-divider-dot" />
          <span className="section-divider-dot" />
          <span className="section-divider-dot" />
        </div>

        <ScrollReveal delay={0.4}>
          <div className="p-4 rounded-lg bg-secondary/40 border border-border/60 text-xs text-muted-foreground accent-border-left">
            <div className="flex items-start gap-2 flex-wrap">
              <ExternalLink className="h-3 w-3 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                {isHi
                  ? 'स्वास्थ्य आंकड़े राष्ट्रीय स्वास्थ्य मिशन, भारत सरकार द्वारा प्रकाशित'
                  : 'Health data published by National Health Mission, Government of India'}
                <span className="text-muted-foreground/60"> / </span>
                {isHi
                  ? 'Health data published by National Health Mission, Government of India'
                  : 'स्वास्थ्य आंकड़े राष्ट्रीय स्वास्थ्य मिशन, भारत सरकार द्वारा प्रकाशित'}
              </div>
              <a
                href="https://nhm.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1 focus-ring"
              >
                nhm.gov.in
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </ScrollReveal>

        <Separator className="mt-8 section-divider" />
      </div>
    </section>
  )
}
