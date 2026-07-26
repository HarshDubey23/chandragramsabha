'use client'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { motion } from 'framer-motion'
import {
  Trees,
  Droplets,
  Wheat,
  Building,
  Sun,
  Wind,
  Mountain,
  Tractor,
  LandPlot,
  TreePine,
  Waves,
  Sprout,
  Flame,
  MapPin,
  Phone,
  Clock,
  Info,
  CheckCircle2,
  ExternalLink,
  Combine,
} from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

// ── Land-use breakdown data (6 slices, 460 ha total) ──
interface LandUseSlice {
  key: string
  nameHi: string
  nameEn: string
  value: number // hectare
  pct: number
  color: string
}

const LAND_USE: LandUseSlice[] = [
  { key: 'agri',   nameHi: 'कृषि भूमि',          nameEn: 'Agricultural Land',    value: 285, pct: 62.0, color: '#FF9933' },
  { key: 'forest', nameHi: 'वन / चारागाह',        nameEn: 'Forest / Grazing',     value: 65,  pct: 14.1, color: '#138808' },
  { key: 'resi',   nameHi: 'आवासीय क्षेत्र',       nameEn: 'Residential',          value: 42,  pct: 9.1,  color: '#F59E0B' },
  { key: 'water',  nameHi: 'जल स्रोत',             nameEn: 'Water Bodies',         value: 18,  pct: 3.9,  color: '#0EA5E9' },
  { key: 'pub',    nameHi: 'सार्वजनिक ढांचा',      nameEn: 'Public Infrastructure',value: 15,  pct: 3.3,  color: '#8B5CF6' },
  { key: 'waste',  nameHi: 'बंजर / अन्य',          nameEn: 'Wasteland / Other',    value: 35,  pct: 7.6,  color: '#6B7280' },
]

const TOTAL_HA = 460

// ── Water bodies & irrigation sources ──
const WATER_BODIES = [
  {
    id: 'tubewells',
    icon: Droplets,
    titleHi: 'सरकारी ट्यूबवेल',
    titleEn: 'Government Tube wells',
    countHi: '4 ट्यूबवेल',
    countEn: '4 tube wells',
    descHi: 'सिंचाई हेतु',
    descEn: 'For irrigation',
    detailHi: 'वार्ड 2, 5, 7, 9',
    detailEn: 'Ward 2, 5, 7, 9',
  },
  {
    id: 'ponds',
    icon: Waves,
    titleHi: 'तालाब / पोखर',
    titleEn: 'Ponds / Tanks',
    countHi: '2 सामुदायिक तालाब',
    countEn: '2 community ponds',
    descHi: 'मछली पालन एवं पुनर्भरण',
    descEn: 'Fishery & recharge',
    detailHi: 'वार्ड 1 एवं 6',
    detailEn: 'Ward 1 & 6',
  },
  {
    id: 'canal',
    icon: Droplets,
    titleHi: 'नहर पहुँच',
    titleEn: 'Canal Reach',
    countHi: 'असी-वरुणा शाखा',
    countEn: 'Assi-Varuna canal branch',
    descHi: 'कृषि जल आपूर्ति',
    descEn: 'Agricultural water supply',
    detailHi: '145 हे कमान क्षेत्र',
    detailEn: '145 ha command area',
  },
]

