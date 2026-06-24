'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Upload, Sun, Moon, Heart, Eye, Trash2, X, Sparkles,
  BookOpen, AudioLines, Video, Link as LinkIcon, Image as ImageIcon,
  FileText, ChevronRight, Calendar, User, Globe, Tag, Flame, Crown,
  TrendingUp, Clock, ArrowUpRight, Quote, Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { OmSymbol, LotusIcon, DiyaIcon, KalashIcon } from '@/components/sacred-icons'
import { CATEGORIES, LANGUAGES, CONTENT_TYPES, type ContentType } from '@/lib/categories'

// ===================== Types =====================
type ContentItem = {
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
  views: number
  likes: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

// ===================== Constants =====================
const SORTS = [
  { value: 'newest', label: 'Newest First', icon: Clock },
  { value: 'oldest', label: 'Oldest First', icon: Clock },
  { value: 'popular', label: 'Most Viewed', icon: Eye },
  { value: 'liked', label: 'Most Liked', icon: Heart },
]

const QUOTES = [
  { text: 'सत्यमेव जयते', trans: 'Truth alone triumphs — Mundaka Upanishad' },
  { text: 'वसुधैव कुटुम्बकम्', trans: 'The whole world is one family — Maha Upanishad' },
  { text: 'अहं ब्रह्मास्मि', trans: 'I am Brahman — Brihadaranyaka Upanishad' },
  { text: 'तत्त्वमसि', trans: 'Thou art that — Chandogya Upanishad' },
]

// ===================== Main Component =====================
export default function Home() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [items, setItems] = React.useState<ContentItem[]>([])
  const [stats, setStats] = React.useState<{ total: number; categories: { name: string; count: number }[] }>({
    total: 0,
    categories: [],
  })
  const [loading, setLoading] = React.useState(true)

  // filters
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState('All')
  const [type, setType] = React.useState('All')
  const [sort, setSort] = React.useState('newest')

  // modals
  const [uploadOpen, setUploadOpen] = React.useState(false)
  const [activeItem, setActiveItem] = React.useState<ContentItem | null>(null)

  React.useEffect(() => setMounted(true), [])

  // fetch content
  const fetchContent = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (category !== 'All') params.set('category', category)
      if (type !== 'All') params.set('type', type)
      params.set('sort', sort)
      const res = await fetch(`/api/content?${params.toString()}`)
      const json = await res.json()
      setItems(json.items || [])
    } catch {
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }, [search, category, type, sort])

  React.useEffect(() => {
    const t = setTimeout(fetchContent, search ? 350 : 0)
    return () => clearTimeout(t)
  }, [fetchContent, search])

  const fetchStats = React.useCallback(async () => {
    try {
      const res = await fetch('/api/stats')
      const json = await res.json()
      setStats(json)
    } catch {}
  }, [])

  React.useEffect(() => {
    fetchContent()
    fetchStats()
  }, [fetchContent, fetchStats])

  const handleCreated = async () => {
    setUploadOpen(false)
    await Promise.all([fetchContent(), fetchStats()])
    toast.success('Content uploaded successfully 🙏')
  }

  const handleDeleted = async (id: string) => {
    try {
      await fetch(`/api/content/${id}`, { method: 'DELETE' })
      setActiveItem(null)
      await Promise.all([fetchContent(), fetchStats()])
      toast.success('Content removed')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleLike = async (id: string) => {
    try {
      const res = await fetch(`/api/content/${id}/like`, { method: 'POST' })
      const json = await res.json()
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, likes: json.likes } : it))
      )
      if (activeItem?.id === id) {
        setActiveItem({ ...activeItem, likes: json.likes })
      }
      toast.success('Blessed 🙏')
    } catch {
      toast.error('Failed to like')
    }
  }

  const quote = React.useMemo(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
    []
  )

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header
        onUpload={() => setUploadOpen(true)}
        onSearch={setSearch}
        theme={mounted ? theme : undefined}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        totalCount={stats.total}
      />

      <main className="flex-1">
        <Hero
          totalCount={stats.total}
          categoryCount={stats.categories.length || CATEGORIES.length}
          onUpload={() => setUploadOpen(true)}
          onBrowse={() => {
            document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })
          }}
        />

        <CategorySection
          categories={CATEGORIES}
          counts={Object.fromEntries(stats.categories.map((c) => [c.name, c.count]))}
          onSelect={(cat) => {
            setCategory(cat)
            document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })
          }}
        />

        <LibrarySection
          items={items}
          loading={loading}
          search={search}
          category={category}
          type={type}
          sort={sort}
          onSearch={setSearch}
          onCategory={setCategory}
          onType={setType}
          onSort={setSort}
          onSelect={setActiveItem}
          onLike={handleLike}
        />

        <QuoteBanner quote={quote} />
      </main>

      <Footer onUpload={() => setUploadOpen(true)} />

      {/* Upload Dialog */}
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onCreated={handleCreated}
      />

      {/* Detail Dialog */}
      <DetailDialog
        item={activeItem}
        onOpenChange={(open) => !open && setActiveItem(null)}
        onLike={() => activeItem && handleLike(activeItem.id)}
        onDelete={() => activeItem && handleDeleted(activeItem.id)}
      />
    </div>
  )
}

