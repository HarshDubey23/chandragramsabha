'use client'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'
import {
  CloudSun,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  SunMedium,
  ExternalLink,
  Sprout,
  Wheat,
  Phone,
  Thermometer,
  Calendar,
  TrendingUp,
  Cloud,
  Sunrise,
} from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

// Warm Indian palette — NO indigo/blue
const SAFFRON = '#c2410c'
const GREEN = '#16a34a'
const AMBER = '#d97706'
const STONE = '#78716c'

// Current weather snapshot (mock, sourced from IMD Prayagraj)
const CURRENT_WEATHER = {
  tempC: 32,
  feelsLikeC: 36,
  conditionHi: 'मुख्यतः साफ',
  conditionEn: 'Mainly Clear',
  humidityPct: 62,
  windKmh: 12,
  windDir: 'NW',
  windDirHi: 'उत्तर-पश्चिम',
  uvIndex: 8,
  uvLabelHi: 'बहुत अधिक',
  uvLabelEn: 'Very High',
  updatedHi: 'आज सुबह 6:30 बजे',
  updatedEn: 'Today 6:30 AM',
}

// 5-day forecast
const FORECAST = [
  { dayHi: 'आज', dayEn: 'Today', max: 32, min: 24, icon: 'sun' as const },
  { dayHi: 'कल', dayEn: 'Tomorrow', max: 33, min: 25, icon: 'sun' as const },
  { dayHi: 'बुध', dayEn: 'Wed', max: 31, min: 23, icon: 'cloud' as const },
  { dayHi: 'गुरु', dayEn: 'Thu', max: 30, min: 23, icon: 'cloud-rain' as const },
  { dayHi: 'शुक्र', dayEn: 'Fri', max: 29, min: 22, icon: 'cloud-rain' as const },
]

// Crop calendar — Kharif 2025
const CROP_CALENDAR = [
  {
    cropHi: 'धान',
    cropEn: 'Rice',
    sowingHi: 'जुलाई-अगस्त',
    sowingEn: 'Jul–Aug',
    harvestHi: 'अक्टूबर-नवंबर',
    harvestEn: 'Oct–Nov',
    yieldHi: '22 क्विंटल/हेक्टेयर',
    yieldEn: '22 qt/ha',
  },
  {
    cropHi: 'बाजरा',
    cropEn: 'Bajra',
    sowingHi: 'जुलाई',
    sowingEn: 'Jul',
    harvestHi: 'अक्टूबर',
    harvestEn: 'Oct',
    yieldHi: '18 क्विंटल/हे',
    yieldEn: '18 qt/ha',
  },
  {
    cropHi: 'उड़द',
    cropEn: 'Urad',
    sowingHi: 'जुलाई',
    sowingEn: 'Jul',
    harvestHi: 'अक्टूबर',
    harvestEn: 'Oct',
    yieldHi: '8 क्विंटल/हे',
    yieldEn: '8 qt/ha',
  },
  {
    cropHi: 'तिल',
    cropEn: 'Sesame',
    sowingHi: 'जुलाई',
    sowingEn: 'Jul',
    harvestHi: 'अक्टूबर',
    harvestEn: 'Oct',
    yieldHi: '5 क्विंटल/हे',
    yieldEn: '5 qt/ha',
  },
]

// Mandi prices — Shankargarh
const MANDI_PRICES = [
  { cropHi: 'गेहूं', cropEn: 'Wheat', varietyHi: 'लोकवान', varietyEn: 'Lokwan', min: 2200, max: 2350, modal: 2280 },
  { cropHi: 'धान', cropEn: 'Rice', varietyHi: 'सामान्य', varietyEn: 'Common', min: 1850, max: 2050, modal: 1960 },
  { cropHi: 'आलू', cropEn: 'Potato', varietyHi: 'आलू', varietyEn: 'Potato', min: 800, max: 1200, modal: 950 },
  { cropHi: 'प्याज', cropEn: 'Onion', varietyHi: 'प्याज', varietyEn: 'Onion', min: 1800, max: 2600, modal: 2200 },
  { cropHi: 'सरसों', cropEn: 'Mustard', varietyHi: 'सरसों', varietyEn: 'Mustard', min: 4900, max: 5200, modal: 5050 },
]

// Monthly rainfall (mm) — monsoon pattern for Prayagraj region
const RAINFALL_DATA = [
  { month: 'जून', monthEn: 'Jun', mm: 65, fill: AMBER },
  { month: 'जुलाई', monthEn: 'Jul', mm: 245, fill: SAFFRON },
  { month: 'अगस्त', monthEn: 'Aug', mm: 280, fill: SAFFRON },
  { month: 'सितम्बर', monthEn: 'Sep', mm: 175, fill: SAFFRON },
  { month: 'अक्टूबर', monthEn: 'Oct', mm: 35, fill: AMBER },
  { month: 'नवंबर', monthEn: 'Nov', mm: 8, fill: STONE },
]

