'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Minus } from 'lucide-react'

export function ScrollIndicator() {
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      
      setScrollProgress(progress)
      setIsAtBottom(progress > 0.95)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hide when near top
  if (scrollProgress < 0.02) {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-bounce">
        <div className="w-10 h-10 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          <ChevronDown className="w-6 h-6 text-primary" />
        </div>
      </div>
    )
  }

  // Show line/dash at bottom
  if (isAtBottom) {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <div className="w-10 h-10 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-foreground/20 transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Minus className="w-6 h-6 text-foreground" />
        </div>
      </div>
    )
  }

  // Show arrow pointing down (scrolling)
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-300">
      <div 
        className="w-10 h-10 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
        onClick={() => window.scrollTo({ top: window.innerHeight * Math.ceil(scrollProgress * 4 + 1), behavior: 'smooth' })}
      >
        <ChevronDown className="w-6 h-6 text-primary" />
      </div>
    </div>
  )
}
