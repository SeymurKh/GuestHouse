'use client'

import { Mountain } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2">
          <Mountain className="w-5 h-5" />
          <span className="font-semibold">Guest House Gabala</span>
        </div>
      </div>
    </footer>
  )
}
