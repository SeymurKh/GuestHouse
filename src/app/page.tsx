'use client'

// Guest House Gabala - Landing Page (Refactored)
import { useState, useEffect, useMemo } from 'react'
import { Mountain } from 'lucide-react'

// Components
import { 
  Header, 
  Hero, 
  Rooms, 
  Gallery, 
  Contact, 
  Footer, 
  RoomModal, 
  AdminDialog,
  ScrollIndicator
} from '@/components'

// Hooks
import { useToast } from '@/hooks/use-toast'

// Types
import { Room, Review, RoomImage } from '@/types'

// Utils
import { parseImages } from '@/lib/parse'
import { useLanguage } from '@/lib/LanguageContext'

export default function GuestHouseLanding() {
  const { t } = useLanguage()
  const { toast } = useToast()
  
  // State
  const [rooms, setRooms] = useState<Room[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [phone, setPhone] = useState('+994 50 123 45 67')
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Room detail modal state
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [roomModalOpen, setRoomModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Admin state
  const [adminOpen, setAdminOpen] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentReview, setCurrentReview] = useState(0)
  
  // Collect ALL images from all rooms with room info
  const allRoomImages: RoomImage[] = useMemo(() => 
    rooms.flatMap(room => 
      parseImages(room.images).map(img => ({
        image: img,
        roomName: room.name,
        price: room.price,
        capacity: room.capacity,
        roomId: room.id
      }))
    ),
    [rooms]
  )

  // Initialize data
  useEffect(() => {
    async function initData() {
      try {
        await fetch('/api/init', { method: 'POST' })
        const roomsRes = await fetch('/api/rooms')
        const roomsData = await roomsRes.json()
        setRooms(roomsData.slice(0, 2))
        const reviewsRes = await fetch('/api/reviews')
        const reviewsData = await reviewsRes.json()
        setReviews(reviewsData.slice(0, 5))
        const settingsRes = await fetch('/api/settings')
        const settingsData = await settingsRes.json()
        if (settingsData?.phone) setPhone(settingsData.phone)
        setLoading(false)
      } catch {
        setLoading(false)
      }
    }
    initData()
  }, [])

  // Auto-slide effect for hero
  useEffect(() => {
    if (allRoomImages.length <= 1) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % allRoomImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [allRoomImages.length])

  // Auto-slide effect for reviews
  useEffect(() => {
    if (reviews.length === 0) return
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [reviews.length])

  // Secret admin access via keyboard shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'Ф' || e.key === 'ф')) {
        setAdminOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Admin login - server-side password verification
  const handleAdminLogin = async () => {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword })
      })
      const data = await res.json()
      
      if (data.success) {
        setIsAdmin(true)
        setAdminToken(data.token ?? adminPassword)
        toast({
          title: 'Success',
          description: 'Admin access granted',
          duration: 2000,
        })
      } else {
        setIsAdmin(false)
        setAdminToken(null)
        toast({
          title: 'Error',
          description: t.admin.wrongPassword,
          variant: 'destructive',
          duration: 3000,
        })
      }
    } catch (error) {
      setIsAdmin(false)
      setAdminToken(null)
      toast({
        title: 'Error',
        description: 'Authorization error',
        variant: 'destructive',
        duration: 3000,
      })
    }
  }

  // Open room detail modal
  const openRoomModal = (room: Room) => {
    setSelectedRoom(room)
    setCurrentImageIndex(0)
    setRoomModalOpen(true)
  }

  // Handle room update from admin
  const handleRoomUpdate = (updatedRoom: Room) => {
    setRooms(rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r))
  }

  // Refresh reviews from server
  const refreshReviews = async () => {
    try {
      const res = await fetch('/api/reviews')
      const data = await res.json()
      setReviews(data.slice(0, 5))
    } catch {
      // Failed to refresh reviews
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Mountain className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-white/70">{t.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden relative">
      {/* Fixed background image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      {/* Dark overlay for text readability */}
      <div className="fixed inset-0 z-0 bg-black/40" />
      
      {/* Header */}
      <Header 
        phone={phone}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Hero Section */}
      <Hero 
        phone={phone}
        allRoomImages={allRoomImages}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        rooms={rooms}
        onRoomClick={openRoomModal}
      />

      {/* Rooms Section */}
      <Rooms 
        rooms={rooms}
        onRoomClick={openRoomModal}
      />

      {/* Gallery Section */}
      <Gallery />

      {/* Contact Section */}
      <Contact 
        phone={phone}
        reviews={reviews}
        currentReview={currentReview}
        setCurrentReview={setCurrentReview}
      />

      {/* Footer */}
      <Footer />

      {/* Room Detail Modal */}
      <RoomModal 
        room={selectedRoom}
        open={roomModalOpen}
        onOpenChange={setRoomModalOpen}
        phone={phone}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
      />

      {/* Admin Dialog */}
      <AdminDialog 
        open={adminOpen}
        onOpenChange={setAdminOpen}
        isAdmin={isAdmin}
        adminToken={adminToken}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
        onLogin={handleAdminLogin}
        rooms={rooms}
        onRoomUpdate={handleRoomUpdate}
        onReviewsUpdate={refreshReviews}
      />

      {/* Dynamic Scroll Indicator */}
      <ScrollIndicator />
    </div>
  )
}
