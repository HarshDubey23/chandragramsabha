'use client'
import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  GraduationCap,
  School,
  Building2,
  Baby,
  ExternalLink,
  Users,
  BookOpen,
  Award,
  Utensils,
  BookCopy,
  Library,
  Apple,
  MapPin,
  CalendarDays,
  CheckCircle2,
  Info,
  TrendingUp,
  Camera,
} from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

// ── Real panchayat photographs — education institutions ──
const SCHOOL_PHOTOS = [
  {
    src: '/whatsapp-optimized/IMG-20260725-WA0011.webp',
    titleHi: 'प्राथमिक विद्यालय भवन',
    titleEn: 'Primary School Building',
    descHi: 'वार्ड 4 स्थित भित्तिचित्रों से युक्त प्राथमिक विद्यालय।',
    descEn: 'Primary school at Ward 4 with murals painted on walls.',
  },
  {
    src: '/whatsapp-optimized/IMG-20260725-WA0030.webp',
    titleHi: 'कक्षा का आंतरिक दृश्य',
    titleEn: 'Classroom Interior View',
    descHi: 'बच्चों के लिए सुसज्जित कक्षा का दृश्य।',
    descEn: 'Well-equipped classroom view for students.',
  },
]

// Warm Indian palette — NO indigo/blue
const SAFFRON = '#c2410c'
const GREEN = '#16a34a'
const STONE = '#a8a29e'

// Schools overview data
const SCHOOLS = [
  {
    id: 'primary',
    icon: School,
    nameHi: 'प्राथमिक विद्यालय',
    nameEn: 'Primary School',
    count: 1,
    detailHi: 'वार्ड 4, स्थापित 1968',
    detailEn: 'Ward 4, established 1968',
  },
  {
    id: 'upper-primary',
    icon: Building2,
    nameHi: 'उच्च प्राथमिक विद्यालय',
    nameEn: 'Upper Primary School',
    count: 1,
    detailHi: 'शंकरगढ़, 3 किमी',
    detailEn: 'Shankargarh, 3 km',
  },
  {
    id: 'anganwadi',
    icon: Baby,
    nameHi: 'आंगनवाड़ी केंद्र',
    nameEn: 'Anganwadi Center',
    count: 2,
    detailHi: 'वार्ड 3 एवं 7',
    detailEn: 'Ward 3 & 7',
  },
]

// Enrollment by class — Class 1-5
const ENROLLMENT = [
  { class: 'कक्षा 1', classEn: 'Class 1', boys: 15, girls: 9, total: 24 },
  { class: 'कक्षा 2', classEn: 'Class 2', boys: 12, girls: 10, total: 22 },
  { class: 'कक्षा 3', classEn: 'Class 3', boys: 11, girls: 9, total: 20 },
  { class: 'कक्षा 4', classEn: 'Class 4', boys: 10, girls: 9, total: 19 },
  { class: 'कक्षा 5', classEn: 'Class 5', boys: 9, girls: 9, total: 18 },
]

// Teacher statistics
const TEACHER_STATS = {
  total: 4,
  male: 3,
  female: 1,
  studentTeacherRatio: '26:1',
  rteNorm: '30:1',
  qualified: '4/4',
  qualifiedPct: 100,
  pgt: 0,
  tgt: 2,
  prt: 2,
}

// Mid-Day Meal stats
const MDM_STATS = {
  studentsCovered: 103,
  coveragePct: 100,
  cookingCost: '₹4.97',
  daysServed: 220,
}

// Sample weekly menu (bilingual)
const WEEKLY_MENU = [
  { dayHi: 'सोमवार', dayEn: 'Mon', menuHi: 'चावल, दाल, सब्ज़ी', menuEn: 'Rice, Dal, Sabzi' },
  { dayHi: 'मंगलवार', dayEn: 'Tue', menuHi: 'रोटी, सब्ज़ी, खीर', menuEn: 'Roti, Sabzi, Kheer' },
  { dayHi: 'बुधवार', dayEn: 'Wed', menuHi: 'चावल, राजमा, सलाद', menuEn: 'Rice, Rajma, Salad' },
  { dayHi: 'गुरुवार', dayEn: 'Thu', menuHi: 'रोटी, दाल, हरी सब्ज़ी', menuEn: 'Roti, Dal, Green Sabzi' },
  { dayHi: 'शुक्रवार', dayEn: 'Fri', menuHi: 'चावल, छोले, सब्ज़ी', menuEn: 'Rice, Chole, Sabzi' },
]

