'use client'
// Complaint manager — filterable table + status update dialog.
// Enhanced (Task 11-b): caller name search, date range filter, bulk actions,
// CSV export, priority badges, statistics summary bar.
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Inbox,
  Loader2,
  Pencil,
  Search,
  UserCheck,
  Download,
  CheckSquare,
  XSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react'
import {
  COMPLAINT_STATUSES,
  categoryLabel,
  formatDateTime,
  statusBadgeClass,
  statusLabel,
  type ComplaintStatus,
  type SessionUser,
} from './lib'
import type { Locale } from '@/lib/i18n'

interface Complaint {
  id: string
  trackingId: string
  callerName: string
  callerPhone: string
  callReason: string
  category: string
  status: ComplaintStatus
  assignedToId: string | null
  resolutionNote: string | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
}

type Filter = 'All' | ComplaintStatus

// ── Priority helper ────────────────────────────────────────────────
type Priority = 'urgent' | 'normal' | 'low'

function determinePriority(c: Complaint): Priority {
  if (c.status === 'Resolved' || c.status === 'Rejected') return 'low'
  const daysSince = Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 86400000)
  if ((c.category === 'water' || c.category === 'road') && daysSince <= 7) return 'urgent'
  if (c.status === 'Pending' && daysSince > 14) return 'urgent'
  return 'normal'
}

function priorityBadgeClass(priority: Priority): string {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-900 border-red-300 dark:bg-red-900/40 dark:text-red-100 dark:border-red-700'
    case 'normal':
      return 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/40 dark:text-amber-100 dark:border-amber-700'
    case 'low':
      return 'bg-green-100 text-green-900 border-green-300 dark:bg-green-900/40 dark:text-green-100 dark:border-green-700'
  }
}

function priorityLabel(priority: Priority, locale: Locale): string {
  const map: Record<Priority, { hi: string; en: string }> = {
    urgent: { hi: 'अत्यावश्यक', en: 'Urgent' },
    normal: { hi: 'सामान्य', en: 'Normal' },
    low: { hi: 'निम्न', en: 'Low' },
  }
  return map[priority][locale]
}

function priorityIcon(priority: Priority) {
  switch (priority) {
    case 'urgent': return <AlertTriangle className="h-3 w-3" />
    case 'normal': return <Clock className="h-3 w-3" />
    case 'low': return <CheckCircle2 className="h-3 w-3" />
  }
}

