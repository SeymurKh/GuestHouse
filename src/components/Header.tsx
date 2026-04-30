'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'
import { useLanguage } from '@/lib/LanguageContext'
import { languages } from '@/lib/i18n'

interface HeaderProps {
  phone: string
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export function Header({ phone, mobileMenuOpen, setMobileMenuOpen }: HeaderProps) {
  const { lang, setLang, t } = useLanguage()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-8 h-8 rounded" />
          <span className="font-bold text-xl text-white">Guest House Ivanovka</span>
        </a>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#rooms" className="text-white/70 hover:text-white transition-colors">{t.nav.rooms}</a>
          <a href="#gallery" className="text-white/70 hover:text-white transition-colors">{t.nav.gallery}</a>
          <a href="#contact" className="text-white/70 hover:text-white transition-colors">{t.nav.contact}</a>
        </nav>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Flags */}
          <div className="flex items-center gap-1">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                title={l.name}
                className={`w-7 h-7 rounded flex items-center justify-center text-base transition-all ${
                  lang === l.code 
                    ? 'bg-primary/30 ring-1 ring-primary' 
                    : 'hover:bg-white/10'
                }`}
              >
                {l.flag}
              </button>
            ))}
          </div>

          <Button asChild className="hidden sm:flex gap-2 bg-[#25D366] hover:bg-[#20BD5A]">
            <a href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="w-5 h-5" />
              WhatsApp
            </a>
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
            <Button asChild className="gap-2 bg-[#25D366] hover:bg-[#20BD5A] w-full">
              <a href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="w-5 h-5" />
                WhatsApp
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
