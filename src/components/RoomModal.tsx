'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Check, Wifi, Thermometer, Tv, Coffee, Bath, Shield, Sparkles, Flame, Car, Utensils, ChevronLeft, ChevronRight } from 'lucide-react'
import { Room } from '@/types'
import { parseImages, parseLocalizedAmenities, parseLocalizedAdvantages } from '@/lib/parse'
import { useLanguage } from '@/lib/LanguageContext'
import { getLocalizedValue } from '@/lib/localize'

interface RoomModalProps {
  room: Room | null
  open: boolean
  onOpenChange: (open: boolean) => void
  phone: string
  currentImageIndex: number
  setCurrentImageIndex: (index: number) => void
}

const getAmenityIcon = (amenity: string) => {
  const icons: Record<string, React.ReactNode> = {
    'Wi-Fi': <Wifi className="w-4 h-4" />,
    'Кондиционер': <Thermometer className="w-4 h-4" />,
    'ТВ': <Tv className="w-4 h-4" />,
    'Мини-бар': <Coffee className="w-4 h-4" />,
    'Ванна': <Bath className="w-4 h-4" />,
    'Душ': <Bath className="w-4 h-4" />,
    'Камин': <Flame className="w-4 h-4" />,
    'Кухня': <Utensils className="w-4 h-4" />,
    'Парковка': <Car className="w-4 h-4" />,
    'Сейф': <Shield className="w-4 h-4" />,
    // English
    'Air Conditioning': <Thermometer className="w-4 h-4" />,
    'Mini-bar': <Coffee className="w-4 h-4" />,
    'Fireplace': <Flame className="w-4 h-4" />,
    'Kitchen': <Utensils className="w-4 h-4" />,
    'Parking': <Car className="w-4 h-4" />,
    'Safe': <Shield className="w-4 h-4" />,
    'Shower': <Bath className="w-4 h-4" />,
  }
  return icons[amenity] || <Sparkles className="w-4 h-4" />
}

export function RoomModal({ room, open, onOpenChange, phone, currentImageIndex, setCurrentImageIndex }: RoomModalProps) {
  const { t, lang } = useLanguage()
  
  if (!room) return null

  // Get localized values
  const roomName = getLocalizedValue(room.name, lang, room.name)
  const roomDescription = getLocalizedValue(room.description, lang, '')
  const roomConditions = getLocalizedValue(room.conditions, lang, '')
  const roomAdvantages = parseLocalizedAdvantages(room.advantages, lang)
  const images = parseImages(room.images)
  const amenities = parseLocalizedAmenities(room.amenities, lang)

  // Image navigation
  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] lg:max-w-[1000px] max-h-[90vh] overflow-y-auto overflow-x-hidden w-[95vw] max-w-[95vw] sm:w-auto sm:max-w-[900px]">
        {/* Header - with extra right padding to avoid close button */}
        <DialogHeader className="pb-4 border-b pr-12">
          <DialogTitle className="text-xl sm:text-2xl mb-2">{roomName}</DialogTitle>
          <DialogDescription className="sr-only">{t.modal.description}</DialogDescription>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Badge className="bg-primary text-white text-xs sm:text-sm px-2 sm:px-3 py-1">{room.price} {t.hero.perNight}</Badge>
            <Badge variant="outline" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {t.rooms.upTo} {room.capacity} {t.rooms.guests}
            </Badge>
            {/* Book Button in header */}
            <Button 
              asChild 
              size="sm"
              className="bg-[#25D366] hover:bg-[#20BD5A] ml-auto text-xs sm:text-sm"
            >
              <a href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={() => onOpenChange(false)}>
                <img src="/whatsapp-logo.png" alt="WhatsApp" className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                {t.modal.book}
              </a>
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 py-4">
          {/* LEFT COLUMN - GALLERY */}
          <div className="space-y-3">
            {/* Main Image - Fixed Size */}
            <div className="relative w-full h-[220px] sm:h-[300px] lg:h-[350px] rounded-xl overflow-hidden bg-muted">
              <img 
                src={images[currentImageIndex] || '/images/hero-bg.jpg'} 
                alt={roomName} 
                className="w-full h-full object-cover" 
              />
              
              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}
              
              {/* Image counter */}
              <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/50 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                {currentImageIndex + 1} / {images.length || 1}
              </div>
            </div>
            
            {/* Thumbnails - All images in grid rows */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 sm:grid-cols-5 gap-1.5 sm:gap-2">
                {images.map((img: string, i: number) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentImageIndex(i)} 
                    className={`w-full aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${i === currentImageIndex ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-muted-foreground/30'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* RIGHT COLUMN - INFO BLOCKS */}
          <div className="space-y-3 sm:space-y-4">
            {/* Block 1 - Description */}
            {roomDescription && (
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <h4 className="font-semibold text-sm sm:text-base mb-2 flex items-center gap-2">
                    {t.modal.description}
                  </h4>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{roomDescription}</p>
                </CardContent>
              </Card>
            )}
            
            {/* Block 2 - Advantages */}
            {roomAdvantages.length > 0 && (
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">{t.modal.advantages}</h4>
                  <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
                    {roomAdvantages.map((adv: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{adv}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Block 3 - Amenities */}
            {amenities.length > 0 && (
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">{t.modal.amenities}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {amenities.map((amenity: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs sm:text-sm p-1.5 sm:p-2 bg-muted/50 rounded-lg">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {getAmenityIcon(amenity)}
                        </div>
                        <span className="text-muted-foreground text-xs sm:text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Block 4 - Conditions */}
            {roomConditions && (
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <h4 className="font-semibold text-sm sm:text-base mb-2">{t.modal.conditions}</h4>
                  <div className="bg-muted/50 rounded-lg p-2 sm:p-3">
                    <pre className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">{roomConditions}</pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
