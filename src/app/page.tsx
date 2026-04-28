'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { 
  Mountain, Trees, Phone, Mail, MapPin, Star, Users, 
  ChevronRight, Menu, X, Wifi, 
  Thermometer, Tv, Coffee, Bath, Shield, Sparkles, 
  Flame, Car, Utensils, Heart,
  Settings, Check, ArrowRight, Plus, Trash2, ChevronDown, Upload, Loader2
} from 'lucide-react'

// Types
interface Room {
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

interface Review {
  id: string
  guestName: string
  rating: number
  comment: string
  createdAt: string
}

export default function GuestHouseLanding() {
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
  const [isAdmin, setIsAdmin] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Slider state for hero
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Review slider state
  const [currentReview, setCurrentReview] = useState(0)

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
        setReviews(reviewsData)
        const settingsRes = await fetch('/api/settings')
        const settingsData = await settingsRes.json()
        if (settingsData?.phone) setPhone(settingsData.phone)
        setLoading(false)
      } catch (error) {
        console.error('Error initializing:', error)
        setLoading(false)
      }
    }
    initData()
  }, [])

  // Auto-slide effect for hero
  useEffect(() => {
    if (rooms.length === 0) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % rooms.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [rooms.length])

  // Auto-slide effect for reviews
  useEffect(() => {
    if (reviews.length === 0) return
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [reviews.length])

  // Admin login
  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdmin(true)
    } else {
      alert('Неверный пароль')
    }
  }

  // Open room detail modal
  const openRoomModal = (room: Room) => {
    setSelectedRoom(room)
    setCurrentImageIndex(0)
    setRoomModalOpen(true)
  }

  // Parse helpers - with type safety
  const parseAmenities = (amenitiesStr: string | null | undefined): string[] => {
    if (!amenitiesStr) return []
    try {
      const parsed = JSON.parse(amenitiesStr)
      return Array.isArray(parsed) ? parsed : []
    } catch { 
      return [] 
    }
  }

  const parseAdvantages = (advantagesStr: string | null | undefined): string[] => {
    if (!advantagesStr) return []
    try {
      const parsed = JSON.parse(advantagesStr)
      return Array.isArray(parsed) ? parsed : []
    } catch { 
      return [] 
    }
  }

  const parseImages = (imagesStr: string | null | undefined): string[] => {
    if (!imagesStr) return []
    try {
      const parsed = JSON.parse(imagesStr)
      return Array.isArray(parsed) ? parsed : []
    } catch { 
      return [] 
    }
  }

  // Amenity icons
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

  // Upload file to server
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (res.ok) {
        const data = await res.json()
        return data.url
      } else {
        const error = await res.json()
        alert(error.error || 'Ошибка при загрузке')
        return null
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Ошибка при загрузке файла')
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  // Delete file from server
  const deleteFile = async (imageUrl: string): Promise<boolean> => {
    // Only delete files from /uploads/ folder
    if (!imageUrl.startsWith('/uploads/')) {
      return true // Don't delete default images
    }
    
    try {
      const res = await fetch(`/api/upload?url=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE'
      })
      return res.ok
    } catch (error) {
      console.error('Delete error:', error)
      return false
    }
  }

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingRoom) return
    
    const url = await uploadFile(file)
    if (url) {
      const currentImages = parseImages(editingRoom.images)
      setEditingRoom({
        ...editingRoom,
        images: JSON.stringify([...currentImages, url])
      })
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Add image to editing room (from URL - optional)
  const addImageToRoom = (imageUrl: string) => {
    if (!editingRoom || !imageUrl.trim()) return
    const currentImages = parseImages(editingRoom.images)
    setEditingRoom({
      ...editingRoom,
      images: JSON.stringify([...currentImages, imageUrl.trim()])
    })
  }

  // Remove image from editing room and delete from server
  const removeImageFromRoom = async (index: number) => {
    if (!editingRoom) return
    const currentImages = parseImages(editingRoom.images)
    const imageToDelete = currentImages[index]
    
    // Delete file from server
    await deleteFile(imageToDelete)
    
    // Remove from room data
    setEditingRoom({
      ...editingRoom,
      images: JSON.stringify(currentImages.filter((_: string, i: number) => i !== index))
    })
  }

  // Save room changes
  const saveRoomChanges = async (room: Room) => {
    try {
      const res = await fetch('/api/rooms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(room)
      })
      if (res.ok) {
        const updated = await res.json()
        setRooms(rooms.map(r => r.id === room.id ? updated : r))
        setEditingRoom(null)
        alert('Сохранено успешно!')
      }
    } catch {
      alert('Ошибка при сохранении')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Mountain className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <Mountain className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl">Guest House Gabala</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#rooms" className="text-muted-foreground hover:text-primary transition-colors">Домики</a>
            <a href="#gallery" className="text-muted-foreground hover:text-primary transition-colors">Галерея</a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Контакты</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button asChild className="hidden sm:flex bg-primary hover:bg-primary/90">
              <a href={`tel:${phone}`}>
                <Phone className="w-4 h-4 mr-2" />
                Позвонить
              </a>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setAdminOpen(true)} className="hidden sm:flex">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b p-4">
            <nav className="flex flex-col gap-4">
              <a href="#rooms" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Домики</a>
              <a href="#gallery" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Галерея</a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Контакты</a>
              <Button asChild className="bg-primary hover:bg-primary/90 w-full">
                <a href={`tel:${phone}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  Позвонить
                </a>
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section - Full Screen */}
      <section className="min-h-screen flex items-center pt-20 pb-8 bg-gradient-to-br from-background via-muted/30 to-background snap-start">
        <div className="container mx-auto px-4 h-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-8rem)]">
            {/* Left Side - Welcome Text */}
            <div className="space-y-6 lg:space-y-8">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Trees className="w-3 h-3 mr-1" />
                Азербайджан, Габала
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Добро пожаловать в<br />
                <span className="text-primary">уголок спокойствия</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-lg">
                Оставьте суету позади и окунитесь в атмосферу тепла и уюта. 
                Наш гостевой дом — место, где природа обнимает вас.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 px-8">
                  <a href="#rooms">
                    Наши домики
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary/20">
                  <a href={`tel:${phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Связаться
                  </a>
                </Button>
              </div>
            </div>
            
            {/* Right Side - Sliding Images (only 2 rooms) */}
            <div className="relative h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
              <div className="absolute inset-0 flex items-center justify-center">
                {rooms.slice(0, 2).map((room, index) => (
                  <div 
                    key={room.id}
                    className={`absolute w-full max-w-md transition-all duration-1000 ease-in-out ${
                      index === currentSlide 
                        ? 'opacity-100 translate-x-0 scale-100' 
                        : index < currentSlide 
                          ? 'opacity-0 -translate-x-full scale-95'
                          : 'opacity-0 translate-x-full scale-95'
                    }`}
                  >
                    <Card className="overflow-hidden shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow" onClick={() => openRoomModal(room)}>
                      <div className="relative h-56 sm:h-64">
                        <img 
                          src={parseImages(room.images)[0] || '/images/hero-bg.jpg'} 
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white text-lg sm:text-xl font-semibold mb-1">{room.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary text-white">{room.price} AZN / ночь</Badge>
                            <Badge variant="secondary" className="bg-white/20 text-white border-0">
                              <Users className="w-3 h-3 mr-1" />
                              {room.capacity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
              
              {/* Slide Indicators */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
                {rooms.slice(0, 2).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide ? 'bg-primary w-8' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
            <ChevronDown className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Features Section - Compact */}
      <section className="py-10 bg-muted/30 snap-start">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Mountain, title: 'Горные виды', desc: 'Кавказские горы' },
              { icon: Trees, title: 'Лесная тишина', desc: 'Густые леса' },
              { icon: Heart, title: 'Уют', desc: 'Домашний комфорт' },
              { icon: Utensils, title: 'Кухня', desc: 'Национальная кухня' },
            ].map((item, i) => (
              <div key={i} className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section - Full Screen */}
      <section id="rooms" className="min-h-screen flex items-center py-16 bg-background snap-start">
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
                onClick={() => openRoomModal(room)}
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

      {/* Gallery Section - Full Screen */}
      <section id="gallery" className="min-h-screen flex items-center py-16 bg-muted/30 snap-start">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="mb-4">Галерея</Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Окружающая природа</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              Горы, леса, водопады — всё это рядом с нами
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
            {[
              { src: '/images/gallery-forest.jpg', title: 'Лесные тропы' },
              { src: '/images/gallery-waterfall.jpg', title: 'Горный водопад' },
              { src: '/images/gallery-dining.jpg', title: 'Отдых на террасе' },
              { src: '/images/room-cottage.jpg', title: 'Домик' },
              { src: '/images/hero-bg.jpg', title: 'Горный пейзаж' },
              { src: '/images/room-family.jpg', title: 'Вид на горы' },
            ].map((item, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl group cursor-pointer aspect-square">
                <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-medium">{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Reviews Section - Combined Full Screen */}
      <section id="contact" className="min-h-screen flex items-center py-16 bg-primary text-white snap-start">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            
            {/* Left - Contact Form */}
            <div>
              <Badge className="mb-4 bg-white/20 text-white border-white/30">Контакты</Badge>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">Свяжитесь с нами</h2>
              <p className="text-white/80 mb-6 text-sm md:text-base">
                Готовы ответить на все ваши вопросы и помочь с выбором домика
              </p>
              
              <div className="space-y-3 mb-6">
                <a href={`tel:${phone}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Телефон</p>
                    <p className="font-medium">{phone}</p>
                  </div>
                </a>
                <a href="mailto:info@guesthouse-gabala.az" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Email</p>
                    <p className="font-medium">info@guesthouse-gabala.az</p>
                  </div>
                </a>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Адрес</p>
                    <p className="font-medium">Азербайджан, Габала</p>
                  </div>
                </div>
              </div>
              
              <Card className="bg-white/10 border-white/20 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg">Быстрая заявка</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-3" onSubmit={(e) => {
                    e.preventDefault()
                    alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.')
                  }}>
                    <Input placeholder="Ваше имя" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-10" />
                    <Input placeholder="Телефон" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-10" />
                    <Button type="submit" className="w-full bg-white text-primary hover:bg-white/90">
                      Отправить
                    </Button>
                  </form>
                </CardContent>
              </Card>
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

      {/* Footer */}
      <footer className="bg-foreground text-background py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Mountain className="w-6 h-6" />
              <span className="font-semibold">Guest House Gabala</span>
            </div>
            <p className="text-sm text-background/60">© 2024 Все права защищены. Азербайджан, Габала.</p>
          </div>
        </div>
      </footer>

      {/* Room Detail Modal */}
      <Dialog open={roomModalOpen} onOpenChange={setRoomModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {selectedRoom && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedRoom.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-3">
                  <Badge className="bg-primary text-white">{selectedRoom.price} AZN / ночь</Badge>
                  <Badge variant="outline"><Users className="w-3 h-3 mr-1" />до {selectedRoom.capacity} гостей</Badge>
                </DialogDescription>
              </DialogHeader>
              
              {/* 1. Изображения */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  Изображения
                  <Badge variant="secondary" className="text-xs">{parseImages(selectedRoom.images).length}</Badge>
                </h4>
                <div className="aspect-video rounded-lg overflow-hidden mb-2">
                  <img src={parseImages(selectedRoom.images)[currentImageIndex] || '/images/hero-bg.jpg'} alt={selectedRoom.name} className="w-full h-full object-cover" />
                </div>
                {parseImages(selectedRoom.images).length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {parseImages(selectedRoom.images).map((img: string, i: number) => (
                      <button key={i} onClick={() => setCurrentImageIndex(i)} className={`w-20 h-14 rounded overflow-hidden flex-shrink-0 border-2 ${i === currentImageIndex ? 'border-primary' : 'border-transparent'}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 2. Описание */}
              <div>
                <h4 className="font-semibold mb-2">Описание</h4>
                <p className="text-muted-foreground text-sm">{selectedRoom.description}</p>
              </div>
              
              {/* 3. Условия проживания */}
              {selectedRoom.conditions && (
                <div>
                  <h4 className="font-semibold mb-2">Условия проживания</h4>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">{selectedRoom.conditions}</pre>
                  </div>
                </div>
              )}
              
              {/* 4. Преимущества */}
              {parseAdvantages(selectedRoom.advantages).length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Преимущества</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {parseAdvantages(selectedRoom.advantages).map((adv: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{adv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 5. Удобства */}
              <div>
                <h4 className="font-semibold mb-3">Удобства</h4>
                <div className="flex flex-wrap gap-2">
                  {parseAmenities(selectedRoom.amenities).map((amenity: string, i: number) => (
                    <Badge key={i} variant="secondary" className="flex items-center gap-1">
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button asChild className="w-full bg-primary hover:bg-primary/90 mt-4">
                <a href={`tel:${phone}`} onClick={() => setRoomModalOpen(false)}>
                  <Phone className="w-4 h-4 mr-2" />
                  Забронировать по телефону
                </a>
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Admin Dialog */}
      <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {!isAdmin ? (
            <>
              <DialogHeader>
                <DialogTitle>Админ-панель</DialogTitle>
                <DialogDescription>Введите пароль для доступа</DialogDescription>
              </DialogHeader>
              <div className="flex gap-2">
                <Input type="password" placeholder="Пароль" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()} />
                <Button onClick={handleAdminLogin}>Войти</Button>
              </div>
              <p className="text-xs text-muted-foreground">Демо пароль: admin123</p>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Управление домиками</DialogTitle>
                <DialogDescription>Редактирование информации (только 2 домика)</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {rooms.slice(0, 2).map((room) => (
                  <Card key={room.id} className="overflow-hidden">
                    {editingRoom?.id === room.id ? (
                      <CardContent className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Название</Label>
                            <Input value={editingRoom.name} onChange={(e) => setEditingRoom({...editingRoom, name: e.target.value})} />
                          </div>
                          <div>
                            <Label>Цена (AZN)</Label>
                            <Input type="number" value={editingRoom.price} onChange={(e) => setEditingRoom({...editingRoom, price: parseFloat(e.target.value)})} />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Описание</Label>
                          <Textarea value={editingRoom.description} onChange={(e) => setEditingRoom({...editingRoom, description: e.target.value})} rows={2} />
                        </div>
                        
                        <div>
                          <Label>Условия проживания</Label>
                          <Textarea value={editingRoom.conditions} onChange={(e) => setEditingRoom({...editingRoom, conditions: e.target.value})} rows={3} placeholder="• Заезд: с 14:00&#10;• Выезд: до 12:00" />
                        </div>
                        
                        <div>
                          <Label>Преимущества (каждое с новой строки)</Label>
                          <Textarea value={parseAdvantages(editingRoom.advantages).join('\n')} onChange={(e) => setEditingRoom({...editingRoom, advantages: JSON.stringify(e.target.value.split('\n').filter(Boolean))})} rows={3} />
                        </div>
                        
                        <div>
                          <Label>Удобства (через запятую)</Label>
                          <Input value={parseAmenities(editingRoom.amenities).join(', ')} onChange={(e) => setEditingRoom({...editingRoom, amenities: JSON.stringify(e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))})} />
                        </div>
                        
                        {/* Image Management */}
                        <div>
                          <Label className="flex items-center gap-2 mb-2">
                            Изображения
                            <Badge variant="secondary">{parseImages(editingRoom.images).length}</Badge>
                          </Label>
                          
                          {/* Image Previews */}
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {parseImages(editingRoom.images).map((img: string, i: number) => (
                              <div key={i} className="relative group aspect-video rounded overflow-hidden border">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button
                                  onClick={() => removeImageFromRoom(i)}
                                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                                  title="Удалить изображение"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          {/* Upload Button */}
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                          >
                            {uploadingImage ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Загрузка...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Загрузить фото с компьютера
                              </>
                            )}
                          </Button>
                          
                          <p className="text-xs text-muted-foreground mt-2">
                            Поддерживаемые форматы: JPG, PNG, GIF, WebP
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button onClick={() => saveRoomChanges(editingRoom)} className="bg-primary">Сохранить</Button>
                          <Button variant="outline" onClick={() => setEditingRoom(null)}>Отмена</Button>
                        </div>
                      </CardContent>
                    ) : (
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0">
                              <img src={parseImages(room.images)[0] || '/images/hero-bg.jpg'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{room.name}</p>
                                <Badge className="bg-primary">{room.price} AZN</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{parseImages(room.images).length} фото</p>
                            </div>
                          </div>
                          <Button onClick={() => setEditingRoom(room)}>Редактировать</Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => { setIsAdmin(false); setAdminPassword(''); setEditingRoom(null); }}>
                  Выйти
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
