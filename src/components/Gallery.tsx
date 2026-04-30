'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/lib/LanguageContext'

export function Gallery() {
  const { t } = useLanguage()
  
  const galleryImages = [
    { src: '/images/gallery-forest.jpg', titleKey: 'forest' as const },
    { src: '/images/gallery-waterfall.jpg', titleKey: 'waterfall' as const },
    { src: '/images/gallery-dining.jpg', titleKey: 'terrace' as const },
    { src: '/images/room-cottage.jpg', titleKey: 'cottage' as const },
    { src: '/images/hero-bg.jpg', titleKey: 'landscape' as const },
    { src: '/images/room-family.jpg', titleKey: 'mountainView' as const },
  ]
  
  return (
    <section id="gallery" className="relative z-10 min-h-screen flex items-center py-16 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge className="mb-4">{t.gallery.badge}</Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">{t.gallery.title}</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-sm md:text-base">
            {t.gallery.description}
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
          {galleryImages.map((item, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl group cursor-pointer aspect-square">
              <Image 
                src={item.src} 
                alt={t.gallery[item.titleKey]} 
                fill
                loading={item.src === '/images/room-cottage.jpg' ? 'eager' : 'lazy'}
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-medium">{t.gallery[item.titleKey]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
