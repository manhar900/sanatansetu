'use client'

// ============================================================================
// home-app.tsx — the full homepage for Sanatan Setu
// Header · Hero · Categories · Library · Content cards · Upload dialog ·
// Detail dialog · Admin approval flow · Audio chant toggle · i18n · AI auto-translation
// ============================================================================

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Upload,
  Sun,
  Moon,
  Heart,
  Eye,
  Trash2,
  X,
  Sparkles,
  BookOpen,
  AudioLines,
  Video,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  ChevronRight,
  Calendar,
  User,
  Globe,
  Tag,
  Crown,
  Clock,
  ArrowUpRight,
  Quote,
  Loader2,
  Plus,
  Languages,
  Shield,
  Pencil,
  LogOut,
  KeyRound,
  Check,
  Volume2,
  VolumeX,
  Music,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Slider } from '@/components/ui/slider'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

import { OmSymbol, LotusIcon, DiyaIcon } from '@/components/sacred-icons'
import { SmartImage } from '@/components/smart-image'
import {
  CATEGORIES,
  LANGUAGES,
  CONTENT_TYPES,
  type ContentType,
  getCategoryName,
  getLanguageNativeName,
} from '@/lib/categories'
import { useLanguage } from '@/components/language-provider'
import { uiLangToContentLang, quotes, getLanguage, type LanguageCode } from '@/lib/i18n'
import {
  useAutoTranslation,
  clearTranslationCache,
} from '@/components/use-auto-translation'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useAdmin } from '@/components/admin-provider'
import { useAudio } from '@/components/audio-provider'
import { cn } from '@/lib/utils'

// ===================== Types =====================
export type ContentItem = {
  id: string
  title: string
  description: string
  body: string | null
  category: string
  type: string
  mediaUrl: string | null
  imageUrl: string | null
  author: string | null
  language: string
  tags: string | null
  translations: string | null
  mediaGallery: string | null
  views: number
  likes: number
  featured: boolean
  status: string
  submittedBy: string | null
  createdAt: string
  updatedAt: string
}

type Stats = {
  total: number
  categories: { name: string; count: number }[]
}

type SortOption = 'newest' | 'oldest' | 'popular' | 'liked'

type MediaGalleryItem = {
  type: 'image' | 'video'
  url: string
  caption?: string
}

type TranslationEntry = {
  lang: string // content language like "Hindi"
  title: string
  description: string
  body: string
}

// ===================== Helpers =====================
function parseGallery(raw: string | null | undefined): MediaGalleryItem[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (g) => g && (g.type === 'image' || g.type === 'video') && typeof g.url === 'string'
      )
    }
  } catch {
    // ignore
  }
  return []
}

function parseTranslations(raw: string | null | undefined): Record<string, any> {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, any>
    }
  } catch {
    // ignore
  }
  return {}
}

