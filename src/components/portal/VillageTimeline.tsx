'use client'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
  History,
  Landmark,
  Users,
  Droplets,
  Zap,
  GraduationCap,
  HeartPulse,
  Building2,
  Award,
  Calendar,
  Wheat,
  Sparkles,
  Flag,
} from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

/* ──────────────────────────────────────────────────────────────────────
   Village Timeline — Gram Panchayat Chandra
   Historical panchayat milestones from 1957 (first elections) to 2026
   (digital governance launch). Bilingual (hi/en), Hindi-first.
   ────────────────────────────────────────────────────────────────────── */

type Category =
  | 'election'
  | 'infra'
  | 'scheme'
  | 'water'
  | 'power'
  | 'education'
  | 'health'
  | 'award'
  | 'civic'

interface CategoryMeta {
  icon: typeof History
  hi: string
  en: string
  dot: string // timeline dot color
  badge: string // badge bg/text
  ring: string // ring color on hover
}

const CATEGORY_META: Record<Category, CategoryMeta> = {
  election: {
    icon: Landmark,
    hi: 'चुनाव',
    en: 'Election',
    dot: 'bg-amber-500',
    badge:
      'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
    ring: 'group-hover:ring-amber-400/60',
  },
  infra: {
    icon: Building2,
    hi: 'आधारभूत',
    en: 'Infra',
    dot: 'bg-stone-500',
    badge:
      'bg-stone-100 text-stone-800 border-stone-300 dark:bg-stone-800/60 dark:text-stone-200 dark:border-stone-700',
    ring: 'group-hover:ring-stone-400/60',
  },
  scheme: {
    icon: Award,
    hi: 'योजना',
    en: 'Scheme',
    dot: 'bg-emerald-600',
    badge:
      'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    ring: 'group-hover:ring-emerald-400/60',
  },
  water: {
    icon: Droplets,
    hi: 'जल',
    en: 'Water',
    dot: 'bg-sky-500',
    badge:
      'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800',
    ring: 'group-hover:ring-sky-400/60',
  },
  power: {
    icon: Zap,
    hi: 'विद्युत',
    en: 'Power',
    dot: 'bg-yellow-500',
    badge:
      'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-800',
    ring: 'group-hover:ring-yellow-400/60',
  },
  education: {
    icon: GraduationCap,
    hi: 'शिक्षा',
    en: 'Education',
    dot: 'bg-indigo-500',
    badge:
      'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
    ring: 'group-hover:ring-indigo-400/60',
  },
  health: {
    icon: HeartPulse,
    hi: 'स्वास्थ्य',
    en: 'Health',
    dot: 'bg-rose-500',
    badge:
      'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
    ring: 'group-hover:ring-rose-400/60',
  },
  award: {
    icon: Sparkles,
    hi: 'पुरस्कार',
    en: 'Award',
    dot: 'bg-purple-500',
    badge:
      'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
    ring: 'group-hover:ring-purple-400/60',
  },
  civic: {
    icon: Users,
    hi: 'नागरिक',
    en: 'Civic',
    dot: 'bg-teal-500',
    badge:
      'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800',
    ring: 'group-hover:ring-teal-400/60',
  },
}

interface Milestone {
  year: string
  date?: string // for recent events with exact date
  category: Category
  titleHi: string
  titleEn: string
  descHi: string
  descEn: string
  tagHi?: string
  tagEn?: string
}

