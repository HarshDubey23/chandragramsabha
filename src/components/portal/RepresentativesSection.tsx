'use client'
import { useI18n } from '@/lib/i18n'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Landmark,
  User,
  GraduationCap,
  Calendar,
  Users,
  Mail,
  Phone,
  ExternalLink,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowUpCircle,
  ImageIcon,
} from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

interface Bi { hi: string; en: string }

interface TermData {
  id: number
  period: string
  label: Bi
  pradhan: { name: Bi; initials: Bi; education: Bi; age?: number }
  upPradhan?: { name: Bi; initials: Bi }
  wardMembers: number
  achievement?: Bi
  status: Bi
  statusType: 'completed' | 'delayed' | 'current'
  note?: Bi
  nextElection?: Bi
  isCurrent?: boolean
}

interface SecretaryData {
  name: Bi
  initials: Bi
  appointedBy: Bi
  email: string
  note: Bi
}

// ── Current leadership (real photos from WhatsApp) ──
// Pradhan photo: IMG-20260725-WA0003.jpg (Smt. Sangita Mishra, woman in orange sari)
// GPA photo: IMG-20260725-WA0091.jpg (Shri Balwant Chauhan, man at desk with Hindi posters)
// Up-Pradhan photo: placeholder — client will upload later.
const PANCHAYAT_PHONE = '+91 96510 35021'

const TERMS: TermData[] = [
  {
    id: 1, period: '2015-2020', label: { hi: 'प्रथम कार्यकाल', en: 'First Term' },
    pradhan: { name: { hi: 'श्री रामावतार', en: 'Shri Ramavatar' }, initials: { hi: 'रा', en: 'R' }, education: { hi: 'बी.ए.', en: 'B.A.' }, age: 52 },
    upPradhan: { name: { hi: 'श्री मोहन लाल', en: 'Shri Mohan Lal' }, initials: { hi: 'मल', en: 'ML' } },
    wardMembers: 10,
    achievement: { hi: 'पक्का सड़क निर्माण 3 वार्ड', en: 'Pucca road construction in 3 wards' },
    status: { hi: 'पूर्ण', en: 'Completed' }, statusType: 'completed',
  },
  {
    id: 2, period: '2020-2021', label: { hi: 'द्वितीय कार्यकाल (संक्षिप्त)', en: 'Second Term (Short)' },
    pradhan: { name: { hi: 'श्री रामावतार', en: 'Shri Ramavatar' }, initials: { hi: 'रा', en: 'R' }, education: { hi: 'बी.ए.', en: 'B.A.' }, age: 57 },
    wardMembers: 10,
    status: { hi: 'COVID विलंब', en: 'COVID Delay' }, statusType: 'delayed',
    note: { hi: 'निर्वाचन COVID-19 के कारण विलंबित', en: 'Election delayed due to COVID-19' },
  },
  {
    id: 3, period: '2021-2026', label: { hi: 'तृतीय कार्यकाल', en: 'Third Term' },
    pradhan: { name: { hi: 'श्रीमती संगीता मिश्रा', en: 'Smt. Sangita Mishra' }, initials: { hi: 'समि', en: 'SM' }, education: { hi: 'बी.ए. बी.टी.सी.', en: 'B.A. BTC' } },
    upPradhan: { name: { hi: 'श्री रामेश्वर प्रसाद', en: 'Shri Rameshwar Prasad' }, initials: { hi: 'रप', en: 'RP' } },
    wardMembers: 10,
    status: { hi: 'वर्तमान', en: 'Active' }, statusType: 'current',
    nextElection: { hi: 'मई 2026', en: 'May 2026' }, isCurrent: true,
  },
]

const SECRETARY: SecretaryData = {
  name: { hi: 'श्री अनिल कुमार सिंह', en: 'Shri Anil Kumar Singh' },
  initials: { hi: 'अक', en: 'AK' },
  appointedBy: { hi: 'बी.डी.ओ. कार्यालय शंकरगढ़ द्वारा नियुक्त', en: 'Appointed by BDO Office Shankargarh' },
  email: 'panchayat-secretary@up.gov.in',
  note: { hi: 'सचिव राज्य सरकार द्वारा नियुक्त, निर्वाचित नहीं', en: 'Secretary is state-appointed, not elected' },
}

function TimelineCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}

function getStatusBadgeClasses(type: TermData['statusType']) {
  switch (type) {
    case 'current': return 'bg-primary/10 text-primary border-primary/30'
    case 'delayed': return 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700/40'
    case 'completed': return 'bg-muted text-muted-foreground border-border/60'
    default: return 'bg-muted text-muted-foreground border-border/60'
  }
}

function StatusIcon({ type }: { type: TermData['statusType'] }) {
  switch (type) {
    case 'current': return <ArrowUpCircle className="h-3.5 w-3.5" />
    case 'delayed': return <AlertTriangle className="h-3.5 w-3.5" />
    case 'completed': return <CheckCircle2 className="h-3.5 w-3.5" />
    default: return <Clock className="h-3.5 w-3.5" />
  }
}

function getCardBorderClass(type: TermData['statusType']) {
  switch (type) {
    case 'current': return 'border-t-[3px] border-t-green-600 dark:border-t-green-500'
    case 'delayed': return 'border-t-[3px] border-t-amber-500 dark:border-t-amber-400'
    case 'completed': return 'border-t-[3px] border-t-muted-foreground/40'
    default: return 'border-t-[3px] border-t-muted-foreground/40'
  }
}

export function RepresentativesSection() {
  const { locale } = useI18n()
  const isHi = locale === 'hi'
  const currentTerm = TERMS.find((t) => t.isCurrent)

  return (
    <section id="representatives" className="border-b border-border/60 py-16 md:py-20">
      <div className="container mx-auto px-4 section-rail">
        {/* ── Header ── */}
        <ScrollReveal delay={0.1}>
          <div className="mb-10">
            <Badge variant="outline" className="mb-2 gap-1.5 shadow-sm">
              <Landmark className="h-3 w-3" />
              {isHi ? 'नेतृत्व एवं इतिहास' : 'Leadership & History'}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold section-heading text-gradient-tricolor">
              {isHi ? 'ग्राम पंचायत चंद्रा — नेतृत्व एवं पदाधिकारी इतिहास' : 'Gram Panchayat Chandra — Leadership & Representatives Timeline'}
            </h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
              {isHi ? '2015-2026 तक तीन निर्वाचन आयोजित। प्रत्येक कार्यकाल 5 वर्ष।' : 'Three elections held from 2015-2026. Each tenure is 5 years.'}
            </p>
          </div>
        </ScrollReveal>

        {/* ── Current Leadership — 3 prominent cards with real photos ── */}
        <ScrollReveal delay={0.15}>
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="text-lg font-semibold">{isHi ? 'वर्तमान नेतृत्व' : 'Current Leadership'}</h3>
            <Badge className="bg-primary text-primary-foreground gap-1 ml-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground soft-pulse" />
              {isHi ? '2021–2026 वर्तमान' : '2021–2026 Active'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-6 max-w-2xl">
            {isHi
              ? 'ग्राम पंचायत चंद्रा के निर्वाचित एवं प्रशासनिक पदाधिकारी। वास्तविक तस्वीरें।'
              : 'Elected and administrative officials of Gram Panchayat Chandra. Real photographs.'}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {/* ── Pradhan card (real photo WA0003) ── */}
          <ScrollReveal delay={0.18}>
            <Card className="indian-border-top bg-primary/5 border-primary/30 hover-lift-large glow-saffron shadow-md hover:shadow-xl tricolor-frame overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-primary via-amber-500 to-green-600" />
              <CardContent className="p-6 text-center">
                <div className="relative mx-auto mb-4 w-32 h-32">
                  <Avatar className="w-32 h-32 rounded-xl border-4 border-primary/30 shadow-lg mx-auto">
                    <AvatarImage src="/whatsapp-optimized/IMG-20260725-WA0003.webp" alt={isHi ? 'श्रीमती संगीता मिश्रा' : 'Smt. Sangita Mishra'} className="object-cover" />
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary text-3xl avatar-initials">
                      {isHi ? 'समि' : 'SM'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                    {isHi ? 'प्रधान' : 'Pradhan'}
                  </span>
                </div>
                <Badge className="bg-primary text-primary-foreground mb-2 gap-1">
                  <Landmark className="h-3 w-3" /> {isHi ? 'ग्राम प्रधान' : 'Gram Pradhan'}
                </Badge>
                <h4 className="text-lg font-bold leading-tight">
                  {isHi ? 'श्रीमती संगीता मिश्रा' : 'Smt. Sangita Mishra'}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">Mrs. Sangita Mishra</p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-2">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  {isHi ? 'बी.ए. बी.टी.सी. (स्नातक)' : 'B.A. BTC (Graduate)'}
                </div>
                <div className="mt-3 pt-3 border-t border-border/50 space-y-1.5">
                  <a href={`tel:${PANCHAYAT_PHONE.replace(/\s/g, '')}`} className="flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:underline">
                    <Phone className="h-3.5 w-3.5" /> {PANCHAYAT_PHONE}
                  </a>
                  <p className="text-[10px] text-muted-foreground">{isHi ? 'पंचायत कार्यालय, ग्राम चंद्रा' : 'Panchayat Office, Gram Chandra'}</p>
                </div>
                <div className="mt-2 text-[9px] text-green-700 dark:text-green-400 bg-green-600/10 rounded px-2 py-1 inline-flex items-center gap-1">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  {isHi ? 'वास्तविक तस्वीर / Real photo' : 'Real photograph'}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* ── Up-Pradhan card (placeholder — client will upload photo later) ── */}
          <ScrollReveal delay={0.24}>
            <Card className="border-accent-foreground/20 hover-lift-large shadow-md hover:shadow-xl overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-accent-foreground/40 via-amber-400/50 to-accent-foreground/40" />
              <CardContent className="p-6 text-center">
                <div className="relative mx-auto mb-4 w-32 h-32">
                  <div className="w-32 h-32 rounded-xl border-4 border-dashed border-accent-foreground/30 bg-secondary/50 grid place-items-center mx-auto shadow-sm">
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/50 mx-auto mb-1" />
                      <span className="text-[9px] text-muted-foreground/70 block px-2 leading-tight">
                        {isHi ? 'तस्वीर अपलोड होने बाकी' : 'Photo pending upload'}
                      </span>
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-accent-foreground text-accent text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                    {isHi ? 'उप-प्रधान' : 'Up-Pradhan'}
                  </span>
                </div>
                <Badge variant="outline" className="mb-2 gap-1 border-accent-foreground/30 text-accent-foreground">
                  <User className="h-3 w-3" /> {isHi ? 'उप-प्रधान' : 'Up-Pradhan'}
                </Badge>
                <h4 className="text-lg font-bold leading-tight">
                  {isHi ? 'श्री रामेश्वर प्रसाद' : 'Shri Rameshwar Prasad'}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">Mr. Rameshwar Prasad</p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-2">
                  <Users className="h-3.5 w-3.5 text-accent-foreground" />
                  {isHi ? 'निर्वाचित उप-प्रधान' : 'Elected Up-Pradhan'}
                </div>
                <div className="mt-3 pt-3 border-t border-border/50 space-y-1.5">
                  <a href={`tel:${PANCHAYAT_PHONE.replace(/\s/g, '')}`} className="flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:underline">
                    <Phone className="h-3.5 w-3.5" /> {PANCHAYAT_PHONE}
                  </a>
                  <p className="text-[10px] text-muted-foreground">{isHi ? 'पंचायत कार्यालय, ग्राम चंद्रा' : 'Panchayat Office, Gram Chandra'}</p>
                </div>
                <div className="mt-2 text-[9px] text-amber-700 dark:text-amber-400 bg-amber-500/10 rounded px-2 py-1 inline-flex items-center gap-1">
                  <ImageIcon className="h-2.5 w-2.5" />
                  {isHi ? 'तस्वीर शीघ्र अपलोड / Photo coming soon' : 'Photo coming soon'}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* ── GPA card (real photo WA0091) ── */}
          <ScrollReveal delay={0.3}>
            <Card className="border-accent/40 hover-lift-large shadow-md hover:shadow-xl overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-green-600 via-amber-500 to-primary" />
              <CardContent className="p-6 text-center">
                <div className="relative mx-auto mb-4 w-32 h-32">
                  <Avatar className="w-32 h-32 rounded-xl border-4 border-accent/40 shadow-lg mx-auto">
                    <AvatarImage src="/whatsapp-optimized/IMG-20260725-WA0091.webp" alt={isHi ? 'श्री बलवंत चौहान' : 'Shri Balwant Chauhan'} className="object-cover" />
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-accent/15 to-accent/5 text-accent-foreground text-3xl avatar-initials">
                      {isHi ? 'बच' : 'BC'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-1 -right-1 bg-accent text-accent-foreground text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                    {isHi ? 'जी.पी.ए.' : 'GPA'}
                  </span>
                </div>
                <Badge variant="outline" className="mb-2 gap-1 border-accent/40 text-accent-foreground">
                  <ShieldCheck className="h-3 w-3" /> {isHi ? 'ग्राम पंचायत अधिकारी' : 'Gram Panchayat Adhikari'}
                </Badge>
                <h4 className="text-lg font-bold leading-tight">
                  {isHi ? 'श्री बलवंत चौहान' : 'Shri Balwant Chauhan'}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">Mr. Balwant Chauhan</p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-2">
                  <Landmark className="h-3.5 w-3.5 text-accent-foreground" />
                  {isHi ? 'प्रशासनिक अधिकारी' : 'Administrative Officer'}
                </div>
                <div className="mt-3 pt-3 border-t border-border/50 space-y-1.5">
                  <a href={`tel:${PANCHAYAT_PHONE.replace(/\s/g, '')}`} className="flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:underline">
                    <Phone className="h-3.5 w-3.5" /> {PANCHAYAT_PHONE}
                  </a>
                  <p className="text-[10px] text-muted-foreground">{isHi ? 'पंचायत कार्यालय, ग्राम चंद्रा' : 'Panchayat Office, Gram Chandra'}</p>
                </div>
                <div className="mt-2 text-[9px] text-green-700 dark:text-green-400 bg-green-600/10 rounded px-2 py-1 inline-flex items-center gap-1">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  {isHi ? 'वास्तविक तस्वीर / Real photo' : 'Real photograph'}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        {/* ── Timeline Visualization — 3 term cards ── */}
        <ScrollReveal delay={0.2}>
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="text-lg font-semibold">{isHi ? 'कार्यकाल टाइमलाइन' : 'Tenure Timeline'}</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-6 max-w-2xl">
            {isHi ? '2015 से 2026 तक तीन निर्वाचन आयोजित।' : 'Three elections held from 2015 to 2026.'}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 bouncy-in">
          {TERMS.map((term, idx) => {
            const isCurrentTerm = term.isCurrent
            return (
              <TimelineCard key={term.id} delay={0.1 + idx * 0.05}>
                <Card
                  className={`hover-lift-large shadow-sm hover:shadow-md ${getCardBorderClass(term.statusType)} ${
                    isCurrentTerm ? 'bg-green-50/50 dark:bg-green-900/10 border-green-600/30' : ''
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`number-badge ${term.isCurrent ? 'number-badge-green' : ''}`} style={{ width: 'auto', height: 'auto', borderRadius: '8px', fontSize: '11px', padding: '4px 10px' }}>
                        {term.period}
                      </span>
                      {term.statusType === 'completed' ? (
                        <span className="tag-chip">
                          <StatusIcon type={term.statusType} />
                          {isHi ? term.status.hi : term.status.en}
                        </span>
                      ) : (
                        <Badge variant="outline" className={`text-[10px] gap-1 ${getStatusBadgeClasses(term.statusType)}`}>
                          <StatusIcon type={term.statusType} />
                          {isHi ? term.status.hi : term.status.en}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base mt-1">{isHi ? term.label.hi : term.label.en}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-10 w-10 shrink-0 ring-1 ring-border/60">
                        <AvatarFallback className="text-xs avatar-initials bg-primary/10 text-primary">
                          {isHi ? term.pradhan.initials.hi : term.pradhan.initials.en}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">{isHi ? 'प्रधान' : 'Pradhan'}</div>
                        <p className="text-sm font-medium truncate">{isHi ? term.pradhan.name.hi : term.pradhan.name.en}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {isHi ? term.pradhan.education.hi : term.pradhan.education.en}
                          </span>
                          {term.pradhan.age && <span>{isHi ? `अयु ${term.pradhan.age}` : `Age ${term.pradhan.age}`}</span>}
                        </div>
                      </div>
                    </div>
                    {term.upPradhan && (
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 shrink-0 ring-1 ring-border/60">
                          <AvatarFallback className="text-[10px] avatar-initials bg-accent/40 text-accent-foreground">
                            {isHi ? term.upPradhan.initials.hi : term.upPradhan.initials.en}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="text-[10px] text-muted-foreground">{isHi ? 'उप-प्रधान' : 'Up-Pradhan'}</div>
                          <p className="text-xs font-medium truncate">{isHi ? term.upPradhan.name.hi : term.upPradhan.name.en}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3 w-3 shrink-0" />
                      {isHi ? `${term.wardMembers} वार्ड सदस्य` : `${term.wardMembers} Ward Members`}
                    </div>
                    {term.achievement && (
                      <div className="pt-2 border-t border-border/40">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{isHi ? 'मुख्य उपलब्धि' : 'Key Achievement'}</div>
                        <p className="text-xs text-foreground/80">{isHi ? term.achievement.hi : term.achievement.en}</p>
                      </div>
                    )}
                    {term.note && (
                      <div className="pt-2 border-t border-amber-300/40 dark:border-amber-700/30">
                        <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          {isHi ? term.note.hi : term.note.en}
                        </div>
                      </div>
                    )}
                    {isCurrentTerm && (
                      <div className="pt-2 border-t border-green-600/30">
                        <a href="#representatives" className="flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400 font-medium hover:underline">
                          <ArrowUpCircle className="h-3 w-3 shrink-0" />
                          {isHi ? '↑ वर्तमान नेतृत्व देखें' : '↑ See Current Leadership above'}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TimelineCard>
            )
          })}
        </div>

        {/* ── Panchayat Secretary Section ── */}
        <ScrollReveal delay={0.25}>
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h3 className="text-lg font-semibold">{isHi ? 'पंचायत सचिव (प्रशासनिक)' : 'Panchayat Secretary (Administrative)'}</h3>
          </div>
          <Card className="border-accent/40 hover-lift-large shadow-sm hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <Avatar className="h-16 w-16 border-2 border-accent/30 shadow-sm shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-accent/15 to-accent/5 text-accent-foreground avatar-initials text-lg">
                    {isHi ? SECRETARY.initials.hi : SECRETARY.initials.en}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <p className="text-lg font-semibold">{isHi ? SECRETARY.name.hi : SECRETARY.name.en}</p>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Landmark className="h-3.5 w-3.5 shrink-0" />
                      {isHi ? SECRETARY.appointedBy.hi : SECRETARY.appointedBy.en}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <a href={`tel:${PANCHAYAT_PHONE.replace(/\s/g, '')}`} className="flex items-center gap-1.5 hover:text-primary">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-primary" /> {PANCHAYAT_PHONE}
                    </a>
                    <a href={`mailto:${SECRETARY.email}`} className="flex items-center gap-1.5 hover:text-primary">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-primary" /> {SECRETARY.email}
                    </a>
                  </div>
                  <div className="accent-border-left">
                    <p className="text-xs text-muted-foreground italic">{isHi ? SECRETARY.note.hi : SECRETARY.note.en}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="section-divider">
            <div className="section-divider-dot" />
            <div className="section-divider-dot" />
            <div className="section-divider-dot" />
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ExternalLink className="h-3 w-3 shrink-0" />
            <span>{isHi ? 'निर्वाचन आयोग, उत्तर प्रदेश — sec.up.nic.in' : 'Election Commission, Uttar Pradesh — sec.up.nic.in'}</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
