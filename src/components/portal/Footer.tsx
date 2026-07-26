'use client'
import { useI18n } from '@/lib/i18n'
import { useUI } from '@/lib/ui-store'
import { ShieldCheck, Lock, MapPin, Phone, Mail, ExternalLink, FileText, Database, Heart, Sun } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function Footer() {
  const { locale } = useI18n()
  const { setView } = useUI()

  return (
    <footer className="mt-auto border-t border-border/60 bg-gradient-to-b from-secondary/30 to-secondary/50 relative">
      {/* Gradient top bar — thicker tricolor */}
      <div className="tricolor-bar h-1 w-full" style={{ backgroundSize: '200% 100%', animation: 'tricolor-shift 8s ease-in-out infinite' }} />

      {/* Decorative Indian border top */}
      <div className="absolute top-1 left-0 right-0 h-px bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />

      <div className="container mx-auto px-4 py-10 relative">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground grid place-items-center font-bold text-sm shadow-md">
                ग्रा
              </div>
              <div>
                <div className="text-sm font-bold leading-tight text-gradient-tricolor">
                  {locale === 'hi' ? 'ग्राम पंचायत चंद्रा' : 'Gram Panchayat Chandra'}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {locale === 'hi' ? 'डिजिटल शासन पोर्टल' : 'Digital Governance Portal'}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === 'hi'
                ? 'विकास खण्ड शंकरगढ़, जनपद प्रयागराज, उत्तर प्रदेश। पंचायत कोड: 3145021064।'
                : 'Block Shankargarh, District Prayagraj, Uttar Pradesh. Panchayat Code: 3145021064.'}
            </p>
            {/* Government compliance badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded border border-primary/30 bg-primary/5 text-primary" title="Digital India Initiative">Digital India</span>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded border border-accent-foreground/30 bg-accent/10 text-accent-foreground" title="eGramSwaraj">eGramSwaraj</span>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded border border-green-600/30 bg-green-600/5 text-green-700 dark:text-green-400" title="NeSDA Compliant">NeSDA</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-3 flex items-center gap-1.5 accent-border-left">
              <FileText className="h-3.5 w-3.5 text-primary" />
              {locale === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setView('home')} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  {locale === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}
                </button>
              </li>
              <li>
                <button onClick={() => setView('complaints')} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  {locale === 'hi' ? 'शिकायत ट्रैकिंग' : 'Complaint Tracking'}
                </button>
              </li>
              <li>
                <button onClick={() => setView('admin')} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  {locale === 'hi' ? 'व्यवस्थापक पैनल' : 'Admin Panel'}
                </button>
              </li>
              <li>
                <a href="https://egramswaraj.gov.in/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  eGramSwaraj <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
              <li>
                <a href="https://mnregaweb2.dord.gov.in/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  NREGA Portal <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-3 flex items-center gap-1.5 green-border-left">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {locale === 'hi' ? 'संपर्क' : 'Contact'}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                <span>
                  {locale === 'hi'
                    ? 'ग्राम पंचायत चंद्रा, विकास खण्ड शंकरगढ़, जनपद प्रयागराज, उत्तर प्रदेश - 212108'
                    : 'Gram Panchayat Chandra, Block Shankargarh, District Prayagraj, Uttar Pradesh - 212108'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
                <a href="tel:+919651035021" className="font-mono hover:text-primary">+91 96510 35021</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                <a href="mailto:pradhan@chandra-gp.in" className="hover:text-primary">pradhan@chandra-gp.in</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              {locale === 'hi' ? 'कानूनी' : 'Legal'}
            </h4>
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30 shadow-sm tricolor-frame">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-start gap-1.5 text-[11px] text-foreground/70 leading-relaxed">
                  <Lock className="h-3 w-3 mt-0.5 shrink-0 text-accent-foreground" />
                  <span>
                    {locale === 'hi'
                      ? 'DPDP अधिनियम 2023 अनुपालन — संवेदनशील डेटा (आधार, बैंक, IFSC) रेड-एक्टेड है।'
                      : 'DPDP Act 2023 Compliant — Sensitive data (Aadhaar, Bank, IFSC) is redacted.'}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-[11px] text-foreground/70 leading-relaxed">
                  <Database className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                  <span>
                    {locale === 'hi'
                      ? 'इस पोर्टल का डेटा सार्वजनिक सरकारी पोर्टलों से OSINT विधि से एकत्रित है।'
                      : 'Data collected via OSINT from public government portals.'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="section-divider my-2">
          <div className="section-divider-dot" />
          <div className="section-divider-dot" />
          <div className="section-divider-dot" />
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="pulse-glow inline-flex rounded-full">
              <Sun className="h-3.5 w-3.5 text-primary slow-rotate" aria-hidden="true" />
            </span>
            <span>© {new Date().getFullYear()} {locale === 'hi' ? 'ग्राम पंचायत चंद्रा। सर्वाधिकार सुरक्षित।' : 'Gram Panchayat Chandra. All Rights Reserved.'}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            <span className="tag-chip">Zero-Budget</span>
            <span className="tag-chip">Open-Source</span>
            <span className="tag-chip">Bilingual (HI/EN)</span>
            <span className="tag-chip text-primary/80">
              {locale === 'hi' ? 'Powered by डिजिटल इंडिया' : 'Powered by Digital India'}
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center mt-4">
          <p className="text-[11px] text-muted-foreground/80 inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 glow-green">
            <Heart className="h-3 w-3 text-primary/60" />
            {locale === 'hi'
              ? 'पारदर्शिता के लिए निर्मित'
              : 'Built for Transparency'}
          </p>
        </div>
      </div>
    </footer>
  )
}
