'use client'
import { useI18n } from '@/lib/i18n'
import { useUI } from '@/lib/ui-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ShieldCheck, Phone, MapPin, FileSearch, Mic, ArrowRight, Database, Lock, Sun, Users, Landmark, Home, GraduationCap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Real WhatsApp photographs of Gram Panchayat Chandra — used as the hero
// background rotator. NO AI-generated images. Each is an authentic panchayat
// photograph (flag hoisting at the panchayat bhawan, primary school building,
// village gathering, water tanker, well construction).
const HERO_IMAGES = [
  { src: '/whatsapp/IMG-20260725-WA0072.jpg', credit: 'झंडारोहण, पंचायत भवन / Flag hoisting, Panchayat Bhawan' },
  { src: '/whatsapp/IMG-20260725-WA0011.jpg', credit: 'प्राथमिक विद्यालय भवन / Primary school building' },
  { src: '/whatsapp/IMG-20260725-WA0080.jpg', credit: 'ग्राम सभा आयोजन / Village gathering event' },
  { src: '/whatsapp/IMG-20260725-WA0020.jpg', credit: 'जल टंकी आपूर्ति / Water tanker supply' },
  { src: '/whatsapp/IMG-20260725-WA0042.jpg', credit: 'कुआँ निर्माण / Well construction' },
]

