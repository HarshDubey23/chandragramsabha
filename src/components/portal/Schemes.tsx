'use client'
import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, ExternalLink, Database, Lock, Calendar, Droplets, Home, Heart, GraduationCap, Users, HandCoins } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

interface SchemeInfo {
  code: string
  nameHi: string
  nameEn: string
  portal: string
  url: string
  descHi: string
  descEn: string
  accent: string
  gradientBg: string
  icon: React.ElementType
}

const SCHEMES: SchemeInfo[] = [
  {
    code: 'mgnrega',
    nameHi: 'मनरेगा (MGNREGA)',
    nameEn: 'MGNREGA',
    portal: 'nrega',
    url: 'https://mnregaweb2.dord.gov.in/netnrega/IndexFrame.aspx?lflag=eng&District_Code=3145&district_name=PRAYAGRAJ&state_name=UTTAR+PRADESH&state_Code=31&block_name=SHANKARGARH&block_code=3145021&fin_year=2026-2027&check=1&Panchayat_name=chandra&Panchayat_Code=3145021064',
    descHi: 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम — प्रति परिवार वर्ष में 100 दिन काम की गारंटी। वर्तमान मजदूरी दर ₹257/दिन (उ.प्र.)।',
    descEn: 'Mahatma Gandhi NREGA — 100 days of guaranteed work per household per year. Current wage rate ₹257/day (UP).',
    accent: 'bg-primary/10 text-primary',
    gradientBg: 'from-primary/8 to-primary/2',
    icon: HandCoins,
  },
  {
    code: 'pmayg',
    nameHi: 'पीएमआवास-ग्रामीण (PMAY-G)',
    nameEn: 'PMAY-G',
    portal: 'pmayg',
    url: 'https://report.pmayg.dord.gov.in/',
    descHi: 'प्रधानमंत्री आवास योजना — ग्रामीण। मैदानी क्षेत्र में ₹1.20 लाख की सहायता, 4 किस्तों में।',
    descEn: 'PM Awaas Yojana - Gramin. ₹1.20 lakh assistance in plain areas, in 4 installments.',
    accent: 'bg-accent/20 text-accent-foreground',
    gradientBg: 'from-accent/8 to-accent/2',
    icon: Home,
  },
  {
    code: 'jjm',
    nameHi: 'जल जीवन मिशन (JJM)',
    nameEn: 'Jal Jeevan Mission',
    portal: 'jjm',
    url: 'https://jjm.up.gov.in/',
    descHi: 'हर घर जल जोड़ — ग्रामीण घरों तक नल से पीने योग्य पानी। चंद्रा में 93% घर कवर्ड।',
    descEn: 'Har Ghar Jal — piped potable water to rural households. 93% coverage in Chandra.',
    accent: 'bg-primary/10 text-primary',
    gradientBg: 'from-primary/8 to-accent/4',
    icon: Droplets,
  },
  {
    code: 'sbmg',
    nameHi: 'स्वच्छ भारत मिशन-ग्रामीण',
    nameEn: 'SBM-Gramin',
    portal: 'icds',
    url: 'https://swachhbharatmission.ddws.gov.in/',
    descHi: 'ग्रामीण क्षेत्र में खुले में शौच मुक्ति, शौचालय निर्माण, ठोस अपशिष्ट प्रबंधन।',
    descEn: 'Open-defecation free rural India, toilet construction, solid waste management.',
    accent: 'bg-accent/20 text-accent-foreground',
    gradientBg: 'from-accent/8 to-primary/4',
    icon: Heart,
  },
  {
    code: 'icds',
    nameHi: 'आंगनवाड़ी (ICDS)',
    nameEn: 'Anganwadi (ICDS)',
    portal: 'icds',
    url: 'https://icds-wcd.nic.in/',
    descHi: 'समेकित बाल विकास सेवा — 0-6 वर्ष बच्चों एवं गर्भवती/धाती महिलाओं के लिए पोषण।',
    descEn: 'Integrated Child Development Services — nutrition for 0-6 yr children and pregnant/lactating women.',
    accent: 'bg-primary/10 text-primary',
    gradientBg: 'from-primary/8 to-primary/2',
    icon: GraduationCap,
  },
  {
    code: 'gpdp',
    nameHi: 'ग्राम पंचायत विकास योजना',
    nameEn: 'GPDP',
    portal: 'egramswaraj',
    url: 'https://egramswaraj.gov.in/',
    descHi: 'GPDP योजना — वित्त आयोग अनुदान से ग्राम पंचायत की वार्षिक विकास योजना।',
    descEn: 'Gram Panchayat Development Plan — annual plan via Finance Commission grants.',
    accent: 'bg-accent/20 text-accent-foreground',
    gradientBg: 'from-accent/8 to-accent/2',
    icon: Users,
  },
]