// ── Common property resources ──
const CPR = [
  {
    id: 'bhawan',
    icon: Building,
    titleHi: 'पंचायत भवन',
    titleEn: 'Panchayat Bhawan',
    metaHi: '1 भवन',
    metaEn: '1 building',
    descHi: 'सरपंच कार्यालय',
    descEn: 'Sarpanch office',
    detailHi: 'वार्ड 4 · 2400 वर्ग फुट',
    detailEn: 'Ward 4 · 2400 sq ft',
  },
  {
    id: 'hall',
    icon: Building,
    titleHi: 'सामुदायिक भवन',
    titleEn: 'Community Hall',
    metaHi: '1 हॉल',
    metaEn: '1 hall',
    descHi: 'विवाह एवं सभाएँ',
    descEn: 'Weddings & meetings',
    detailHi: '200 क्षमता',
    detailEn: '200 capacity',
  },
  {
    id: 'cremation',
    icon: Flame,
    titleHi: 'श्मशान घाट',
    titleEn: 'Cremation Ground',
    metaHi: '1 स्थल',
    metaEn: '1 site',
    descHi: 'अंतिम संस्कार',
    descEn: 'Last rites',
    detailHi: 'वार्ड 8 बाहरी क्षेत्र',
    detailEn: 'Ward 8 outskirts',
  },
  {
    id: 'playground',
    icon: Mountain,
    titleHi: 'खेल का मैदान',
    titleEn: 'Playground',
    metaHi: '1 मैदान',
    metaEn: '1 ground',
    descHi: 'बच्चों का मैदान',
    descEn: "Children's ground",
    detailHi: '1.2 एकड़, विद्यालय के पास',
    detailEn: '1.2 acre near school',
  },
  {
    id: 'grazing',
    icon: Wheat,
    titleHi: 'चारागाह',
    titleEn: 'Grazing Land',
    metaHi: '65 हे',
    metaEn: '65 ha',
    descHi: 'चारागाह',
    descEn: 'Pasture land',
    detailHi: 'गोपालन हेतु',
    detailEn: 'For cattle grazing',
  },
  {
    id: 'forest',
    icon: TreePine,
    titleHi: 'वन क्षेत्र',
    titleEn: 'Forest Patch',
    metaHi: '28 हे',
    metaEn: '28 ha',
    descHi: 'वन क्षेत्र',
    descEn: 'Forest area',
    detailHi: 'संयुक्त वन प्रबंधन समिति',
    detailEn: 'Joint Forest Management Committee',
  },
]

// ── Renewable energy & public assets ──
const ENERGY_ASSETS = [
  {
    id: 'solar-street',
    icon: Sun,
    titleHi: 'सौर स्ट्रीट लाइट',
    titleEn: 'Solar Street Lights',
    metaHi: '38 लाइटें · 10 वार्ड',
    metaEn: '38 lights · 10 wards',
    descHi: 'रात्रि गशन',
    descEn: 'Night lighting',
    detailHi: '₹1.2 लाख/वर्ष बिजली बचत',
    detailEn: '₹1.2L/year electricity saved',
  },
  {
    id: 'solar-pump',
    icon: Sun,
    titleHi: 'सौर जल पम्प',
    titleEn: 'Solar Water Pump',
    metaHi: '2 पम्प · पेय जल',
    metaEn: '2 pumps · drinking water',
    descHi: 'पेय जल आपूर्ति',
    descEn: 'Drinking water supply',
    detailHi: 'वार्ड 3 एवं 7',
    detailEn: 'Ward 3 & 7',
  },
  {
    id: 'toilets',
    icon: Building,
    titleHi: 'सार्वजनिक शौचालय',
    titleEn: 'Public Toilets',
    metaHi: '4 यूनिट (2 पुरुष + 2 महिला)',
    metaEn: '4 units (2 male + 2 female)',
    descHi: 'सामुदायिक शौचालय',
    descEn: 'Community toilets',
    detailHi: 'ODF++ प्रमाणित',
    detailEn: 'ODF++ certified',
  },
  {
    id: 'biogas',
    icon: Wind,
    titleHi: 'बायो-गैस संयंत्र',
    titleEn: 'Bio-Gas Plant',
    metaHi: '1 संयंत्र · 5 घन मीटर',
    metaEn: '1 plant · 5 cubic m',
    descHi: 'कच्चे कचन से',
    descEn: 'From organic waste',
    detailHi: '8 घर जुड़े',
    detailEn: '8 households connected',
  },
]

