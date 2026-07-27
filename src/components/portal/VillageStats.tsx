'use client'
import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, Tooltip, Legend, Label } from 'recharts'
import { Droplets, School, Route, Home, Sun, Building2, BarChart3 } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

interface StatsData {
  complaints: { total: number; pending: number; inProgress: number; resolved: number; rejected: number }
  images: number
  scrapedRecords: number
}

interface ImageAsset {
  imageId: string
  category: string
  isPublic: boolean
}

// Warm Indian palette colors for chart slices
const COMPLAINT_COLORS = {
  pending: '#d97706',    // amber
  inProgress: '#0891b2', // cyan
  resolved: '#16a34a',   // green (matches accent)
  rejected: '#dc2626',   // red
}

const SAFFRON_BAR = '#c2410c' // deep saffron for bar chart

const INFRA_ICONS: Record<string, { icon: typeof Droplets; labelHi: string; labelEn: string }> = {
  'infrastructure.water': { icon: Droplets, labelHi: 'जल स्रोत', labelEn: 'Water' },
  'infrastructure.school': { icon: School, labelHi: 'विद्यालय', labelEn: 'School' },
  'infrastructure.road': { icon: Route, labelHi: 'सड़क', labelEn: 'Roads' },
  'scheme.pmay-g': { icon: Home, labelHi: 'आवास', labelEn: 'Housing' },
  'infrastructure.power': { icon: Sun, labelHi: 'विद्युत', labelEn: 'Power' },
  'infrastructure.civic': { icon: Building2, labelHi: 'सामाजिक', labelEn: 'Civic' },
}

function BarTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { name: string; label: string } }> }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-md px-3 py-2 text-xs shadow-md">
        <div className="font-medium">{payload[0].payload.name}</div>
        <div className="text-muted-foreground">{payload[0].payload.label}</div>
      </div>
    )
  }
  return null
}