// ===================== Header =====================
function Header({
  onUpload, onSearch, theme, onToggleTheme, totalCount,
}: {
  onUpload: () => void
  onSearch: (s: string) => void
  theme?: string
  onToggleTheme: () => void
  totalCount: number
}) {
  const [mobileSearch, setMobileSearch] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-saffron/20 bg-background/85 backdrop-blur-xl">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-3 sm:gap-6">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-saffron/30 rounded-full blur-md group-hover:bg-saffron/50 transition" />
              <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-saffron via-amber-500 to-maroon flex items-center justify-center text-white shadow-md">
                <OmSymbol size={22} className="text-white" strokeWidth={2.6} />
              </div>
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-bold text-base tracking-tight text-foreground">
                Sanatan Setu
              </span>
              <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
                Bridge to Sanatan Dharma
              </span>
            </div>
          </a>

          {/* Search (desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-saffron transition" />
              <Input
                placeholder="Search mantras, scriptures, bhajans…"
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 pr-3 h-10 bg-muted/60 border-saffron/15 focus-visible:border-saffron/50 focus-visible:ring-saffron/20"
              />
            </div>
          </div>

          <div className="flex-1 md:hidden" />

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="hidden lg:flex border-saffron/30 text-saffron bg-saffron/5">
              <Sparkles className="h-3 w-3 mr-1" />
              {totalCount} sacred items
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="text-foreground hover:bg-saffron/10"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSearch(!mobileSearch)}
              aria-label="Search"
              className="md:hidden text-foreground hover:bg-saffron/10"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              onClick={onUpload}
              className="bg-gradient-to-r from-saffron to-maroon hover:from-saffron/90 hover:to-maroon/90 text-white shadow-sm hover:shadow-md transition-all"
            >
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <AnimatePresence>
          {mobileSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden pb-3"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search…"
                  onChange={(e) => onSearch(e.target.value)}
                  className="pl-10 bg-muted/60 border-saffron/15"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

// ===================== Hero =====================
function Hero({
  totalCount, categoryCount, onUpload, onBrowse,
}: {
  totalCount: number
  categoryCount: number
  onUpload: () => void
  onBrowse: () => void
}) {
  return (
    <section className="relative overflow-hidden bg-pattern-sacred">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-saffron/15 blur-3xl" />
        <div className="absolute top-40 -left-20 h-80 w-80 rounded-full bg-maroon/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      </div>

      {/* Floating Om symbols */}
      <motion.div
        className="absolute top-12 left-[8%] text-saffron/15 hidden lg:block"
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <OmSymbol size={64} strokeWidth={1.8} />
      </motion.div>
      <motion.div
        className="absolute top-32 right-[10%] text-maroon/15 hidden lg:block"
        animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <LotusIcon size={80} strokeWidth={1.5} />
      </motion.div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 relative">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-saffron/40 rounded-full blur-2xl animate-pulse" />
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-saffron via-amber-500 to-maroon flex items-center justify-center text-white shadow-xl">
                <OmSymbol size={48} className="text-white" strokeWidth={2.4} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mb-5"
          >
            <Badge className="bg-saffron/15 text-saffron border border-saffron/30 hover:bg-saffron/20 font-medium">
              <DiyaIcon size={14} className="mr-1.5" />
              ॥ लोकाः समस्ताः सुखिनो भवन्तु ॥
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
          >
            <span className="text-gradient-saffron">Sanatan Setu</span>
            <br />
            <span className="text-foreground text-3xl sm:text-4xl lg:text-5xl">
              A Sacred Library of Hindu Dharma
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Upload, preserve, and explore the eternal wisdom of Hinduism — the Vedas, Upanishads,
            Bhagavad Gita, Ramayana, mantras, bhajans, and the teachings of saints.
            A digital bridge to Sanatan Dharma for seekers everywhere.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              size="lg"
              onClick={onUpload}
              className="bg-gradient-to-r from-saffron to-maroon hover:from-saffron/90 hover:to-maroon/90 text-white shadow-lg shadow-saffron/20 hover:shadow-xl hover:shadow-saffron/30 transition-all h-12 px-7"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Sacred Content
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onBrowse}
              className="h-12 px-7 border-saffron/30 text-foreground hover:bg-saffron/5 hover:border-saffron/50"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Explore Library
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-12 grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto"
          >
            <Stat value={totalCount} label="Sacred Items" />
            <Stat value={categoryCount} label="Categories" />
            <Stat value="∞" label="Eternal Wisdom" />
          </motion.div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-saffron/50 to-transparent" />
    </section>
  )
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-bold text-gradient-saffron">{value}</div>
      <div className="text-xs sm:text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  )
}