// ── Agricultural equipment bank ──
interface EquipmentItem {
  key: string
  nameHi: string
  nameEn: string
  rent: number
  status: 'available' | 'on-rent'
  noteHi?: string
  noteEn?: string
}

const EQUIPMENT: EquipmentItem[] = [
  {
    key: 'tractor',
    nameHi: 'ट्रैक्टर (मैसी फर्ग्यूसन 385)',
    nameEn: 'Tractor (Massey Ferguson 385)',
    rent: 800,
    status: 'available',
  },
  {
    key: 'rotavator',
    nameHi: 'रोटावेटर',
    nameEn: 'Rotavator',
    rent: 400,
    status: 'available',
  },
  {
    key: 'seed-drill',
    nameHi: 'सीड ड्रिल',
    nameEn: 'Seed Drill',
    rent: 250,
    status: 'on-rent',
    noteHi: '2 दिन में वापसी',
    noteEn: 'Return in 2 days',
  },
  {
    key: 'thresher',
    nameHi: 'थ्रेशर',
    nameEn: 'Thresher',
    rent: 600,
    status: 'available',
  },
  {
    key: 'transplanter',
    nameHi: 'पैडी ट्रांसप्लांटर',
    nameEn: 'Paddy Transplanter',
    rent: 500,
    status: 'available',
  },
  {
    key: 'sprayer',
    nameHi: 'स्प्रेयर (पावर)',
    nameEn: 'Sprayer (Power)',
    rent: 150,
    status: 'on-rent',
  },
]

// ── Recharts custom tooltip for land-use — declared OUTSIDE the component
// to satisfy react-hooks/static-components lint rule
function LandUseTooltip({
  active,
  payload,
  locale,
}: {
  active?: boolean
  payload?: Array<{ value: number; payload: LandUseSlice }>
  locale: 'hi' | 'en'
}) {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    const name = locale === 'hi' ? d.nameHi : d.nameEn
    const unit = locale === 'hi' ? 'हे' : 'ha'
    return (
      <div className="bg-card border border-border rounded-md px-3 py-2 text-xs shadow-md">
        <div className="font-medium flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: d.color }}
          />
          {name}
        </div>
        <div className="text-muted-foreground mt-0.5">
          {d.value} {unit} ({d.pct}%)
        </div>
      </div>
    )
  }
  return null
}

