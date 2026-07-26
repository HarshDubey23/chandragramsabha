'use client'
// Admin panel — login gate + authenticated tabbed layout.
// §6.2 editable entities, §6.3 immutable audit log, §6.4 CSV bulk upload.
// Bilingual HI/EN throughout. Warm Indian palette (saffron primary, green accent).
import { useEffect, useState, useCallback } from 'react'
import { useI18n } from '@/lib/i18n'
import { useUI } from '@/lib/ui-store'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme-store'
import {
  ArrowLeft,
  Bell,
  FileSpreadsheet,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  LogOut,
  Lock,
  MessageSquareWarning,
  Shield,
  Star,
  UserCog,
  ScrollText,
  Store,
  Vote,
  Newspaper,
  Database,
} from 'lucide-react'
import type { SessionUser } from './lib'
import { Dashboard } from './Dashboard'
import { ProfileEditor } from './ProfileEditor'
import { ImageManager } from './ImageManager'
import { ComplaintManager } from './ComplaintManager'
import { AnnouncementsManager } from './AnnouncementsManager'
import { CsvUpload } from './CsvUpload'
import { ActivityLog } from './ActivityLog'
import { FeedbackDashboard } from './FeedbackDashboard'
import { PollsManager } from './PollsManager'
import { MarketplaceManager } from './MarketplaceManager'
import { NotificationBell } from './NotificationBell'
import { BlogManager } from './BlogManager'
import { ContentEditor } from './ContentEditor'

type TabKey = 'dashboard' | 'profile' | 'images' | 'complaints' | 'feedback' | 'polls' | 'marketplace' | 'announcements' | 'blog' | 'content' | 'csv' | 'activity'

