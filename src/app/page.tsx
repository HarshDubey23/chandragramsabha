'use client'
import { useEffect } from 'react'
import { Header } from '@/components/portal/Header'
import { Footer } from '@/components/portal/Footer'
import { PublicPortal } from '@/components/portal/PublicPortal'
import { ComplaintTracking } from '@/components/portal/ComplaintTracking'
import { AdminPanel } from '@/components/admin/AdminPanel'
import { ScrollProgress } from '@/components/portal/ScrollProgress'
import { BackToTop } from '@/components/portal/BackToTop'
import { ServiceWorkerRegister } from '@/components/portal/ServiceWorkerRegister'
import { useUI } from '@/lib/ui-store'
import { useI18n } from '@/lib/i18n'

export default function Home() {
  const { view } = useUI()
  const { locale } = useI18n()

  // keep <html lang> attribute in sync with locale for screen readers + CSS :lang()
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        {locale === 'hi' ? 'मुख्य सामग्री पर जाएं' : 'Skip to main content'}
      </a>
      <Header />
      <ScrollProgress />
      <main id="main-content" className="flex-1">
        {view === 'home' && <PublicPortal />}
        {view === 'complaints' && <ComplaintTracking />}
        {view === 'admin' && <AdminPanel />}
      </main>
      <Footer />
      <BackToTop />
      <ServiceWorkerRegister />
    </div>
  )
}
