'use client'
import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Building2, User, MapPin, GraduationCap, Phone, Mail, Calendar, Users, Home, Flag } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

interface ProfileData {
  pradhan?: {
    name_hi: string; name_en: string; photo_url: string
    education_hi: string; education_en: string
    mobile_last4: string; email: string
    tenure_start: string; bio_hi: string; bio_en: string
  }
  secretary?: {
    name_hi: string; name_en: string; photo_url: string
    designation_hi: string; designation_en: string
    mobile_last4: string; email: string
  }
  site_config?: {
    office_address_hi: string; office_address_en: string
    total_wards: number; villages_under_gp: number
    population_ref: string; panchayat_name: string; block_name: string; district_name: string
  }
}

export function About() {
  const { locale } = useI18n()
  const [data, setData] = useState<ProfileData>({})

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  const pradhan = data.pradhan
  const secretary = data.secretary
  const cfg = data.site_config

  return (
    <section id="about" className="py-12 md:py-16 border-b border-border/60 relative section-backdrop-dots">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute inset-0 hero-pattern opacity-30 pointer-events-none" />

      <ScrollReveal delay={0.1}>
      <div className="container mx-auto px-4 relative section-rail">
        <div className="mb-8">
          <Badge variant="outline" className="mb-2 gap-1.5 shadow-sm">
            <Building2 className="h-3 w-3" />
            {locale === 'hi' ? 'पंचायत परिचय' : 'About the Panchayat'}
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold section-heading">
            {locale === 'hi' ? 'पंचायत के पदाधिकारी' : 'Panchayat Office Bearers'}
          </h2>
        </div>

        {/* Hero banner — real panchayat photograph (flag hoisting at panchayat building) */}
        <div className="mb-6 relative rounded-xl overflow-hidden border border-border/60 shadow-md card-hover-lift indian-border-top">
          <div className="relative aspect-[21/9] sm:aspect-[3/1]">
            <img
              src="/whatsapp/IMG-20260725-WA0072.jpg"
              alt={locale === 'hi'
                ? 'पंचायत भवन पर ध्वजारोहण — ग्राम चंद्रा की वास्तविक तस्वीर'
                : 'Flag hoisting at panchayat building — real photo of Gram Chandra'}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Saffron gradient overlay — keeps text legible while preserving the photo */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/55 to-primary/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-5 sm:p-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-background/85 backdrop-blur px-2.5 py-1 text-[10px] font-semibold text-primary shadow-sm mb-2">
                  <Flag className="h-3 w-3" />
                  {locale === 'hi' ? 'ग्राम पंचायत चंद्रा' : 'Gram Panchayat Chandra'}
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-background drop-shadow-sm leading-tight">
                  {locale === 'hi'
                    ? 'जनभागीदारी से ग्राम विकास'
                    : 'Village development through public participation'}
                </h3>
                <p className="text-xs sm:text-sm text-background/90 mt-2 leading-relaxed">
                  {locale === 'hi'
                    ? 'शंकरगढ़ विकास खंड, जनपद प्रयागराज, उत्तर प्रदेश — पंचायत कोड 3145021064'
                    : 'Shankargarh Block, Prayagraj District, Uttar Pradesh — Panchayat Code 3145021064'}
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 py-1.5 bg-secondary/40 border-t border-border/40 flex items-center justify-between gap-2">
            <span className="text-[10px] text-green-700 dark:text-green-400 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              {locale === 'hi' ? 'वास्तविक तस्वीर / Real photo' : 'वास्तविक तस्वीर / Real photo'}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              {locale === 'hi' ? 'पंचायत भवन, स्वतंत्रता दिवस' : 'Panchayat Bhawan, Independence Day'}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pradhan card — enhanced with shadow and hover */}
          <Card className="lg:col-span-2 border-primary/30 card-hover-lift indian-border-top shadow-sm hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground gap-1 shadow-sm">
                  <User className="h-3 w-3" />
                  {locale === 'hi' ? 'ग्राम प्रधान' : 'Gram Pradhan'}
                </Badge>
                <span className="badge-gov">
                  {locale === 'hi' ? 'निर्वाचित' : 'Elected'}
                </span>
              </div>
              <CardTitle className="text-xl mt-2">
                {pradhan ? (locale === 'hi' ? pradhan.name_hi : pradhan.name_en) : '—'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Avatar className="h-24 w-24 rounded-lg border-2 border-primary/30 shrink-0 shadow-sm">
                  <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 text-primary text-2xl avatar-initials">
                    {pradhan ? (locale === 'hi' ? 'सं' : 'SM') : '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 text-sm">
                  <InfoRow
                    icon={GraduationCap}
                    label={locale === 'hi' ? 'शिक्षा' : 'Education'}
                    value={pradhan ? (locale === 'hi' ? pradhan.education_hi : pradhan.education_en) : '—'}
                  />
                  <InfoRow
                    icon={Phone}
                    label={locale === 'hi' ? 'संपर्क' : 'Phone'}
                    value={pradhan ? `+91 •••• ${pradhan.mobile_last4}` : '—'}
                    muted
                  />
                  <InfoRow
                    icon={Mail}
                    label={locale === 'hi' ? 'ईमेल' : 'Email'}
                    value={pradhan?.email || '—'}
                  />
                  <InfoRow
                    icon={Calendar}
                    label={locale === 'hi' ? 'कार्यकाल' : 'Tenure Start'}
                    value={pradhan?.tenure_start || '—'}
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-border/60">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                  {locale === 'hi' ? 'परिचय' : 'Bio'}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {pradhan ? (locale === 'hi' ? pradhan.bio_hi : pradhan.bio_en) : '—'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Secretary card — enhanced with hover */}
          <Card className="border-accent/40 card-hover-lift shadow-sm hover:shadow-md">
            <CardHeader className="pb-3">
              <Badge className="bg-accent text-accent-foreground gap-1 w-fit shadow-sm">
                <User className="h-3 w-3" />
                {locale === 'hi' ? 'ग्राम पंचायत अधिकारी' : 'Secretary (GPA)'}
              </Badge>
              <CardTitle className="text-lg mt-2">
                {secretary ? (locale === 'hi' ? secretary.name_hi : secretary.name_en) : '—'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-14 w-14 border-2 border-accent/30 shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-accent/15 to-accent/5 text-accent-foreground avatar-initials">
                    {secretary ? (locale === 'hi' ? 'स' : 'S') : '?'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <InfoRow
                icon={Building2}
                label={locale === 'hi' ? 'पद' : 'Designation'}
                value={secretary ? (locale === 'hi' ? secretary.designation_hi : secretary.designation_en) : '—'}
              />
              <InfoRow
                icon={Phone}
                label={locale === 'hi' ? 'संपर्क' : 'Phone'}
                value={secretary ? `+91 •••• ${secretary.mobile_last4 || '----'}` : '—'}
                muted
              />
              <InfoRow
                icon={Mail}
                label={locale === 'hi' ? 'ईमेल' : 'Email'}
                value={secretary?.email || '—'}
              />
            </CardContent>
          </Card>
        </div>

        {/* Panchayat identity strip — more visually interesting */}
        <Card className="mt-6 bg-gradient-to-r from-secondary/40 via-secondary/20 to-accent/5 border-border/60 shadow-sm hover-lift-large indian-border-top conic-ring">
          <CardContent className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat icon={Home} label={locale === 'hi' ? 'कुल वार्ड' : 'Total Wards'} value={cfg?.total_wards?.toString() || '—'} />
              <Stat icon={Users} label={locale === 'hi' ? 'अधीन गाँव' : 'Villages Under GP'} value={cfg?.villages_under_gp?.toString() || '—'} />
              <Stat icon={MapPin} label={locale === 'hi' ? 'ब्लॉक' : 'Block'} value={cfg?.block_name || '—'} />
              <Stat icon={Building2} label={locale === 'hi' ? 'जनपद' : 'District'} value={cfg?.district_name || '—'} />
            </div>
            <div className="mt-4 pt-4 border-t border-border/60">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                {locale === 'hi' ? 'पंचायत कार्यालय पता' : 'Panchayat Office Address'}
              </div>
              <p className="text-sm text-foreground/80">
                {cfg ? (locale === 'hi' ? cfg.office_address_hi : cfg.office_address_en) : '—'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Decorative section divider */}
        <div className="section-divider">
          <div className="section-divider-dot" />
          <div className="section-divider-dot" />
          <div className="section-divider-dot" />
        </div>
      </div>
      </ScrollReveal>
    </section>
  )
}

function InfoRow({ icon: Icon, label, value, muted }: { icon: React.ElementType; label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className={`text-sm font-medium truncate ${muted ? 'font-mono text-muted-foreground' : ''}`}>{value}</div>
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="stat-card hover-lift-large">
      <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0 shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-number">{value}</div>
      </div>
    </div>
  )
}