interface SchemesData {
  schemes: Record<string, { count: number; types: string[]; latestRetrievedAt: string | null; totalPiiRedactions: number }>
}

export function Schemes() {
  const { locale } = useI18n()
  const [data, setData] = useState<SchemesData | null>(null)

  useEffect(() => {
    fetch('/api/schemes').then(r => r.json()).then(setData).catch(() => {})
  }, [])

  return (
    <section id="schemes" className="section-rail py-12 md:py-16 border-b border-border/60 bg-gradient-to-b from-secondary/20 via-secondary/10 to-transparent relative">
      {/* Decorative background */}
      <div className="absolute inset-0 hero-pattern section-backdrop-dots opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge variant="outline" className="mb-2 gap-1.5 shadow-sm">
              <BookOpen className="h-3 w-3" />
              {locale === 'hi' ? 'सरकारी योजनाएँ' : 'Government Schemes'}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold section-heading">
              {locale === 'hi' ? 'योजनाएँ एवं लाभार्थी डेटा' : 'Schemes & Beneficiary Data'}
            </h2>
            <p className="text-sm text-gradient-tricolor mt-3 max-w-2xl">
              {locale === 'hi'
                ? 'OSINT-सत्यापित लाभार्थी डेटा — प्रत्येक रिकॉर्ड का स्रोत URL अनुमान्य है।'
                : 'OSINT-verified beneficiary data — every record traces to a source URL.'}
            </p>
          </div>
          <Badge variant="secondary" className="gap-1.5 shadow-sm badge-gov">
            <Database className="h-3 w-3" />
            {data ? Object.keys(data.schemes).length : '—'} {locale === 'hi' ? 'पोर्टल' : 'portals'}
          </Badge>
        </div>

        <ScrollReveal delay={0.15}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 tricolor-frame rounded-lg p-1">
          {SCHEMES.map((s) => {
            const stats = data?.schemes[s.portal]
            const SchemeIcon = s.icon
            return (
              <Card key={s.code} className={`border-border/70 hover:border-primary/40 transition-all hover-lift-large shadow-sm hover:shadow-md bg-gradient-to-br ${s.gradientBg}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-tight">
                      {locale === 'hi' ? s.nameHi : s.nameEn}
                    </CardTitle>
                    <div className={`h-9 w-9 rounded-lg grid place-items-center shrink-0 shadow-sm ${s.accent}`}>
                      <SchemeIcon className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-foreground/70 leading-relaxed">
                    {locale === 'hi' ? s.descHi : s.descEn}
                  </p>

                  {stats && (
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline" className="text-[10px] gap-1 shadow-sm">
                        <Database className="h-2.5 w-2.5" />
                        {stats.count} {locale === 'hi' ? 'रिकॉर्ड' : 'records'}
                      </Badge>
                      {stats.totalPiiRedactions > 0 && (
                        <Badge variant="outline" className="text-[10px] gap-1 text-accent-foreground shadow-sm">
                          <Lock className="h-2.5 w-2.5" />
                          {stats.totalPiiRedactions} {locale === 'hi' ? 'PII रेड' : 'PII redacted'}
                        </Badge>
                      )}
                      {stats.latestRetrievedAt && (
                        <Badge variant="outline" className="text-[10px] gap-1 shadow-sm">
                          <Calendar className="h-2.5 w-2.5" />
                          {new Date(stats.latestRetrievedAt).toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN')}
                        </Badge>
                      )}
                    </div>
                  )}

                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full gap-1.5 h-8 text-xs pulse-glow group-hover:bg-secondary"
                  >
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                      {locale === 'hi' ? 'स्रोत पोर्टल देखें' : 'View Source Portal'}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
        </ScrollReveal>

        {/* Section divider */}
        <div className="section-divider mt-6">
          <div className="section-divider-dot" />
          <div className="section-divider-dot" />
          <div className="section-divider-dot" />
        </div>
      </div>
    </section>
  )
}
