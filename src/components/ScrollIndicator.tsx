'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronDown, Minus } from 'lucide-react'

export function ScrollIndicator() {
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)

  // Section IDs in order (Hero has no ID, then rooms, gallery, contact)
  const sectionIds = ['rooms', 'gallery', 'contact']

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? scrollTop / docHeight : 0
    
    setScrollProgress(progress)
    setIsAtBottom(progress > 0.95)
    
    // Determine current section based on scroll position
    const sections = document.querySelectorAll('section')
    let foundIndex = 0
    
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect()
      // If section top is near or above viewport center, it's the current section
      if (rect.top <= window.innerHeight / 2) {
        foundIndex = index
      }
    })
    
    setCurrentSectionIndex(foundIndex)
  }, [])

  useEffect(() => {
    // Initial check after mount
    const timeoutId = setTimeout(handleScroll, 0)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // Scroll to next section
  const scrollToNextSection = useCallback(() => {
    const sections = document.querySelectorAll('section')
    
    if (currentSectionIndex < sections.length - 1) {
      const nextSection = sections[currentSectionIndex + 1]
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [currentSectionIndex])

  // Scroll to top
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Hide when near top - show initial arrow
  if (scrollProgress < 0.02) {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-bounce">
        <div 
          className="w-10 h-10 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors" 
          onClick={scrollToNextSection}
        >
          <ChevronDown className="w-6 h-6 text-primary" />
        </div>
      </div>
    )
  }

  // Show line/dash at bottom - click to go to top
  if (isAtBottom) {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <div 
          className="w-10 h-10 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-foreground/20 transition-colors" 
          onClick={scrollToTop}
        >
          <Minus className="w-6 h-6 text-foreground" />
        </div>
      </div>
    )
  }

  // Show arrow pointing down (scrolling) - go to next section
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-300">
      <div 
        className="w-10 h-10 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
        onClick={scrollToNextSection}
      >
        <ChevronDown className="w-6 h-6 text-primary" />
      </div>
    </div>
  )
}
