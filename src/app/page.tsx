'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { 
  Mountain, Trees, Phone, Mail, MapPin, Star, Users, Bed, 
  Calendar as CalendarIcon, ChevronRight, Menu, X, Wifi, 
  Thermometer, Tv, Coffee, Bath, Shield, Sparkles, 
  Flame, Car, Utensils, Heart, MessageCircle, Send,
  Settings, LogIn, Eye, Check, XCircle, Clock
} from 'lucide-react'

// Types
interface Room {
  id: string
  name: string
  description: string
  price: number
  capacity: number
  amenities: string
  images: string
  isAvailable: boolean
}

interface Booking {
  id: string
  roomId: string
  guestName: string
  guestPhone: string
  guestEmail: string | null
  checkIn: string
  checkOut: string
  guests: number
  status: string
  notes: string | null
  room: Room
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
  const [bookings, setBookings] = useState<Booking[]>([])
  const [phone, setPhone] = useState('+994 50 123 45 67')
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Booking modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [bookingForm, setBookingForm] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    guests: 1,
    notes: ''
  })
  
  // Admin state
  const [adminOpen, setAdminOpen] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  // Initialize data
  useEffect(() => {
    async function initData() {
      try {
        // Initialize sample data
        await fetch('/api/init', { method: 'POST' })
        
        // Fetch rooms
        const roomsRes = await fetch('/api/rooms')
        const roomsData = await roomsRes.json()
        setRooms(roomsData)
        
        // Fetch reviews
        const reviewsRes = await fetch('/api/reviews')
        const reviewsData = await reviewsRes.json()
        setReviews(reviewsData)
        
        // Fetch settings
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

  // Fetch bookings for admin
  const fetchBookings = async () => {
    const res = await fetch('/api/bookings')
    const data = await res.json()
    setBookings(data)
  }

  // Handle booking submit
  const handleBookingSubmit = async () => {
    if (!selectedRoom || !checkIn || !checkOut) return
    
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          ...bookingForm,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString()
        })
      })
      
      if (res.ok) {
        alert('Бронирование успешно создано! Мы свяжемся с вами для подтверждения.')
        setBookingModalOpen(false)
        setBookingForm({ guestName: '', guestPhone: '', guestEmail: '', guests: 1, notes: '' })
        setCheckIn(undefined)
        setCheckOut(undefined)
      } else {
        const error = await res.json()
        alert(error.error || 'Ошибка при бронировании')
      }
    } catch (error) {
      alert('Ошибка при бронировании')
    }
  }

  // Update booking status
  const updateBookingStatus = async (id: string, status: string) => {
    await fetch('/api/bookings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    })
    fetchBookings()
  }

  // Admin login
  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdmin(true)
      fetchBookings()
    } else {
      alert('Неверный пароль')
    }
  }

  // Parse amenities
  const parseAmenities = (amenitiesStr: string) => {
    try {
      return JSON.parse(amenitiesStr)
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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <Mountain className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl">Guest House Gabala</span>
          </a>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#rooms" className="text-muted-foreground hover:text-primary transition-colors">Номера</a>
            <a href="#gallery" className="text-muted-foreground hover:text-primary transition-colors">Галерея</a>
            <a href="#reviews" className="text-muted-foreground hover:text-primary transition-colors">Отзывы</a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Контакты</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button asChild className="hidden sm:flex bg-primary hover:bg-primary/90">
              <a href={`tel:${phone}`}>
                <Phone className="w-4 h-4 mr-2" />
                Позвонить
              </a>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setAdminOpen(true)}
              className="hidden sm:flex"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b p-4">
            <nav className="flex flex-col gap-4">
              <a href="#rooms" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Номера</a>
              <a href="#gallery" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Галерея</a>
              <a href="#reviews" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Отзывы</a>
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <Badge className="mb-6 bg-primary/20 border-primary/30 text-white backdrop-blur-sm">
            <Trees className="w-3 h-3 mr-1" />
            Азербайджан, Габала
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Отдых в горах<br />
            <span className="text-primary">среди природы</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Уютный гостевой дом в горно-лесной местности Габалы. 
            Величественные горы, густые леса и незабываемые впечатления.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
              <a href="#rooms">
                Выбрать номер
                <ChevronRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <a href={`tel:${phone}`}>
                <Phone className="w-4 h-4 mr-2" />
                Связаться
              </a>
            </Button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Mountain, title: 'Горные виды', desc: 'Панорамные виды на Кавказские горы' },
              { icon: Trees, title: 'Лесная тишина', desc: 'Отдых в окружении густых лесов' },
              { icon: Heart, title: 'Уют', desc: 'Домашняя атмосфера и комфорт' },
              { icon: Utensils, title: 'Кухня', desc: 'Национальная азербайджанская кухня' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Размещение</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Наши номера</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Выберите идеальный номер для вашего отдыха. От уютных стандартов до премиальных коттеджей.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={JSON.parse(room.images)[0] || '/images/hero-bg.jpg'} 
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary text-white text-sm">
                      {room.price} AZN
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    <div className="flex items-center text-muted-foreground text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {room.capacity}
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2 text-sm">{room.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 mt-auto">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {parseAmenities(room.amenities).slice(0, 3).map((amenity: string, i: number) => (
                      <Badge key={i} variant="secondary" className="flex items-center gap-1 text-xs px-2 py-0.5">
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </Badge>
                    ))}
                    {parseAmenities(room.amenities).length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5">+{parseAmenities(room.amenities).length - 3}</Badge>
                    )}
                  </div>
                  <Dialog open={bookingModalOpen && selectedRoom?.id === room.id} onOpenChange={(open) => {
                    setBookingModalOpen(open)
                    if (open) setSelectedRoom(room)
                  }}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="w-full bg-primary hover:bg-primary/90 mt-auto" onClick={() => setSelectedRoom(room)}>
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Забронировать
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Бронирование: {selectedRoom?.name}</DialogTitle>
                        <DialogDescription>
                          Заполните форму для бронирования номера
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Заезд</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {checkIn ? format(checkIn, 'dd MMM', { locale: ru }) : 'Выберите'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={checkIn}
                                  onSelect={setCheckIn}
                                  disabled={(date) => date < new Date()}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-2">
                            <Label>Выезд</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {checkOut ? format(checkOut, 'dd MMM', { locale: ru }) : 'Выберите'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={checkOut}
                                  onSelect={setCheckOut}
                                  disabled={(date) => date < (checkIn || new Date())}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="name">Имя и фамилия</Label>
                          <Input 
                            id="name" 
                            value={bookingForm.guestName}
                            onChange={(e) => setBookingForm({...bookingForm, guestName: e.target.value})}
                            placeholder="Али Мамедов"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Телефон *</Label>
                          <Input 
                            id="phone" 
                            value={bookingForm.guestPhone}
                            onChange={(e) => setBookingForm({...bookingForm, guestPhone: e.target.value})}
                            placeholder="+994 50 XXX XX XX"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email"
                            value={bookingForm.guestEmail}
                            onChange={(e) => setBookingForm({...bookingForm, guestEmail: e.target.value})}
                            placeholder="email@example.com"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="guests">Количество гостей</Label>
                          <Select value={bookingForm.guests.toString()} onValueChange={(v) => setBookingForm({...bookingForm, guests: parseInt(v)})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({length: selectedRoom?.capacity || 4}, (_, i) => i + 1).map(n => (
                                <SelectItem key={n} value={n.toString()}>{n} {n === 1 ? 'гость' : n < 5 ? 'гостя' : 'гостей'}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="notes">Пожелания</Label>
                          <Textarea 
                            id="notes"
                            value={bookingForm.notes}
                            onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                            placeholder="Особые пожелания..."
                            rows={3}
                          />
                        </div>
                        {checkIn && checkOut && (
                          <div className="bg-muted p-3 rounded-lg">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} ночей × {selectedRoom?.price} AZN</span>
                            </div>
                            <div className="flex justify-between font-bold">
                              <span>Итого:</span>
                              <span>{Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) * (selectedRoom?.price || 0)} AZN</span>
                            </div>
                          </div>
                        )}
                        <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleBookingSubmit}>
                          Отправить заявку
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Галерея</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Окружающая природа</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Габала славится своей невероятной природой. Горы, леса, водопады — всё это рядом с нами.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { src: '/images/gallery-forest.jpg', title: 'Лесные тропы' },
              { src: '/images/gallery-waterfall.jpg', title: 'Горный водопад' },
              { src: '/images/gallery-dining.jpg', title: 'Отдых на террасе' },
              { src: '/images/room-cottage.jpg', title: 'Премиум коттедж' },
              { src: '/images/hero-bg.jpg', title: 'Горный пейзаж' },
              { src: '/images/room-family.jpg', title: 'Семейный номер' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="relative overflow-hidden rounded-xl group cursor-pointer aspect-square"
              >
                <img 
                  src={item.src} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
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

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Отзывы</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Что говорят гости</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Нам важно ваше мнение. Посмотрите, что пишут о нас гости.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <Card key={review.id} className="relative">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({length: 5}, (_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} 
                      />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{review.guestName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">&ldquo;{review.comment}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-white/20 text-white border-white/30">Контакты</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Свяжитесь с нами</h2>
              <p className="text-white/80 mb-8">
                Готовы ответить на все ваши вопросы и помочь с выбором идеального номера для вашего отдыха.
              </p>
              
              <div className="space-y-4">
                <a href={`tel:${phone}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Телефон</p>
                    <p className="text-lg font-medium">{phone}</p>
                  </div>
                </a>
                <a href="mailto:info@guesthouse-gabala.az" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Email</p>
                    <p className="text-lg font-medium">info@guesthouse-gabala.az</p>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Адрес</p>
                    <p className="text-lg font-medium">Азербайджан, Габала</p>
                    <p className="text-sm text-white/60">горно-лесная местность</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Быстрая заявка</CardTitle>
                <CardDescription className="text-white/60">Оставьте заявку и мы перезвоним</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault()
                  alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.')
                }}>
                  <Input 
                    placeholder="Ваше имя" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Input 
                    placeholder="Телефон" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Textarea 
                    placeholder="Сообщение" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    rows={3}
                  />
                  <Button type="submit" className="w-full bg-white text-primary hover:bg-white/90">
                    <Send className="w-4 h-4 mr-2" />
                    Отправить
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Mountain className="w-6 h-6" />
              <span className="font-semibold">Guest House Gabala</span>
            </div>
            <p className="text-sm text-background/60">
              © 2024 Все права защищены. Азербайджан, Габала.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="text-background/60 hover:text-background">
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Dialog */}
      <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {!isAdmin ? (
            <>
              <DialogHeader>
                <DialogTitle>Админ-панель</DialogTitle>
                <DialogDescription>Введите пароль для доступа</DialogDescription>
              </DialogHeader>
              <div className="flex gap-2">
                <Input 
                  type="password" 
                  placeholder="Пароль" 
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
                <Button onClick={handleAdminLogin}>Войти</Button>
              </div>
              <p className="text-xs text-muted-foreground">Демо пароль: admin123</p>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Панель управления</DialogTitle>
                <DialogDescription>Управление бронированиями и номерами</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="bookings">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="bookings">Бронирования</TabsTrigger>
                  <TabsTrigger value="pending">Ожидающие</TabsTrigger>
                  <TabsTrigger value="confirmed">Подтверждённые</TabsTrigger>
                  <TabsTrigger value="rooms">Номера</TabsTrigger>
                </TabsList>
                <TabsContent value="bookings" className="mt-4">
                  <div className="space-y-4">
                    {bookings.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">Нет бронирований</p>
                    ) : (
                      bookings.map((booking) => (
                        <Card key={booking.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <p className="font-medium">{booking.guestName}</p>
                                <p className="text-sm text-muted-foreground">{booking.guestPhone}</p>
                                <p className="text-sm">
                                  {format(new Date(booking.checkIn), 'dd MMM', { locale: ru })} - {format(new Date(booking.checkOut), 'dd MMM', { locale: ru })}
                                </p>
                                <p className="text-xs text-muted-foreground">Номер: {booking.room?.name}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={
                                  booking.status === 'confirmed' ? 'bg-green-500' :
                                  booking.status === 'cancelled' ? 'bg-red-500' :
                                  'bg-yellow-500'
                                }>
                                  {booking.status === 'confirmed' ? 'Подтверждено' :
                                   booking.status === 'cancelled' ? 'Отменено' : 'Ожидание'}
                                </Badge>
                                {booking.status === 'pending' && (
                                  <div className="flex gap-1">
                                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateBookingStatus(booking.id, 'confirmed')}>
                                      <Check className="w-4 h-4 text-green-500" />
                                    </Button>
                                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateBookingStatus(booking.id, 'cancelled')}>
                                      <XCircle className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="pending" className="mt-4">
                  <div className="space-y-4">
                    {bookings.filter(b => b.status === 'pending').length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">Нет ожидающих бронирований</p>
                    ) : (
                      bookings.filter(b => b.status === 'pending').map((booking) => (
                        <Card key={booking.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <p className="font-medium">{booking.guestName}</p>
                                <p className="text-sm text-muted-foreground">{booking.guestPhone}</p>
                                <p className="text-sm">
                                  {format(new Date(booking.checkIn), 'dd MMM', { locale: ru })} - {format(new Date(booking.checkOut), 'dd MMM', { locale: ru })}
                                </p>
                                <p className="text-xs text-muted-foreground">Номер: {booking.room?.name}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => updateBookingStatus(booking.id, 'confirmed')}>
                                  <Check className="w-4 h-4 mr-1" /> Подтвердить
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => updateBookingStatus(booking.id, 'cancelled')}>
                                  <XCircle className="w-4 h-4 mr-1" /> Отклонить
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="confirmed" className="mt-4">
                  <div className="space-y-4">
                    {bookings.filter(b => b.status === 'confirmed').length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">Нет подтверждённых бронирований</p>
                    ) : (
                      bookings.filter(b => b.status === 'confirmed').map((booking) => (
                        <Card key={booking.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <p className="font-medium">{booking.guestName}</p>
                                <p className="text-sm text-muted-foreground">{booking.guestPhone}</p>
                                <p className="text-sm">
                                  {format(new Date(booking.checkIn), 'dd MMM', { locale: ru })} - {format(new Date(booking.checkOut), 'dd MMM', { locale: ru })}
                                </p>
                                <p className="text-xs text-muted-foreground">Номер: {booking.room?.name}</p>
                              </div>
                              <Badge className="bg-green-500">Подтверждено</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="rooms" className="mt-4">
                  <div className="space-y-4">
                    {rooms.map((room) => (
                      <Card key={room.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-medium">{room.name}</p>
                              <p className="text-sm text-muted-foreground">до {room.capacity} гостей</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Цена:</span>
                              <Input 
                                type="number" 
                                className="w-24" 
                                defaultValue={room.price}
                                id={`price-${room.id}`}
                              />
                              <span className="text-sm">AZN</span>
                              <Button 
                                size="sm" 
                                onClick={async () => {
                                  const input = document.getElementById(`price-${room.id}`) as HTMLInputElement
                                  const newPrice = input?.value
                                  if (newPrice) {
                                    try {
                                      const res = await fetch('/api/rooms', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ id: room.id, price: newPrice })
                                      })
                                      if (res.ok) {
                                        // Обновляем локальное состояние
                                        setRooms(rooms.map(r => r.id === room.id ? {...r, price: parseFloat(newPrice)} : r))
                                        alert('Цена обновлена!')
                                      }
                                    } catch {
                                      alert('Ошибка при обновлении')
                                    }
                                  }
                                }}
                              >
                                Сохранить
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