export function Hero() {
  const { locale } = useI18n()
  const { setView } = useUI()
  const [siteConfig, setSiteConfig] = useState<Record<string, unknown> | null>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    fetch('/api/profile?key=site_config')
      .then(r => r.json())
      .then(d => setSiteConfig(d.value || d))
      .catch(() => {})
  }, [])

  // CSS fade rotator — cycles through real village photos every 8 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx(i => (i + 1) % HERO_IMAGES.length)
    }, 8000)
    return () => clearInterval(id)
  }, [])

  const codes = [
    { labelHi: 'पंचायत कोड', labelEn: 'Panchayat Code', value: '3145021064', color: 'from-primary/15 to-primary/5' },
    { labelHi: 'ब्लॉक कोड', labelEn: 'Block Code', value: '3145021', color: 'from-accent/15 to-accent/5' },
    { labelHi: 'जिला कोड', labelEn: 'District Code', value: '3145', color: 'from-primary/15 to-primary/5' },
    { labelHi: 'राज्य कोड', labelEn: 'State Code', value: '31', color: 'from-accent/15 to-accent/5' },
  ]

  const quickStats = [
    { labelHi: 'जनसंख्या', labelEn: 'Population', value: '1,247', Icon: Users },
    { labelHi: 'वार्ड', labelEn: 'Wards', value: '10', Icon: Landmark },
    { labelHi: 'घर', labelEn: 'Households', value: '187', Icon: Home },
    { labelHi: 'साक्षरता', labelEn: 'Literacy', value: '67.8%', Icon: GraduationCap },
  ] as const

  return (
    <section id="hero" className="relative overflow-hidden border-b border-border/60">
      {/* ── Real village photograph background rotator ── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {HERO_IMAGES.map((img, i) => (
          <div
            key={img.src}
            className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
            style={{ opacity: i === activeIdx ? 1 : 0 }}
          >
            <img
              src={img.src}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        {/* Saffron-to-dark gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/55 via-black/55 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        {/* Subtle tricolor top bar */}
        <div className="tricolor-bar h-1.5 w-full absolute top-0 left-0 right-0" style={{ backgroundSize: '200% 100%', animation: 'tricolor-shift 8s ease-in-out infinite' }} />
      </div>

      {/* Floating particles (decorative) */}
      <div className="hero-particle hero-particle-1 z-0" aria-hidden="true" />
      <div className="hero-particle hero-particle-2 z-0" aria-hidden="true" />
      <div className="hero-particle hero-particle-3 z-0" aria-hidden="true" />

      {/* Image credit + rotator dots */}
      <div className="absolute bottom-3 right-4 z-20 flex items-center gap-3">
        <span className="text-[10px] text-white/70 hidden sm:inline-block bg-black/40 backdrop-blur px-2 py-1 rounded">
          {locale === 'hi' ? 'वास्तविक ग्राम चंद्रा चित्र' : 'Authentic Chandra village photo'} • {HERO_IMAGES[activeIdx].credit}
        </span>
        <div className="flex items-center gap-1.5">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              aria-label={`${locale === 'hi' ? 'चित्र' : 'Image'} ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === activeIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-14 md:py-22 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left — title & CTAs */}
          <motion.div
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="gap-1.5 py-1 px-3 text-[11px] font-medium shadow-sm bg-white/90 backdrop-blur">
                <ShieldCheck className="h-3 w-3 text-primary" />
                {locale === 'hi'
                  ? 'OSINT-सत्यापित • DPDP 2023 अनुपालन • शून्य-बजट'
                  : 'OSINT-Verified • DPDP 2023 Compliant • Zero-Budget'}
              </Badge>
              <Sun className="h-4 w-4 text-amber-300 slow-rotate shrink-0 drop-shadow" aria-hidden="true" />
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white drop-shadow-lg">
                <span className="text-amber-300">
                  {locale === 'hi' ? 'ग्राम पंचायत चंद्रा' : 'Gram Panchayat Chandra'}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/95 font-medium drop-shadow">
                {locale === 'hi' ? 'डिजिटल शासन पोर्टल' : 'Digital Governance Portal'}
              </p>
              <p className="text-sm md:text-base text-white/85 flex items-center gap-1.5 flex-wrap drop-shadow">
                <MapPin className="h-4 w-4 text-amber-300" />
                {locale === 'hi'
                  ? 'विकास खण्ड शंकरगढ़ • जनपद प्रयागराज • उत्तर प्रदेश'
                  : 'Block Shankargarh • District Prayagraj • Uttar Pradesh'}
              </p>
            </div>

            {/* Codes grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
              {codes.map((c, i) => (
                <motion.div
                  key={c.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Card className={`border-white/20 bg-gradient-to-br ${c.color} backdrop-blur-md card-hover-lift shadow-lg hover:shadow-xl`}>
                    <CardContent className="p-3.5">
                      <div className="text-[10px] uppercase tracking-wider text-white/80">
                        {locale === 'hi' ? c.labelHi : c.labelEn}
                      </div>
                      <div className="text-base font-mono font-bold text-white tracking-tight tabular-nums-strong">{c.value}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.15 }}>
                <Button onClick={() => setView('complaints')} size="lg" className="gap-2 shadow-lg hover:shadow-xl glow-saffron shiny-sweep gradient-border-animate bg-primary">
                  <FileSearch className="h-4 w-4" />
                  {locale === 'hi' ? 'शिकायत ट्रैक करें' : 'Track Complaint'}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.15 }}>
                <Button
                  onClick={() => {
                    setView('home')
                    setTimeout(() => document.getElementById('schemes')?.scrollIntoView({ behavior: 'smooth' }), 100)
                  }}
                  variant="outline"
                  size="lg"
                  className="gap-2 shadow-md hover:shadow-lg shiny-sweep bg-white/90 backdrop-blur border-white/40 text-foreground hover:bg-white"
                >
                  {locale === 'hi' ? 'योजनाएँ देखें' : 'View Schemes'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            {/* AI voice complaint line CTA */}
            <Card className="border-white/20 bg-white/15 backdrop-blur-md max-w-2xl border-glow shadow-lg">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-amber-400 text-amber-950 grid place-items-center shrink-0 shadow-md float-bob">
                  <Mic className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold flex items-center gap-2 text-white">
                    {locale === 'hi' ? 'AI वॉइस शिकायत लाइन' : 'AI Voice Complaint Line'}
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-100 bg-amber-500/30 px-1.5 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-300 soft-pulse" />
                      {locale === 'hi' ? 'लाइव' : 'Live'}
                    </span>
                  </div>
                  <div className="text-xs text-white/80 mt-0.5">
                    {locale === 'hi'
                      ? 'प्रधान जी उपलब्ध नहीं हैं? AI सहायक से शिकायत दर्ज करें।'
                      : 'Pradhan unavailable? File a complaint with the AI assistant.'}
                  </div>
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="gap-1.5 shrink-0 shadow-sm bg-white/90 border-white/40"
                >
                  <a href="tel:+919651035021" className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500 pulse-glow shrink-0" aria-hidden="true" />
                    <Phone className="h-3.5 w-3.5" />
                    {locale === 'hi' ? 'कॉल करें' : 'Call'}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right — provenance / trust panel */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <Card className="border-white/20 bg-white/15 backdrop-blur-md shadow-xl indian-border-top tricolor-frame">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-amber-300" />
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-white">
                    {locale === 'hi' ? 'डेटा स्रोत' : 'Data Provenance'}
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { hi: 'NREGA पोर्टल (mnregaweb2.dord.gov.in)', en: 'NREGA portal', records: '3 records' },
                    { hi: 'eGramSwaraj (GPDP, आस्तियाँ)', en: 'eGramSwaraj (GPDP, assets)', records: '1 record' },
                    { hi: 'PMAY-G (Awaassoft रिपोर्ट)', en: 'PMAY-G (Awaassoft reports)', records: '1 record' },
                    { hi: 'LG डायरेक्टरी + PB2 रिपोर्ट', en: 'LG Directory + PB2 report', records: '2 records' },
                    { hi: 'जल जीवन मिशन + आंगनवाड़ी', en: 'Jal Jeevan Mission + Anganwadi', records: '2 records' },
                    { hi: 'जनगणना 2011 गाँव निर्देशिका', en: 'Census 2011 Village Directory', records: '1 record' },
                  ].map((src, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/15 last:border-0">
                      <span className="text-xs text-white/90">
                        {locale === 'hi' ? src.hi : src.en}
                      </span>
                      <span className="tag-chip bg-white/20 text-white">{src.records}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 flex items-center gap-2 text-[11px] text-white/70">
                  <Lock className="h-3 w-3" />
                  {locale === 'hi'
                    ? 'DPDP अधिनियम 2023: आधार/बैंक/IFSC रेड-एक्टेड'
                    : 'DPDP Act 2023: Aadhaar/Bank/IFSC redacted'}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Stats row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          {quickStats.map((s, i) => {
            const Icon = s.Icon
            return (
              <motion.div
                key={i}
                className="stat-card hover-lift-large stat-card-shimmer bg-white/15 backdrop-blur-md border border-white/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.08 }}
              >
                <div className="h-8 w-8 rounded-full bg-amber-400/20 text-amber-300 grid place-items-center shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="stat-card-number text-white">{s.value}</div>
                  <div className="stat-card-label text-white/80">{locale === 'hi' ? s.labelHi : s.labelEn}</div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="section-divider mt-8">
          <div className="section-divider-dot" />
          <div className="section-divider-dot" />
          <div className="section-divider-dot" />
        </div>
      </div>
    </section>
  )
}
