'use client'

import { Badge } from '@/components/ui/badge'

const galleryImages = [
  { src: '/images/gallery-forest.jpg', title: 'Лесные тропы' },
  { src: '/images/gallery-waterfall.jpg', title: 'Горный водопад' },
  { src: '/images/gallery-dining.jpg', title: 'Отдых на террасе' },
  { src: '/images/room-cottage.jpg', title: 'Домик' },
  { src: '/images/hero-bg.jpg', title: 'Горный пейзаж' },
  { src: '/images/room-family.jpg', title: 'Вид на горы' },
]

export function Gallery() {
  return (
    <section id="gallery" className="min-h-screen flex items-center py-16 bg-muted/30 snap-start">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge className="mb-4">Галерея</Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Окружающая природа</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Горы, леса, водопады — всё это рядом с нами
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
          {galleryImages.map((item, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl group cursor-pointer aspect-square">
              <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-medium">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