// Literacy data — donut PieChart segments
const LITERACY_DATA = [
  { nameHi: 'साक्षर पुरुष', nameEn: 'Literate Male', value: 412, pct: 76.5, color: SAFFRON },
  { nameHi: 'साक्षर महिला', nameEn: 'Literate Female', value: 275, pct: 58.7, color: GREEN },
  { nameHi: 'निरक्षर', nameEn: 'Illiterate', value: 560, pct: 45, color: STONE },
]

// Scholarship schemes
const SCHOLARSHIPS = [
  {
    schemeHi: 'प्री-मैट्रिक छात्रवृत्ति (SC/ST)',
    schemeEn: 'Pre-Matric Scholarship (SC/ST)',
    amountHi: '₹1,500/वर्ष',
    amountEn: '₹1,500/year',
    classHi: 'कक्षा 1-8',
    classEn: 'Class 1-8',
    beneficiaries: 12,
  },
  {
    schemeHi: 'पोस्ट-मैट्रिक छात्रवृत्ति',
    schemeEn: 'Post-Matric Scholarship',
    amountHi: '₹3,500/वर्ष',
    amountEn: '₹3,500/year',
    classHi: 'कक्षा 9-12',
    classEn: 'Class 9-12',
    beneficiaries: 8,
  },
  {
    schemeHi: 'राष्ट्रीय आजीविका मिशन (NLM)',
    schemeEn: 'National Livelihood Mission (NLM)',
    amountHi: '₹2,000/वर्ष',
    amountEn: '₹2,000/year',
    classHi: 'केवल बालिकाएं',
    classEn: 'Girls only',
    beneficiaries: 6,
  },
  {
    schemeHi: 'मुफ्त यूनिफॉर्म',
    schemeEn: 'Free Uniform',
    amountHi: '₹400/वर्ष',
    amountEn: '₹400/year',
    classHi: 'सभी छात्र',
    classEn: 'All students',
    beneficiaries: 103,
  },
]

// Recharts custom tooltip for enrollment — declared OUTSIDE the component function
// to satisfy react-hooks/static-components lint rule
function EnrollmentTooltip({
  active,
  payload,
  locale,
}: {
  active?: boolean
  payload?: Array<{ value: number; payload: { class: string; classEn: string; boys: number; girls: number; total: number } }>
  locale: 'hi' | 'en'
}) {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    const cls = locale === 'hi' ? d.class : d.classEn
    const boysLbl = locale === 'hi' ? 'लड़के' : 'Boys'
    const girlsLbl = locale === 'hi' ? 'लड़कियां' : 'Girls'
    const totalLbl = locale === 'hi' ? 'कुल' : 'Total'
    return (
      <div className="bg-card border border-border rounded-md px-3 py-2 text-xs shadow-md">
        <div className="font-medium">{cls}</div>
        <div className="text-muted-foreground">{boysLbl}: {d.boys} · {girlsLbl}: {d.girls}</div>
        <div className="font-semibold">{totalLbl}: {d.total}</div>
      </div>
    )
  }
  return null
}

// Recharts custom tooltip for literacy — declared OUTSIDE the component function
// to satisfy react-hooks/static-components lint rule
function LiteracyTooltip({
  active,
  payload,
  locale,
}: {
  active?: boolean
  payload?: Array<{ value: number; payload: { nameHi: string; nameEn: string; value: number; pct: number; color: string } }>
  locale: 'hi' | 'en'
}) {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    const name = locale === 'hi' ? d.nameHi : d.nameEn
    return (
      <div className="bg-card border border-border rounded-md px-3 py-2 text-xs shadow-md">
        <div className="font-medium">{name}</div>
        <div className="text-muted-foreground">{d.value.toLocaleString('en-IN')} ({d.pct}%)</div>
      </div>
    )
  }
  return null
}