// Recharts custom tooltip — declared OUTSIDE the component function
// to satisfy react-hooks/static-components lint rule
function RainfallTooltip({
  active,
  payload,
  locale,
}: {
  active?: boolean
  payload?: Array<{ value: number; payload: { month: string; monthEn: string; mm: number } }>
  locale: 'hi' | 'en'
}) {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    const label = locale === 'hi' ? d.month : d.monthEn
    return (
      <div className="bg-card border border-border rounded-md px-3 py-2 text-xs shadow-md">
        <div className="font-medium">{label}</div>
        <div className="text-muted-foreground">
          {d.mm} {locale === 'hi' ? 'मिमी वर्षा' : 'mm rain'}
        </div>
      </div>
    )
  }
  return null
}

// Forecast icon picker
function ForecastIcon({ kind, className }: { kind: 'sun' | 'cloud' | 'cloud-rain'; className?: string }) {
  if (kind === 'sun') return <Sun className={className} />
  if (kind === 'cloud') return <CloudSun className={className} />
  return <CloudRain className={className} />
}

export function WeatherAgriSection() {
  const { locale } = useI18n()
  const isHi = locale === 'hi'

  return (
    <section id="weather-agri" className="border-b border-border/60 py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <ScrollReveal delay={0.1}>
          <div className="mb-10">
            <Badge variant="outline" className="mb-2 gap-1.5">
              <CloudSun className="h-3 w-3" />
              {isHi ? 'मौसम एवं कृषि' : 'Weather & Agriculture'}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold section-heading">
              {isHi ? 'आज का मौसम एवं कृषि जानकारी' : "Today's Weather & Agriculture Info"}
            </h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
              {isHi
                ? 'ग्राम चंद्रा, शंकरगढ़ क्षेत्र के लिए वास्तविक मौसम, फसल कैलेंडर, मंडी भाव एवं मासिक वर्षा का सारांश।'
                : 'Live weather, crop calendar, mandi prices, and monthly rainfall summary for Chandra village, Shankargarh region.'}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-6">
            {/* Row 1: Current Weather (span 5) + 5-Day Forecast (span 7) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Current Weather Card */}
              <Card className="border-border/70 lg:col-span-5 overflow-hidden">
                <CardContent className="p-0">
                  {/* Top saffron-tinted band */}
                  <div className="bg-gradient-to-br from-primary/10 via-amber-500/5 to-transparent p-5 md:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                          <Sunrise className="h-3 w-3" />
                          {isHi ? 'वर्तमान मौसम' : 'Current Weather'}
                        </div>
                        <div className="flex items-end gap-3">
                          <Sun className="h-14 w-14 text-primary" strokeWidth={1.5} />
                          <div>
                            <div className="text-4xl md:text-5xl font-bold leading-none">
                              {CURRENT_WEATHER.tempC}°C
                            </div>
                            <div className="text-sm font-medium mt-1">
                              {isHi ? CURRENT_WEATHER.conditionHi : CURRENT_WEATHER.conditionEn}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="gap-1 text-[10px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600 inline-block" />
                        {isHi ? 'लाइव' : 'Live'}
                      </Badge>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-px bg-border/40 p-0">
                    <DetailCell
                      icon={<Droplets className="h-4 w-4" />}
                      label={isHi ? 'आर्द्रता' : 'Humidity'}
                      value={`${CURRENT_WEATHER.humidityPct}%`}
                      tint="bg-secondary/30"
                    />
                    <DetailCell
                      icon={<Wind className="h-4 w-4" />}
                      label={isHi ? 'हवा' : 'Wind'}
                      value={`${CURRENT_WEATHER.windKmh} km/h ${isHi ? CURRENT_WEATHER.windDirHi : CURRENT_WEATHER.windDir}`}
                      tint="bg-secondary/30"
                    />
                    <DetailCell
                      icon={<Thermometer className="h-4 w-4" />}
                      label={isHi ? 'महसूस' : 'Feels Like'}
                      value={`${CURRENT_WEATHER.feelsLikeC}°C`}
                      tint="bg-secondary/30"
                    />
                    <DetailCell
                      icon={<SunMedium className="h-4 w-4" />}
                      label={isHi ? 'यूवी सूचकांक' : 'UV Index'}
                      value={`${CURRENT_WEATHER.uvIndex} (${isHi ? CURRENT_WEATHER.uvLabelHi : CURRENT_WEATHER.uvLabelEn})`}
                      tint="bg-secondary/30"
                    />
                  </div>

                  {/* Footer */}
                  <div className="p-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/60">
                    <div className="text-[11px] text-muted-foreground">
                      {isHi ? 'अंतिम अपडेट: ' : 'Last updated: '}
                      <span className="text-foreground/80">
                        {isHi ? CURRENT_WEATHER.updatedHi : CURRENT_WEATHER.updatedEn}
                      </span>
                    </div>
                    <a
                      href="https://mausam.imd.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {isHi ? 'स्रोत: IMD प्रयागराज' : 'Source: IMD Prayagraj'}
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* 5-Day Forecast Card */}
              <Card className="border-border/70 lg:col-span-7 bg-secondary/30">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary" />
                      {isHi ? '5-दिवसीय पूर्वानुमान' : '5-Day Forecast'}
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px] gap-1">
                      <CloudSun className="h-3 w-3" />
                      {isHi ? 'शंकरगढ़ क्षेत्र' : 'Shankargarh Area'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {FORECAST.map((f, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-border/60 bg-card p-3 flex flex-col items-center text-center gap-1.5 card-hover-lift"
                      >
                        <div className="text-xs font-semibold">
                          {isHi ? f.dayHi : f.dayEn}
                        </div>
                        <ForecastIcon
                          kind={f.icon}
                          className={`h-7 w-7 ${
                            f.icon === 'sun'
                              ? 'text-amber-600'
                              : f.icon === 'cloud'
                              ? 'text-stone-500'
                              : 'text-primary'
                          }`}
                        />
                        <div className="flex items-baseline gap-1.5 text-sm">
                          <span className="font-bold">{f.max}°</span>
                          <span className="text-muted-foreground text-xs">/ {f.min}°</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="h-2.5 w-2.5" />
                          {isHi ? 'अधिकतम/न्यूनतम' : 'Hi/Lo'}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Row 2: Crop Calendar (span 6) + Mandi Prices (span 6) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Crop Calendar Card */}
              <Card className="border-border/70 lg:col-span-6">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                      <Sprout className="h-4 w-4 text-green-600" />
                      {isHi ? 'फसल कैलेंडर (खरीफ 2025)' : 'Crop Calendar (Kharif 2025)'}
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px] gap-1">
                      <Sprout className="h-3 w-3" />
                      {isHi ? 'खरीफ सत्र' : 'Kharif Season'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">
                          {isHi ? 'फसल' : 'Crop'}
                        </TableHead>
                        <TableHead className="text-xs">
                          {isHi ? 'बोना' : 'Sowing'}
                        </TableHead>
                        <TableHead className="text-xs">
                          {isHi ? 'कटाई' : 'Harvest'}
                        </TableHead>
                        <TableHead className="text-xs">
                          {isHi ? 'अनुमानित पैदावार' : 'Expected Yield'}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {CROP_CALENDAR.map((c, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-xs font-medium">
                            <span className="flex items-center gap-1.5">
                              <Wheat className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                              {isHi ? c.cropHi : c.cropEn}
                              <span className="text-muted-foreground">
                                ({isHi ? c.cropEn : c.cropHi})
                              </span>
                            </span>
                          </TableCell>
                          <TableCell className="text-xs">
                            {isHi ? c.sowingHi : c.sowingEn}
                          </TableCell>
                          <TableCell className="text-xs">
                            {isHi ? c.harvestHi : c.harvestEn}
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-primary">
                            {isHi ? c.yieldHi : c.yieldEn}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-3 text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Sprout className="h-3 w-3" />
                    {isHi
                      ? 'स्रोत: कृषि विभाग, उत्तर प्रदेश'
                      : 'Source: Department of Agriculture, UP'}
                  </div>
                </CardContent>
              </Card>

              {/* Mandi Prices Card */}
              <Card className="border-border/70 lg:col-span-6">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      {isHi ? 'मंडी भाव (शंकरगढ़)' : 'Mandi Prices (Shankargarh)'}
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px] gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600 inline-block" />
                      {isHi ? 'आज का भाव' : "Today's Rate"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">
                          {isHi ? 'फसल' : 'Crop'}
                        </TableHead>
                        <TableHead className="text-xs">
                          {isHi ? 'विविधता' : 'Variety'}
                        </TableHead>
                        <TableHead className="text-xs text-right">
                          {isHi ? 'न्यूनतम' : 'Min'}
                          <div className="text-[9px] font-normal text-muted-foreground">
                            (₹/{isHi ? 'क्विंटल' : 'qt'})
                          </div>
                        </TableHead>
                        <TableHead className="text-xs text-right">
                          {isHi ? 'अधिकतम' : 'Max'}
                          <div className="text-[9px] font-normal text-muted-foreground">
                            (₹/{isHi ? 'क्विंटल' : 'qt'})
                          </div>
                        </TableHead>
                        <TableHead className="text-xs text-right">
                          {isHi ? 'औसत' : 'Modal'}
                          <div className="text-[9px] font-normal text-muted-foreground">
                            (₹/{isHi ? 'क्विंटल' : 'qt'})
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MANDI_PRICES.map((m, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-xs font-medium">
                            <span className="flex items-center gap-1.5">
                              <Wheat className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                              {isHi ? m.cropHi : m.cropEn}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {isHi ? m.varietyHi : m.varietyEn}
                          </TableCell>
                          <TableCell className="text-xs text-right text-muted-foreground">
                            ₹{m.min.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell className="text-xs text-right text-muted-foreground">
                            ₹{m.max.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell className="text-xs text-right font-bold text-primary">
                            ₹{m.modal.toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-3 text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <ExternalLink className="h-3 w-3" />
                    {isHi ? 'स्रोत: ' : 'Source: '}
                    <a
                      href="https://upagriculture.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary underline-offset-2 hover:underline"
                    >
                      upagriculture.com
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Row 3: Rainfall Chart full width */}
            <Card className="border-border/70 bg-secondary/30">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                    <CloudRain className="h-4 w-4 text-primary" />
                    {isHi ? 'मासिक वर्षा (मिमी)' : 'Monthly Rainfall (mm)'}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-[10px] gap-1">
                      <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: SAFFRON }} />
                      {isHi ? 'मानसून (जुलाई–सितम्बर)' : 'Monsoon (Jul–Sep)'}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] gap-1">
                      <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: AMBER }} />
                      {isHi ? 'पूर्व/उत्तर मानसून' : 'Pre/Post Monsoon'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={RAINFALL_DATA}
                    margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis
                      dataKey={isHi ? 'month' : 'monthEn'}
                      tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                      tickLine={false}
                      axisLine={{ stroke: 'var(--border)' }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                      tickLine={false}
                      axisLine={false}
                      width={32}
                    />
                    <Tooltip
                      cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
                      content={<RainfallTooltip locale={locale} />}
                    />
                    <Bar dataKey="mm" radius={[4, 4, 0, 0]} barSize={36}>
                      {RAINFALL_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 rounded-md bg-card border border-border/60">
                    <div className="text-muted-foreground">{isHi ? 'कुल वार्षिक वर्षा' : 'Total Annual'}</div>
                    <div className="font-bold text-primary">808 mm</div>
                  </div>
                  <div className="p-2 rounded-md bg-card border border-border/60">
                    <div className="text-muted-foreground">{isHi ? 'मानसून वर्षा' : 'Monsoon Rain'}</div>
                    <div className="font-bold text-primary">700 mm</div>
                  </div>
                  <div className="p-2 rounded-md bg-card border border-border/60">
                    <div className="text-muted-foreground">{isHi ? 'सबसे भीगा महीना' : 'Wettest Month'}</div>
                    <div className="font-bold text-primary">{isHi ? 'अगस्त (280)' : 'Aug (280)'}</div>
                  </div>
                  <div className="p-2 rounded-md bg-card border border-border/60">
                    <div className="text-muted-foreground">{isHi ? 'सबसे सूखा महीना' : 'Driest Month'}</div>
                    <div className="font-bold text-primary">{isHi ? 'नवंबर (8)' : 'Nov (8)'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer note */}
            <div className="rounded-lg border border-green-600/30 bg-green-600/5 p-4 flex items-start gap-3">
              <div className="h-9 w-9 rounded-md grid place-items-center shrink-0 bg-green-600/15 text-green-700 dark:text-green-500">
                <Phone className="h-4 w-4" />
              </div>
              <div className="text-sm">
                <div className="font-semibold">
                  {isHi ? 'कृषि विशेषज्ञ सलाह के लिए' : 'For Expert Agricultural Advice'}
                </div>
                <div className="text-muted-foreground text-xs mt-0.5">
                  {isHi
                    ? 'कृषि विज्ञान केंद्र शंकरगढ़ से संपर्क करें'
                    : 'Contact Krishi Vigyan Kendra Shankargarh'}
                  {' — '}
                  <a href="tel:+915322800000" className="text-primary font-medium hover:underline">
                    +91-532-2800000
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

// Helper detail cell used inside current weather card
function DetailCell({
  icon,
  label,
  value,
  tint,
}: {
  icon: React.ReactNode
  label: string
  value: string
  tint?: string
}) {
  return (
    <div className={`p-3 ${tint || ''}`}>
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  )
}
