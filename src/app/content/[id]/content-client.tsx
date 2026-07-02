'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Eye,
  Heart,
  User,
  Tag,
  Languages,
  Sparkles,
  AudioLines,
  Video,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OmSymbol } from '@/components/sacred-icons'
import { SmartImage } from '@/components/smart-image'
import { useLanguage } from '@/components/language-provider'
import { useAutoTranslation } from '@/components/use-auto-translation'
import { uiLangToContentLang, getLanguage, LANGUAGES, type LanguageCode } from '@/lib/i18n'
import { getCategoryName } from '@/lib/categories'
import { toast } from 'sonner'

type Item = {
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

function parseGallery(raw: string | null): { type: 'image' | 'video'; url: string; caption?: string }[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
  } catch {
    // ignore
  }
  return []
}

function parseTranslations(raw: string | null): Record<string, any> {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') return parsed
  } catch {
    // ignore
  }
  return {}
}

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  text: FileText,
  image: ImageIcon,
  audio: AudioLines,
  video: Video,
  link: LinkIcon,
}

export function ContentClient({ item }: { item: Item }) {
  const { lang, dict } = useLanguage()
  const targetContentLang = uiLangToContentLang(lang as LanguageCode)
  const { data: translated, loading, isAutoTranslated } = useAutoTranslation(
    item,
    targetContentLang,
    { includeBody: true }
  )

  const translations = parseTranslations(item.translations)
  const availableLangs = Object.keys(translations)
  const [activeLang, setActiveLang] = React.useState<string>(item.language)

  // Determine which translation to display.
  const showOriginal = activeLang === item.language
  const humanTranslation = showOriginal ? null : translations[activeLang.toLowerCase()]
  const autoTrans = translated && activeLang === targetContentLang ? translated : null

  const displayTitle =
    humanTranslation?.title ?? autoTrans?.title ?? item.title
  const displayDescription =
    humanTranslation?.description ?? autoTrans?.description ?? item.description
  const displayBody =
    humanTranslation?.body ?? autoTrans?.body ?? item.body

  const gallery = parseGallery(item.mediaGallery)
  const category = getCategoryName(item.category)
  const TypeIcon = TYPE_ICONS[item.type] ?? FileText

  const [liked, setLiked] = React.useState(false)
  const [likeCount, setLikeCount] = React.useState(item.likes)

  const handleLike = async () => {
    if (liked) return
    setLiked(true)
    setLikeCount((c) => c + 1)
    try {
      const res = await fetch(`/api/content/${item.id}/like`, { method: 'POST' })
      if (!res.ok) throw new Error()
    } catch {
      setLiked(false)
      setLikeCount((c) => c - 1)
      toast.error(dict.blessedFailed)
    }
  }

  const createdDate = new Date(item.createdAt)
  const langBtns = [item.language, ...availableLangs.filter((l) => l !== item.language.toLowerCase())]

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/30 via-background to-rose-50/20 dark:from-amber-950/10 dark:via-background dark:to-rose-950/10">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Library
          </Button>
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-amber-200/40 dark:border-amber-900/30 bg-card/80 backdrop-blur p-6 sm:p-10 shadow-sm"
        >
          {/* Category + type badge */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {category && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                <span className="mr-1">{category.sanskrit}</span> · {category.name}
              </Badge>
            )}
            <Badge variant="outline" className="capitalize">
              <TypeIcon className="mr-1 h-3 w-3" /> {item.type}
            </Badge>
            {item.featured && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">
                <Sparkles className="mr-1 h-3 w-3" /> {dict.featured}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-3">
            {displayTitle}
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed">
            {displayDescription}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-6 pb-6 border-b border-border/60">
            {item.author && (
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" /> {item.author}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {createdDate.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4" /> {item.views} {dict.views}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Languages className="h-4 w-4" /> {item.language}
            </span>
          </div>

          {/* Language toggle */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs uppercase tracking-wider text-muted-foreground mr-1">
              {dict.availableIn}:
            </span>
            {langBtns.map((l) => {
              const isActive = l === activeLang || l.toLowerCase() === activeLang.toLowerCase()
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
            {!availableLangs.map((l) => l.toLowerCase()).includes(targetContentLang.toLowerCase()) &&
              targetContentLang !== item.language && (
                <Button
                  size="sm"
                  variant={activeLang === targetContentLang ? 'default' : 'outline'}
                  onClick={() => setActiveLang(targetContentLang)}
                  className="h-7 text-xs"
                >
                  {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  <span className="ml-1">{targetContentLang}</span>
                </Button>
              )}
            {isAutoTranslated && activeLang === targetContentLang && (
              <Badge variant="secondary" className="text-[0.65rem]">
                <Sparkles className="mr-1 h-3 w-3" /> {dict.autoTranslated}
              </Badge>
            )}
          </div>

          {/* Cover image */}
          {item.imageUrl && (
            <div className="mb-6 overflow-hidden rounded-2xl">
              <SmartImage
                src={item.imageUrl}
                alt={displayTitle}
                className="w-full h-auto object-cover"
                containerClassName="w-full"
              />
            </div>
          )}

          {/* Media (audio/video/link) */}
          {item.mediaUrl && item.type === 'audio' && (
            <audio controls className="w-full mb-6" src={item.mediaUrl} />
          )}
          {item.mediaUrl && item.type === 'video' && (
            <div className="mb-6 aspect-video overflow-hidden rounded-2xl bg-black">
              <iframe
                src={getVideoEmbedUrl(item.mediaUrl)}
                className="w-full h-full"
                title={displayTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                frameBorder="0"
              />
            </div>
          )}
          {item.mediaUrl && item.type === 'link' && (
            <a href={item.mediaUrl} target="_blank" rel="noopener noreferrer" className="block mb-6">
              <Button variant="outline" className="w-full sm:w-auto">
                <ExternalLink className="mr-2 h-4 w-4" /> {dict.openExternal}
              </Button>
            </a>
          )}

          {/* Body */}
          {displayBody && (
            <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
              <pre className="whitespace-pre-wrap font-serif text-base leading-relaxed bg-transparent border-0 p-0">
                {displayBody}
              </pre>
            </div>
          )}

          {/* Gallery */}
          {gallery.length > 0 && (
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold text-foreground">Media Gallery</h2>
              {gallery.map((g, i) => (
                <div key={i} className="space-y-1.5">
                  {g.type === 'image' ? (
                    <div className="rounded-xl overflow-hidden border border-saffron/15">
                      <SmartImage
                        src={g.url}
                        alt={g.caption ?? displayTitle}
                        className="w-full"
                        containerClassName="w-full"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl overflow-hidden border border-saffron/15 aspect-video bg-black">
                      <iframe
                        src={getVideoEmbedUrl(g.url)}
                        className="w-full h-full"
                        title={g.caption ?? `Video ${i + 1}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                        frameBorder="0"
                      />
                    </div>
                  )}
                  {g.caption && (
                    <p className="text-xs text-muted-foreground italic px-1">{g.caption}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          {item.tags && (
            <div className="flex flex-wrap gap-2 mb-6">
              {item.tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
                .map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    <Tag className="mr-1 h-3 w-3" /> {t}
                  </Badge>
                ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleLike}
              variant={liked ? 'default' : 'outline'}
              className={liked ? 'bg-rose-500 hover:bg-rose-600 text-white' : ''}
            >
              <Heart className={`mr-2 h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              {liked ? dict.blessed : dict.bless} · {likeCount}
            </Button>
          </div>
        </motion.article>

        {/* Decorative footer */}
        <div className="flex justify-center mt-10 mb-6">
          <OmSymbol className="h-8 w-8 text-amber-500/50" />
        </div>
      </div>
    </main>
  )
}

// Convert various video URLs to embeddable format
function getVideoEmbedUrl(url: string): string {
  // YouTube: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/shorts/ID, youtube.com/embed/ID
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/)
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`
  }
  // Vimeo: vimeo.com/ID, player.vimeo.com/video/ID
  const vimeoMatch = url.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  // Loom: loom.com/share/ID
  const loomMatch = url.match(/loom\.com\/share\/([a-f0-9-]+)/)
  if (loomMatch) {
    return `https://www.loom.com/embed/${loomMatch[1]}`
  }
  // Direct video file — return as-is
  return url
}
