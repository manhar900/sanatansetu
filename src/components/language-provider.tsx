'use client'

import * as React from 'react'
import {
  LANGUAGES,
  DEFAULT_LANGUAGE,
  getDict,
  getLanguage,
  type LanguageCode,
  type Dict,
} from '@/lib/i18n'

type LanguageContextValue = {
  lang: LanguageCode
  setLang: (code: LanguageCode) => void
  dict: Dict
  direction: 'ltr' | 'rtl'
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'sanatan-setu-lang'

function detectBrowserLang(): LanguageCode {
  if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE
  const nav = navigator.language?.toLowerCase() ?? ''
  const prefix = nav.split('-')[0]
  const match = LANGUAGES.find((l) => l.code === prefix)
  return match?.code ?? DEFAULT_LANGUAGE
}

function loadStoredLang(): LanguageCode | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const found = LANGUAGES.find((l) => l.code === stored)
    return found?.code ?? null
  } catch {
    return null
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<LanguageCode>(DEFAULT_LANGUAGE)

  // On mount: load from localStorage or detect browser language.
  React.useEffect(() => {
    const stored = loadStoredLang()
    setLangState(stored ?? detectBrowserLang())
  }, [])

  // Keep <html lang> and dir attributes in sync.
  React.useEffect(() => {
    if (typeof document === 'undefined') return
    const language = getLanguage(lang)
    document.documentElement.lang = lang
    document.documentElement.dir = language.direction
  }, [lang])

  const setLang = React.useCallback((code: LanguageCode) => {
    setLangState(code)
    try {
      window.localStorage.setItem(STORAGE_KEY, code)
    } catch {
      // ignore storage failures
    }
  }, [])

  const value = React.useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      dict: getDict(lang),
      direction: getLanguage(lang).direction,
    }),
    [lang, setLang]
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = React.useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}
