'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ArrowRight, Wifi, Thermometer, Tv, Coffee, Bath, Shield, Sparkles, Flame, Car, Utensils } from 'lucide-react'
import { Room } from '@/types'
import { parseImages, parseAmenities } from '@/lib/parse'

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
  }
  return icons[amenity] || <Sparkles className="w-4 h-4" />
}

export function Rooms({ rooms, onRoomClick }: RoomsProps) {
  return (
    <section id="rooms" className="min-h-screen flex items-center py-16 bg-background snap-start snap-always">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge className="mb-4">Размещение</Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Наши домики</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Два уникальных домика для вашего идеального отдыха
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {rooms.slice(0, 2).map((room) => (
            <Card 
              key={room.id} 
              className="overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/30"
              onClick={() => onRoomClick(room)}
            >
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <img 
                  src={parseImages(room.images)[0] || '/images/hero-bg.jpg'} 
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary text-white text-sm">{room.price} AZN / ночь</Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">
                      <Users className="w-3 h-3 mr-1" />
                      до {room.capacity} гостей
                    </Badge>
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">{room.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm">{room.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-4">
                  {parseAmenities(room.amenities).slice(0, 4).map((amenity: string, i: number) => (
                    <Badge key={i} variant="secondary" className="flex items-center gap-1 text-xs">
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 group/btn">
                  Подробнее
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