export function EducationSection() {
  const { locale } = useI18n()
  const isHi = locale === 'hi'
  const [eduData, setEduData] = useState<{
    primary_school?: { teachers?: number; students?: number }
    literacy?: { male?: number; female?: number; overall?: number }
    enrollment?: { boys?: number; girls?: number; total?: number }
    mid_day_meal?: { students_served?: number }
    scholarships?: { sc_st?: number; obc?: number; general?: number; total?: number }
  } | null>(null)

  useEffect(() => {
    fetch('/api/content/education').then(r => r.ok ? r.json() : null).then(d => d?.data && setEduData(d.data)).catch(() => {})
  }, [])

  // Dynamic teacher stats — override hardcoded with content API data if available
  const teacherStats = eduData?.primary_school?.teachers ? {
    ...TEACHER_STATS,
    total: eduData.primary_school.teachers,
    studentTeacherRatio: eduData.primary_school.students && eduData.primary_school.teachers
      ? `${Math.round(eduData.primary_school.students / eduData.primary_school.teachers)}:1`
      : TEACHER_STATS.studentTeacherRatio,
  } : TEACHER_STATS

  // Dynamic MDM stats
  const mdmStats = eduData?.mid_day_meal?.students_served ? {
    ...MDM_STATS,
    studentsCovered: eduData.mid_day_meal.students_served,
  } : MDM_STATS

  // Dynamic literacy data — override with content API values
  const literacyData = (LITERACY_DATA).map(d => {
    if (eduData?.literacy) {
      if (d.nameEn === 'Literate Male' && eduData.literacy.male) return { ...d, pct: eduData.literacy.male }
      if (d.nameEn === 'Literate Female' && eduData.literacy.female) return { ...d, pct: eduData.literacy.female }
    }
    return d
  }).map(d => ({
    name: isHi ? d.nameHi : d.nameEn,
    ...d,
  }))

  const enrollmentData = ENROLLMENT.map(e => ({
    name: isHi ? e.class : e.classEn,
    ...e,
  }))

  return (
    <section id="education" className="section-rail border-b border-border/60 py-16 md:py-20 relative">
      {/* Decorative backdrop */}
      <div className="absolute inset-0 section-backdrop-dots pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <ScrollReveal delay={0.1}>
          <div className="mb-10">
            <Badge variant="outline" className="mb-2 gap-1.5">
              <GraduationCap className="h-3 w-3" />
              {isHi ? 'शिक्षा' : 'Education'}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold section-heading border-bottom-glow inline-block">
              {isHi
                ? 'ग्राम चंद्रा — शिक्षा संस्थाएं एवं साक्षरता'
                : 'Gram Chandra — Education Institutions & Literacy'}
            </h2>
            <p className="text-sm text-gradient-tricolor mt-3 max-w-2xl">
              {isHi
                ? 'सर्व शिक्षा अभियान, मध्याह्न भोजन योजना, छात्रवृत्ति एवं नामांकन आँकड़े'
                : 'Sarva Shiksha Abhiyan, Mid-day Meal, Scholarships & Enrollment data'}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px]">
              <a
                href="https://mdm.nic.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary inline-flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                mdm.nic.in
              </a>
              <a
                href="https://schooleducation.up.nic.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary inline-flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                schooleducation.up.nic.in
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Real panchayat photographs — school building & classroom */}
        <ScrollReveal delay={0.12}>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {SCHOOL_PHOTOS.map((p, idx) => (
              <Card
                key={idx}
                className="overflow-hidden border-border/70 hover:border-primary/40 card-hover-lift indian-border-top group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                  <img
                    src={p.src}
                    alt={(isHi ? p.titleHi : p.titleEn) + ' — वास्तविक तस्वीर / Real photo'}
                    loading="lazy"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5 bg-background/90 backdrop-blur gap-1 shadow-sm">
                      <School className="h-3 w-3 text-primary" />
                      {isHi ? 'विद्यालय' : 'School'}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4 space-y-1.5">
                  <h4 className="text-sm font-semibold leading-snug">
                    {isHi ? p.titleHi : p.titleEn}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {isHi ? p.descHi : p.descEn}
                  </p>
                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-border/40">
                    <span className="text-[10px] text-green-700 dark:text-green-400 font-medium inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      वास्तविक तस्वीर / Real photo
                    </span>
                    <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                      <Camera className="h-2.5 w-2.5" />
                      {isHi ? 'पंचायत फोटो' : 'Panchayat photo'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>

        {/* Schools Overview — 3 stat-cards */}
        <ScrollReveal delay={0.15}>
          <div className="grid md:grid-cols-3 gap-6 mb-8 tricolor-frame rounded-lg p-1">
            {SCHOOLS.map(s => {
              const Icon = s.icon
              return (
                <Card
                  key={s.id}
                  className="border-border/70 indian-border-top hover-lift-large"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm font-semibold">
                        {isHi ? s.nameHi : s.nameEn}
                      </CardTitle>
                      <div className="h-8 w-8 rounded-md grid place-items-center shrink-0 bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{s.count}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>{isHi ? s.detailHi : s.detailEn}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </ScrollReveal>

        {/* Enrollment & Teachers Card — 2-column */}
        <ScrollReveal delay={0.2}>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Left: Enrollment BarChart */}
            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {isHi ? 'कक्षावार नामांकन' : 'Enrollment by Class'}
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] gap-1 pulse-glow">
                    <Users className="h-3 w-3" />
                    {isHi ? 'कुल 103' : 'Total 103'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={enrollmentData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      width={60}
                      stroke="var(--muted-foreground)"
                    />
                    <Tooltip content={<EnrollmentTooltip locale={locale} />} />
                    <Bar
                      dataKey="total"
                      fill={SAFFRON}
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                      label={({ x, width, y, value }) => {
                        if (![x, width, y, value].every(v => Number.isFinite(v))) return null
                        return (
                          <text
                            x={x + width + 6}
                            y={y + 13}
                            fontSize="11"
                            fontWeight="600"
                            fill="var(--foreground)"
                          >
                            {value}
                          </text>
                        )
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                  {enrollmentData.map(e => (
                    <Badge
                      key={e.name}
                      variant="outline"
                      className="text-[10px] gap-1"
                      style={{ borderColor: SAFFRON, color: SAFFRON }}
                    >
                      {e.name}: {e.total}
                      <span className="text-muted-foreground">
                        ({e.boys}{isHi ? 'ले' : 'B'}/{e.girls}{isHi ? 'लि' : 'G'})
                      </span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Right: Teacher Statistics Card */}
            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" />
                    {isHi ? 'शिक्षक सांख्यिकी' : 'Teacher Statistics'}
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] gap-1">
                    <Award className="h-3 w-3" />
                    {isHi ? 'RTE अनुपात' : 'RTE Ratio'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Total Teachers + Student-Teacher Ratio */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="text-xs text-muted-foreground mb-1">
                      {isHi ? 'कुल शिक्षक' : 'Total Teachers'}
                    </div>
                    <div className="text-2xl font-bold text-primary">{teacherStats.total}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {teacherStats.male} {isHi ? 'पुरुष' : 'Male'} · {teacherStats.female} {isHi ? 'महिला' : 'Female'}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border/70">
                    <div className="text-xs text-muted-foreground mb-1">
                      {isHi ? 'छात्र-शिक्षक अनुपात' : 'Student-Teacher Ratio'}
                    </div>
                    <div className="text-2xl font-bold">{teacherStats.studentTeacherRatio}</div>
                    <div className="text-[10px] text-green-700 dark:text-green-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {isHi ? `RTE मान ${teacherStats.rteNorm} से बेहतर` : `Better than RTE ${teacherStats.rteNorm}`}
                    </div>
                  </div>
                </div>

                {/* Qualification */}
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {isHi ? 'B.Ed/B.El.Ed योग्य' : 'Qualified (B.Ed/B.El.Ed)'}
                    </div>
                    <Badge className="text-[10px] gap-1" style={{ backgroundColor: GREEN, color: '#fff' }}>
                      <Award className="h-3 w-3" />
                      {TEACHER_STATS.qualifiedPct}%
                    </Badge>
                  </div>
                  <div className="text-lg font-semibold mt-1">
                    {TEACHER_STATS.qualified}{' '}
                    <span className="text-xs text-muted-foreground">({TEACHER_STATS.qualifiedPct}%)</span>
                  </div>
                </div>

                {/* Cadre breakdown */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-md bg-secondary/50 border border-border/60">
                    <div className="text-[10px] text-muted-foreground">PGT</div>
                    <div className="text-lg font-bold">{TEACHER_STATS.pgt}</div>
                  </div>
                  <div className="text-center p-2 rounded-md bg-secondary/50 border border-border/60">
                    <div className="text-[10px] text-muted-foreground">TGT</div>
                    <div className="text-lg font-bold">{TEACHER_STATS.tgt}</div>
                  </div>
                  <div className="text-center p-2 rounded-md bg-secondary/50 border border-border/60">
                    <div className="text-[10px] text-muted-foreground">PRT</div>
                    <div className="text-lg font-bold">{TEACHER_STATS.prt}</div>
                  </div>
                </div>

                <Separator className="my-1" />
                <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                  <Info className="h-3 w-3" />
                  {isHi ? 'स्रोत: उत्तर प्रदेश बेसिक शिक्षा विभाग' : 'Source: UP Basic Education Department'}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Mid-Day Meal Card */}
        <ScrollReveal delay={0.25}>
          <Card className="border-border/70 mb-8">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <Utensils className="h-4 w-4 text-primary" />
                  {isHi ? 'मध्याह्न भोजन योजना' : 'Mid-Day Meal Scheme'}
                </CardTitle>
                <a
                  href="https://mdm.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  mdm.nic.in
                </a>
              </div>
            </CardHeader>
            <CardContent>
              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-xs text-muted-foreground mb-1">
                    {isHi ? 'छात्र कवर्ड' : 'Students Covered'}
                  </div>
                  <div className="text-2xl font-bold text-primary">{mdmStats.studentsCovered}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {MDM_STATS.coveragePct}% {isHi ? 'कवरेज' : 'coverage'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/70">
                  <div className="text-xs text-muted-foreground mb-1">
                    {isHi ? 'भोजन लागत/बालक' : 'Cooking Cost/Child'}
                  </div>
                  <div className="text-2xl font-bold">{MDM_STATS.cookingCost}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {isHi ? 'प्राथमिक' : 'primary'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                  <div className="text-xs text-muted-foreground mb-1">
                    {isHi ? 'वार्षिक दिन' : 'Days Served/Year'}
                  </div>
                  <div className="text-2xl font-bold">{MDM_STATS.daysServed}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {isHi ? 'दिन/वर्ष' : 'days/year'}
                  </div>
                </div>
              </div>

              {/* Weekly menu */}
              <div className="rounded-lg border border-border/60 overflow-hidden">
                <div className="bg-secondary/50 px-3 py-2 text-xs font-semibold flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-primary" />
                  {isHi ? 'साप्ताहिक मेनू नमूना' : 'Sample Weekly Menu'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-px bg-border/40">
                  {WEEKLY_MENU.map((m, idx) => (
                    <div key={idx} className="bg-card p-2.5">
                      <div className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                        {isHi ? m.dayHi : m.dayEn}
                      </div>
                      <div className="text-xs mt-1 leading-snug">
                        {isHi ? m.menuHi : m.menuEn}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 text-[10px] text-muted-foreground flex items-center gap-1.5">
                <Apple className="h-3 w-3" />
                {isHi
                  ? 'मेनू स्थानीय उपलब्धता के अनुसार परिवर्तनीय'
                  : 'Menu subject to local availability'}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Literacy Rate Card */}
        <ScrollReveal delay={0.3}>
          <Card className="border-border/70 mb-8 tricolor-frame">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <BookCopy className="h-4 w-4 text-primary" />
                  {isHi ? 'साक्षरता दर विश्लेषण' : 'Literacy Rate Analysis'}
                </CardTitle>
                <Badge variant="outline" className="text-[10px] gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {isHi ? 'जनगणना 2011' : 'Census 2011'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Donut chart with centered overlay label */}
                <div className="relative">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={literacyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                        labelLine={true}
                      >
                        {literacyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<LiteracyTooltip locale={locale} />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center label overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-2xl font-bold text-primary leading-none pulse-glow rounded-md px-1.5">67.8%</div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {isHi ? 'साक्षरता' : 'Literacy'}
                    </div>
                  </div>
                </div>

                {/* Legend breakdown */}
                <div className="space-y-3">
                  {literacyData.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border/60"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-3 w-3 rounded-sm shrink-0"
                          style={{ backgroundColor: d.color }}
                        />
                        <div>
                          <div className="text-xs font-medium">
                            {isHi ? d.nameHi : d.nameEn}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {isHi ? d.nameEn : d.nameHi}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{d.value.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-muted-foreground">{d.pct}%</div>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                    <Info className="h-3 w-3" />
                    {isHi
                      ? 'कुल जनसंख्या: 1,247 · साक्षर: 687'
                      : 'Total population: 1,247 · Literates: 687'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Scholarships Card */}
        <ScrollReveal delay={0.35}>
          <Card className="border-border/70 mb-8">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-primary" />
                  {isHi ? 'छात्रवृत्ति योजनाएं' : 'Scholarship Schemes'}
                </CardTitle>
                <a
                  href="https://scholarship.up.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  scholarship.up.nic.in
                </a>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">{isHi ? 'योजना' : 'Scheme'}</TableHead>
                    <TableHead className="text-xs text-right">{isHi ? 'राशि' : 'Amount'}</TableHead>
                    <TableHead className="text-xs">{isHi ? 'पात्रता' : 'Eligibility'}</TableHead>
                    <TableHead className="text-xs text-right">{isHi ? 'लाभार्थी' : 'Beneficiaries'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SCHOLARSHIPS.map((s, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-xs font-medium align-top">
                        <div className="flex items-start gap-1.5">
                          <Award className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <div>{isHi ? s.schemeHi : s.schemeEn}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {isHi ? s.schemeEn : s.schemeHi}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-right font-semibold text-primary align-top whitespace-nowrap">
                        {isHi ? s.amountHi : s.amountEn}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground align-top">
                        {isHi ? s.classHi : s.classEn}
                      </TableCell>
                      <TableCell className="text-xs text-right align-top">
                        <Badge variant="secondary" className="text-[10px]">
                          {s.beneficiaries}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-3 text-[10px] text-muted-foreground flex items-center gap-1.5">
                <Library className="h-3 w-3" />
                {isHi
                  ? 'स्रोत: उत्तर प्रदेश छात्रवृत्ति एवं शिक्षा विभाग'
                  : 'Source: UP Scholarship & Education Department'}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Footer note with section-divider */}
        <div className="section-divider">
          <span className="section-divider-dot" />
          <span className="section-divider-dot" />
          <span className="section-divider-dot" />
        </div>
        <div className="text-center text-xs text-muted-foreground mt-2 flex flex-col items-center gap-1.5">
          <p className="max-w-2xl">
            {isHi
              ? 'शिक्षा आंकड़े सर्व शिक्षा अभियान, उत्तर प्रदेश शिक्षा विभाग द्वारा प्रकाशित'
              : 'Education data published by Sarva Shiksha Abhiyan, UP Education Department'}
          </p>
          <a
            href="https://basiceducation.up.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary inline-flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            basiceducation.up.gov.in
          </a>
        </div>
      </div>
    </section>
  )
}