export function AdminPanel() {
  const { locale } = useI18n()
  const { setView } = useUI()
  const { theme, toggle } = useTheme()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [tab, setTab] = useState<TabKey>('dashboard')

  const refreshUser = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/me')
      const d = await r.json()
      setUser(d.user || null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refreshUser() }, [refreshUser])

  const handleLogin = async () => {
    setSubmitting(true); setError(null)
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const d = await r.json()
      if (!r.ok) {
        if (d.error === 'rate_limited') {
          setError(locale === 'hi' ? 'बहुत अधिक प्रयास। 1 मिनट प्रतीक्षा करें।' : 'Too many attempts. Wait 1 minute.')
        } else {
          setError(locale === 'hi' ? 'अमान्य ईमेल या पासवर्ड' : 'Invalid email or password')
        }
        return
      }
      setUser(d.user)
      toast.success(locale === 'hi' ? `स्वागत है, ${d.user.name}` : `Welcome, ${d.user.name}`)
    } catch {
      setError(locale === 'hi' ? 'नेटवर्क त्रुटि' : 'Network error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setUser(null)
    setTab('dashboard')
    toast.success(locale === 'hi' ? 'लॉगआउट सफल' : 'Logged out')
  }

  // ── Loading splash ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 grid place-items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">{locale === 'hi' ? 'सत्र जाँचा जा रहा है...' : 'Checking session...'}</p>
        </div>
      </div>
    )
  }

  // ── Login screen ─────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 min-h-[70vh]">
        <Button variant="ghost" size="sm" className="mb-4 gap-1.5" onClick={() => setView('home')}>
          <ArrowLeft className="h-4 w-4" />
          {locale === 'hi' ? 'मुख्य पर वापस' : 'Back to Home'}
        </Button>
        <div className="max-w-md mx-auto">
          <div className="h-1 tricolor-bar rounded-full mb-6" />
          <Card className="border-primary/30">
            <CardHeader className="text-center pb-3">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground grid place-items-center mx-auto mb-3 shadow-md">
                <Shield className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">{locale === 'hi' ? 'व्यवस्थापक लॉगिन' : 'Admin Login'}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {locale === 'hi' ? 'केवल अधिकृत पदाधिकारियों के लिए' : 'Authorized office bearers only'}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">{locale === 'hi' ? 'ईमेल' : 'Email'}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="pradhan@chandra-gp.in"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs">{locale === 'hi' ? 'पासवर्ड' : 'Password'}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <div className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded p-2 flex items-center gap-1.5">
                  <Lock className="h-3 w-3" />
                  {error}
                </div>
              )}
              <Button onClick={handleLogin} disabled={submitting || !email || !password} className="w-full gap-1.5" size="lg">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                {locale === 'hi' ? 'साइन इन करें' : 'Sign In'}
              </Button>
              <div className="text-[11px] text-muted-foreground bg-secondary/40 rounded p-2.5 space-y-1">
                <div className="font-semibold text-foreground">{locale === 'hi' ? 'डेमो क्रेडेंशियल:' : 'Demo credentials:'}</div>
                <div className="font-mono">pradhan@chandra-gp.in / chandra2026</div>
                <div className="font-mono">gpa@chandra-gp.in / secretary2026</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ── Authenticated layout ─────────────────────────────────────────────────
  const tabs: { key: TabKey; hi: string; en: string; icon: React.ElementType }[] = [
    { key: 'dashboard', hi: 'डैशबोर्ड', en: 'Dashboard', icon: LayoutDashboard },
    { key: 'profile', hi: 'प्रोफ़ाइल', en: 'Profile', icon: UserCog },
    { key: 'images', hi: 'छवियाँ', en: 'Images', icon: ImageIcon },
    { key: 'complaints', hi: 'शिकायतें', en: 'Complaints', icon: MessageSquareWarning },
    { key: 'feedback', hi: 'नागरिक प्रतिक्रिया', en: 'Feedback', icon: Star },
    { key: 'polls', hi: 'सर्वेक्षण', en: 'Polls', icon: Vote },
    { key: 'marketplace', hi: 'बाजार', en: 'Market', icon: Store },
    { key: 'announcements', hi: 'घोषणाएँ', en: 'Announcements', icon: Bell },
    { key: 'blog', hi: 'ब्लॉग', en: 'Blog', icon: Newspaper },
    { key: 'content', hi: 'सामग्री', en: 'Content', icon: Database },
    { key: 'csv', hi: 'CSV अपलोड', en: 'CSV Upload', icon: FileSpreadsheet },
    { key: 'activity', hi: 'गतिविधि लॉग', en: 'Activity Log', icon: ScrollText },
  ]

  return (
    <div className="min-h-[70vh]">
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
        {/* Sticky sub-header */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center flex-shrink-0">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm font-bold flex items-center gap-1.5 truncate">
                    {locale === 'hi' ? 'व्यवस्थापक पैनल' : 'Admin Panel'}
                  </h1>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 truncate">
                    <span className="truncate">{user.name}</span>
                    <Badge variant="outline" className="text-[9px] uppercase">{user.role}</Badge>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <NotificationBell onNavigate={(t) => setTab(t)} />
                <Button variant="outline" size="icon" onClick={toggle} className="h-8 w-8 shadow-sm border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all" aria-label={theme === 'light' ? 'डार्क मोड / Dark mode' : 'लाइट मोड / Light mode'} title={theme === 'light' ? 'डार्क मोड / Dark mode' : 'लाइट मोड / Light mode'}>
                  {theme === 'light' ? <Moon className="h-3.5 w-3.5 text-primary" /> : <Sun className="h-3.5 w-3.5 text-amber-500" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setView('home')} className="gap-1.5">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{locale === 'hi' ? 'मुख्य पर' : 'Home'}</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{locale === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
                </Button>
              </div>
            </div>

            {/* Tabs nav — horizontally scrollable on small screens */}
            <TabsList className="overflow-x-auto max-w-full w-full justify-start h-auto p-1 mt-3">
              {tabs.map(t => {
                const Icon = t.icon
                return (
                  <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1.5 flex-shrink-0 admin-tab-hover">
                    <Icon className="h-3.5 w-3.5" />
                    {locale === 'hi' ? t.hi : t.en}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>
        </div>

        {/* Tab content */}
        <div className="container mx-auto px-4 py-6 md:py-8">
          <TabsContent value="dashboard"><Dashboard onNavigate={(t) => setTab(t)} /></TabsContent>
          <TabsContent value="profile"><ProfileEditor /></TabsContent>
          <TabsContent value="images"><ImageManager /></TabsContent>
          <TabsContent value="complaints"><ComplaintManager currentUser={user} /></TabsContent>
          <TabsContent value="feedback"><FeedbackDashboard /></TabsContent>
          <TabsContent value="polls"><PollsManager /></TabsContent>
          <TabsContent value="marketplace"><MarketplaceManager /></TabsContent>
          <TabsContent value="announcements"><AnnouncementsManager /></TabsContent>
          <TabsContent value="blog"><BlogManager /></TabsContent>
          <TabsContent value="content"><ContentEditor /></TabsContent>
          <TabsContent value="csv"><CsvUpload /></TabsContent>
          <TabsContent value="activity"><ActivityLog /></TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