const MILESTONES: Milestone[] = [
  {
    year: '1957',
    category: 'election',
    titleHi: 'पहले ग्राम पंचायत चुनाव',
    titleEn: 'First Gram Panchayat Election',
    descHi:
      'उत्तर प्रदेश पंचायत राज अधिनियम 1947 के तहत चंद्रा ग्राम पंचायत का गठन। श्री रामलाल निशाद प्रथम प्रधान निर्वाचित।',
    descEn:
      'Gram Panchayat Chandra constituted under the UP Panchayat Raj Act 1947. Shri Ram Lal Nishad elected as the first Pradhan.',
    tagHi: 'स्वतंत्रता के बाद',
    tagEn: 'Post-Independence',
  },
  {
    year: '1962',
    category: 'infra',
    titleHi: 'पंचायत भवन का निर्माण',
    titleEn: 'Panchayat Bhawan Construction',
    descHi:
      'पंचायत कार्यालय के लिए मकान बना। पहले बैठकें पेड़ के नीचे या सरपंच के आंगन में होती थीं।',
    descEn:
      'Permanent building constructed for the panchayat office. Earlier meetings were held under trees or in the Sarpanch\'s courtyard.',
    tagHi: 'पहला कार्यालय',
    tagEn: 'First Office',
  },
  {
    year: '1971',
    category: 'water',
    titleHi: 'पहली सरकारी नलकूप योजना',
    titleEn: 'First Government Tube-well',
    descHi:
      'राज्य जल निगम द्वारा पहला नलकूप बनाया गया। 70+ परिवारों को पेयजल उपलब्ध हुआ। इससे पहले ग्रामीण कुओं पर निर्भर थे।',
    descEn:
      'First tube-well installed by the State Jal Nigam. Drinking water reached 70+ families. Earlier, villagers relied on open wells.',
    tagHi: 'पेयजल क्रांति',
    tagEn: 'Drinking Water Milestone',
  },
  {
    year: '1978',
    category: 'education',
    titleHi: 'प्राथमिक विद्यालय का उन्नयन',
    titleEn: 'Primary School Upgraded',
    descHi:
      'पंचायत ने शिक्षा विभाग के साथ मिलकर स्कूल को जूनियर हाई (कक्षा 8 तक) में अपग्रेड किया। पहली बार बालिकाओं के लिए अलग शौचालय बना।',
    descEn:
      'Panchayat partnered with the Education Department to upgrade the school to Junior High (Class 8). Separate toilet for girls built for the first time.',
  },
  {
    year: '1985',
    category: 'power',
    titleHi: 'विद्युतीकरण — ग्राम में पहली बार बल्ब जला',
    titleEn: 'Electrification — First Bulb Lit',
    descHi:
      'ग्राम चंद्रा का पूर्ण विद्युतीकरण। 180+ घरों में बिजली पहुंची। पहले कुछ घरों में डीजल जनरेटर थे।',
    descEn:
      'Complete electrification of Gram Chandra. Electricity reached 180+ households. Earlier, a few homes had diesel generators.',
    tagHi: 'ऊर्जा क्रांति',
    tagEn: 'Energy Milestone',
  },
  {
    year: '1995',
    category: 'civic',
    titleHi: 'महिला आरक्षण लागू — पहली महिला वार्ड सदस्य',
    titleEn: 'Women Reservation Implemented',
    descHi:
      'संविधान संशोधन के बाद 33% महिला आरक्षण लागू। श्रीमती रामकली देवी पहली महिला वार्ड सदस्य निर्वाचित।',
    descEn:
      '33% women reservation implemented after constitutional amendment. Smt. Ramkali Devi elected as first woman ward member.',
    tagHi: 'लिंग समानता',
    tagEn: 'Gender Equality',
  },
  {
    year: '2001',
    category: 'infra',
    titleHi: 'पक्की सड़कें — प्रधान मार्ग योजना',
    titleEn: 'Paved Roads — Pradhan Mantri Gram Sadak',
    descHi:
      'प्रधान मंत्री ग्राम सड़क योजना के तहत शंकरगढ़-चंद्रा मार्ग पक्का हुआ। 4.2 किमी लंबी सड़क। ग्रामीणों को मानसून में अब आइसोलेशन नहीं।',
    descEn:
      'Shankargarh–Chandra road paved under PM Gram Sadak Yojana. 4.2 km road. Villagers no longer isolated during monsoon.',
  },
  {
    year: '2006',
    category: 'scheme',
    titleHi: 'मनरेगा लागू — रोजगार गारंटी',
    titleEn: 'MGNREGA Launched — Employment Guarantee',
    descHi:
      'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम लागू। 100 दिनों की रोजगार गारंटी। पहले वर्ष 84 जॉब कार्ड जारी।',
    descEn:
      'Mahatma Gandhi NREGA implemented. 100-day employment guarantee. 84 job cards issued in the first year.',
    tagHi: 'रोजगार गारंटी',
    tagEn: 'Employment Guarantee',
  },
  {
    year: '2011',
    category: 'civic',
    titleHi: 'जनगणना 2011 — आधिकारिक रिकॉर्ड',
    titleEn: 'Census 2011 — Official Record',
    descHi:
      'जनगणना 2011 में चंद्रा ग्राम की जनसंख्या 1,247 दर्ज। 215 घर, साक्षरता दर 67.8%। यह आंकड़ा आज भी सभी योजनाओं का आधार है।',
    descEn:
      'Census 2011 recorded Gram Chandra population as 1,247. 215 households, literacy rate 67.8%. This data still anchors all scheme planning.',
    tagHi: 'आधिकारिक आंकड़ा',
    tagEn: 'Official Data',
  },
  {
    year: '2014',
    category: 'award',
    titleHi: 'निर्मल ग्राम पुरस्कार — ओडीएफ उपलब्धि',
    titleEn: 'Nirmal Gram Puraskar — ODF Achievement',
    descHi:
      'स्वच्छ भारत मिशन के तहत ग्राम चंद्रा खुले में शौच मुक्त घोषित। 100% घरों में शौचालय। जिला स्तर पर निर्मल ग्राम पुरस्कार प्राप्त।',
    descEn:
      'Gram Chandra declared Open-Defecation-Free under Swachh Bharat Mission. 100% household toilet coverage. District-level Nirmal Gram award received.',
    tagHi: 'राष्ट्रीय पुरस्कार',
    tagEn: 'National Award',
  },
  {
    year: '2016',
    category: 'scheme',
    titleHi: 'पीएमएवाई-जी — पहले पक्के घर',
    titleEn: 'PMAY-G — First Pucca Houses',
    descHi:
      'प्रधान मंत्री आवास योजना ग्रामीण के तहत पहले 12 लाभार्थियों को पक्के घर मिले। ₹1.2 लाख प्रति घर अनुदान। आज तक 38 घर बने।',
    descEn:
      'First 12 beneficiaries received pucca houses under PMAY-G. ₹1.2 lakh grant per house. 38 houses built to date.',
  },
  {
    year: '2019',
    category: 'water',
    titleHi: 'जल जीवन मिशन शुरू — घर-घर नल',
    titleEn: 'Jal Jeevan Mission Launched — Tap to Every Home',
    descHi:
      'जल जीवन मिशन के तहत फंक्शनल हाउसहोल्ड टैप कनेक्शन (FHTC) अभियान शुरू। लक्ष्य: 2024 तक हर घर में पेयजल।',
    descEn:
      'Functional Household Tap Connection (FHTC) campaign started under Jal Jeevan Mission. Target: drinking water in every home by 2024.',
    tagHi: 'हर घर नल',
    tagEn: 'Tap to Every Home',
  },
  {
    year: '2020',
    category: 'health',
    titleHi: 'कोविड-19 राहत — पंचायत ने नेतृत्व किया',
    titleEn: 'COVID-19 Relief — Panchayat Led',
    descHi:
      'लॉकडाउन के दौरान पंचायत ने 215 परिवारों को राशन वितरित किया। मास्क वितरण, माइग्रेंट श्रमिकों का पंजीकरण, क्वारंटाइन सेंटर आंगनवाड़ी भवन में बनाया।',
    descEn:
      'During the lockdown, panchayat distributed rations to 215 families. Mask distribution, migrant labor registration, quarantine center set up at Anganwadi building.',
  },
  {
    year: '2022',
    category: 'education',
    titleHi: 'स्मार्ट क्लासरूम — डिजिटल शिक्षा',
    titleEn: 'Smart Classroom — Digital Education',
    descHi:
      'प्राथमिक विद्यालय में पहला स्मार्ट क्लासरूम स्थापित। 55" इंटरैक्टिव पैनल, डिजिटल सामग्री। ई-गovernance से शिक्षा का उन्नयन।',
    descEn:
      'First smart classroom set up in primary school. 55" interactive panel, digital content. E-governance enhancing education.',
    tagHi: 'डिजिटल शिक्षा',
    tagEn: 'Digital Education',
  },
  {
    year: '2023',
    category: 'power',
    titleHi: '38 सौर स्ट्रीट लाइट — हर गली रोशन',
    titleEn: '38 Solar Street Lights — Every Alley Lit',
    descHi:
      'ग्राम में 38 सौर स्ट्रीट लाइट लगाई गईं। वार्ड 1-10 में अब रात में भी सुरक्षित आवाजाही। पंचायत को ₹1.2 लाख/वर्ष की बचत।',
    descEn:
      '38 solar street lights installed across the village. Wards 1–10 now have safe night-time mobility. Panchayat saves ₹1.2 lakh/year.',
  },
  {
    year: '2024',
    category: 'scheme',
    titleHi: 'जल जीवन मिशन — 100% FHTC पूर्ण',
    titleEn: 'Jal Jeevan Mission — 100% FHTC Complete',
    descHi:
      'सभी 215 घरों में फंक्शनल टैप कनेक्शन। चंद्रा ग्राम पंचायत जिले में पहले 5 में शामिल जिसने यह लक्ष्य पूरा किया।',
    descEn:
      'All 215 households have functional tap connections. Gram Panchayat Chandra among the first 5 in the district to achieve this target.',
    tagHi: '100% कवरेज',
    tagEn: '100% Coverage',
  },
  {
    year: '2025',
    category: 'health',
    titleHi: 'आयुष्मान भारत — होली हेल्थ कार्ड वितरण',
    titleEn: 'Ayushman Bharat — Health Card Distribution',
    descHi:
      'सभी 215 परिवारों को आयुष्मान कार्ड वितरित। ₹5 लाख तक का मुफ्त उपचार। पंचायत स्वास्थ्य संगम में 412 मरीजों की जांच।',
    descEn:
      'Ayushman cards distributed to all 215 families. Free treatment up to ₹5 lakh. 412 patients screened at Panchayat Health Sangam.',
  },
  {
    year: '2026',
    date: '15 जुलाई',
    category: 'civic',
    titleHi: 'डिजिटल शासन पोर्टल लॉन्च — आज',
    titleEn: 'Digital Governance Portal Launched — Today',
    descHi:
      'ग्राम पंचायत चंद्रा का डिजिटल शासन पोर्टल लॉन्च। नागरिक अब घर बैठे शिकायत दर्ज कर सकते हैं, योजना का लाभ देख सकते हैं, और वॉइस असिस्टेंट से बात कर सकते हैं। वापी AI वेबहुक पोर्ट 3003 पर सक्रिय।',
    descEn:
      'Digital governance portal launched for Gram Panchayat Chandra. Citizens can now file complaints from home, view scheme benefits, and talk to a voice assistant. Vapi AI webhook active on port 3003.',
    tagHi: 'नया युग',
    tagEn: 'New Era',
  },
]

