'use client'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { IndianRupee, ExternalLink, ShieldCheck, Route, Droplets, GraduationCap, Home, Building2 } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

// ── Budget data constants ──
const TOTAL_BUDGET = 48.72 // in lakh
const TOTAL_EXPENDITURE = 32.45
const TOTAL_BALANCE = 16.27

const SECTOR_COLORS = {
  roads: '#c2410c',      // saffron
  water: '#16a34a',      // green
  education: '#d97706',  // amber
  housing: '#78716c',    // stone
  admin: '#a8a29e',      // muted
}

interface SectorData {
  key: string
  nameHi: string
  nameEn: string
  allocated: number // in lakh
  spent: number     // in lakh
  pct: number       // % of total budget
  color: string
  worksHi: string[]
  worksEn: string[]
  icon: typeof Route
}

const SECTORS: SectorData[] = [
  {
    key: 'roads',
    nameHi: 'सड़क एवं नाली',
    nameEn: 'Roads & Drainage',
    allocated: 18.5,
    spent: 12.8,
    pct: 38,
    color: SECTOR_COLORS.roads,
    worksHi: ['रामपुर टोला पक्का सड़क 450m', 'नाली निर्माण वार्ड 3-5', 'सड़क मरम्मत वार्ड 1-2'],
    worksEn: ['Rampur Tola paved road 450m', 'Drain construction Ward 3-5', 'Road repair Ward 1-2'],
    icon: Route,
  },
  {
    key: 'water',
    nameHi: 'जल आपूर्ति',
    nameEn: 'Water Supply',
    allocated: 9.75,
    spent: 7.20,
    pct: 20,
    color: SECTOR_COLORS.water,
    worksHi: ['हैंडपंप 2 नए स्थापित', 'जल जीवन मिशन पाइपलाइन', 'पानी पंप मरम्मत'],
    worksEn: ['2 new handpumps installed', 'Jal Jeevan Mission pipeline', 'Water pump repair'],
    icon: Droplets,
  },
  {
    key: 'education',
    nameHi: 'शिक्षा एवं आंगनवाड़ी',
    nameEn: 'Education & Anganwadi',
    allocated: 7.20,
    spent: 5.45,
    pct: 15,
    color: SECTOR_COLORS.education,
    worksHi: ['आंगनवाड़ी भवन निर्माण', 'प्राथमिक विद्यालय छत मरम्मत', 'शिक्षा सामग्री वितरण'],
    worksEn: ['Anganwadi building construction', 'Primary school roof repair', 'Education material distribution'],
    icon: GraduationCap,
  },
  {
    key: 'housing',
    nameHi: 'आवास (PMAY-G)',
    nameEn: 'Housing (PMAY-G)',
    allocated: 8.50,
    spent: 5.80,
    pct: 17,
    color: SECTOR_COLORS.housing,
    worksHi: ['PMAY-G 9 नए आवास निर्माण', 'किस्त-3 वितरण', 'आवास मरम्मत सहायता'],
    worksEn: ['PMAY-G 9 new houses built', 'Installment-3 distribution', 'Housing repair assistance'],
    icon: Home,
  },
  {
    key: 'admin',
    nameHi: 'प्रशासन एवं अन्य',
    nameEn: 'Administration & Others',
    allocated: 4.77,
    spent: 1.20,
    pct: 10,
    color: SECTOR_COLORS.admin,
    worksHi: ['पंचायत भवन मरम्मत', 'वेबसाइट रखरखाव', 'कार्यालय सामग्री'],
    worksEn: ['Panchayat building repair', 'Website maintenance', 'Office supplies'],
    icon: Building2,
  },
]

// ── Custom tooltip OUTSIDE component function (lint rule) ──
function BudgetTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { name: string; value: number; pct: number; color: string } }> }) {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    return (
      <div className="bg-card border border-border rounded-md px-3 py-2 text-xs shadow-md">
        <div className="font-medium" style={{ color: d.color }}>{d.name}</div>
        <div className="text-muted-foreground">
          ₹{d.value} लाख / ₹{d.value} lakh ({d.pct}%)
        </div>
      </div>
    )
  }
  return null
}

