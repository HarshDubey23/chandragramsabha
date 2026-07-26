'use client'
import { useEffect, useState, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Droplets, School, Baby, Route, Home, Sun, Building2, Hammer, Umbrella, CalendarDays, Image as ImageIcon, Lock, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'
import { ImageLightbox } from './ImageLightbox'

interface ImageAsset {
  imageId: string
  filename: string
  url: string
  category: string
  subcategory: string | null
  hiCaption: string
  enCaption: string
  schemeLogos: string | null
  purpose: string
  chatContext: string | null
  exif: string | null
  geoInferred: string | null
  scrollSection: string | null
  facesDetected: number
  confidence: number
  isPublic: boolean
}

const SECTIONS = [
  { id: 'water-infrastructure', labelHi: 'जल आपूर्ति', labelEn: 'Water', icon: Droplets, prefix: 'infrastructure.water' },
  { id: 'school', labelHi: 'विद्यालय', labelEn: 'School', icon: School, prefix: 'infrastructure.school' },
  { id: 'anganwadi', labelHi: 'आंगनवाड़ी', labelEn: 'Anganwadi', icon: Baby, prefix: 'infrastructure.anganwadi' },
  { id: 'road', labelHi: 'सड़क एवं नाली', labelEn: 'Roads', icon: Route, prefix: 'infrastructure.road' },
  { id: 'housing', labelHi: 'आवास', labelEn: 'Housing', icon: Home, prefix: 'scheme.pmay-g' },
  { id: 'power', labelHi: 'विद्युत', labelEn: 'Power', icon: Sun, prefix: 'infrastructure.power' },
  { id: 'civic', labelHi: 'सामाजिक', labelEn: 'Civic', icon: Building2, prefix: 'infrastructure.civic' },
  { id: 'mgnrega', labelHi: 'मनरेगा', labelEn: 'MGNREGA', icon: Hammer, prefix: 'scheme.mgnrega' },
  { id: 'events', labelHi: 'कार्यक्रम', labelEn: 'Events', icon: CalendarDays, prefix: 'event' },
]

export function Infrastructure() {
  const { locale } = useI18n()
  const [images, setImages] = useState<ImageAsset[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    fetch('/api/images').then(r => r.json()).then(d => setImages(d.images || [])).catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    if (activeTab === 'all') return images
    const section = SECTIONS.find(s => s.id === activeTab)
    if (!section) return images
    return images.filter(img => img.category.startsWith(section.prefix) || img.scrollSection === activeTab)
  }, [images, activeTab])

  // group by scrollSection for display
  const grouped = useMemo(() => {
    const g: Record<string, ImageAsset[]> = {}
    for (const img of filtered) {
      const key = img.scrollSection || 'other'
      if (!g[key]) g[key] = []
      g[key].push(img)
    }
    return g
  }, [filtered])

  return (
    <section id="infrastructure" className="py-12 md:py-16 border-b border-border/60">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Badge variant="outline" className="mb-2 gap-1.5">
            <ImageIcon className="h-3 w-3" />
            {locale === 'hi' ? 'आधारभूत संरचना गैलरी' : 'Infrastructure Gallery'}
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold section-heading">
            {locale === 'hi' ? 'आधारभूत संरचना एवं कार्यक्रम' : 'Infrastructure & Events'}
          </h2>
          <p className="text-sm text-muted-foreground mt-3">
            {locale === 'hi'
              ? 'दृश्य प्रमाण — हिंदी/अंग्रेज़ी कैप्शन टॉगल के लिए भाषा स्विच का उपयोग करें'
              : 'Visual evidence — use the language switch to toggle Hindi/English captions'}
          </p>
        </div>

        <ScrollReveal delay={0.1}>
        {/* Featured real-photo highlights — well construction & water tanker supply */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <FeaturedPhotoCard
            src="/whatsapp/IMG-20260725-WA0042.jpg"
            icon={Hammer}
            tagHi="वास्तविक तस्वीर / Real photo"
            tagEn="वास्तविक तस्वीर / Real photo"
            titleHi="कुआँ निर्माण — जल स्रोत विकास"
            titleEn="Well construction — water source development"
            captionHi="मनरेगा अंतर्गत ग्राम चंद्रा में नवनिर्मित कुआँ।"
            captionEn="Newly constructed well in Gram Chandra under MGNREGA."
            locale={locale}
          />
          <FeaturedPhotoCard
            src="/whatsapp/IMG-20260725-WA0020.jpg"
            icon={Droplets}
            tagHi="वास्तविक तस्वीर / Real photo"
            tagEn="वास्तविक तस्वीर / Real photo"
            titleHi="जल टैंकर आपूर्ति — पेयजल सुविधा"
            titleEn="Water tanker supply — drinking water service"
            captionHi="ग्राम पंचायत द्वारा वर्षा ऋतु में जल टैंकर आपूर्ति।"
            captionEn="Panchayat-supplied water tanker during dry season."
            locale={locale}
          />
        </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-secondary/50 p-1 mb-6">
            <TabsTrigger value="all" className="text-xs gap-1.5">
              <ImageIcon className="h-3 w-3" />
              {locale === 'hi' ? 'सभी' : 'All'}
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 ml-1">{images.length}</Badge>
            </TabsTrigger>
            {SECTIONS.map((s) => {
              const Icon = s.icon
              const count = images.filter(img => img.category.startsWith(s.prefix) || img.scrollSection === s.id).length
              if (count === 0) return null
              return (
                <TabsTrigger key={s.id} value={s.id} className="text-xs gap-1.5">
                  <Icon className="h-3 w-3" />
                  {locale === 'hi' ? s.labelHi : s.labelEn}
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5 ml-1">{count}</Badge>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{locale === 'hi' ? 'इस श्रेणी में कोई चित्र उपलब्ध नहीं' : 'No images in this category'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((img) => (
                  <ImageCard key={img.imageId} img={img} locale={locale} onClick={() => { setSelectedImage(img); setLightboxOpen(true) }} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        </ScrollReveal>

        {/* Photo Lightbox */}
        <ImageLightbox
          image={selectedImage}
          open={lightboxOpen}
          onClose={() => { setLightboxOpen(false); setSelectedImage(null) }}
        />
      </div>
    </section>
  )
}

function ImageCard({ img, locale, onClick }: { img: ImageAsset; locale: 'hi' | 'en'; onClick?: () => void }) {
  const caption = locale === 'hi' ? img.hiCaption : img.enCaption
  const altCaption = locale === 'hi' ? img.enCaption : img.hiCaption
  const logos = img.schemeLogos ? JSON.parse(img.schemeLogos) as string[] : []
  const chatCtx = img.chatContext ? JSON.parse(img.chatContext) : null
  const geo = img.geoInferred ? JSON.parse(img.geoInferred) : null

  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }} onClick={onClick} className="cursor-pointer">
    <Card className="overflow-hidden border-border/70 hover:border-primary/40 hover:shadow-md transition-all group">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={img.url}
          alt={caption}
          loading="lazy"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        {/* scheme logos overlay */}
        {logos.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {logos.map((l) => (
              <Badge key={l} variant="secondary" className="text-[9px] py-0 px-1.5 bg-background/90 backdrop-blur">
                {l}
              </Badge>
            ))}
          </div>
        )}
        {/* confidence indicator */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {img.confidence >= 0.9 && (
            <Badge variant="secondary" className="text-[9px] py-0 px-1.5 bg-background/90 backdrop-blur gap-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              {locale === 'hi' ? 'उच्च' : 'High'}
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-3 space-y-2">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-xs font-medium leading-snug line-clamp-2 cursor-help">
                {caption}
              </p>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[240px]">
              <p className="text-xs">{altCaption}</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {locale === 'hi' ? 'अंग्रेज़ी कैप्शन' : 'Hindi caption'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* provenance strip */}
        <div className="flex flex-wrap gap-1 pt-1 border-t border-border/40">
          <Badge variant="outline" className="text-[9px] py-0 px-1.5 font-mono">
            {img.imageId}
          </Badge>
          {geo && (
            <Badge variant="outline" className="text-[9px] py-0 px-1.5">
              {geo.village}
            </Badge>
          )}
          {img.purpose === 'asset-evidence' && (
            <Badge variant="outline" className="text-[9px] py-0 px-1.5 text-accent-foreground gap-0.5">
              <Lock className="h-2 w-2" />
              {locale === 'hi' ? 'साक्ष्य' : 'evidence'}
            </Badge>
          )}
        </div>

        {/* chat context */}
        {chatCtx && (
          <div className="text-[10px] text-muted-foreground bg-secondary/40 rounded p-1.5 line-clamp-2">
            <span className="font-medium">{chatCtx.sender}</span>: &ldquo;{locale === 'hi' ? chatCtx.msg_before : chatCtx.msg_before}&rdquo;
          </div>
        )}
      </CardContent>
    </Card>
    </motion.div>
  )
}

function FeaturedPhotoCard({
  src,
  icon: Icon,
  tagHi,
  tagEn,
  titleHi,
  titleEn,
  captionHi,
  captionEn,
  locale,
}: {
  src: string
  icon: React.ElementType
  tagHi: string
  tagEn: string
  titleHi: string
  titleEn: string
  captionHi: string
  captionEn: string
  locale: 'hi' | 'en'
}) {
  return (
    <Card className="overflow-hidden border-border/70 hover:border-primary/40 card-hover-lift indian-border-top group">
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <img
          src={src}
          alt={(locale === 'hi' ? titleHi : titleEn) + ' — वास्तविक तस्वीर / Real photo'}
          loading="lazy"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-[10px] py-0 px-1.5 bg-background/90 backdrop-blur gap-1 shadow-sm">
            <Icon className="h-3 w-3 text-primary" />
            {locale === 'hi' ? 'आधारभूत संरचना' : 'Infrastructure'}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4 space-y-1.5">
        <h4 className="text-sm font-semibold leading-snug">
          {locale === 'hi' ? titleHi : titleEn}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {locale === 'hi' ? captionHi : captionEn}
        </p>
        <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-border/40">
          <span className="text-[10px] text-green-700 dark:text-green-400 font-medium inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
            {locale === 'hi' ? tagHi : tagEn}
          </span>
          <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
            <Camera className="h-2.5 w-2.5" />
            {locale === 'hi' ? 'पंचायत फोटो' : 'Panchayat photo'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
