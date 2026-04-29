'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Phone, Mail, MapPin, Star } from 'lucide-react'
import { Review } from '@/types'
import { useLanguage } from '@/lib/LanguageContext'

interface ContactProps {
  phone: string
  reviews: Review[]
  currentReview: number
  setCurrentReview: (index: number) => void
}

export function Contact({ phone, reviews, currentReview, setCurrentReview }: ContactProps) {
  const { t } = useLanguage()
  
  return (
    <section id="contact" className="relative z-10 min-h-screen flex items-center py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left - Contact Info */}
          <div>
            <Badge className="mb-4 bg-white/20 text-white border-white/30">{t.contact.badge}</Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">{t.contact.title}</h2>
            <p className="text-white/80 mb-6 text-sm md:text-base">
              {t.contact.description}
            </p>
            
            <div className="space-y-3 mb-6">
              <a href={`tel:${phone}`} className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-white/60">{t.contact.phone}</p>
                  <p className="font-medium">{phone}</p>
                </div>
              </a>
              <a href="mailto:info@guesthouse-gabala.az" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-white/60">{t.contact.email}</p>
                  <p className="font-medium">info@guesthouse-gabala.az</p>
                </div>
              </a>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-white/60">{t.contact.address}</p>
                  <p className="font-medium">{t.contact.addressValue}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right - Floating Reviews */}
          <div className="relative h-[400px] lg:h-[500px]">
            <div className="absolute inset-0 flex items-center justify-center">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className={`absolute w-full max-w-sm transition-all duration-700 ease-in-out ${
                    index === currentReview 
                      ? 'opacity-100 scale-100 translate-y-0' 
                      : index < currentReview 
                        ? 'opacity-0 scale-90 -translate-y-10'
                        : 'opacity-0 scale-90 translate-y-10'
                  }`}
                >
                  <Card className="bg-white/15 border-white/30 backdrop-blur-sm shadow-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({length: 5}, (_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`} />
                        ))}
                      </div>
                      <p className="text-white/90 italic mb-4 text-sm md:text-base">&ldquo;{review.comment}&rdquo;</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
                          {review.guestName.charAt(0)}
                        </div>
                        <p className="font-medium text-white">{review.guestName}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            {/* Review indicators */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReview(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentReview ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
