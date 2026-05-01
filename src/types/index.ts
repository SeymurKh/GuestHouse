// Types for Guest House application

export type LocalizedValue = string | { ru?: string | string[]; az?: string | string[]; en?: string | string[] }

export type JsonArrayOrObject = string | string[] | Record<string, unknown>

export interface Room {
  id: string
  name: string
  description: string
  conditions: string
  advantages: JsonArrayOrObject
  price: number
  capacity: number
  amenities: JsonArrayOrObject
  images: string[]
  isAvailable: boolean
}

export interface Review {
  id: string
  guestName: string
  rating: number
  comment: string
  createdAt: string
}

export interface RoomImage {
  image: string
  roomName: string
  price: number
  capacity: number
  roomId: string
}
