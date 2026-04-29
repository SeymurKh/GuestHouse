'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mountain, Menu, X, Settings, Globe, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { languages, Language } from '@/lib/i18n'

interface HeaderProps {
  phone: string
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  onAdminClick: () => void
}

export function Header({ phone, mobileMenuOpen, setMobileMenuOpen, onAdminClick }: HeaderProps) {
  const { lang, setLang, t } = useLanguage()
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const langMenuRef = useRef<HTMLDivElement>(null)

  // Close language menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLang = languages.find(l => l.code === lang)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <Mountain className="w-8 h-8 text-primary" />
          <span className="font-bold text-xl text-white">Guest House Gabala</span>
        </a>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#rooms" className="text-white/70 hover:text-white transition-colors">{t.nav.rooms}</a>
          <a href="#gallery" className="text-white/70 hover:text-white transition-colors">{t.nav.gallery}</a>
          <a href="#contact" className="text-white/70 hover:text-white transition-colors">{t.nav.contact}</a>
        </nav>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white text-sm"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{currentLang?.flag}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {langMenuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-black/90 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden min-w-[140px]">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code)
                      setLangMenuOpen(false)
                    }}
                    className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                      lang === l.code 
                        ? 'bg-primary text-white' 
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button asChild className="hidden sm:flex bg-[#25D366] hover:bg-[#20BD5A]">
            <a href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
              <img src="/whatsapp-logo.png" alt="WhatsApp" className="w-5 h-5 mr-2" />
              WhatsApp
            </a>
          </Button>
          <Button variant="ghost" size="icon" onClick={onAdminClick} className="hidden sm:flex text-white hover:bg-white/10">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md border-b border-white/10 p-4">
          <nav className="flex flex-col gap-4">
            <a href="#rooms" className="text-white/70 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>{t.nav.rooms}</a>
            <a href="#gallery" className="text-white/70 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>{t.nav.gallery}</a>
            <a href="#contact" className="text-white/70 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>{t.nav.contact}</a>
            <Button asChild className="bg-[#25D366] hover:bg-[#20BD5A] w-full">
              <a href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                <img src="/whatsapp-logo.png" alt="WhatsApp" className="w-5 h-5 mr-2" />
                WhatsApp
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