export function VillageResources() {
  const { locale } = useI18n()
  const isHi = locale === 'hi'

  const landUseData = LAND_USE.map(d => ({
    name: isHi ? d.nameHi : d.nameEn,
    ...d,
  }))

  return (
    <section id="village-resources" className="border-b border-border/60 py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <ScrollReveal delay={0.1}>
          <div className="mb-10">
            <Badge variant="outline" className="mb-2 gap-1.5">
              <LandPlot className="h-3 w-3" />
              {isHi ? 'संसाधन' : 'Resources'}
            </Badge>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-2xl md:text-3xl font-bold section-heading border-bottom-glow inline-block"
            >
              {isHi
                ? 'ग्राम संसाधन एवं संपत्ति'
                : 'Village Resources & Assets'}
            </motion.h2>
            <p className="text-sm mt-3 max-w-2xl text-gradient-tricolor font-semibold">
              {isHi
                ? 'सामूहिक संपत्ति, भूमि उपयोग एवं प्राकृतिक संसाधन'
                : 'Common property, land use & natural resources'}
            </p>
          </div>
        </ScrollReveal>

        {/* ── Land Use Breakdown (PieChart + legend) ── */}
        <ScrollReveal delay={0.15}>
          <Card className="border-border/70 mb-8">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <LandPlot className="h-4 w-4 text-primary" />
                  {isHi ? 'भूमि उपयोग वितरण' : 'Land Use Breakdown'}
                </CardTitle>
                <Badge variant="outline" className="text-[10px] gap-1">
                  <Trees className="h-3 w-3" />
                  {isHi ? '460 हे कुल' : '460 ha total'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Donut chart with centered overlay label */}
                <div className="relative">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={landUseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="var(--background)"
                        strokeWidth={2}
                      >
                        {landUseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<LandUseTooltip locale={locale} />} />
                      <Legend
                        verticalAlign="bottom"
                        height={0}
                        wrapperStyle={{ display: 'none' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center label overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-2xl font-bold text-primary leading-none pulse-glow rounded-md px-2 py-0.5">
                      {TOTAL_HA} {isHi ? 'हे' : 'ha'}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {isHi ? 'कुल क्षेत्रफल' : 'Total'}
                    </div>
                  </div>
                </div>

                {/* Legend breakdown */}
                <div className="space-y-2.5">
                  {landUseData.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border/60"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="h-3 w-3 rounded-sm shrink-0"
                          style={{ backgroundColor: d.color }}
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-medium truncate">
                            {isHi ? d.nameHi : d.nameEn}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {isHi ? d.nameEn : d.nameHi}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold">
                          {d.value} {isHi ? 'हे' : 'ha'}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{d.pct}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* ── Water Bodies & Irrigation grid ── */}
        <ScrollReveal delay={0.2}>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {WATER_BODIES.map(w => {
              const Icon = w.icon
              return (
                <Card
                  key={w.id}
                  className="border-border/70 indian-border-top hover-lift-large"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm font-semibold">
                        {isHi ? w.titleHi : w.titleEn}
                      </CardTitle>
                      <div className="h-8 w-8 rounded-md grid place-items-center shrink-0 bg-sky-500/10 text-sky-600 dark:text-sky-400">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-base font-bold">{isHi ? w.countHi : w.countEn}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {isHi ? w.descHi : w.descEn}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>{isHi ? w.detailHi : w.detailEn}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </ScrollReveal>

        {/* ── Common Property Resources ── */}
        <ScrollReveal delay={0.25}>
          <Card className="border-border/70 mb-8">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <Building className="h-4 w-4 text-primary" />
                  {isHi ? 'सामूहिक संपत्ति संसाधन' : 'Common Property Resources'}
                </CardTitle>
                <Badge variant="outline" className="text-[10px] gap-1">
                  <Trees className="h-3 w-3" />
                  {isHi ? '6 संपत्तियाँ' : '6 assets'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {CPR.map(c => {
                  const Icon = c.icon
                  return (
                    <div
                      key={c.id}
                      className="p-4 rounded-lg bg-secondary/40 border border-border/60 hover-lift-large"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="h-9 w-9 rounded-md grid place-items-center bg-primary/10 text-primary shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-semibold text-primary">
                          {isHi ? c.metaHi : c.metaEn}
                        </span>
                      </div>
                      <div className="text-sm font-semibold leading-tight">
                        {isHi ? c.titleHi : c.titleEn}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {isHi ? c.descHi : c.descEn}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-2 flex items-start gap-1">
                        <Info className="h-3 w-3 shrink-0 mt-0.5" />
                        <span>{isHi ? c.detailHi : c.detailEn}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* ── Renewable Energy & Public Assets ── */}
        <ScrollReveal delay={0.3}>
          <div className="mb-8">
            <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <Sun className="h-3.5 w-3.5" />
              {isHi ? 'नवीकरणीय ऊर्जा एवं सार्वजनिक संपत्ति' : 'Renewable Energy & Public Assets'}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {ENERGY_ASSETS.map(a => {
                const Icon = a.icon
                return (
                  <Card
                    key={a.id}
                    className="border-border/70 hover-lift-large"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-md grid place-items-center shrink-0 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="text-sm font-semibold">
                              {isHi ? a.titleHi : a.titleEn}
                            </div>
                            <span className="text-[10px] font-semibold text-primary">
                              {isHi ? a.metaHi : a.metaEn}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {isHi ? a.descHi : a.descEn}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-2 flex items-start gap-1">
                            <Info className="h-3 w-3 shrink-0 mt-0.5" />
                            <span>{isHi ? a.detailHi : a.detailEn}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* ── Agricultural Equipment Bank ── */}
        <ScrollReveal delay={0.35}>
          <Card className="border-border/70 tricolor-frame">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <Tractor className="h-4 w-4 text-primary" />
                  {isHi ? 'कृषि उपकरण बैंक' : 'Agricultural Equipment Bank'}
                </CardTitle>
                <Badge variant="outline" className="text-[10px] gap-1">
                  <Combine className="h-3 w-3" />
                  {isHi ? 'किसानों हेतु किराये' : 'For rent to farmers'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isHi
                  ? 'पंचायत उपकरण किसानों को नाममात्र किराये पर उपलब्ध।'
                  : 'Panchayat equipment available for rent to farmers at nominal rates.'}
              </p>
            </CardHeader>
            <CardContent>
              {/* Table-like list */}
              <div className="overflow-hidden rounded-lg border border-border/60">
                <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-secondary/60 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  <div className="col-span-6 sm:col-span-7">
                    {isHi ? 'उपकरण' : 'Equipment'}
                  </div>
                  <div className="col-span-3 sm:col-span-3 text-right">
                    {isHi ? 'दैनिक किराया' : 'Daily Rent'}
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-right">
                    {isHi ? 'स्थिति' : 'Status'}
                  </div>
                </div>
                {EQUIPMENT.map((e, idx) => {
                  const available = e.status === 'available'
                  return (
                    <div
                      key={e.key}
                      className={`grid grid-cols-12 gap-2 px-4 py-3 items-center text-sm ${
                        idx % 2 === 0 ? 'bg-background' : 'bg-secondary/20'
                      }`}
                    >
                      <div className="col-span-6 sm:col-span-7">
                        <div className="font-medium flex items-center gap-2">
                          <Sprout className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>{isHi ? e.nameHi : e.nameEn}</span>
                        </div>
                        {!available && e.noteHi && (
                          <div className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5 ml-5">
                            {isHi ? e.noteHi : e.noteEn}
                          </div>
                        )}
                      </div>
                      <div className="col-span-3 sm:col-span-3 text-right font-semibold text-primary">
                        ₹{e.rent}
                        <span className="text-[10px] text-muted-foreground font-normal">
                          {isHi ? '/दिन' : '/day'}
                        </span>
                      </div>
                      <div className="col-span-3 sm:col-span-2 text-right">
                        {available ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] gap-1 border-green-600/40 text-green-700 dark:text-green-400"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            {isHi ? 'उपलब्ध' : 'Available'}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] gap-1 border-amber-600/40 text-amber-700 dark:text-amber-400"
                          >
                            <Clock className="h-3 w-3" />
                            {isHi ? 'किराये पर' : 'On rent'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Booking info */}
              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {isHi ? 'बुकिंग संपर्क' : 'Booking Contact'}
                  </div>
                  <div className="text-xs font-semibold mt-1">
                    {isHi ? 'पंचायत कार्यालय' : 'Panchayat office'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {isHi ? 'समय' : 'Timings'}
                  </div>
                  <div className="text-xs font-semibold mt-1">
                    {isHi ? 'सुबह 10 – शाम 5' : '10 AM – 5 PM'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {isHi ? 'स्रोत' : 'Source'}
                  </div>
                  <div className="text-xs font-semibold mt-1">
                    {isHi ? 'PM-कृषि यंत्र धारा + पंचायत' : 'PM-Krishi Yantra Dhara + Panchayat'}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-[10px] text-muted-foreground flex items-center gap-1.5">
                <ExternalLink className="h-3 w-3" />
                {isHi
                  ? 'pmkisanmyl.in · उपकरण सब्सिडी हेतु'
                  : 'pmkisanmyl.in · for equipment subsidy'}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  )
}