export function ComplaintManager({ currentUser }: { currentUser: SessionUser }) {
  const { locale } = useI18n()
  const [filter, setFilter] = useState<Filter>('All')
  const [items, setItems] = useState<Complaint[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Complaint | null>(null)
  // ── Client-side search & filter ──
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // ── New filters (Task 11-b) ──
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // ── Bulk action state ──
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkStatus, setBulkStatus] = useState<ComplaintStatus>('InProgress')
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false)
  const [bulkSaving, setBulkSaving] = useState(false)

  const buildUrl = useCallback((f: Filter) => {
    return f === 'All' ? '/api/complaints/list' : `/api/complaints/list?status=${f}`
  }, [])

  useEffect(() => {
    let alive = true
    setLoading(true)
    fetch(buildUrl(filter))
      .then(r => r.json())
      .then(d => { if (alive) setItems(d.complaints || []) })
      .catch(() => { if (alive) { setItems([]); toast.error(locale === 'hi' ? 'शिकायतें लोड विफल' : 'Complaints load failed') } })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [filter, locale, buildUrl])

  const reload = useCallback(() => {
    setLoading(true)
    fetch(buildUrl(filter))
      .then(r => r.json())
      .then(d => setItems(d.complaints || []))
      .catch(() => { setItems([]); toast.error(locale === 'hi' ? 'शिकायतें लोड विफल' : 'Complaints load failed') })
      .finally(() => setLoading(false))
  }, [filter, locale, buildUrl])

  // ── Category filter options ──
  const categoryOptions = [
    { value: 'all', labelHi: 'सभी', labelEn: 'All' },
    { value: 'water', labelHi: 'पानी', labelEn: 'Water' },
    { value: 'housing', labelHi: 'आवास', labelEn: 'Housing' },
    { value: 'road', labelHi: 'सड़क', labelEn: 'Road' },
    { value: 'electricity', labelHi: 'बिजली', labelEn: 'Electricity' },
    { value: 'general', labelHi: 'सामान्य', labelEn: 'General' },
  ]

  const statusFilterOptions = [
    { value: 'all', labelHi: 'सभी', labelEn: 'All' },
    { value: 'Pending', labelHi: 'लंबित', labelEn: 'Pending' },
    { value: 'InProgress', labelHi: 'प्रगति पर', labelEn: 'In Progress' },
    { value: 'Resolved', labelHi: 'हल', labelEn: 'Resolved' },
    { value: 'Rejected', labelHi: 'अस्वीकृत', labelEn: 'Rejected' },
  ]

  // ── Derived filtered list (client-side) ──
  const filteredItems = useMemo(() => {
    return items?.filter((c) => {
      // Tracking ID OR caller name search
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const idMatch = c.trackingId.toLowerCase().includes(q)
        const nameMatch = c.callerName.toLowerCase().includes(q)
        if (!idMatch && !nameMatch) return false
      }
      // Status filter
      if (statusFilter !== 'all' && c.status !== statusFilter) return false
      // Category filter — map 'general' → 'other' in data model
      const catMatch = categoryFilter === 'all'
        || (categoryFilter === 'general' && c.category === 'other')
        || c.category === categoryFilter
      if (!catMatch) return false
      // Date range filter
      if (startDate) {
        const s = new Date(startDate)
        if (new Date(c.createdAt) < s) return false
      }
      if (endDate) {
        const e = new Date(endDate)
        e.setHours(23, 59, 59, 999)
        if (new Date(c.createdAt) > e) return false
      }
      return true
    }) ?? []
  }, [items, searchQuery, statusFilter, categoryFilter, startDate, endDate])

  // ── Statistics summary ──
  const stats = useMemo(() => {
    if (!items) return null
    const total = items.length
    const pending = items.filter(c => c.status === 'Pending').length
    const resolved = items.filter(c => c.status === 'Resolved').length
    const resolvedItems = items.filter(c => c.status === 'Resolved' && c.resolvedAt)
    const avgResolutionMs = resolvedItems.length > 0
      ? resolvedItems.reduce((acc, c) => {
          const created = new Date(c.createdAt).getTime()
          const resolved = new Date(c.resolvedAt!).getTime()
          return acc + (resolved - created)
        }, 0) / resolvedItems.length
      : 0
    const avgResolutionDays = Math.round(avgResolutionMs / 86400000)
    return { total, pending, resolved, avgResolutionDays }
  }, [items])

  // ── Bulk actions ──
  const handleSelectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredItems.map(c => c.id)))
    }
  }

  const handleSelectOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const handleBulkUpdate = async () => {
    if (selectedIds.size === 0) return
    setBulkSaving(true)
    try {
      const trackingIds = filteredItems
        .filter(c => selectedIds.has(c.id))
        .map(c => c.trackingId)

      const r = await fetch('/api/complaints/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingIds, status: bulkStatus }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'bulk_update_failed')
      toast.success(locale === 'hi'
        ? `${selectedIds.size} शिकायतें ${statusLabel(bulkStatus, locale)} पर अपडेट`
        : `${selectedIds.size} complaints updated to ${bulkStatus}`)
      setSelectedIds(new Set())
      setBulkDialogOpen(false)
      reload()
    } catch (e) {
      toast.error(locale === 'hi' ? 'बल्क अपडेट विफल' : 'Bulk update failed', { description: (e as Error).message })
    } finally {
      setBulkSaving(false)
    }
  }

  // ── CSV Export ──
  const handleExportCsv = () => {
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (categoryFilter !== 'all') params.set('category', categoryFilter)
    if (startDate) params.set('startDate', startDate)
    if (endDate) params.set('endDate', endDate)
    const url = `/api/complaints/export?${params.toString()}`
    // Open download in new window
    window.open(url, '_blank')
    toast.success(locale === 'hi' ? 'CSV डाउनलोड शुरू' : 'CSV download started')
  }

  const tabs: { key: Filter; labelHi: string; labelEn: string }[] = [
    { key: 'All', labelHi: 'सभी', labelEn: 'All' },
    { key: 'Pending', labelHi: 'लंबित', labelEn: 'Pending' },
    { key: 'InProgress', labelHi: 'प्रगति पर', labelEn: 'In Progress' },
    { key: 'Resolved', labelHi: 'हल', labelEn: 'Resolved' },
    { key: 'Rejected', labelHi: 'अस्वीकृत', labelEn: 'Rejected' },
  ]

  return (
    <div className="space-y-4">
      {/* ── Statistics summary bar ── */}
      {stats && !loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="stat-card stat-card-shimmer rounded-lg p-3 hover-lift-large">
            <div className="stat-card-number tabular-nums-strong">{stats.total}</div>
            <div className="stat-card-label">{locale === 'hi' ? 'कुल शिकायतें' : 'Total Complaints'}</div>
          </div>
          <div className="stat-card stat-card-shimmer rounded-lg p-3 hover-lift-large">
            <div className="stat-card-number text-amber-600">{stats.pending}</div>
            <div className="stat-card-label">{locale === 'hi' ? 'लंबित' : 'Pending'}</div>
          </div>
          <div className="stat-card stat-card-shimmer rounded-lg p-3 hover-lift-large">
            <div className="stat-card-number text-green-600">{stats.resolved}</div>
            <div className="stat-card-label">{locale === 'hi' ? 'हल' : 'Resolved'}</div>
          </div>
          <div className="stat-card stat-card-shimmer rounded-lg p-3 hover-lift-large">
            <div className="stat-card-number text-primary">{stats.avgResolutionDays > 0 ? `${stats.avgResolutionDays}d` : '—'}</div>
            <div className="stat-card-label">{locale === 'hi' ? 'अव हल समय' : 'Avg Resolution'}</div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold section-heading">
            {locale === 'hi' ? 'शिकायत प्रबंधक' : 'Complaint Manager'}
          </h2>
          <p className="text-xs text-muted-foreground mt-2">
            {locale === 'hi'
              ? 'स्थिति फ़िल्टर करें और अपडेट करें।'
              : 'Filter by status and update as needed.'}
          </p>
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList className="overflow-x-auto max-w-[90vw]">
            {tabs.map(t => (
              <TabsTrigger key={t.key} value={t.key} className="text-xs">
                {locale === 'hi' ? t.labelHi : t.labelEn}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* ── Search & filter bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'hi' ? 'ट्रैकिंग आईडी / कॉलर नाम खोजें...' : 'Search Tracking ID / Caller Name...'}
            className="pl-8 text-xs h-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="text-xs h-9">
            <SelectValue placeholder={locale === 'hi' ? 'स्थिति' : 'Status'} />
          </SelectTrigger>
          <SelectContent>
            {statusFilterOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {locale === 'hi' ? opt.labelHi : opt.labelEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="text-xs h-9">
            <SelectValue placeholder={locale === 'hi' ? 'श्रेणी' : 'Category'} />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {locale === 'hi' ? opt.labelHi : opt.labelEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2 items-center">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-xs h-9"
            placeholder={locale === 'hi' ? 'से' : 'From'}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-xs h-9"
            placeholder={locale === 'hi' ? 'तक' : 'To'}
          />
        </div>
      </div>

      {/* ── Action bar: Bulk actions + Export ── */}
      <div className="flex flex-wrap items-center gap-3">
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {selectedIds.size} {locale === 'hi' ? 'चयनित' : 'selected'}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs"
              onClick={() => setBulkDialogOpen(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
              {locale === 'hi' ? 'बल्क अपडेट' : 'Bulk Update'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 text-xs text-muted-foreground"
              onClick={() => setSelectedIds(new Set())}
            >
              <XSquare className="h-3.5 w-3.5" />
              {locale === 'hi' ? 'चयन हटाएं' : 'Clear Selection'}
            </Button>
          </div>
        )}
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs ml-auto"
          onClick={handleExportCsv}
        >
          <Download className="h-3.5 w-3.5" />
          {locale === 'hi' ? 'CSV डाउनलोड' : 'Export CSV'}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 rounded" />)}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
              <Inbox className="h-6 w-6 opacity-50" />
              {locale === 'hi' ? 'इस फ़िल्टर में कोई शिकायत नहीं।' : 'No complaints match this filter.'}
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto custom-scroll">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs w-[40px]">
                      <Checkbox
                        checked={selectedIds.size === filteredItems.length && filteredItems.length > 0}
                        onCheckedChange={handleSelectAll}
                        className="h-4 w-4"
                      />
                    </TableHead>
                    <TableHead className="text-xs">{locale === 'hi' ? 'प्राथमिकता' : 'Priority'}</TableHead>
                    <TableHead className="text-xs">{locale === 'hi' ? 'ट्रैकिंग आईडी' : 'Tracking ID'}</TableHead>
                    <TableHead className="text-xs">{locale === 'hi' ? 'कॉलर' : 'Caller'}</TableHead>
                    <TableHead className="text-xs">{locale === 'hi' ? 'श्रेणी' : 'Category'}</TableHead>
                    <TableHead className="text-xs">{locale === 'hi' ? 'स्थिति' : 'Status'}</TableHead>
                    <TableHead className="text-xs">{locale === 'hi' ? 'बनाया गया' : 'Created'}</TableHead>
                    <TableHead className="text-xs text-right">{locale === 'hi' ? 'क्रिया' : 'Action'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map(c => {
                    const priority = determinePriority(c)
                    return (
                      <TableRow key={c.id} className={selectedIds.has(c.id) ? 'bg-primary/5' : ''}>
                        <TableCell className="w-[40px]">
                          <Checkbox
                            checked={selectedIds.has(c.id)}
                            onCheckedChange={() => handleSelectOne(c.id)}
                            className="h-4 w-4"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] gap-0.5 ${priorityBadgeClass(priority)}`}>
                            {priorityIcon(priority)}
                            {priorityLabel(priority, locale)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{c.trackingId}</TableCell>
                        <TableCell className="text-xs max-w-[180px] truncate" title={c.callerName}>{c.callerName}</TableCell>
                        <TableCell className="text-xs">{categoryLabel(c.category, locale)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${statusBadgeClass(c.status)}`}>
                            {statusLabel(c.status, locale)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{formatDateTime(c.createdAt, locale)}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setEditing(c)}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{locale === 'hi' ? 'अपडेट' : 'Update'}</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <UpdateDialog
        complaint={editing}
        locale={locale}
        currentUser={currentUser}
        onClose={() => setEditing(null)}
        onUpdated={() => { setEditing(null); reload() }}
      />

      {/* ── Bulk update dialog ── */}
      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <CheckSquare className="h-4 w-4 text-primary" />
              {locale === 'hi' ? 'बल्क स्थिति अपडेट' : 'Bulk Status Update'}
              <span className="text-xs font-mono text-muted-foreground">{selectedIds.size} {locale === 'hi' ? 'शिकायतें' : 'complaints'}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">{locale === 'hi' ? 'नई स्थिति' : 'New Status'}</Label>
              <Select value={bulkStatus} onValueChange={(v) => setBulkStatus(v as ComplaintStatus)}>
                <SelectTrigger className="w-full text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COMPLAINT_STATUSES.map(s => (
                    <SelectItem key={s} value={s} className="text-xs">{statusLabel(s, locale)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{locale === 'hi' ? 'समाधान टिप्पणी (वैकल्पिक)' : 'Resolution Note (optional)'}</Label>
              <Textarea
                className="text-sm min-h-[60px]"
                placeholder={locale === 'hi' ? 'सभी के लिए समाधान टिप्पणी...' : 'Resolution note for all...'}
                id="bulk-resolution-note"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDialogOpen(false)}>{locale === 'hi' ? 'रद्द करें' : 'Cancel'}</Button>
            <Button onClick={handleBulkUpdate} disabled={bulkSaving} className="gap-1.5">
              {bulkSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckSquare className="h-4 w-4" />}
              {locale === 'hi' ? 'अपडेट करें' : 'Update All'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function UpdateDialog({
  complaint,
  locale,
  currentUser,
  onClose,
  onUpdated,
}: {
  complaint: Complaint | null
  locale: Locale
  currentUser: SessionUser
  onClose: () => void
  onUpdated: () => void
}) {
  const [status, setStatus] = useState<ComplaintStatus>('Pending')
  const [note, setNote] = useState('')
  // 'none' | 'me' — assignment resolves to the current logged-in user's id
  const [assignChoice, setAssignChoice] = useState<string>('none')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status)
      setNote(complaint.resolutionNote || '')
      setAssignChoice(complaint.assignedToId === currentUser.id ? 'me' : 'none')
    }
  }, [complaint, currentUser.id])

  const submit = async () => {
    if (!complaint) return
    setSaving(true)
    try {
      const r = await fetch('/api/complaints/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingId: complaint.trackingId,
          status,
          resolutionNote: note || undefined,
          assignedToId: assignChoice === 'me' ? currentUser.id : null,
        }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'update_failed')
      toast.success(locale === 'hi' ? `शिकायत ${statusLabel(status, locale)} पर अपडेट की गई` : `Complaint updated to ${status}`)
      onUpdated()
    } catch (e) {
      toast.error(locale === 'hi' ? 'अपडेट विफल' : 'Update failed', { description: (e as Error).message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={!!complaint} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Pencil className="h-4 w-4 text-primary" />
            {locale === 'hi' ? 'शिकायत अपडेट करें' : 'Update Complaint'}
            {complaint && <span className="text-xs font-mono text-muted-foreground">{complaint.trackingId}</span>}
          </DialogTitle>
        </DialogHeader>

        {complaint && (
          <div className="space-y-3">
            {/* Priority badge in update dialog */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-[10px] gap-0.5 ${priorityBadgeClass(determinePriority(complaint))}`}>
                {priorityIcon(determinePriority(complaint))}
                {priorityLabel(determinePriority(complaint), locale)}
              </Badge>
            </div>

            <div className="rounded-md bg-secondary/40 p-2.5 space-y-1">
              <div className="text-xs"><span className="text-muted-foreground">{locale === 'hi' ? 'कॉलर: ' : 'Caller: '}</span>{complaint.callerName}</div>
              <div className="text-xs"><span className="text-muted-foreground">{locale === 'hi' ? 'कारण: ' : 'Reason: '}</span>{complaint.callReason}</div>
              <div className="text-xs"><span className="text-muted-foreground">{locale === 'hi' ? 'श्रेणी: ' : 'Category: '}</span>{categoryLabel(complaint.category, locale)}</div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">{locale === 'hi' ? 'स्थिति' : 'Status'}</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ComplaintStatus)}>
                <SelectTrigger className="w-full text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COMPLAINT_STATUSES.map(s => (
                    <SelectItem key={s} value={s} className="text-xs">{statusLabel(s, locale)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1"><UserCheck className="h-3 w-3" />{locale === 'hi' ? 'सौंपा गया' : 'Assigned To'}</Label>
              <Select value={assignChoice} onValueChange={setAssignChoice}>
                <SelectTrigger className="w-full text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-xs">{locale === 'hi' ? 'किसी को नहीं' : 'Unassigned'}</SelectItem>
                  <SelectItem value="me" className="text-xs">
                    {currentUser.role === 'admin'
                      ? (locale === 'hi' ? 'प्रधान (मुझे सौंपें)' : 'Pradhan (assign to me)')
                      : (locale === 'hi' ? 'सचिव (मुझे सौंपें)' : 'Secretary (assign to me)')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">
                {locale === 'hi'
                  ? 'असाइनमेंट आपके सत्र यूज़र आईडी पर सेट होती है (RBAC §6.1)।'
                  : 'Assignment is resolved to your session user id (RBAC §6.1).'}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">{locale === 'hi' ? 'समाधान टिप्पणी' : 'Resolution Note'}</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="text-sm min-h-[80px]"
                placeholder={locale === 'hi' ? 'कार्रवाई का विवरण दर्ज करें...' : 'Enter action details...'}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{locale === 'hi' ? 'रद्द करें' : 'Cancel'}</Button>
          <Button onClick={submit} disabled={saving} className="gap-1.5">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
            {locale === 'hi' ? 'अपडेट करें' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