function formatRelativeTime(iso: string, dict: ReturnType<typeof useLanguage>['dict']): string {
  try {
    const date = new Date(iso)
    const now = Date.now()
    const diff = Math.max(0, now - date.getTime())
    const seconds = Math.floor(diff / 1000)
    if (seconds < 60) return dict.justNow
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} ${dict.minutesAgo}`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} ${dict.hoursAgo}`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} ${dict.daysAgo}`
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  text: FileText,
  image: ImageIcon,
  audio: AudioLines,
  video: Video,
  link: LinkIcon,
}

function getTypeLabel(type: string, dict: ReturnType<typeof useLanguage>['dict']): string {
  switch (type) {
    case 'text':
      return dict.typeText
    case 'image':
      return dict.typeImage
    case 'audio':
      return dict.typeAudio
    case 'video':
      return dict.typeVideo
    case 'link':
      return dict.typeLink
    default:
      return type
  }
}

// Category icon component — falls back to OmSymbol when no specific icon exists.
function getCategorySymbol(name: string, className?: string) {
  // All categories use a stylized glyph; we fall back to OmSymbol.
  const cat = CATEGORIES.find((c) => c.name === name)
  if (!cat) return <OmSymbol className={className} />
  // Use the sanskrit glyph as a text-based symbol fallback.
  return (
    <span
      className={cn('font-serif font-bold tracking-tight', className)}
      style={{ fontSize: 'inherit' }}
    >
      {cat.icon}
    </span>
  )
}

// ============================================================================
// AudioChantToggle — header control with chant selector + volume slider
// ============================================================================
function AudioChantToggle() {
  const { dict } = useLanguage()
  const {
    isPlaying,
    toggle,
    currentChant,
    setChant,
    availableChants,
    volume,
    setVolume,
  } = useAudio()
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'gap-1.5 h-9 px-2 sm:px-3',
              isPlaying && 'text-amber-600 dark:text-amber-400'
            )}
            aria-label={isPlaying ? dict.audioChantingOff : dict.audioChantingOn}
          >
            <Music className="h-[1.05rem] w-[1.05rem]" />
            {isPlaying && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs">
                <motion.span
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"
                />
                {availableChants.find((c) => c.id === currentChant)?.name}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            {dict.selectChant}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableChants.map((c) => (
            <DropdownMenuItem
              key={c.id}
              onSelect={() => setChant(c.id)}
              className="flex items-center justify-between gap-2 cursor-pointer"
            >
              <span className="flex flex-col">
                <span className="text-sm font-medium">{c.name}</span>
                <span className="text-[0.7rem] text-muted-foreground font-serif">
                  {c.sanskrit} · {c.baseFreq}Hz
                </span>
              </span>
              {currentChant === c.id && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <div className="px-2 py-2">
            <div className="flex items-center gap-2 mb-2">
              {volume === 0 ? (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground">{dict.audioVolume}</span>
            </div>
            <Slider
              value={[Math.round(volume * 100)]}
              min={0}
              max={100}
              step={1}
              onValueChange={(v) => setVolume((v[0] ?? 0) / 100)}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="h-9 w-9"
        aria-label={isPlaying ? dict.audioChantingOff : dict.audioChantingOn}
        title={isPlaying ? dict.audioChantingOff : dict.audioChantingOn}
      >
        {isPlaying ? (
          <Volume2 className="h-[1.05rem] w-[1.05rem]" />
        ) : (
          <VolumeX className="h-[1.05rem] w-[1.05rem]" />
        )}
      </Button>
    </div>
  )
}

// ============================================================================
// FloatingAudioIndicator — bottom-right badge when audio is playing
// ============================================================================
function FloatingAudioIndicator() {
  const { dict } = useLanguage()
  const { isPlaying, currentChant, availableChants, toggle } = useAudio()
  const chant = availableChants.find((c) => c.id === currentChant)

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.button
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          onClick={toggle}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full border border-amber-300/60 bg-gradient-to-r from-amber-500/95 to-orange-500/95 px-4 py-2.5 text-white shadow-lg shadow-amber-500/30 backdrop-blur"
          aria-label={dict.audioChantingPlaying}
        >
          <span className="flex items-end gap-0.5 h-4">
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="w-0.5 bg-white rounded-full"
                animate={{ height: ['30%', '100%', '30%'] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[0.65rem] uppercase tracking-wider opacity-80">
              {dict.audioNowPlaying}
            </span>
            <span className="text-sm font-medium font-serif">
              {chant?.sanskrit} · {chant?.name}
            </span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// ThemeToggle
// ============================================================================
function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  const isDark = mounted ? (resolvedTheme ?? theme) === 'dark' : false
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="h-9 w-9"
      aria-label="Toggle theme"
    >
      {mounted && isDark ? (
        <Sun className="h-[1.15rem] w-[1.15rem]" />
      ) : (
        <Moon className="h-[1.15rem] w-[1.15rem]" />
      )}
    </Button>
  )
}

// ============================================================================
// AdminLoginDialog
// ============================================================================
function AdminLoginDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { dict } = useLanguage()
  const { login, logout, isAdmin } = useAdmin()
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return
    setLoading(true)
    const ok = await login(password)
    setLoading(false)
    if (ok) {
      toast.success(dict.adminLoggedIn)
      setPassword('')
      onOpenChange(false)
    } else {
      toast.error(dict.adminLoginFailed)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-amber-600" /> {dict.adminLogin}
          </DialogTitle>
          <DialogDescription>{dict.adminPasswordHint}</DialogDescription>
        </DialogHeader>
        {isAdmin ? (
          <div className="py-4 space-y-3">
            <p className="text-sm text-muted-foreground">{dict.adminLoggedIn}</p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                logout()
                toast.success(dict.adminLoggedOut)
                onOpenChange(false)
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> {dict.adminLogout}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="admin-pw">{dict.adminPassword}</Label>
              <Input
                id="admin-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {dict.adminLoginButton}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// Header
// ============================================================================
function Header({
  onOpenUpload,
  search,
  setSearch,
  pendingCount,
}: {
  onOpenUpload: () => void
  search: string
  setSearch: (v: string) => void
  pendingCount: number
}) {
  const { dict } = useLanguage()
  const { isAdmin, logout } = useAdmin()
  const [adminOpen, setAdminOpen] = React.useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-amber-200/40 dark:border-amber-900/30 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm">
                <OmSymbol className="h-5 w-5" />
              </span>
              <span className="hidden sm:flex flex-col leading-none">
                <span className="font-serif font-bold text-base">Sanatan Setu</span>
                <span className="text-[0.65rem] text-muted-foreground">{dict.brandTagline}</span>
              </span>
            </Link>

            {/* Search */}
            <div className="relative flex-1 max-w-md mx-auto hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={dict.searchPlaceholder}
                className="pl-9 h-9 bg-muted/40 border-amber-200/50"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5 ml-auto">
              <AudioChantToggle />
              <LanguageSwitcher />
              <ThemeToggle />

              {/* Admin */}
              {isAdmin ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 gap-1.5 px-2">
                      <Shield className="h-4 w-4 text-amber-600" />
                      <span className="hidden sm:inline text-xs">{dict.admin}</span>
                      {pendingCount > 0 && (
                        <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[0.6rem] font-bold text-white">
                          {pendingCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      {dict.admin}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {pendingCount > 0 && (
                      <DropdownMenuItem
                        onSelect={() => {
                          const ev = new CustomEvent('ss-open-pending')
                          window.dispatchEvent(ev)
                        }}
                        className="cursor-pointer"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {dict.pendingApproval}
                        <Badge className="ml-auto bg-rose-500 text-white text-[0.6rem] h-4 min-w-4 justify-center">
                          {pendingCount}
                        </Badge>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onSelect={() => {
                        logout()
                        toast.success(dict.adminLoggedOut)
                      }}
                      className="cursor-pointer text-rose-600 focus:text-rose-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> {dict.adminLogout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAdminOpen(true)}
                  className="h-9 w-9"
                  aria-label={dict.adminLogin}
                >
                  <KeyRound className="h-[1.05rem] w-[1.05rem]" />
                </Button>
              )}

              {/* Upload */}
              <Button
                onClick={onOpenUpload}
                size="sm"
                className="ml-1 h-9 gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">{dict.upload}</span>
              </Button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={dict.searchPlaceholder}
                className="pl-9 h-9 bg-muted/40"
              />
            </div>
          </div>
        </div>
      </header>
      <AdminLoginDialog open={adminOpen} onOpenChange={setAdminOpen} />
    </>
  )
}

// ============================================================================
// Hero
// ============================================================================
function Hero({
  stats,
  onOpenUpload,
  onBrowse,
}: {
  stats: Stats
  onOpenUpload: () => void
  onBrowse: () => void
}) {
  const { dict } = useLanguage()
  const categoryCount = stats.categories.length || CATEGORIES.length

  return (
    <section className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-orange-50/40 to-background dark:from-amber-950/20 dark:via-orange-950/10 dark:to-background" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-24 -right-24 opacity-[0.07] dark:opacity-[0.04]"
        >
          <OmSymbol size={420} />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-32 -left-24 opacity-[0.05] dark:opacity-[0.03]"
        >
          <LotusIcon size={360} />
        </motion.div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-16 sm:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-100/60 dark:bg-amber-950/30 px-4 py-1.5 text-xs font-medium text-amber-800 dark:text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            {dict.heroBadge}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center my-8"
        >
          <span className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30">
            <OmSymbol className="h-12 w-12" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent"
        >
          {dict.heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          {dict.heroDescription}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            onClick={onOpenUpload}
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0"
          >
            <Upload className="mr-2 h-4 w-4" /> {dict.uploadSacredContent}
          </Button>
          <Button onClick={onBrowse} size="lg" variant="outline">
            <BookOpen className="mr-2 h-4 w-4" /> {dict.exploreLibrary}
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-14 grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto"
        >
          <div className="rounded-2xl border border-amber-200/40 dark:border-amber-900/30 bg-card/60 backdrop-blur p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-bold font-serif text-amber-600 dark:text-amber-400">
              {stats.total}
            </div>
            <div className="text-[0.7rem] sm:text-xs uppercase tracking-wider text-muted-foreground mt-1">
              {dict.statSacredItems}
            </div>
          </div>
          <div className="rounded-2xl border border-amber-200/40 dark:border-amber-900/30 bg-card/60 backdrop-blur p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-bold font-serif text-rose-600 dark:text-rose-400">
              {categoryCount}
            </div>
            <div className="text-[0.7rem] sm:text-xs uppercase tracking-wider text-muted-foreground mt-1">
              {dict.statCategories}
            </div>
          </div>
          <div className="rounded-2xl border border-amber-200/40 dark:border-amber-900/30 bg-card/60 backdrop-blur p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-bold font-serif text-emerald-600 dark:text-emerald-400">
              ∞
            </div>
            <div className="text-[0.7rem] sm:text-xs uppercase tracking-wider text-muted-foreground mt-1">
              {dict.statEternalWisdom}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================================
// QuoteBanner
// ============================================================================
function QuoteBanner() {
  const [idx, setIdx] = React.useState(0)
  React.useEffect(() => {
    setIdx(Math.floor(Math.random() * quotes.length))
  }, [])
  const q = quotes[idx]
  return (
    <section className="container mx-auto max-w-4xl px-4 py-6">
      <motion.figure
        key={idx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl border border-amber-200/40 dark:border-amber-900/30 bg-gradient-to-r from-amber-50/60 to-rose-50/40 dark:from-amber-950/20 dark:to-rose-950/10 p-6 sm:p-8 text-center"
      >
        <Quote className="absolute left-4 top-4 h-6 w-6 text-amber-400/40" />
        <blockquote className="font-serif text-lg sm:text-xl font-medium leading-relaxed text-foreground/90">
          {q.text}
        </blockquote>
        <figcaption className="mt-3 text-sm text-muted-foreground italic">
          {q.trans}
        </figcaption>
      </motion.figure>
    </section>
  )
}

// ============================================================================
// CategorySection
// ============================================================================
function CategorySection({
  stats,
  onSelect,
}: {
  stats: Stats
  onSelect: (cat: string | null) => void
}) {
  const { dict } = useLanguage()
  const countFor = (name: string) =>
    stats.categories.find((c) => c.name === name)?.count ?? 0

  return (
    <section id="categories" className="container mx-auto max-w-7xl px-4 py-12">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/50 bg-amber-100/40 dark:bg-amber-950/20 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
          <Sparkles className="h-3 w-3" /> {dict.categoriesBadge}
        </span>
        <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold tracking-tight">
          {dict.browseByCategory}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{dict.categoriesSubtitle}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {CATEGORIES.map((cat, i) => {
          const count = countFor(cat.name)
          return (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              onClick={() => onSelect(cat.name)}
              className={cn(
                'group relative overflow-hidden rounded-2xl border border-amber-200/40 dark:border-amber-900/30 bg-gradient-to-br p-4 sm:p-5 text-left transition-all hover:shadow-md hover:-translate-y-0.5',
                cat.accent
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/70 dark:bg-black/30 text-amber-700 dark:text-amber-300 text-xs font-bold font-serif shadow-sm">
                  {cat.icon}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-amber-600 transition-colors" />
              </div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-foreground">
                {cat.name}
              </h3>
              <p className="font-serif text-xs text-amber-700/80 dark:text-amber-300/80 mt-0.5">
                {cat.sanskrit}
              </p>
              <p className="mt-2 text-[0.7rem] text-muted-foreground line-clamp-2">
                {cat.description}
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-[0.7rem] font-medium text-muted-foreground">
                <span className="rounded-full bg-white/60 dark:bg-black/20 px-2 py-0.5">
                  {count} {count === 1 ? dict.itemCount : dict.itemsCount}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}

// ============================================================================
// ContentCard
// ============================================================================
function ContentCard({
  item,
  onOpen,
}: {
  item: ContentItem
  onOpen: (item: ContentItem) => void
}) {
  const { lang, dict } = useLanguage()
  const targetContentLang = uiLangToContentLang(lang as LanguageCode)
  const { data: translated, loading, isAutoTranslated } = useAutoTranslation(
    item,
    targetContentLang,
    { includeBody: false }
  )

  const translations = parseTranslations(item.translations)
  const hasTranslation =
    item.language === targetContentLang ||
    Boolean(translations[targetContentLang.toLowerCase()])
  const showAuto = !hasTranslation && translated && isAutoTranslated

  const title = translated?.title ?? item.title
  const description = translated?.description ?? item.description
  const category = getCategoryName(item.category)
  const TypeIcon = TYPE_ICONS[item.type] ?? FileText

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/content/${item.id}`}>
        <article
          onClick={(e) => {
            // We want to navigate via Link; the onClick is used to also allow
            // a quick dialog preview when Cmd/Ctrl is held — but to keep things
            // simple, we just rely on the Link navigation. The onOpen handler
            // is exposed for programmatic open (e.g. pending items).
            if (e.metaKey || e.ctrlKey) {
              e.preventDefault()
              onOpen(item)
            }
          }}
          className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-amber-200/40 dark:border-amber-900/30 bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          {/* Cover */}
          <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-amber-100/60 to-orange-100/40 dark:from-amber-950/30 dark:to-orange-950/20">
            {item.imageUrl ? (
              <SmartImage
                src={item.imageUrl}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                containerClassName="h-full w-full"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-amber-600/30 dark:text-amber-400/30">
                {item.type === 'audio' ? (
                  <AudioLines className="h-10 w-10" />
                ) : item.type === 'video' ? (
                  <Video className="h-10 w-10" />
                ) : item.type === 'image' ? (
                  <ImageIcon className="h-10 w-10" />
                ) : item.type === 'link' ? (
                  <LinkIcon className="h-10 w-10" />
                ) : (
                  <OmSymbol className="h-10 w-10" />
                )}
              </div>
            )}

            {/* Top-left category badge */}
            {category && (
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[0.65rem] font-medium text-white backdrop-blur">
                <span className="font-serif">{category.sanskrit}</span> · {category.name}
              </span>
            )}
            {/* Top-right type + featured */}
            <div className="absolute right-2 top-2 flex items-center gap-1">
              {item.featured && (
                <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-500 text-white">
                  <Crown className="h-3.5 w-3.5" />
                </span>
              )}
              <span className="grid h-6 w-6 place-items-center rounded-full bg-black/55 text-white backdrop-blur">
                <TypeIcon className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col p-4">
            <h3 className="font-serif font-bold text-base leading-snug line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
              {loading ? (
                <span className="inline-block h-4 w-3/4 bg-muted rounded animate-pulse" />
              ) : (
                title
              )}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3 flex-1">
              {loading ? '…' : description}
            </p>

            {/* Tags */}
            {item.tags && (
              <div className="mt-3 flex flex-wrap gap-1">
                {item.tags
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .slice(0, 3)
                  .map((t) => (
                    <Badge key={t} variant="secondary" className="text-[0.65rem] h-5">
                      <Tag className="mr-1 h-2.5 w-2.5" />
                      {t}
                    </Badge>
                  ))}
              </div>
            )}

            {/* Meta footer */}
            <div className="mt-3 flex items-center justify-between text-[0.7rem] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3 w-3" /> {item.views}
              </span>
              <span className="inline-flex items-center gap-1">
                <Heart className="h-3 w-3" /> {item.likes}
              </span>
              {showAuto ? (
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Sparkles className="h-3 w-3" /> {dict.autoTranslated}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Languages className="h-3 w-3" /> {item.language}
                </span>
              )}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}

