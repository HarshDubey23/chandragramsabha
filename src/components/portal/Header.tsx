'use client'
import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { useUI } from '@/lib/ui-store'
import { LanguageSwitcher } from './LanguageSwitcher'
import { DarkModeToggle } from './DarkModeToggle'
import { ExportReport } from './ExportReport'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from '@/components/ui/sheet'
import { Menu, Shield, Phone, Home, Building2, Droplets, Image, MessageSquare, BookOpen, Globe, Users, CloudSun, HelpCircle, IndianRupee, Landmark, Scale, GraduationCap, HeartPulse, Calendar, ChevronDown, MoreHorizontal, Flag, ClipboardCheck, FileCheck, Store, Video } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const { locale } = useI18n()
  const { view, setView, setScrollTarget } = useUI()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { key: 'home', labelHi: 'मुख्य', labelEn: 'Home', icon: Home, view: 'home' as const, scroll: 'hero' },
    { key: 'about', labelHi: 'परिचय', labelEn: 'About', icon: Building2, view: 'home' as const, scroll: 'about' },
    { key: 'schemes', labelHi: 'योजनाएँ', labelEn: 'Schemes', icon: BookOpen, view: 'home' as const, scroll: 'schemes' },
    { key: 'wards', labelHi: 'वार्ड', labelEn: 'Wards', icon: Users, view: 'home' as const, scroll: 'wards' },
    { key: 'budget', labelHi: 'बजट', labelEn: 'Budget', icon: IndianRupee, view: 'home' as const, scroll: 'budget' },
    { key: 'complaints', labelHi: 'शिकायत', labelEn: 'Complaint', icon: MessageSquare, view: 'complaints' as const, scroll: null },
  ]

  // Secondary nav items — shown in "More" dropdown to keep desktop nav clean
  const secondaryNavItems = [
    { key: 'representatives', labelHi: 'पदाधिकारी', labelEn: 'Reps', icon: Landmark, view: 'home' as const, scroll: 'representatives' },
    { key: 'education', labelHi: 'शिक्षा', labelEn: 'Education', icon: GraduationCap, view: 'home' as const, scroll: 'education' },
    { key: 'shg', labelHi: 'समूह', labelEn: 'Groups', icon: Users, view: 'home' as const, scroll: 'shg' },
    { key: 'health', labelHi: 'स्वास्थ्य', labelEn: 'Health', icon: HeartPulse, view: 'home' as const, scroll: 'health' },
    { key: 'weather', labelHi: 'मौसम', labelEn: 'Weather', icon: CloudSun, view: 'home' as const, scroll: 'weather-agri' },
    { key: 'marketplace', labelHi: 'बाजार', labelEn: 'Market', icon: Store, view: 'home' as const, scroll: 'marketplace' },
    { key: 'grievance', labelHi: 'शिकायत निवारण', labelEn: 'Grievance', icon: Scale, view: 'home' as const, scroll: 'grievance' },
    { key: 'events', labelHi: 'कार्यक्रम', labelEn: 'Events', icon: Calendar, view: 'home' as const, scroll: 'events' },
    { key: 'rti', labelHi: 'सूचना अधिकार', labelEn: 'RTI', icon: Scale, view: 'home' as const, scroll: 'rti' },
    { key: 'documents', labelHi: 'दस्तावेज़', labelEn: 'Documents', icon: FileCheck, view: 'home' as const, scroll: 'documents' },
    { key: 'faq', labelHi: 'सहायता', labelEn: 'Help', icon: HelpCircle, view: 'home' as const, scroll: 'faq' },
    { key: 'infrastructure', labelHi: 'आधारभूत', labelEn: 'Infra', icon: Droplets, view: 'home' as const, scroll: 'infrastructure' },
    { key: 'gallery', labelHi: 'गैलरी', labelEn: 'Gallery', icon: Image, view: 'home' as const, scroll: 'gallery' },
    { key: 'videos', labelHi: 'वीडियो', labelEn: 'Videos', icon: Video, view: 'home' as const, scroll: 'videos' },
    { key: 'eligibility', labelHi: 'पात्रता', labelEn: 'Eligibility', icon: ClipboardCheck, view: 'home' as const, scroll: 'eligibility' },
  ]

  const handleNav = (item: typeof navItems[number]) => {
    setView(item.view)
    if (item.scroll) {
      setTimeout(() => {
        const el = document.getElementById(item.scroll!)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
    setMobileOpen(false)
  }

  return (
    <>
      {/* Tricolor accent strip — thicker at 3px with animation */}
      <div className="tricolor-bar h-[3px] w-full" style={{ backgroundSize: '200% 100%', animation: 'tricolor-shift 8s ease-in-out infinite' }} />
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-all',
          scrolled ? 'shadow-lg shadow-primary/5' : 'shadow-sm'
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-3">
          {/* Logo + title */}
          <button
            onClick={() => handleNav(navItems[0])}
            className="flex items-center gap-3 text-left group"
          >
            <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground grid place-items-center font-bold shadow-md group-hover:scale-105 transition-transform">
              <span className="text-base avatar-initials">ग्रा</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-accent border-2 border-background shadow-sm" />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-bold text-foreground">
                {locale === 'hi' ? 'ग्राम पंचायत चंद्रा' : 'Gram Panchayat Chandra'}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {locale === 'hi' ? 'शंकरगढ़ • प्रयागराज • उ.प्र.' : 'Shankargarh • Prayagraj • UP'}
              </div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = view === item.view
              return (
                <Button
                  key={item.key}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNav(item)}
                  className={cn(
                    'gap-1.5 h-9 text-xs font-medium transition-all',
                    active
                      ? 'bg-secondary text-secondary-foreground shadow-sm'
                      : 'hover:bg-secondary/80 hover:shadow-sm'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {locale === 'hi' ? item.labelHi : item.labelEn}
                </Button>
              )
            })}
            {/* "More" dropdown for secondary nav items */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 h-9 text-xs font-medium transition-all hover:bg-secondary/80 hover:shadow-sm"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  {locale === 'hi' ? 'अधिक' : 'More'}
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                  {locale === 'hi' ? 'सभी अनुभाग / All Sections' : 'All Sections'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem
                      key={item.key}
                      onClick={() => handleNav(item)}
                      className="gap-2.5 cursor-pointer py-2"
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        {locale === 'hi' ? item.labelHi : item.labelEn}
                      </span>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right actions — more styled */}
          <div className="flex items-center gap-1.5">
            <ExportReport />
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex gap-1.5 h-9 text-xs shadow-sm hover:shadow-md border-primary/30 hover:border-primary/50 transition-all"
              onClick={() => window.open('tel:+919651035021')}
            >
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono">{locale === 'hi' ? '96510 35021' : '+91 96510 35021'}</span>
            </Button>
            <LanguageSwitcher />
            <DarkModeToggle />
            <Button
              variant="default"
              size="sm"
              className="hidden sm:flex gap-1.5 h-9 shadow-sm hover:shadow-md transition-all"
              onClick={() => setView('admin')}
            >
              <Shield className="h-3.5 w-3.5" />
              {locale === 'hi' ? 'व्यवस्थापक' : 'Admin'}
            </Button>

            {/* Mobile menu — improved hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden h-9 w-9 shadow-sm border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[360px]">
                <SheetHeader>
                  <VisuallyHidden>
                    <SheetTitle>Navigation</SheetTitle>
                  </VisuallyHidden>
                </SheetHeader>
                <div className="flex flex-col gap-1 mt-4">
                  {/* Mobile header with logo */}
                  <div className="px-3 py-3 mb-2 border-b border-border/60 bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground grid place-items-center font-bold shadow-sm">
                        <span className="text-xs avatar-initials">ग्रा</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold">
                          {locale === 'hi' ? 'ग्राम पंचायत चंद्रा' : 'Gram Panchayat Chandra'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {locale === 'hi' ? 'डिजिटल शासन पोर्टल' : 'Digital Governance Portal'}
                        </div>
                      </div>
                    </div>
                  </div>
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Button
                        key={item.key}
                        variant="ghost"
                        className="justify-start gap-3 h-11 hover:bg-secondary/80"
                        onClick={() => handleNav(item)}
                      >
                        <Icon className="h-4 w-4" />
                        {locale === 'hi' ? item.labelHi : item.labelEn}
                      </Button>
                    )
                  })}
                  {/* Divider + secondary nav items in mobile sheet */}
                  <div className="px-3 py-2 mt-2 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold border-y border-border/60">
                    {locale === 'hi' ? 'सभी अनुभाग / All Sections' : 'All Sections'}
                  </div>
                  <div className="grid grid-cols-2 gap-1 px-1">
                    {secondaryNavItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Button
                          key={item.key}
                          variant="ghost"
                          size="sm"
                          className="justify-start gap-2 h-9 text-xs hover:bg-secondary/80"
                          onClick={() => handleNav(item)}
                        >
                          <Icon className="h-3.5 w-3.5 text-primary" />
                          <span className="truncate">{locale === 'hi' ? item.labelHi : item.labelEn}</span>
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    className="justify-start gap-3 h-11 mt-2 shadow-sm"
                    onClick={() => { setView('admin'); setMobileOpen(false) }}
                  >
                    <Shield className="h-4 w-4" />
                    {locale === 'hi' ? 'व्यवस्थापक पैनल' : 'Admin Panel'}
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start gap-3 h-11"
                    onClick={() => window.open('tel:+919651035021')}
                  >
                    <Phone className="h-4 w-4" />
                    <span className="font-mono text-xs">+91 96510 35021</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}
