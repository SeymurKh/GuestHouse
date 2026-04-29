'use client'

import { Mountain } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

export function Footer() {
  const { t } = useLanguage()
  
  return (
    <footer className="relative z-10 bg-black/60 backdrop-blur-md py-4 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2">
          <Mountain className="w-5 h-5 text-primary" />
          <span className="font-semibold">Guest House Gabala</span>
        </div>
      </div>
    </footer>
  )
}