export function VillageStats() {
  const { locale } = useI18n()
  const [stats, setStats] = useState<StatsData | null>(null)
  const [images, setImages] = useState<ImageAsset[]>([])
  const [schemeData, setSchemeData] = useState<{ mgnrega?: { coverage_pct: number }; pmay_g?: { coverage_pct: number }; jjm?: { coverage_pct: number } } | null>(null)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {})
    fetch('/api/images').then(r => r.json()).then(d => setImages(d.images || [])).catch(() => {})
    fetch('/api/content/schemes_coverage').then(r => r.ok ? r.json() : null).then(d => d?.data && setSchemeData(d.data)).catch(() => {})
  }, [])

  const isHi = locale === 'hi'

  // Complaint status data for pie chart
  const complaintData = stats
    ? [
        { name: isHi ? 'लंबित' : 'Pending', value: stats.complaints.pending, color: COMPLAINT_COLORS.pending },
        { name: isHi ? 'प्रगति में' : 'In Progress', value: stats.complaints.inProgress, color: COMPLAINT_COLORS.inProgress },
        { name: isHi ? 'समाधान' : 'Resolved', value: stats.complaints.resolved, color: COMPLAINT_COLORS.resolved },
        { name: isHi ? 'अस्वीकृत' : 'Rejected', value: stats.complaints.rejected, color: COMPLAINT_COLORS.rejected },
      ].filter(d => d.value > 0)
    : []

  const totalComplaints = stats?.complaints.total || 0

  // Scheme coverage data for bar chart — fetched from content API (admin-editable)
  const mCov = schemeData?.mgnrega?.coverage_pct ?? 76
  const pCov = schemeData?.pmay_g?.coverage_pct ?? 63
  const jCov = schemeData?.jjm?.coverage_pct ?? 93
  const schemeCoverageData = [
    { name: isHi ? 'मनरेगा' : 'MGNREGA', coverage: mCov, label: isHi ? `${mCov}% सक्रिय` : `${mCov}% Active` },
    { name: isHi ? 'पीएमआवास' : 'PMAY-G', coverage: pCov, label: isHi ? `${pCov}% पूर्ण` : `${pCov}% Done` },
    { name: isHi ? 'जल जीवन' : 'JJM', coverage: jCov, label: isHi ? `${jCov}% कवर्ड` : `${jCov}% Covered` },
  ]

  // Infrastructure category counts from images
  const infraCounts: Record<string, number> = {}
  for (const img of images) {
    // Match prefix (e.g., "infrastructure.water.handpump" matches "infrastructure.water")
    const prefixes = Object.keys(INFRA_ICONS)
    for (const prefix of prefixes) {
      if (img.category.startsWith(prefix)) {
        infraCounts[prefix] = (infraCounts[prefix] || 0) + 1
        break
      }
    }
  }

  // Custom label for pie center
  const renderPieCenterLabel = () => {
    return (
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="fill-foreground">
        <tspan fontSize="18" fontWeight="bold">{totalComplaints}</tspan>
        <tspan fontSize="10" x="50%" dy="16">{isHi ? 'शिकायत' : 'Total'}</tspan>
      </text>
    )
  }

  return (
    <section id="village-stats" className="section-rail py-12 md:py-16 border-b border-border/60">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Badge variant="outline" className="mb-2 gap-1.5">
            <BarChart3 className="h-3 w-3" />
            {isHi ? 'सांख्यिकी' : 'Statistics'}
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold section-heading">
            {isHi ? 'विवरण एवं सांख्यिकी' : 'Village Statistics'}
          </h2>
          <p className="text-sm text-gradient-tricolor mt-3 max-w-2xl">
            {isHi
              ? 'ग्राम चंद्रा की शिकायत स्थिति, योजना कवरेज और आधारभूत संरचना सारांश'
              : 'Complaint status, scheme coverage, and infrastructure summary for Chandra village'}
          </p>
        </div>

        <ScrollReveal delay={0.2}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 tricolor-frame rounded-lg p-1">

            {/* Complaint Status Pie Chart */}
            <Card className="border-border/70 hover-lift-large stat-card-shimmer saffron-edge">
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold mb-4">
                  {isHi ? 'शिकायत स्थिति वितरण' : 'Complaint Status Distribution'}
                </h3>
                {complaintData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={complaintData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                        labelLine={true}
                      >
                        {complaintData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <Label content={renderPieCenterLabel} position="center" />
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string) => [value, name]}
                        contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                    {isHi ? 'डेटा लोड हो रहा है...' : 'Loading data...'}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                  {complaintData.map(d => (
                    <Badge key={d.name} variant="outline" className="text-[10px] gap-1" style={{ borderColor: d.color, color: d.color }}>
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                      {d.name}: {d.value}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scheme Coverage Bar Chart */}
            <Card className="border-border/70 hover-lift-large stat-card-shimmer saffron-edge">
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold mb-4">
                  {isHi ? 'योजना कवरेज' : 'Scheme Coverage'}
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={schemeCoverageData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                  >
                    <Tooltip content={<BarTooltip />} />
                    <Bar
                      dataKey="coverage"
                      fill={SAFFRON_BAR}
                      radius={[0, 4, 4, 0]}
                      barSize={24}
                      label={({ x, width, value, y }) => {
                        const safeX = Number.isFinite(x) ? x : 0
                        const safeWidth = Number.isFinite(width) ? width : 0
                        const safeY = Number.isFinite(y) ? y : 0
                        const safeValue = Number.isFinite(value) ? value : 0
                        if (!Number.isFinite(x) || !Number.isFinite(width) || !Number.isFinite(y)) return null
                        return (
                          <text
                            x={safeX + safeWidth + 8}
                            y={safeY + 12}
                            fontSize="11"
                            fontWeight="600"
                            fill="var(--foreground)"
                          >
                            {safeValue}%
                          </text>
                        )
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                  {schemeCoverageData.map(d => (
                    <Badge key={d.name} variant="outline" className="text-[10px]" style={{ borderColor: SAFFRON_BAR, color: SAFFRON_BAR }}>
                      {d.name}: {d.coverage}%
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Infrastructure Summary */}
            <Card className="border-border/70 hover-lift-large stat-card-shimmer saffron-edge">
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold mb-4">
                  {isHi ? 'आधारभूत संरचना सारांश' : 'Infrastructure Summary'}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(INFRA_ICONS).map(([prefix, info]) => {
                    const Icon = info.icon
                    const count = infraCounts[prefix] || 0
                    return (
                      <div key={prefix} className="flex items-center gap-2 p-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
                        <div className="h-7 w-7 rounded-md grid place-items-center shrink-0 bg-primary/10 text-primary">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-medium">{isHi ? info.labelHi : info.labelEn}</div>
                          <div className="text-[10px] text-muted-foreground">{count} {isHi ? 'चित्र' : 'images'}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  {isHi
                    ? `कुल ${images.length} आधारभूत संरचना चित्र उपलब्ध`
                    : `Total ${images.length} infrastructure images available`}
                </div>
              </CardContent>
            </Card>

          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
