'use client'

import { Button } from '@/components/ui/button'
import { Mountain, Phone, Menu, X, Settings } from 'lucide-react'

interface HeaderProps {
  phone: string
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  onAdminClick: () => void
}

export function Header({ phone, mobileMenuOpen, setMobileMenuOpen, onAdminClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <Mountain className="w-8 h-8 text-primary" />
          <span className="font-bold text-xl">Guest House Gabala</span>
        </a>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#rooms" className="text-muted-foreground hover:text-primary transition-colors">Домики</a>
          <a href="#gallery" className="text-muted-foreground hover:text-primary transition-colors">Галерея</a>
          <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Контакты</a>
        </nav>
        
        <div className="flex items-center gap-3">
          <Button asChild className="hidden sm:flex bg-primary hover:bg-primary/90">
            <a href={`tel:${phone}`}>
              <Phone className="w-4 h-4 mr-2" />
              Позвонить
            </a>
          </Button>
          <Button variant="ghost" size="icon" onClick={onAdminClick} className="hidden sm:flex">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b p-4">
          <nav className="flex flex-col gap-4">
            <a href="#rooms" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Домики</a>
            <a href="#gallery" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Галерея</a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Контакты</a>
            <Button asChild className="bg-primary hover:bg-primary/90 w-full">
              <a href={`tel:${phone}`}>
                <Phone className="w-4 h-4 mr-2" />
                Позвонить
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
