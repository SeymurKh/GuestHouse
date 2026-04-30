'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ArrowRight, Wifi, Thermometer, Tv, Coffee, Bath, Shield, Sparkles, Flame, Car, Utensils } from 'lucide-react'
import { Room } from '@/types'
import { parseImages, parseLocalizedAmenities } from '@/lib/parse'
import { useLanguage } from '@/lib/LanguageContext'
import { getLocalizedValue } from '@/lib/localize'

interface RoomsProps {
  rooms: Room[]
  onRoomClick: (room: Room) => void
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
    // Azerbaijani
    'Kondisioner': <Thermometer className="w-4 h-4" />,
    'Möhtəşəm': <Flame className="w-4 h-4" />,
    'Mətbəx': <Utensils className="w-4 h-4" />,
    'Parkovka': <Car className="w-4 h-4" />,
    'Seyf': <Shield className="w-4 h-4" />,
  }
  return icons[amenity] || <Sparkles className="w-4 h-4" />
}

export function Rooms({ rooms, onRoomClick }: RoomsProps) {
  const { t, lang } = useLanguage()
  
  return (
    <section id="rooms" className="relative z-10 min-h-screen flex items-center py-16 bg-black/30 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge className="mb-4">{t.rooms.badge}</Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">{t.rooms.title}</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-sm md:text-base">
            {t.rooms.description}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {rooms.slice(0, 2).map((room) => {
            const roomName = getLocalizedValue(room.name, lang, room.name)
            const roomDescription = getLocalizedValue(room.description, lang, '')
            
            return (
              <Card 
                key={room.id} 
                className="overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 bg-white/95 flex flex-col hover:scale-[1.02]"
                onClick={() => onRoomClick(room)}
              >
                {/* Image Section - Fixed Height */}
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden flex-shrink-0">
                  <Image 
                    src={parseImages(room.images)[0] || '/images/hero-bg.jpg'} 
                    alt={roomName}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary text-white text-sm">{room.price} {t.rooms.perNight}</Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">
                        <Users className="w-3 h-3 mr-1" />
                        {t.rooms.upTo} {room.capacity} {t.rooms.guests}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Content Section - Flexible */}
                <div className="flex flex-col flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg md:text-xl">{roomName}</CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">{roomDescription}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="flex flex-wrap gap-1">
                      {parseLocalizedAmenities(room.amenities, lang).slice(0, 4).map((amenity: string, i: number) => (
                        <Badge key={i} variant="secondary" className="flex items-center gap-1 text-xs">
                          {getAmenityIcon(amenity)}
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-primary font-medium mt-4 pt-3 border-t">
                      {t.rooms.details}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
