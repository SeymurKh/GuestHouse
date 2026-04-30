'use client'

import { Wifi, Thermometer, Tv, Coffee, Bath, Shield, Sparkles, Flame, Car, Utensils } from 'lucide-react'

/**
 * Get icon component for amenity by name
 * Supports Russian, English, and Azerbaijani amenity names
 */
export function getAmenityIcon(amenity: string): React.ReactNode {
  const icons: Record<string, React.ReactNode> = {
    // Russian
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
    'Терраса': <Sparkles className="w-4 h-4" />,
    'Барбекю': <Flame className="w-4 h-4" />,
    'Джакузи': <Bath className="w-4 h-4" />,
    '2 спальни': <Sparkles className="w-4 h-4" />,
    // English
    'Air Conditioning': <Thermometer className="w-4 h-4" />,
    'Mini-bar': <Coffee className="w-4 h-4" />,
    'Fireplace': <Flame className="w-4 h-4" />,
    'Kitchen': <Utensils className="w-4 h-4" />,
    'Parking': <Car className="w-4 h-4" />,
    'Safe': <Shield className="w-4 h-4" />,
    'Shower': <Bath className="w-4 h-4" />,
    'Terrace': <Sparkles className="w-4 h-4" />,
    'Barbecue': <Flame className="w-4 h-4" />,
    'Jacuzzi': <Bath className="w-4 h-4" />,
    // Azerbaijani
    'Kondisioner': <Thermometer className="w-4 h-4" />,
    'Möhtəşəm': <Flame className="w-4 h-4" />,
    'Mətbəx': <Utensils className="w-4 h-4" />,
    'Parkovka': <Car className="w-4 h-4" />,
    'Seyf': <Shield className="w-4 h-4" />,
    'Teras': <Sparkles className="w-4 h-4" />,
    'Barbekü': <Flame className="w-4 h-4" />,
  }
  return icons[amenity] || <Sparkles className="w-4 h-4" />
}
