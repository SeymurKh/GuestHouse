'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Check, Phone, Wifi, Thermometer, Tv, Coffee, Bath, Shield, Sparkles, Flame, Car, Utensils } from 'lucide-react'
import { Room } from '@/types'
import { parseImages, parseAmenities, parseAdvantages } from '@/lib/parse'
import { useLanguage } from '@/lib/LanguageContext'

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
  const { t } = useLanguage()
  
  if (!room) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{room.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-3">
            <Badge className="bg-primary text-white">{room.price} {t.hero.perNight}</Badge>
            <Badge variant="outline"><Users className="w-3 h-3 mr-1" />{t.rooms.upTo} {room.capacity} {t.rooms.guests}</Badge>
          </DialogDescription>
        </DialogHeader>
        
        {/* Description */}
        <div>
          <h4 className="font-semibold mb-2">{t.modal.description}</h4>
          <p className="text-muted-foreground text-sm">{room.description}</p>
        </div>
        
        {/* Conditions */}
        {room.conditions && (
          <div>
            <h4 className="font-semibold mb-2">{t.modal.conditions}</h4>
            <div className="bg-muted/50 rounded-lg p-4">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">{room.conditions}</pre>
            </div>
          </div>
        )}
        
        {/* Advantages */}
        {parseAdvantages(room.advantages).length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">{t.modal.advantages}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {parseAdvantages(room.advantages).map((adv: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{adv}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Amenities */}
        <div>
          <h4 className="font-semibold mb-3">{t.modal.amenities}</h4>
          <div className="flex flex-wrap gap-2">
            {parseAmenities(room.amenities).map((amenity: string, i: number) => (
              <Badge key={i} variant="secondary" className="flex items-center gap-1">
                {getAmenityIcon(amenity)}
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Images */}
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            {t.modal.images}
            <Badge variant="secondary" className="text-xs">{parseImages(room.images).length}</Badge>
          </h4>
          <div className="aspect-video rounded-lg overflow-hidden mb-2">
            <img src={parseImages(room.images)[currentImageIndex] || '/images/hero-bg.jpg'} alt={room.name} className="w-full h-full object-cover" />
          </div>
          {parseImages(room.images).length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {parseImages(room.images).map((img: string, i: number) => (
                <button key={i} onClick={() => setCurrentImageIndex(i)} className={`w-20 h-14 rounded overflow-hidden flex-shrink-0 border-2 ${i === currentImageIndex ? 'border-primary' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        <Button asChild className="w-full bg-primary hover:bg-primary/90 mt-4">
          <a href={`tel:${phone}`} onClick={() => onOpenChange(false)}>
            <Phone className="w-4 h-4 mr-2" />
            {t.modal.bookPhone}
          </a>
        </Button>
      </DialogContent>
    </Dialog>
  )
}
