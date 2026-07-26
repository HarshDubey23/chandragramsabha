'use client'
import { Hero } from './Hero'
import { About } from './About'
import { Schemes } from './Schemes'
import { SchemeEligibilityChecker } from './SchemeEligibilityChecker'
import { SchemeDataCards } from './SchemeDataCards'
import { VillageStats } from './VillageStats'
import { VillageMap } from './VillageMap'
import { CensusSection } from './CensusSection'
import { VillageResources } from './VillageResources'
import { WardMap } from './WardMap'
import { RepresentativesSection } from './RepresentativesSection'
import { BudgetSection } from './BudgetSection'
import { EducationSection } from './EducationSection'
import { SHGDirectory } from './SHGDirectory'
import { HealthSanitationSection } from './HealthSanitationSection'
import { EmergencyContacts } from './EmergencyContacts'
import { WeatherAgriSection } from './WeatherAgriSection'
import { VillageMarketplace } from './VillageMarketplace'
import { GrievanceSection } from './GrievanceSection'
import { EventsCalendarSection } from './EventsCalendarSection'
import { PollsSection } from './PollsSection'
import { RTISection } from './RTISection'
import { DocumentChecklist } from './DocumentChecklist'
import { FAQSection } from './FAQSection'
import { Infrastructure } from './Infrastructure'
import { PhotoGallery } from './PhotoGallery'
import { VideoGallery } from './VideoGallery'
import { VillageTimeline } from './VillageTimeline'
import { Announcements } from './Announcements'
import { CitizenServiceTracker } from './CitizenServiceTracker'

export function PublicPortal() {
  return (
    <>
      {/* Print-only header — visible only when printing / saving as PDF */}
      <div className="print-only print-header">
        <h1>ग्राम पंचायत चंद्रा — डिजिटल शासन पोर्टल रिपोर्ट</h1>
        <p>Gram Panchayat Chandra — Digital Governance Portal Report</p>
        <p style={{ fontSize: '9pt', marginTop: '4px' }}>
          पंचायत कोड 3145021064 • विकास खण्ड शंकरगढ़ • जनपद प्रयागराज • उत्तर प्रदेश
        </p>
        <p style={{ fontSize: '9pt' }}>
          निर्गत तिथि / Generated: {new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
        </p>
      </div>
      <Hero />
      <About />
      <Schemes />
      <SchemeEligibilityChecker />
      <SchemeDataCards />
      <VillageStats />
      <VillageMap />
      <CensusSection />
      <VillageResources />
      <WardMap />
      <RepresentativesSection />
      <BudgetSection />
      <EducationSection />
      <SHGDirectory />
      <HealthSanitationSection />
      <EmergencyContacts />
      <WeatherAgriSection />
      <VillageMarketplace />
      <GrievanceSection />
      <CitizenServiceTracker />
      <EventsCalendarSection />
      <PollsSection />
      <RTISection />
      <DocumentChecklist />
      <FAQSection />
      <Infrastructure />
      <PhotoGallery />
      <VideoGallery />
      <VillageTimeline />
      <Announcements />
    </>
  )
}
