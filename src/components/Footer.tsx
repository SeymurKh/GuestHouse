'use client'

import { Mountain } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Mountain className="w-6 h-6" />
            <span className="font-semibold">Guest House Gabala</span>
          </div>
          <p className="text-sm text-background/60">© 2024 Все права защищены. Азербайджан, Габала.</p>
        </div>
      </div>
    </footer>
  )
}