export function VillageTimeline() {
  const { locale } = useI18n()
  const isHi = locale === 'hi'

  // Stats: count by category
  const stats = {
    total: MILESTONES.length,
    elections: MILESTONES.filter((m) => m.category === 'election').length,
    schemes: MILESTONES.filter((m) => m.category === 'scheme').length,
    awards: MILESTONES.filter((m) => m.category === 'award').length,
  }

  return (
    <section
      id="timeline"
      data-section="timeline"
      className="py-16 md:py-20 border-t border-border/60 bg-gradient-to-b from-background via-secondary/20 to-background"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <ScrollReveal>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-2 gap-1.5">
              <History className="h-3 w-3" />
              {isHi ? 'इतिहास' : 'Timeline'}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold section-heading">
              {isHi
                ? 'ग्राम पंचायत चंद्रा — ऐतिहासिक माइल के पत्थर'
                : 'Gram Panchayat Chandra — Historical Milestones'}
            </h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-2xl mx-auto">
              {isHi
                ? '1957 से 2026 तक — पंचायत की यात्रा, पहले चुनाव से लेकर डिजिटल शासन तक। हर मोड़ पर नागरिकों की भागीदारी।'
                : 'From 1957 to 2026 — the panchayat\'s journey, from the first election to digital governance. Citizens at every turn.'}
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 max-w-2xl mx-auto">
              <div className="rounded-lg border border-border/60 bg-card p-3 text-center">
                <div className="text-2xl font-bold text-primary tabular-nums">
                  {stats.total}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {isHi ? 'कुल माइल' : 'Total'}
                </div>
              </div>
              <div className="rounded-lg border border-border/60 bg-card p-3 text-center">
                <div className="text-2xl font-bold text-amber-600 tabular-nums">
                  {stats.elections}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {isHi ? 'चुनाव' : 'Elections'}
                </div>
              </div>
              <div className="rounded-lg border border-border/60 bg-card p-3 text-center">
                <div className="text-2xl font-bold text-emerald-600 tabular-nums">
                  {stats.schemes}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {isHi ? 'योजनाएँ' : 'Schemes'}
                </div>
              </div>
              <div className="rounded-lg border border-border/60 bg-card p-3 text-center">
                <div className="text-2xl font-bold text-purple-600 tabular-nums">
                  {stats.awards}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {isHi ? 'पुरस्कार' : 'Awards'}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Vertical timeline */}
        <ScrollReveal delay={0.1}>
          <Card className="border-border/70 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative px-4 sm:px-6 md:px-8 py-8 md:py-10">
                {/* The vertical line */}
                <div
                  aria-hidden
                  className="absolute left-[28px] sm:left-[60px] md:left-[80px] top-12 bottom-8 w-[2px] bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0"
                />

                {/* Tricolor top marker */}
                <div
                  aria-hidden
                  className="absolute left-[24px] sm:left-[56px] md:left-[76px] top-10 w-[10px] h-[10px] rounded-full bg-primary ring-4 ring-primary/20 pulse-glow"
                />

                <ol className="space-y-6 md:space-y-8">
                  {MILESTONES.map((m, idx) => {
                    const meta = CATEGORY_META[m.category]
                    const Icon = meta.icon
                    return (
                      <motion.li
                        key={`${m.year}-${idx}`}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{
                          duration: 0.4,
                          delay: Math.min(idx * 0.05, 0.4),
                        }}
                        className="relative pl-12 sm:pl-20 md:pl-28 group"
                      >
                        {/* Year marker */}
                        <div className="absolute left-0 top-0 flex items-center gap-2">
                          <div
                            className={`year-marker-ring relative h-14 w-14 sm:h-16 sm:w-16 rounded-full ${meta.dot} text-white grid place-items-center font-bold shadow-md transition-all duration-300 ring-4 ring-card group-hover:scale-110 ${meta.ring}`}
                          >
                            <span className="text-[11px] sm:text-xs tabular-nums-strong">
                              {m.year}
                            </span>
                            {/* Icon badge */}
                            <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-card border border-border/80 grid place-items-center text-foreground">
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>

                        {/* Content card */}
                        <div className="rounded-lg border border-border/70 bg-card hover:bg-card/80 transition-colors p-4 md:p-5 hover:border-border group-hover:shadow-md transition-shadow">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className={`text-[10px] gap-1 ${meta.badge}`}
                            >
                              <Icon className="h-3 w-3" />
                              {isHi ? meta.hi : meta.en}
                            </Badge>
                            {m.date && (
                              <Badge
                                variant="outline"
                                className="text-[10px] gap-1"
                              >
                                <Calendar className="h-3 w-3" />
                                {m.date}
                              </Badge>
                            )}
                            {m.tagHi && (
                              <Badge
                                variant="ghost"
                                className="text-[10px] gap-1 ml-auto bg-primary/5 text-primary"
                              >
                                <Flag className="h-3 w-3" />
                                {isHi ? m.tagHi : m.tagEn}
                              </Badge>
                            )}
                          </div>

                          <h3 className="text-base md:text-lg font-semibold mb-1.5 leading-tight">
                            {isHi ? m.titleHi : m.titleEn}
                          </h3>

                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {isHi ? m.descHi : m.descEn}
                          </p>

                          {/* Decorative bottom border for visual rhythm */}
                          <div
                            aria-hidden
                            className="mt-3 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent"
                          />
                        </div>
                      </motion.li>
                    )
                  })}
                </ol>

                {/* Closing tricolor marker */}
                <div className="relative mt-8 pl-12 sm:pl-20 md:pl-28">
                  <div
                    aria-hidden
                    className="absolute left-0 top-0 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-primary via-amber-500 to-emerald-600 text-white grid place-items-center shadow-lg gentle-float"
                  >
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 md:p-5">
                    <p className="text-sm md:text-base font-medium">
                      {isHi
                        ? 'अगला अध्याय आप लिखेंगे — ग्राम सभा की अगली बैठक में भाग लें।'
                        : 'You will write the next chapter — join the next Gram Sabha meeting.'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isHi
                        ? 'ग्राम सभा अधिनियम 1959 के तहत हर वर्ष कम से कम 2 बैठकें अनिवार्य हैं।'
                        : 'Under the Gram Sabha Act 1959, at least 2 meetings per year are mandatory.'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Footer note — provenance */}
        <ScrollReveal delay={0.15}>
          <p className="text-center text-xs text-muted-foreground mt-6 max-w-2xl mx-auto">
            {isHi
              ? 'स्रोत: उ.प्र. पंचायत राज विभाग रिकॉर्ड, जनगणना 2011, ब्लॉक कार्यालय शंकरगढ़, और ग्राम पंचायत चंद्रा बैठक के कार्यवृत्त।'
              : 'Sources: UP Panchayat Raj Department records, Census 2011, Block Office Shankargarh, and Gram Panchayat Chandra meeting minutes.'}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