// ===================== Category Section =====================
function CategorySection({
  categories, counts, onSelect,
}: {
  categories: typeof CATEGORIES
  counts: Record<string, number>
  onSelect: (cat: string) => void
}) {
  return (
    <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      <div className="text-center mb-10">
        <Badge variant="outline" className="border-saffron/30 text-saffron bg-saffron/5 mb-3">
          <Crown className="h-3 w-3 mr-1" />
          Twelve Sacred Streams
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Browse by Category
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          From the eternal Vedas to the devotional bhajans of saints — explore the
          many streams of Sanatan Dharma.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            whileHover={{ y: -4 }}
            onClick={() => onSelect(cat.name)}
            className={`group text-left rounded-2xl p-5 bg-gradient-to-br ${cat.accent} border border-saffron/15 hover:border-saffron/40 transition-all relative overflow-hidden card-glow`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-11 w-11 rounded-xl bg-white/70 dark:bg-black/30 backdrop-blur flex items-center justify-center font-bold text-xs tracking-wider text-maroon shadow-sm">
                {cat.icon}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-saffron group-hover:translate-x-1 transition" />
            </div>
            <h3 className="font-bold text-foreground text-base">{cat.name}</h3>
            <div className="font-devanagari text-sm text-maroon/80 mt-0.5">{cat.sanskrit}</div>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {cat.description}
            </p>
            <div className="mt-3 text-xs text-saffron font-medium">
              {counts[cat.name] || 0} {counts[cat.name] === 1 ? 'item' : 'items'}
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  )
}

// ===================== Library Section =====================
function LibrarySection({
  items, loading, search, category, type, sort,
  onSearch, onCategory, onType, onSort, onSelect, onLike,
}: {
  items: ContentItem[]
  loading: boolean
  search: string
  category: string
  type: string
  sort: string
  onSearch: (s: string) => void
  onCategory: (c: string) => void
  onType: (t: string) => void
  onSort: (s: string) => void
  onSelect: (item: ContentItem) => void
  onLike: (id: string) => void
}) {
  const sortObj = SORTS.find((s) => s.value === sort)!

  return (
    <section id="library" className="bg-muted/30 border-y border-saffron/15">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="flex flex-col gap-2 mb-8">
          <Badge variant="outline" className="border-saffron/30 text-saffron bg-saffron/5 w-fit">
            <BookOpen className="h-3 w-3 mr-1" />
            The Library
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Sacred Content Library
          </h2>
          <p className="text-muted-foreground">
            Browse all uploaded content — mantras, scriptures, bhajans, and more.
          </p>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Search row */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search by title, author, tags, or text…"
              className="pl-10 pr-10 h-11 bg-background border-saffron/15 focus-visible:border-saffron/50 focus-visible:ring-saffron/20"
            />
            {search && (
              <button
                onClick={() => onSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Pills + sorts */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <FilterPill active={category === 'All'} onClick={() => onCategory('All')}>
                All
              </FilterPill>
              {CATEGORIES.slice(0, 8).map((c) => (
                <FilterPill
                  key={c.name}
                  active={category === c.name}
                  onClick={() => onCategory(c.name)}
                >
                  {c.name}
                </FilterPill>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Select value={type} onValueChange={onType}>
                <SelectTrigger className="w-[150px] h-9 bg-background border-saffron/15">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  {CONTENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={onSort}>
                <SelectTrigger className="w-[160px] h-9 bg-background border-saffron/15">
                  <sortObj.icon className="h-3.5 w-3.5 mr-1.5 text-saffron" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  {SORTS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-10 w-10 text-saffron animate-spin mb-4" />
            <p className="text-muted-foreground">Loading sacred content…</p>
          </div>
        ) : items.length === 0 ? (
          <EmptyState search={search} />
        ) : (
          <>
            <div className="text-sm text-muted-foreground mb-5">
              Showing <span className="font-semibold text-foreground">{items.length}</span>{' '}
              {items.length === 1 ? 'item' : 'items'}
              {category !== 'All' && (
                <>
                  {' '}in <span className="text-saffron font-medium">{category}</span>
                </>
              )}
              {type !== 'All' && (
                <>
                  {' '}of type <span className="text-saffron font-medium">{type}</span>
                </>
              )}
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    onClick={() => onSelect(item)}
                    onLike={() => onLike(item.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}

function FilterPill({
  active, onClick, children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 h-8 rounded-full text-xs font-medium transition-all border ${
        active
          ? 'bg-gradient-to-r from-saffron to-maroon text-white border-transparent shadow-sm'
          : 'bg-background text-muted-foreground border-saffron/20 hover:border-saffron/50 hover:text-saffron'
      }`}
    >
      {children}
    </button>
  )
}

function EmptyState({ search }: { search: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-saffron/20 blur-2xl rounded-full" />
        <div className="relative h-20 w-20 rounded-full bg-saffron/10 flex items-center justify-center text-saffron">
          <BookOpen className="h-9 w-9" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-foreground">
        {search ? 'No matches found' : 'The library awaits'}
      </h3>
      <p className="mt-2 text-muted-foreground max-w-md">
        {search
          ? `No content matches "${search}". Try different keywords or browse all categories.`
          : 'Be the first to upload sacred content to this growing library of Sanatan Dharma.'}
      </p>
    </div>
  )
}

// ===================== Content Card =====================
function ContentCard({
  item, onClick, onLike,
}: {
  item: ContentItem
  onClick: () => void
  onLike: () => void
}) {
  const cat = CATEGORIES.find((c) => c.name === item.category)
  const typeMeta = CONTENT_TYPES.find((t) => t.value === item.type)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className="group cursor-pointer rounded-2xl bg-card border border-saffron/15 hover:border-saffron/40 overflow-hidden shadow-sm hover:shadow-xl transition-all card-glow relative flex flex-col"
    >
      {/* Top stripe with category color */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${cat?.accent || 'from-saffron to-maroon'}`} />

      {/* Image / Decoration */}
      {item.imageUrl ? (
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      ) : (
        <div className={`aspect-[16/9] relative overflow-hidden bg-gradient-to-br ${cat?.accent || 'from-saffron/20 to-maroon/20'}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="text-saffron/30 dark:text-saffron/40"
            >
              {item.type === 'audio' ? (
                <AudioLines size={64} strokeWidth={1.2} />
              ) : item.type === 'video' ? (
                <Video size={64} strokeWidth={1.2} />
              ) : item.type === 'image' ? (
                <ImageIcon size={64} strokeWidth={1.2} />
              ) : item.type === 'link' ? (
                <LinkIcon size={64} strokeWidth={1.2} />
              ) : (
                <OmSymbol size={72} strokeWidth={1.4} />
              )}
            </motion.div>
          </div>
          <div className="absolute top-3 left-3">
            <div className="h-9 w-9 rounded-lg bg-white/70 dark:bg-black/30 backdrop-blur flex items-center justify-center font-bold text-[10px] tracking-wider text-maroon">
              {cat?.icon || 'OM'}
            </div>
          </div>
          {item.featured && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-gold/90 text-maroon border-0 hover:bg-gold">
                <Crown className="h-3 w-3 mr-1" /> Featured
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="border-saffron/30 text-saffron bg-saffron/5 text-[10px] font-medium">
            {item.category}
          </Badge>
          <Badge variant="secondary" className="text-[10px] gap-1">
            <TypeGlyph type={item.type} className="h-2.5 w-2.5" />
            {typeMeta?.label || item.type}
          </Badge>
        </div>

        <h3 className="font-bold text-foreground text-lg leading-snug line-clamp-2 group-hover:text-saffron transition">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
          {item.description}
        </p>

        {/* Tags */}
        {item.tags && (
          <div className="mt-3 flex flex-wrap gap-1">
            {item.tags.split(',').slice(0, 3).map((t, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                #{t.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-saffron/10 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {item.views}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(item.createdAt)}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onLike()
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-saffron/10 hover:text-saffron transition text-foreground"
            aria-label="Like"
          >
            <Heart className="h-3.5 w-3.5" />
            {item.likes}
          </button>
        </div>
      </div>
    </motion.article>
  )
}

const TYPE_ICONS: Record<ContentType, React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>> = {
  text: FileText,
  image: ImageIcon,
  audio: AudioLines,
  video: Video,
  link: LinkIcon,
}

function TypeGlyph({ type, className }: { type: string; className?: string }) {
  const Icon = TYPE_ICONS[type as ContentType] || FileText
  return <Icon className={className} />
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = (now.getTime() - d.getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ===================== Quote Banner =====================
function QuoteBanner({ quote }: { quote: { text: string; trans: string } }) {
  return (
    <section className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl bg-gradient-to-br from-saffron/10 via-cream to-maroon/10 dark:from-saffron/15 dark:via-card dark:to-maroon/15 border border-saffron/25 p-8 sm:p-12 overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-6 -mr-6 text-saffron/15">
          <OmSymbol size={180} strokeWidth={1} />
        </div>
        <Quote className="h-10 w-10 text-saffron mb-4" />
        <div className="font-devanagari text-3xl sm:text-4xl text-maroon font-bold mb-3">
          ॥ {quote.text} ॥
        </div>
        <p className="text-base sm:text-lg text-foreground/80 italic">
          {quote.trans}
        </p>
      </motion.div>
    </section>
  )
}

// ===================== Footer =====================
function Footer({ onUpload }: { onUpload: () => void }) {
  return (
    <footer className="mt-auto bg-gradient-to-b from-background to-muted/40 border-t border-saffron/20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-saffron via-amber-500 to-maroon flex items-center justify-center text-white shadow-md">
                <OmSymbol size={22} className="text-white" strokeWidth={2.6} />
              </div>
              <div>
                <div className="font-bold text-foreground">Sanatan Setu</div>
                <div className="text-[10px] text-muted-foreground tracking-wider uppercase">
                  Bridge to Sanatan Dharma
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              A digital library dedicated to preserving and sharing the eternal wisdom of Hinduism.
              Upload mantras, scriptures, bhajans, and teachings to share with seekers worldwide.
            </p>
            <div className="font-devanagari text-sm text-maroon/80 mt-3">
              ॥ लोकाः समस्ताः सुखिनो भवन्तु ॥
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Sacred Streams</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.name}>{c.name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Contribute</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button onClick={onUpload} className="hover:text-saffron transition text-left">
                  Upload Content
                </button>
              </li>
              <li>Browse Library</li>
              <li>Suggest a Category</li>
              <li>About Sanatan Setu</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-saffron/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sanatan Setu · A digital offering at the feet of Sanatan Dharma
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <DiyaIcon size={12} /> Made with devotion
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ===================== Upload Dialog =====================
function UploadDialog({
  open, onOpenChange, onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}) {
  const [submitting, setSubmitting] = React.useState(false)
  const [form, setForm] = React.useState({
    title: '',
    description: '',
    body: '',
    category: CATEGORIES[0].name,
    type: 'text' as ContentType,
    mediaUrl: '',
    imageUrl: '',
    author: '',
    language: 'Sanskrit',
    tags: '',
    featured: false,
  })

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and description are required')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error || 'Failed to upload')
      }
      setForm({
        title: '', description: '', body: '', category: CATEGORIES[0].name,
        type: 'text', mediaUrl: '', imageUrl: '', author: '',
        language: 'Sanskrit', tags: '', featured: false,
      })
      onCreated()
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scroll-sacred bg-background border-saffron/25">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-saffron to-maroon flex items-center justify-center text-white shadow-md">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl text-foreground">
                Upload Sacred Content
              </DialogTitle>
              <DialogDescription>
                Share mantras, scriptures, bhajans, or wisdom with the Sanatan Setu community.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-maroon">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g., Gayatri Mantra"
              className="border-saffron/20 focus-visible:border-saffron/50"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">
              Short Description <span className="text-maroon">*</span>
            </Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="A brief summary of this content…"
              rows={2}
              className="border-saffron/20 focus-visible:border-saffron/50 resize-none"
              required
            />
          </div>

          {/* Category + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Category</Label>
              <Select value={form.category} onValueChange={(v) => update('category', v)}>
                <SelectTrigger className="bg-background border-saffron/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name} · <span className="font-devanagari text-xs text-muted-foreground">{c.sanskrit}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Content Type</Label>
              <Select value={form.type} onValueChange={(v) => update('type', v as ContentType)}>
                <SelectTrigger className="bg-background border-saffron/20">
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

          {/* Conditional fields based on type */}
          {(form.type === 'text') && (
            <div className="space-y-1.5">
              <Label htmlFor="body" className="text-sm font-medium">
                Body / Full Content
              </Label>
              <Textarea
                id="body"
                value={form.body}
                onChange={(e) => update('body', e.target.value)}
                placeholder="Paste the mantra, verse, article, or commentary here. Line breaks will be preserved."
                rows={7}
                className="border-saffron/20 focus-visible:border-saffron/50 resize-y font-devanagari"
              />
              <p className="text-xs text-muted-foreground">
                Line breaks are preserved. Sanskrit, Awadhi, and all languages are welcome.
              </p>
            </div>
          )}

          {(form.type === 'image' || form.type === 'audio' || form.type === 'video' || form.type === 'link') && (
            <div className="space-y-1.5">
              <Label htmlFor="mediaUrl" className="text-sm font-medium">
                {form.type === 'link' ? 'External URL' : `${form.type.charAt(0).toUpperCase() + form.type.slice(1)} URL`}
              </Label>
              <Input
                id="mediaUrl"
                value={form.mediaUrl}
                onChange={(e) => update('mediaUrl', e.target.value)}
                placeholder={
                  form.type === 'image'
                    ? 'https://example.com/deity-image.jpg'
                    : form.type === 'audio'
                    ? 'https://example.com/chanting.mp3'
                    : form.type === 'video'
                    ? 'https://youtube.com/watch?v=…'
                    : 'https://…'
                }
                className="border-saffron/20 focus-visible:border-saffron/50"
              />
              <p className="text-xs text-muted-foreground">
                Paste a direct URL to the {form.type}. For YouTube, use the full video URL.
              </p>
            </div>
          )}

          {/* Optional: cover image URL */}
          <div className="space-y-1.5">
            <Label htmlFor="imageUrl" className="text-sm font-medium">
              Cover Image URL <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="imageUrl"
              value={form.imageUrl}
              onChange={(e) => update('imageUrl', e.target.value)}
              placeholder="https://example.com/cover.jpg"
              className="border-saffron/20 focus-visible:border-saffron/50"
            />
          </div>

          {/* Body always available as additional note for media */}
          {form.type !== 'text' && (
            <div className="space-y-1.5">
              <Label htmlFor="body" className="text-sm font-medium">
                Description / Lyrics / Notes <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="body"
                value={form.body}
                onChange={(e) => update('body', e.target.value)}
                placeholder="Add lyrics, explanation, or context…"
                rows={4}
                className="border-saffron/20 focus-visible:border-saffron/50 resize-y font-devanagari"
              />
            </div>
          )}

          {/* Author + Language */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="author" className="text-sm font-medium">
                Author / Source <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="author"
                value={form.author}
                onChange={(e) => update('author', e.target.value)}
                placeholder="e.g., Sage Valmiki"
                className="border-saffron/20 focus-visible:border-saffron/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Language</Label>
              <Select value={form.language} onValueChange={(v) => update('language', v)}>
                <SelectTrigger className="bg-background border-saffron/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label htmlFor="tags" className="text-sm font-medium">
              Tags <span className="text-muted-foreground font-normal">(comma-separated)</span>
            </Label>
            <Input
              id="tags"
              value={form.tags}
              onChange={(e) => update('tags', e.target.value)}
              placeholder="krishna, devotion, daily-chant"
              className="border-saffron/20 focus-visible:border-saffron/50"
            />
          </div>

          {/* Featured */}
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update('featured', e.target.checked)}
              className="h-4 w-4 rounded border-saffron/30 text-saffron focus:ring-saffron/30"
            />
            <span className="text-sm text-foreground group-hover:text-saffron transition flex items-center gap-1">
              <Crown className="h-3.5 w-3.5 text-gold" />
              Mark as featured content
            </span>
          </label>

          <DialogFooter className="gap-2 pt-2 border-t border-saffron/10">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-saffron to-maroon hover:from-saffron/90 hover:to-maroon/90 text-white shadow-md"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading…
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" /> Offer to Library
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ===================== Detail Dialog =====================
function DetailDialog({
  item, onOpenChange, onLike, onDelete,
}: {
  item: ContentItem | null
  onOpenChange: (open: boolean) => void
  onLike: () => void
  onDelete: () => void
}) {
  const cat = CATEGORIES.find((c) => c.name === item?.category)
  const typeMeta = CONTENT_TYPES.find((t) => t.value === item?.type)
  const [confirmDelete, setConfirmDelete] = React.useState(false)

  React.useEffect(() => {
    if (!item) setConfirmDelete(false)
  }, [item])

  // Fetch fresh item on open to bump views
  const [freshItem, setFreshItem] = React.useState<ContentItem | null>(null)
  React.useEffect(() => {
    if (!item) {
      setFreshItem(null)
      return
    }
    let active = true
    fetch(`/api/content/${item.id}`)
      .then((r) => r.json())
      .then((j) => {
        if (active && j.item) setFreshItem(j.item)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [item])

  const display = freshItem || item

  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto scroll-sacred bg-background border-saffron/25 p-0">
        {display && (
          <>
            {/* Header banner */}
            <div className={`relative h-32 bg-gradient-to-br ${cat?.accent || 'from-saffron/30 to-maroon/30'} overflow-hidden`}>
              <div className="absolute inset-0 flex items-center justify-center text-saffron/20 dark:text-saffron/30">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                >
                  <OmSymbol size={120} strokeWidth={1} />
                </motion.div>
              </div>
              <div className="absolute top-4 left-4">
                <div className="h-12 w-12 rounded-xl bg-white/80 dark:bg-black/40 backdrop-blur flex items-center justify-center font-bold text-xs tracking-wider text-maroon shadow-md">
                  {cat?.icon || 'OM'}
                </div>
              </div>
              {display.featured && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gold/90 text-maroon border-0 hover:bg-gold">
                    <Crown className="h-3 w-3 mr-1" /> Featured
                  </Badge>
                </div>
              )}
              <DialogClose asChild>
                <button
                  className="absolute bottom-4 right-4 h-9 w-9 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur hover:bg-white/90 flex items-center justify-center text-foreground"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogClose>
            </div>

            <div className="p-6 sm:p-8 -mt-2">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="border-saffron/30 text-saffron bg-saffron/5">
                  {display.category}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <TypeGlyph type={display.type} className="h-3 w-3" />
                  {typeMeta?.label || display.type}
                </Badge>
                <Badge variant="outline" className="border-gold/30 text-gold bg-gold/5">
                  <Globe className="h-3 w-3 mr-1" />
                  {display.language}
                </Badge>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                {display.title}
              </h2>
              <p className="mt-2 text-base text-muted-foreground italic leading-relaxed">
                {display.description}
              </p>

              {/* Author + meta */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                {display.author && (
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {display.author}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(display.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {display.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  {display.likes} likes
                </span>
              </div>

              {/* Media */}
              {display.type === 'image' && display.mediaUrl && (
                <div className="mt-5 rounded-xl overflow-hidden border border-saffron/15">
                  <img src={display.mediaUrl} alt={display.title} className="w-full" />
                </div>
              )}
              {display.type === 'audio' && display.mediaUrl && (
                <div className="mt-5 rounded-xl bg-muted/50 border border-saffron/15 p-4">
                  <audio controls className="w-full">
                    <source src={display.mediaUrl} />
                    Your browser does not support audio playback.
                  </audio>
                </div>
              )}
              {display.type === 'video' && display.mediaUrl && (
                <div className="mt-5 rounded-xl overflow-hidden border border-saffron/15 aspect-video">
                  {display.mediaUrl.includes('youtube.com') || display.mediaUrl.includes('youtu.be') ? (
                    <iframe
                      src={getYouTubeEmbed(display.mediaUrl)}
                      title={display.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video controls className="w-full h-full">
                      <source src={display.mediaUrl} />
                      Your browser does not support video playback.
                    </video>
                  )}
                </div>
              )}
              {display.type === 'link' && display.mediaUrl && (
                <a
                  href={display.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-saffron/15 hover:border-saffron/40 hover:bg-saffron/5 transition"
                >
                  <div className="h-10 w-10 rounded-lg bg-saffron/15 flex items-center justify-center text-saffron">
                    <LinkIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm">Open External Resource</div>
                    <div className="text-xs text-muted-foreground truncate">{display.mediaUrl}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-saffron" />
                </a>
              )}

              {/* Body */}
              {display.body && (
                <div className="mt-6 prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed font-devanagari text-[15px]">
                    {display.body}
                  </div>
                </div>
              )}

              {/* Tags */}
              {display.tags && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {display.tags.split(',').map((t, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-saffron/10 text-saffron border border-saffron/15">
                      <Tag className="h-3 w-3 inline mr-1" />
                      {t.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="mt-7 pt-5 border-t border-saffron/15 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={onLike}
                    className="bg-gradient-to-r from-saffron to-maroon hover:from-saffron/90 hover:to-maroon/90 text-white"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Bless ({display.likes})
                  </Button>
                </div>

                {confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Sure?</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={onDelete}
                    >
                      Yes, remove
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmDelete(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmDelete(true)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function getYouTubeEmbed(url: string): string {
  // Handle youtu.be/ID and youtube.com/watch?v=ID
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}