// ============================================================================
// LibrarySection
// ============================================================================
function LibrarySection({
  items,
  loading,
  search,
  setSearch,
  category,
  setCategory,
  type,
  setType,
  sort,
  setSort,
}: {
  items: ContentItem[]
  loading: boolean
  search: string
  setSearch: (v: string) => void
  category: string | null
  setCategory: (v: string | null) => void
  type: string | null
  setType: (v: string | null) => void
  sort: SortOption
  setSort: (v: SortOption) => void
}) {
  const { dict } = useLanguage()
  const libraryRef = React.useRef<HTMLDivElement>(null)

  const activeFilterCount =
    (category ? 1 : 0) + (type ? 1 : 0) + (search ? 1 : 0)

  return (
    <section id="library" ref={libraryRef} className="container mx-auto max-w-7xl px-4 py-12">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-rose-300/50 bg-rose-100/40 dark:bg-rose-950/20 px-3 py-1 text-xs font-medium text-rose-700 dark:text-rose-300">
          <BookOpen className="h-3 w-3" /> {dict.libraryBadge}
        </span>
        <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold tracking-tight">
          {dict.libraryTitle}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{dict.librarySubtitle}</p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={dict.searchLibraryPlaceholder}
            className="pl-9 h-10 bg-muted/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
            <FilterPill active={!category} onClick={() => setCategory(null)}>
              {dict.all}
            </FilterPill>
            {CATEGORIES.map((c) => (
              <FilterPill
                key={c.name}
                active={category === c.name}
                onClick={() => setCategory(c.name)}
              >
                {c.name}
              </FilterPill>
            ))}
          </div>

          {/* Type + Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <Select
              value={type ?? 'all'}
              onValueChange={(v) => setType(v === 'all' ? null : v)}
            >
              <SelectTrigger className="h-9 w-[130px] text-xs">
                <SelectValue placeholder={dict.allTypes} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{dict.allTypes}</SelectItem>
                {CONTENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className="h-9 w-[130px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{dict.sortNewest}</SelectItem>
                <SelectItem value="oldest">{dict.sortOldest}</SelectItem>
                <SelectItem value="popular">{dict.sortPopular}</SelectItem>
                <SelectItem value="liked">{dict.sortLiked}</SelectItem>
              </SelectContent>
            </Select>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('')
                  setCategory(null)
                  setType(null)
                }}
                className="h-9 text-xs"
              >
                <X className="h-3 w-3 mr-1" /> Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="mb-4 text-xs text-muted-foreground">
        {dict.showing} <span className="font-medium text-foreground">{items.length}</span>{' '}
        {items.length === 1 ? dict.itemCount : dict.itemsCount}
        {category ? ` ${dict.inCategory} ${category}` : ''}
        {type ? ` ${dict.ofType} ${getTypeLabel(type, dict)}` : ''}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-3 text-amber-500" />
          <p className="text-sm">{dict.loadingContent}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <OmSymbol className="h-12 w-12 text-amber-400/50 mb-4" />
          {activeFilterCount > 0 ? (
            <>
              <h3 className="font-serif text-lg font-bold">{dict.noMatchesTitle}</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                {dict.noMatchesDesc}
              </p>
            </>
          ) : (
            <>
              <h3 className="font-serif text-lg font-bold">{dict.emptyTitle}</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">{dict.emptyDesc}</p>
            </>
          )}
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <ContentCard key={item.id} item={item} onOpen={() => {}} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  )
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
        active
          ? 'bg-amber-500 text-white border-amber-500'
          : 'bg-muted/40 text-muted-foreground border border-transparent hover:bg-muted'
      )}
    >
      {children}
    </button>
  )
}

// ============================================================================
// UploadDialog — full create/edit form
// ============================================================================
type UploadFormState = {
  title: string
  description: string
  body: string
  category: string
  type: ContentType
  mediaUrl: string
  imageUrl: string
  author: string
  language: string
  tags: string
  featured: boolean
  translations: TranslationEntry[]
  mediaGallery: MediaGalleryItem[]
}

function emptyForm(): UploadFormState {
  return {
    title: '',
    description: '',
    body: '',
    category: CATEGORIES[0].name,
    type: 'text',
    mediaUrl: '',
    imageUrl: '',
    author: '',
    language: LANGUAGES[0].value,
    tags: '',
    featured: false,
    translations: [],
    mediaGallery: [],
  }
}

function UploadDialog({
  open,
  onOpenChange,
  editing,
  onCreated,
  onEdited,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  editing: ContentItem | null
  onCreated: (item: ContentItem) => void
  onEdited: (item: ContentItem) => void
}) {
  const { dict } = useLanguage()
  const { isAdmin, authedFetch } = useAdmin()
  const [form, setForm] = React.useState<UploadFormState>(emptyForm())
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      if (editing) {
        setForm({
          title: editing.title,
          description: editing.description,
          body: editing.body ?? '',
          category: editing.category,
          type: (editing.type as ContentType) ?? 'text',
          mediaUrl: editing.mediaUrl ?? '',
          imageUrl: editing.imageUrl ?? '',
          author: editing.author ?? '',
          language: editing.language,
          tags: editing.tags ?? '',
          featured: editing.featured,
          translations: Object.entries(parseTranslations(editing.translations)).map(
            ([lang, val]: [string, any]) => ({
              lang,
              title: val?.title ?? '',
              description: val?.description ?? '',
              body: val?.body ?? '',
            })
          ),
          mediaGallery: parseGallery(editing.mediaGallery),
        })
      } else {
        setForm(emptyForm())
      }
    }
  }, [open, editing])

  const update = <K extends keyof UploadFormState>(k: K, v: UploadFormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) {
      toast.error(dict.titleRequired)
      return
    }

    setSaving(true)
    try {
      const translationsObj: Record<string, any> = {}
      for (const t of form.translations) {
        if (t.lang && (t.title || t.description || t.body)) {
          translationsObj[t.lang.toLowerCase()] = {
            title: t.title,
            description: t.description,
            body: t.body,
          }
        }
      }

      const payload = {
        title: form.title,
        description: form.description,
        body: form.body || null,
        category: form.category,
        type: form.type,
        mediaUrl: form.mediaUrl || null,
        imageUrl: form.imageUrl || null,
        author: form.author || null,
        language: form.language,
        tags: form.tags || null,
        translations: Object.keys(translationsObj).length ? JSON.stringify(translationsObj) : null,
        mediaGallery: form.mediaGallery.length ? JSON.stringify(form.mediaGallery) : null,
        featured: form.featured,
      }

      if (editing) {
        const res = await authedFetch(`/api/content/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err?.error || 'update failed')
        }
        const data = await res.json()
        clearTranslationCache()
        toast.success(dict.contentUpdated)
        onEdited(data.item)
        onOpenChange(false)
      } else {
        const res = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err?.error || 'create failed')
        }
        const data = await res.json()
        clearTranslationCache()
        if (isAdmin) {
          toast.success(dict.contentPublished)
        } else {
          toast.success(dict.uploadSuccessPending)
        }
        onCreated(data.item)
        onOpenChange(false)
      }
    } catch (e) {
      console.error(e)
      toast.error(editing ? dict.updateFailed : dict.loadFailed)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-amber-600" />
            {editing ? dict.editContent : dict.uploadTitle}
          </DialogTitle>
          <DialogDescription>
            {editing ? dict.editSubtitle : dict.uploadSubtitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {!isAdmin && !editing && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900/40 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
              {dict.uploadSuccessPending}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="up-title">
              {dict.titleLabel} <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="up-title"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="up-desc">
              {dict.descriptionLabel} <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="up-desc"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder={dict.descriptionPlaceholder}
              required
              rows={2}
            />
          </div>

          {/* Category + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{dict.categoryLabel}</Label>
              <Select value={form.category} onValueChange={(v) => update('category', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      <span className="font-serif mr-1">{c.sanskrit}</span> · {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{dict.contentTypeLabel}</Label>
              <Select
                value={form.type}
                onValueChange={(v) => update('type', v as ContentType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Body (for text) */}
          {form.type === 'text' && (
            <div className="space-y-1.5">
              <Label htmlFor="up-body">{dict.bodyLabel}</Label>
              <Textarea
                id="up-body"
                value={form.body}
                onChange={(e) => update('body', e.target.value)}
                placeholder={dict.bodyPlaceholder}
                rows={6}
                className="font-serif"
              />
              <p className="text-[0.7rem] text-muted-foreground">{dict.bodyHint}</p>
            </div>
          )}

          {/* Lyrics/description for audio */}
          {form.type === 'audio' && (
            <div className="space-y-1.5">
              <Label htmlFor="up-lyrics">{dict.descriptionLyricsLabel}</Label>
              <Textarea
                id="up-lyrics"
                value={form.body}
                onChange={(e) => update('body', e.target.value)}
                placeholder={dict.descriptionLyricsPlaceholder}
                rows={4}
                className="font-serif"
              />
            </div>
          )}

          {/* Media URL + Cover */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="up-media">{dict.mediaUrlLabel}</Label>
              <Input
                id="up-media"
                value={form.mediaUrl}
                onChange={(e) => update('mediaUrl', e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="up-cover">
                {dict.coverImageLabel}{' '}
                <span className="text-[0.7rem] text-muted-foreground">
                  ({dict.coverImageOptional})
                </span>
              </Label>
              <Input
                id="up-cover"
                value={form.imageUrl}
                onChange={(e) => update('imageUrl', e.target.value)}
                placeholder="https://…/image.jpg"
              />
            </div>
          </div>

          {/* Author + Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="up-author">{dict.authorLabel}</Label>
              <Input
                id="up-author"
                value={form.author}
                onChange={(e) => update('author', e.target.value)}
                placeholder={dict.authorPlaceholder}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{dict.language}</Label>
              <Select
                value={form.language}
                onValueChange={(v) => update('language', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.native} · {l.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label htmlFor="up-tags">{dict.tagsLabel}</Label>
            <Input
              id="up-tags"
              value={form.tags}
              onChange={(e) => update('tags', e.target.value)}
              placeholder={dict.tagsPlaceholder}
            />
            <p className="text-[0.7rem] text-muted-foreground">{dict.tagsHint}</p>
          </div>

          {/* Featured */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update('featured', e.target.checked)}
              className="h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm inline-flex items-center gap-1">
              <Crown className="h-3.5 w-3.5 text-amber-500" /> {dict.markFeatured}
            </span>
          </label>

          {/* Media Gallery */}
          <div className="space-y-2 rounded-xl border border-amber-200/40 dark:border-amber-900/30 p-3 bg-muted/20">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{dict.gallerySection}</Label>
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() =>
                    update('mediaGallery', [
                      ...form.mediaGallery,
                      { type: 'image', url: '', caption: '' },
                    ])
                  }
                >
                  <Plus className="h-3 w-3 mr-1" /> {dict.addImage}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() =>
                    update('mediaGallery', [
                      ...form.mediaGallery,
                      { type: 'video', url: '', caption: '' },
                    ])
                  }
                >
                  <Plus className="h-3 w-3 mr-1" /> {dict.addVideo}
                </Button>
              </div>
            </div>
            <p className="text-[0.7rem] text-muted-foreground">{dict.galleryHint}</p>
            {form.mediaGallery.length === 0 && (
              <p className="text-[0.7rem] text-muted-foreground/60 italic py-2">
                —
              </p>
            )}
            {form.mediaGallery.map((g, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-start">
                <Badge variant="outline" className="col-span-2 justify-center h-9">
                  {g.type === 'image' ? (
                    <ImageIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <Video className="h-3 w-3 mr-1" />
                  )}
                  {g.type}
                </Badge>
                <Input
                  className="col-span-7 h-9"
                  placeholder={g.type === 'image' ? dict.imagePlaceholder : dict.videoPlaceholder}
                  value={g.url}
                  onChange={(e) => {
                    const next = [...form.mediaGallery]
                    next[i] = { ...next[i], url: e.target.value }
                    update('mediaGallery', next)
                  }}
                />
                <Input
                  className="col-span-2 h-9"
                  placeholder={dict.captionLabel}
                  value={g.caption ?? ''}
                  onChange={(e) => {
                    const next = [...form.mediaGallery]
                    next[i] = { ...next[i], caption: e.target.value }
                    update('mediaGallery', next)
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="col-span-1 h-9 w-9 text-rose-500"
                  onClick={() => {
                    const next = form.mediaGallery.filter((_, idx) => idx !== i)
                    update('mediaGallery', next)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Translations */}
          <div className="space-y-2 rounded-xl border border-amber-200/40 dark:border-amber-900/30 p-3 bg-muted/20">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium inline-flex items-center gap-1">
                <Languages className="h-3.5 w-3.5" /> {dict.translationsSection}
              </Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() =>
                  update('translations', [
                    ...form.translations,
                    { lang: 'Hindi', title: '', description: '', body: '' },
                  ])
                }
              >
                <Plus className="h-3 w-3 mr-1" /> {dict.addTranslation}
              </Button>
            </div>
            <p className="text-[0.7rem] text-muted-foreground">{dict.translationHint}</p>
            {form.translations.map((t, i) => (
              <div key={i} className="rounded-lg border bg-card p-2 space-y-2">
                <div className="flex items-center gap-2">
                  <Select
                    value={t.lang}
                    onValueChange={(v) => {
                      const next = [...form.translations]
                      next[i] = { ...next[i], lang: v }
                      update('translations', next)
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs flex-1">
                      <SelectValue placeholder={dict.translationLangLabel} />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((l) => (
                        <SelectItem key={l.value} value={l.value}>
                          {l.native} · {l.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-500"
                    onClick={() => {
                      const next = form.translations.filter((_, idx) => idx !== i)
                      update('translations', next)
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Input
                  className="h-8 text-xs"
                  placeholder={dict.titleLabel}
                  value={t.title}
                  onChange={(e) => {
                    const next = [...form.translations]
                    next[i] = { ...next[i], title: e.target.value }
                    update('translations', next)
                  }}
                />
                <Input
                  className="h-8 text-xs"
                  placeholder={dict.descriptionLabel}
                  value={t.description}
                  onChange={(e) => {
                    const next = [...form.translations]
                    next[i] = { ...next[i], description: e.target.value }
                    update('translations', next)
                  }}
                />
                <Textarea
                  className="text-xs"
                  placeholder={dict.bodyLabel}
                  rows={2}
                  value={t.body}
                  onChange={(e) => {
                    const next = [...form.translations]
                    next[i] = { ...next[i], body: e.target.value }
                    update('translations', next)
                  }}
                />
              </div>
            ))}
          </div>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {dict.cancel}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              {editing ? dict.saveChanges : dict.upload}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// DetailDialog — full content view with admin actions
// ============================================================================
function DetailDialog({
  item,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}: {
  item: ContentItem | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onEdit: (item: ContentItem) => void
  onDelete: (item: ContentItem) => void
  onApprove: (item: ContentItem) => void
  onReject: (item: ContentItem) => void
}) {
  const { lang, dict } = useLanguage()
  const { isAdmin, authedFetch } = useAdmin()
  const targetContentLang = uiLangToContentLang(lang as LanguageCode)
  const { data: translated, loading, isAutoTranslated } = useAutoTranslation(
    item,
    targetContentLang,
    { includeBody: true }
  )

  const [liked, setLiked] = React.useState(false)
  const [likeCount, setLikeCount] = React.useState(0)
  const [activeLang, setActiveLang] = React.useState<string>('')

  React.useEffect(() => {
    if (item) {
      setLiked(false)
      setLikeCount(item.likes)
      setActiveLang(item.language)
    }
  }, [item])

  if (!item) return null

  const translations = parseTranslations(item.translations)
  const availableLangs = Object.keys(translations).map((l) => l.charAt(0).toUpperCase() + l.slice(1))
  const showOriginal = activeLang.toLowerCase() === item.language.toLowerCase()
  const humanTranslation = !showOriginal
    ? translations[activeLang.toLowerCase()]
    : null
  const autoTrans =
    translated && activeLang.toLowerCase() === targetContentLang.toLowerCase()
      ? translated
      : null

  const displayTitle = humanTranslation?.title ?? autoTrans?.title ?? item.title
  const displayDescription =
    humanTranslation?.description ?? autoTrans?.description ?? item.description
  const displayBody = humanTranslation?.body ?? autoTrans?.body ?? item.body

  const gallery = parseGallery(item.mediaGallery)
  const category = getCategoryName(item.category)
  const TypeIcon = TYPE_ICONS[item.type] ?? FileText
  const isPending = item.status === 'pending'

  const handleLike = async () => {
    if (liked || !item) return
    setLiked(true)
    setLikeCount((c) => c + 1)
    try {
      await fetch(`/api/content/${item.id}/like`, { method: 'POST' })
    } catch {
      setLiked(false)
      setLikeCount((c) => c - 1)
      toast.error(dict.blessedFailed)
    }
  }

  const handleDelete = async () => {
    if (!item) return
    if (!confirm(dict.confirmRemove)) return
    try {
      const res = await authedFetch(`/api/content/${item.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success(dict.removed)
      onDelete(item)
      onOpenChange(false)
    } catch {
      toast.error(dict.removeFailed)
    }
  }

  const langButtons = [item.language, ...availableLangs.filter((l) => l.toLowerCase() !== item.language.toLowerCase())]
  const includesTarget = langButtons.some((l) => l.toLowerCase() === targetContentLang.toLowerCase())
  if (!includesTarget && targetContentLang !== item.language) {
    langButtons.push(targetContentLang)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {category && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                <span className="mr-1 font-serif">{category.sanskrit}</span> · {category.name}
              </Badge>
            )}
            <Badge variant="outline" className="capitalize">
              <TypeIcon className="mr-1 h-3 w-3" /> {getTypeLabel(item.type, dict)}
            </Badge>
            {item.featured && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">
                <Crown className="mr-1 h-3 w-3" /> {dict.featured}
              </Badge>
            )}
            {isPending && (
              <Badge className="bg-rose-500 text-white border-0">
                <Clock className="mr-1 h-3 w-3" /> {dict.pendingApproval}
              </Badge>
            )}
          </div>
          <DialogTitle className="font-serif text-2xl">
            {loading ? '…' : displayTitle}
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            {loading ? '…' : displayDescription}
          </DialogDescription>
        </DialogHeader>

        {/* Language toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {dict.availableIn}:
          </span>
          {langButtons.map((l) => {
            const isActive = l.toLowerCase() === activeLang.toLowerCase()
            return (
              <Button
                key={l}
                size="sm"
                variant={isActive ? 'default' : 'outline'}
                onClick={() => setActiveLang(l)}
                className="h-7 text-xs"
              >
                {l}
              </Button>
            )
          })}
          {isAutoTranslated && activeLang.toLowerCase() === targetContentLang.toLowerCase() && (
            <Badge variant="secondary" className="text-[0.65rem]">
              <Sparkles className="mr-1 h-3 w-3" /> {dict.autoTranslated}
            </Badge>
          )}
        </div>

        {/* Cover */}
        {item.imageUrl && (
          <div className="overflow-hidden rounded-xl">
            <SmartImage
              src={item.imageUrl}
              alt={displayTitle}
              className="w-full h-auto max-h-80 object-cover"
              containerClassName="w-full"
            />
          </div>
        )}

        {/* Media */}
        {item.mediaUrl && item.type === 'audio' && (
          <audio controls className="w-full" src={item.mediaUrl} />
        )}
        {item.mediaUrl && item.type === 'video' && (
          <div className="aspect-video overflow-hidden rounded-xl bg-black">
            <iframe
              src={item.mediaUrl}
              className="w-full h-full"
              title={displayTitle}
              allowFullScreen
            />
          </div>
        )}
        {item.mediaUrl && item.type === 'link' && (
          <a href={item.mediaUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full sm:w-auto">
              <LinkIcon className="mr-2 h-4 w-4" /> {dict.openExternal}
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </a>
        )}

        {/* Body */}
        {displayBody && (
          <div className="rounded-xl bg-muted/30 p-4 max-h-80 overflow-y-auto">
            <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed bg-transparent border-0 p-0">
              {loading ? dict.translating : displayBody}
            </pre>
          </div>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {gallery.map((g, i) => (
              <div key={i} className="overflow-hidden rounded-lg border bg-muted/30">
                {g.type === 'image' ? (
                  <SmartImage
                    src={g.url}
                    alt={g.caption ?? displayTitle}
                    className="w-full h-24 object-cover"
                    containerClassName="w-full"
                  />
                ) : (
                  <div className="aspect-video bg-black">
                    <iframe
                      src={g.url}
                      className="w-full h-full"
                      title={g.caption ?? `media-${i}`}
                      allowFullScreen
                    />
                  </div>
                )}
                {g.caption && (
                  <p className="px-2 py-1 text-[0.65rem] text-muted-foreground">{g.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {item.tags && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
              .map((t) => (
                <Badge key={t} variant="secondary" className="text-[0.7rem]">
                  <Tag className="mr-1 h-3 w-3" /> {t}
                </Badge>
              ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground pt-2 border-t border-border/60">
          {item.author && (
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" /> {dict.author}: {item.author}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {formatRelativeTime(item.createdAt, dict)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> {item.views} {dict.views}
          </span>
          <span className="inline-flex items-center gap-1">
            <Languages className="h-3.5 w-3.5" /> {dict.primaryLang}: {item.language}
          </span>
          {item.submittedBy && (
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" /> {dict.submittedBy}: {item.submittedBy}
            </span>
          )}
        </div>

        {/* Actions */}
        <DialogFooter className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button
            onClick={handleLike}
            variant={liked ? 'default' : 'outline'}
            className={
              liked
                ? 'bg-rose-500 hover:bg-rose-600 text-white border-0 sm:mr-auto'
                : 'sm:mr-auto'
            }
          >
            <Heart className={`mr-2 h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            {liked ? dict.blessed : dict.bless} · {likeCount}
          </Button>

          {isAdmin && (
            <>
              {isPending && (
                <>
                  <Button
                    onClick={() => {
                      onApprove(item)
                      onOpenChange(false)
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                  >
                    <Check className="mr-2 h-4 w-4" /> {dict.approveButton}
                  </Button>
                  <Button
                    onClick={() => {
                      onReject(item)
                      onOpenChange(false)
                    }}
                    variant="outline"
                    className="text-rose-600 border-rose-300 hover:bg-rose-50"
                  >
                    <X className="mr-2 h-4 w-4" /> {dict.rejectButton}
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => onEdit(item)}>
                <Pencil className="mr-2 h-4 w-4" /> {dict.editButton}
              </Button>
              <Button variant="outline" onClick={handleDelete} className="text-rose-600 border-rose-300 hover:bg-rose-50">
                <Trash2 className="mr-2 h-4 w-4" /> {dict.remove}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// PendingDialog — list of pending items for admin
// ============================================================================
function PendingDialog({
  open,
  onOpenChange,
  pending,
  onOpenDetail,
  onApprove,
  onReject,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  pending: ContentItem[]
  onOpenDetail: (item: ContentItem) => void
  onApprove: (item: ContentItem) => void
  onReject: (item: ContentItem) => void
}) {
  const { dict } = useLanguage()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-rose-500" /> {dict.pendingContent}
          </DialogTitle>
          <DialogDescription>{dict.awaitingApproval}</DialogDescription>
        </DialogHeader>
        {pending.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            <Check className="mx-auto h-8 w-8 mb-2 text-emerald-500" />
            No pending items.
          </div>
        ) : (
          <ul className="space-y-2">
            {pending.map((item) => {
              const category = getCategoryName(item.category)
              return (
                <li
                  key={item.id}
                  className="rounded-xl border border-amber-200/40 dark:border-amber-900/30 p-3 flex items-start gap-3"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[0.65rem] font-bold font-serif">
                    {category?.icon ?? 'OM'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => {
                        onOpenDetail(item)
                        onOpenChange(false)
                      }}
                      className="text-left"
                    >
                      <p className="font-medium text-sm truncate hover:text-amber-700">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {item.description}
                      </p>
                      <p className="text-[0.65rem] text-muted-foreground mt-1">
                        {dict.submittedBy}: {item.submittedBy || '—'} ·{' '}
                        {formatRelativeTime(item.createdAt, dict)}
                      </p>
                    </button>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <Button
                      size="sm"
                      className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => onApprove(item)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs text-rose-600 border-rose-300"
                      onClick={() => onReject(item)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// Footer
// ============================================================================
function Footer() {
  const { dict } = useLanguage()
  return (
    <footer className="mt-auto border-t border-amber-200/40 dark:border-amber-900/30 bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                <OmSymbol className="h-4 w-4" />
              </span>
              <span className="font-serif font-bold">Sanatan Setu</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {dict.footerDescription}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-3">{dict.sacredStreams}</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.name}>
                  <Link
                    href={`/?category=${encodeURIComponent(c.name)}`}
                    className="hover:text-amber-700 dark:hover:text-amber-300"
                  >
                    <span className="font-serif mr-1">{c.sanskrit}</span> · {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-3">{dict.contribute}</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <a href="#library" className="hover:text-amber-700 dark:hover:text-amber-300">
                  {dict.uploadContent}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-amber-700 dark:hover:text-amber-300">
                  {dict.suggestCategory}
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-amber-700 dark:hover:text-amber-300">
                  {dict.aboutSanatanSetu}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[0.7rem] text-muted-foreground">
            {dict.footerCopyright.replace('{year}', String(new Date().getFullYear()))}
          </p>
          <p className="text-[0.7rem] text-muted-foreground inline-flex items-center gap-1">
            <DiyaIcon className="h-3.5 w-3.5 text-amber-500" /> {dict.madeWithDevotion}
          </p>
        </div>
      </div>
    </footer>
  )
}

// ============================================================================
// HomeApp — the orchestrator
// ============================================================================
export function HomeApp({
  initialItems,
  initialStats,
}: {
  initialItems: ContentItem[]
  initialStats: Stats
}) {
  const { lang, dict } = useLanguage()
  const { isAdmin, authedFetch } = useAdmin()

  // Items & stats — hydrated from SSR on first render, refetched on filter change.
  const [items, setItems] = React.useState<ContentItem[]>(initialItems)
  const [stats, setStats] = React.useState<Stats>(initialStats)
  const [loading, setLoading] = React.useState(false)

  // Filters
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState<string | null>(null)
  const [type, setType] = React.useState<string | null>(null)
  const [sort, setSort] = React.useState<SortOption>('newest')

  // Dialogs
  const [uploadOpen, setUploadOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<ContentItem | null>(null)
  const [detailItem, setDetailItem] = React.useState<ContentItem | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [pendingOpen, setPendingOpen] = React.useState(false)

  // Admin pending
  const [pending, setPending] = React.useState<ContentItem[]>([])
  const [pendingCount, setPendingCount] = React.useState(0)

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = React.useState('')
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  // Refetch when filters change
  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (category) params.set('category', category)
    if (type) params.set('type', type)
    params.set('sort', sort)
    const url = `/api/content?${params.toString()}`
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (Array.isArray(data.items)) setItems(data.items as ContentItem[])
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedSearch, category, type, sort])

  // Fetch pending count when admin state changes
  const refreshPending = React.useCallback(async () => {
    if (!isAdmin) {
      setPending([])
      setPendingCount(0)
      return
    }
    try {
      const res = await authedFetch('/api/pending')
      if (!res.ok) return
      const data = await res.json()
      setPending(data.items ?? [])
      setPendingCount(data.count ?? 0)
    } catch {
      // ignore
    }
  }, [isAdmin, authedFetch])

  React.useEffect(() => {
    refreshPending()
  }, [refreshPending])

  // Listen for the header's "open pending" event
  React.useEffect(() => {
    const handler = () => {
      if (isAdmin) setPendingOpen(true)
    }
    window.addEventListener('ss-open-pending', handler)
    return () => window.removeEventListener('ss-open-pending', handler)
  }, [isAdmin])

  // Refresh stats after content mutations
  const refreshStats = React.useCallback(async () => {
    try {
      const res = await fetch('/api/stats')
      if (!res.ok) return
      const data = await res.json()
      setStats(data)
    } catch {
      // ignore
    }
  }, [])

  // Handlers
  const handleCreated = React.useCallback(
    (item: ContentItem) => {
      if (item.status === 'published') {
        setItems((prev) => [item, ...prev])
        refreshStats()
      } else {
        // Pending — only show in admin queue
        refreshPending()
      }
    },
    [refreshStats, refreshPending]
  )

  const handleEdited = React.useCallback(
    (item: ContentItem) => {
      setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)))
      if (detailItem?.id === item.id) setDetailItem(item)
      refreshStats()
      refreshPending()
    },
    [detailItem, refreshStats, refreshPending]
  )

  const handleDeleted = React.useCallback(
    (item: ContentItem) => {
      setItems((prev) => prev.filter((i) => i.id !== item.id))
      refreshStats()
      refreshPending()
    },
    [refreshStats, refreshPending]
  )

  const handleLike = React.useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, likes: i.likes + 1 } : i))
    )
  }, [])

  const handleApprove = React.useCallback(
    async (item: ContentItem) => {
      try {
        const res = await authedFetch(`/api/content/${item.id}/approve`, {
          method: 'POST',
        })
        if (!res.ok) throw new Error()
        toast.success(dict.approved)
        setPending((prev) => prev.filter((i) => i.id !== item.id))
        setPendingCount((c) => Math.max(0, c - 1))
        // Add to main list if it matches current filters
        const approvedItem = { ...item, status: 'published' }
        setItems((prev) => [approvedItem, ...prev])
        refreshStats()
      } catch {
        toast.error(dict.updateFailed)
      }
    },
    [authedFetch, dict, refreshStats]
  )

  const handleReject = React.useCallback(
    async (item: ContentItem) => {
      try {
        const res = await authedFetch(`/api/content/${item.id}/reject`, {
          method: 'POST',
        })
        if (!res.ok) throw new Error()
        toast.success(dict.rejected)
        setPending((prev) => prev.filter((i) => i.id !== item.id))
        setPendingCount((c) => Math.max(0, c - 1))
      } catch {
        toast.error(dict.updateFailed)
      }
    },
    [authedFetch, dict]
  )

  const openUpload = React.useCallback(() => {
    setEditing(null)
    setUploadOpen(true)
  }, [])

  const openEdit = React.useCallback((item: ContentItem) => {
    setEditing(item)
    setUploadOpen(true)
    setDetailOpen(false)
  }, [])

  const openDetail = React.useCallback((item: ContentItem) => {
    setDetailItem(item)
    setDetailOpen(true)
  }, [])

  // Read ?category= from URL on mount (used by footer links)
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const cat = params.get('category')
    if (cat) setCategory(cat)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        onOpenUpload={openUpload}
        search={search}
        setSearch={setSearch}
        pendingCount={pendingCount}
      />

      <main className="flex-1">
        <Hero
          stats={stats}
          onOpenUpload={openUpload}
          onBrowse={() => {
            document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })
          }}
        />

        <QuoteBanner />

        <CategorySection
          stats={stats}
          onSelect={(cat) => {
            setCategory(cat)
            document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })
          }}
        />

        <LibrarySection
          items={items}
          loading={loading}
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          type={type}
          setType={setType}
          sort={sort}
          setSort={setSort}
        />
      </main>

      <Footer />

      {/* Floating overlays */}
      <FloatingAudioIndicator />

      {/* Dialogs */}
      <UploadDialog
        open={uploadOpen}
        onOpenChange={(v) => {
          setUploadOpen(v)
          if (!v) setEditing(null)
        }}
        editing={editing}
        onCreated={handleCreated}
        onEdited={handleEdited}
      />

      <DetailDialog
        item={detailItem}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={openEdit}
        onDelete={handleDeleted}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <PendingDialog
        open={pendingOpen}
        onOpenChange={setPendingOpen}
        pending={pending}
        onOpenDetail={openDetail}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}