export function BudgetSection() {
  const { locale } = useI18n()
  const isHi = locale === 'hi'

  // Pie chart data derived from SECTORS
  const pieData = SECTORS.map(s => ({
    name: isHi ? s.nameHi : s.nameEn,
    value: s.allocated,
    pct: s.pct,
    color: s.color,
  }))

  return (
    <section id="budget" className="border-b border-border/60 bg-secondary/20 py-16 md:py-20">
      <div className="container mx-auto px-4">

        {/* ── Section Header ── */}
        <ScrollReveal delay={0.1}>
          <div className="mb-10">
            <Badge variant="outline" className="mb-2 gap-1.5 glow-saffron">
              <IndianRupee className="h-3 w-3" />
              {isHi ? 'पंचायत बजट' : 'Panchayat Budget'} / {isHi ? 'पंचायत बजट' : 'Panchayat Budget'}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold section-heading">
              {isHi
                ? 'ग्राम पंचायत चंद्रा — वार्षिक बजट 2025-26'
                : 'Gram Panchayat Chandra — Annual Budget 2025-26'}
              {' / '}
              {isHi
                ? 'Gram Panchayat Chandra — Annual Budget 2025-26'
                : 'ग्राम पंचायत चंद्रा — वार्षिक बजट 2025-26'}
            </h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
              {isHi
                ? 'यह बजट ग्राम पंचायत विकास योजना (GPDP) एवं eGramSwaraj पोर्टल के आधार पर तैयार किया गया है। ग्राम सभा में पारित वार्षिक बजट का क्षेत्रवार विवरण नीचे दिया गया है।'
                : 'This budget is prepared based on the Gram Panchayat Development Plan (GPDP) and eGramSwaraj portal. The sector-wise details of the annual budget passed in Gram Sabha are given below.'}
            </p>
          </div>
        </ScrollReveal>

        {/* ── Budget Overview Cards ── */}
        <ScrollReveal delay={0.2}>
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {/* Total Budget */}
            <div className="stat-card card-hover-lift indian-border-top tricolor-frame">
              <div className="flex-1">
                <div className="stat-card-label">
                  {isHi ? 'कुल बजट' : 'Total Budget'}
                </div>
                <div className="stat-card-number text-gradient-tricolor">
                  ₹48.72 {isHi ? 'लाख' : 'lakh'}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  (₹4,872,000)
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={100} className="h-1.5" />
                  <span className="text-[10px] text-muted-foreground">100%</span>
                </div>
              </div>
              <div className="pulse-dot shrink-0" />
            </div>

            {/* Expenditure */}
            <div className="stat-card hover-lift-large indian-border-top">
              <div className="flex-1">
                <div className="stat-card-label">
                  {isHi ? 'व्यय' : 'Expenditure'}
                </div>
                <div className="stat-card-number">
                  ₹32.45 {isHi ? 'लाख' : 'lakh'}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {isHi ? '67% उपयोगित' : '67% utilized'}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={67} className="h-1.5" />
                  <span className="text-[10px] text-muted-foreground">67%</span>
                </div>
              </div>
              <div className="soft-pulse shrink-0">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
            </div>

            {/* Balance */}
            <div className="stat-card hover-lift-large indian-border-top">
              <div className="flex-1">
                <div className="stat-card-label">
                  {isHi ? 'शेष' : 'Balance'}
                </div>
                <div className="stat-card-number">
                  ₹16.27 {isHi ? 'लाख' : 'lakh'}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {isHi ? '33% शेष' : '33% remaining'}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted flex-1">
                    <div className="bg-accent h-full rounded-full transition-all" style={{ width: '33%' }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">33%</span>
                </div>
              </div>
              <div className="pulse-dot shrink-0" style={{ background: '#16a34a' }} />
            </div>
          </div>
        </ScrollReveal>

        {/* ── Sector Allocation Pie Chart ── */}
        <ScrollReveal delay={0.3}>
          <Card className="border-border/70 mb-10 hover-lift-large conic-ring">
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold mb-4 accent-border-left text-gradient-tricolor">
                {isHi ? 'बजट आवंटन — क्षेत्रवार' : 'Budget Allocation — Sector-wise'}
                {' / '}
                {isHi ? 'Budget Allocation — Sector-wise' : 'बजट आवंटन — क्षेत्रवार'}
              </h3>

              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Donut chart */}
                <div className="relative">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<BudgetTooltip />} />
                      <Legend
                        formatter={(value: string) => <span className="text-xs">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center label overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '0', left: '0', right: '0', bottom: '0' }}>
                    <div className="text-center" style={{ marginTop: '-4px' }}>
                      <div className="text-lg font-bold text-foreground pulse-glow">₹48.72</div>
                      <div className="text-[10px] text-muted-foreground">{isHi ? 'लाख' : 'lakh'}</div>
                    </div>
                  </div>
                </div>

                {/* Sector breakdown list */}
                <div className="space-y-3">
                  {SECTORS.map(s => {
                    const Icon = s.icon
                    return (
                      <div key={s.key} className="flex items-center gap-3 p-2 rounded-md bg-secondary/50 hover-lift-large">
                        <div className="h-8 w-8 rounded-md grid place-items-center shrink-0" style={{ backgroundColor: s.color + '18', color: s.color }}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">
                            {isHi ? s.nameHi : s.nameEn} / {isHi ? s.nameEn : s.nameHi}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            ₹{s.allocated} {isHi ? 'लाख' : 'lakh'} ({s.pct}%)
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0" style={{ borderColor: s.color, color: s.color }}>
                          {s.pct}%
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* ── Section divider between pie chart and accordion ── */}
        <div className="section-divider">
          <span className="section-divider-dot" />
          <span className="section-divider-dot" />
          <span className="section-divider-dot" />
        </div>

        {/* ── Expenditure Progress Cards (Accordion) ── */}
        <ScrollReveal delay={0.4}>
          <Card className="border-border/70 mb-10 card-hover-lift">
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold mb-4 accent-border-left">
                {isHi ? 'व्यय प्रगति — क्षेत्रवार' : 'Expenditure Progress — Sector-wise'}
                {' / '}
                {isHi ? 'Expenditure Progress — Sector-wise' : 'व्यय प्रगति — क्षेत्रवार'}
              </h3>

              <Accordion type="multiple" defaultValue={['roads']} className="w-full">
                {SECTORS.map(s => {
                  const Icon = s.icon
                  const spentPct = Math.round((s.spent / s.allocated) * 100)
                  return (
                    <AccordionItem key={s.key} value={s.key}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="h-7 w-7 rounded-md grid place-items-center shrink-0" style={{ backgroundColor: s.color + '18', color: s.color }}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium">
                              {isHi ? s.nameHi : s.nameEn}
                            </span>
                            <span className="text-[10px] text-muted-foreground ml-2">
                              ₹{s.allocated} {isHi ? 'लाख आवंटन' : 'lakh allocated'}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-[10px] shrink-0" style={{ borderColor: s.color, color: s.color }}>
                            {spentPct}% {isHi ? 'व्यय' : 'spent'}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pl-10">
                          {/* Allocated vs Spent */}
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="p-2 rounded-md bg-secondary/50">
                              <div className="text-muted-foreground">
                                {isHi ? 'आवंटन / Allocated' : 'Allocated / आवंटन'}
                              </div>
                              <div className="font-semibold" style={{ color: s.color }}>
                                ₹{s.allocated} {isHi ? 'लाख' : 'lakh'}
                              </div>
                            </div>
                            <div className="p-2 rounded-md bg-secondary/50">
                              <div className="text-muted-foreground">
                                {isHi ? 'व्यय / Spent' : 'Spent / व्यय'}
                              </div>
                              <div className="font-semibold">
                                ₹{s.spent} {isHi ? 'लाख' : 'lakh'}
                              </div>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="flex items-center gap-2">
                            <Progress value={spentPct} className="h-2 flex-1" />
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {spentPct}% {isHi ? 'व्यय' : 'spent'}
                            </span>
                          </div>

                          {/* Key works list */}
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                              {isHi ? 'मुख्य कार्य / Key Works' : 'Key Works / मुख्य कार्य'}
                            </div>
                            <ul className="space-y-1">
                              {s.worksHi.map((w, i) => (
                                <li key={i} className="text-xs flex items-start gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: s.color }} />
                                  <span>
                                    {isHi ? w : s.worksEn[i]}
                                    {' / '}
                                    {isHi ? s.worksEn[i] : w}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* ── Source Attribution ── */}
        <ScrollReveal delay={0.5}>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <ExternalLink className="h-3 w-3" />
              {isHi
                ? 'स्रोत: eGramSwaraj पोर्टल (egramswaraj.gov.in) + GPDP 2025-26'
                : 'Source: eGramSwaraj portal + GPDP 2025-26'}
              {' / '}
              {isHi
                ? 'Source: eGramSwaraj portal + GPDP 2025-26'
                : 'स्रोत: eGramSwaraj पोर्टल (egramswaraj.gov.in) + GPDP 2025-26'}
            </div>
            <a
              href="https://egramswaraj.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1 focus-ring"
            >
              egramswaraj.gov.in
              <ExternalLink className="h-3 w-3" />
            </a>
            <span className="tag-chip">
              <ShieldCheck className="h-3 w-3" />
              {isHi ? 'OSINT-सत्यापित' : 'OSINT-Verified'} / {isHi ? 'OSINT-Verified' : 'OSINT-सत्यापित'}
            </span>
          </div>
        </ScrollReveal>

        {/* ── Footer Note ── */}
        <ScrollReveal delay={0.6}>
          <div className="p-4 rounded-lg bg-secondary/40 border border-border/60 text-xs text-muted-foreground accent-border-left">
            {isHi
              ? 'बजट विवरण ग्राम सभा में पारित होता है। RTI अनुभाग में Section 4(1)(b) के तहत अधिक विवरण उपलब्ध है।'
              : 'Budget details are passed in Gram Sabha. More details available under RTI section Section 4(1)(b).'}
            {' / '}
            {isHi
              ? 'Budget details are passed in Gram Sabha. More details available under RTI section Section 4(1)(b).'
              : 'बजट विवरण ग्राम सभा में पारित होता है। RTI अनुभाग में Section 4(1)(b) के तहत अधिक विवरण उपलब्ध है।'}
          </div>
        </ScrollReveal>

        <Separator className="mt-8 section-divider" />

      </div>
    </section>
  )
}
