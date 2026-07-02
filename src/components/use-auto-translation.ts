'use client'

import * as React from 'react'

// ----------------------------------------------------------------------------
// Auto-translation hook
//
// - Checks item.translations for pre-existing human translations first.
// - Falls back to the /api/translate endpoint (server-side z-ai-web-dev-sdk).
// - Uses a global in-memory cache so repeated translations don't re-hit the API.
// - Rate-limits requests to one at a time, 500ms apart, to be gentle on the
//   translation service and the user's bandwidth.
// ----------------------------------------------------------------------------

export type TranslatableItem = {
  id: string
  title?: string
  description?: string
  body?: string | null
  language?: string
  translations?: string | null
}

export type TranslationData = {
  title: string
  description: string
  body: string | null
}

type CacheEntry = {
  data: TranslationData
  isAutoTranslated: boolean
}

type CacheKey = string

// Module-level cache — survives across hook instances & component remounts.
const translationCache = new Map<CacheKey, CacheEntry>()

// Simple sequential queue: each request waits for the previous one + 500ms.
type QueueTask = () => Promise<void>
let queueRunning = false
const queue: QueueTask[] = []

function enqueue(task: QueueTask): Promise<void> {
  return new Promise((resolve, reject) => {
    const wrapped = async () => {
      try {
        await task()
        // Enforce a 500ms spacing between requests.
        await new Promise((r) => setTimeout(r, 500))
        resolve()
      } catch (e) {
        reject(e)
      }
    }
    queue.push(wrapped)
    if (!queueRunning) {
      queueRunning = true
      drainQueue()
    }
  })
}

async function drainQueue() {
  while (queue.length > 0) {
    const next = queue.shift()
    if (next) await next()
  }
  queueRunning = false
}

export function clearTranslationCache() {
  translationCache.clear()
}

function parseTranslations(raw: string | null | undefined): Record<string, any> | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') return parsed as Record<string, any>
  } catch {
    // ignore malformed JSON
  }
  return null
}

function makeCacheKey(itemId: string, targetLang: string, includeBody: boolean): CacheKey {
  return `${itemId}::${targetLang}::${includeBody ? 'b' : 'nb'}`
}

type UseAutoTranslationOptions = {
  includeBody?: boolean
}

export function useAutoTranslation(
  item: TranslatableItem | null | undefined,
  uiLang: string,
  options: UseAutoTranslationOptions = {}
): {
  data: TranslationData | null
  loading: boolean
  error: Error | null
  isAutoTranslated: boolean
} {
  const { includeBody = false } = options
  const [data, setData] = React.useState<TranslationData | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [isAutoTranslated, setIsAutoTranslated] = React.useState(false)

  React.useEffect(() => {
    if (!item || !uiLang) {
      setData(null)
      setLoading(false)
      setError(null)
      setIsAutoTranslated(false)
      return
    }

    // If the item's primary language already matches the requested UI language,
    // just return the original text — no translation needed.
    const itemLang = (item.language ?? '').toLowerCase()
    if (itemLang === uiLang.toLowerCase()) {
      setData({
        title: item.title ?? '',
        description: item.description ?? '',
        body: includeBody ? (item.body ?? null) : null,
      })
      setLoading(false)
      setError(null)
      setIsAutoTranslated(false)
      return
    }

    const cacheKey = makeCacheKey(item.id, uiLang, includeBody)
    const cached = translationCache.get(cacheKey)
    if (cached) {
      setData(cached.data)
      setIsAutoTranslated(cached.isAutoTranslated)
      setLoading(false)
      setError(null)
      return
    }

    // Check for a pre-existing human translation in item.translations.
    const translations = parseTranslations(item.translations)
    const langKey = uiLang.toLowerCase()
    if (translations && translations[langKey]) {
      const t = translations[langKey] as {
        title?: string
        description?: string
        body?: string
      }
      const built: TranslationData = {
        title: t.title ?? item.title ?? '',
        description: t.description ?? item.description ?? '',
        body: includeBody ? (t.body ?? item.body ?? null) : null,
      }
      translationCache.set(cacheKey, {
        data: built,
        isAutoTranslated: false,
      })
      setData(built)
      setIsAutoTranslated(false)
      setLoading(false)
      setError(null)
      return
    }

    // Fall back to the server-side auto-translation API.
    let cancelled = false
    setLoading(true)
    setError(null)

    enqueue(async () => {
      if (cancelled) return
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: item.title ?? '',
            description: item.description ?? '',
            body: includeBody ? (item.body ?? '') : '',
            sourceLang: item.language ?? 'English',
            targetLang: uiLang,
          }),
        })
        if (!res.ok) throw new Error('Translation request failed')
        const json = await res.json()
        const built: TranslationData = {
          title: json.title ?? item.title ?? '',
          description: json.description ?? item.description ?? '',
          body: includeBody ? (json.body ?? item.body ?? null) : null,
        }
        if (cancelled) return
        translationCache.set(cacheKey, {
          data: built,
          isAutoTranslated: true,
        })
        setData(built)
        setIsAutoTranslated(true)
        setLoading(false)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e : new Error(String(e)))
        setLoading(false)
      }
    }).catch((e) => {
      if (cancelled) return
      setError(e instanceof Error ? e : new Error(String(e)))
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [item, uiLang, includeBody])

  return { data, loading, error, isAutoTranslated }
}
