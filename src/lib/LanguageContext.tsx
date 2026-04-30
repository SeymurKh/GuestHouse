'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, translations, Translations } from '@/lib/i18n'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize with saved language or default
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('guesthouse-lang') as Language | null
      if (saved && ['ru', 'az', 'en'].includes(saved)) {
        return saved
      }
    }
    return 'ru'
  })

  // Sync with localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('guesthouse-lang') as Language | null
    if (saved && ['ru', 'az', 'en'].includes(saved) && saved !== lang) {
      setLangState(saved)
    }
  }, [])

  // Save language to localStorage
  const setLang = (newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem('guesthouse-lang', newLang)
  }

  const t = translations[lang]

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
