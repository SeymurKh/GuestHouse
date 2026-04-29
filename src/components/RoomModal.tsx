'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Check, Phone, Wifi, Thermometer, Tv, Coffee, Bath, Shield, Sparkles, Flame, Car, Utensils } from 'lucide-react'
import { Room } from '@/types'
import { parseImages, parseAmenities, parseLocalizedAdvantages } from '@/lib/parse'
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
    'Wi-Fi': <Wifi className="w-3.5 h-3.5" />,
    'Кондиционер': <Thermometer className="w-3.5 h-3.5" />,
    'ТВ': <Tv className="w-3.5 h-3.5" />,
    'Мини-бар': <Coffee className="w-3.5 h-3.5" />,
    'Ванна': <Bath className="w-3.5 h-3.5" />,
    'Душ': <Bath className="w-3.5 h-3.5" />,
    'Камин': <Flame className="w-3.5 h-3.5" />,
    'Кухня': <Utensils className="w-3.5 h-3.5" />,
    'Парковка': <Car className="w-3.5 h-3.5" />,
    'Сейф': <Shield className="w-3.5 h-3.5" />,
    // English
    'Air Conditioning': <Thermometer className="w-3.5 h-3.5" />,
    'Mini-bar': <Coffee className="w-3.5 h-3.5" />,
    'Fireplace': <Flame className="w-3.5 h-3.5" />,
    'Kitchen': <Utensils className="w-3.5 h-3.5" />,
    'Parking': <Car className="w-3.5 h-3.5" />,
    'Safe': <Shield className="w-3.5 h-3.5" />,
    'Shower': <Bath className="w-3.5 h-3.5" />,
  }
  return icons[amenity] || <Sparkles className="w-3.5 h-3.5" />
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{roomName}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Badge className="bg-primary text-white text-xs">{room.price} {t.hero.perNight}</Badge>
            <Badge variant="outline" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              {t.rooms.upTo} {room.capacity} {t.rooms.guests}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-[16/10] rounded-lg overflow-hidden bg-muted">
            <img 
              src={images[currentImageIndex] || '/images/hero-bg.jpg'} 
              alt={roomName} 
              className="w-full h-full object-cover" 
            />
          </div>
          
          {/* Image thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentImageIndex(i)} 
                  className={`w-16 h-12 rounded overflow-hidden flex-shrink-0 border-2 transition-colors ${i === currentImageIndex ? 'border-primary' : 'border-transparent hover:border-muted-foreground/30'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          
          {/* Description */}
          {roomDescription && (
            <div>
              <h4 className="font-medium text-sm mb-1.5">{t.modal.description}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{roomDescription}</p>
            </div>
          )}
          
          {/* Advantages */}
          {roomAdvantages.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2">{t.modal.advantages}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {roomAdvantages.map((adv: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{adv}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Conditions */}
          {roomConditions && (
            <div>
              <h4 className="font-medium text-sm mb-1.5">{t.modal.conditions}</h4>
              <div className="bg-muted/50 rounded-lg p-3">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">{roomConditions}</pre>
              </div>
            </div>
          )}
          
          {/* Amenities */}
          <div>
            <h4 className="font-medium text-sm mb-2">{t.modal.amenities}</h4>
            <div className="flex flex-wrap gap-1.5">
              {parseAmenities(room.amenities).map((amenity: string, i: number) => (
                <Badge key={i} variant="secondary" className="flex items-center gap-1 text-xs px-2 py-1">
                  {getAmenityIcon(amenity)}
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Book Button */}
          <Button asChild className="w-full bg-primary hover:bg-primary/90 mt-2">
            <a href={`tel:${phone}`} onClick={() => onOpenChange(false)}>
              <Phone className="w-4 h-4 mr-2" />
              {t.modal.bookPhone}
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
