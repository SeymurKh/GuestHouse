// Types for Guest House application

export interface Room {
  id: string
  name: string
  description: string
  conditions: string
  advantages: string
  price: number
  capacity: number
  amenities: string
  images: string
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
