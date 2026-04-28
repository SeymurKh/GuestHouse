'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  Mountain, Trees, Phone, Mail, MapPin, Star, Users, 
  ChevronRight, Menu, X, Wifi, 
  Thermometer, Tv, Coffee, Bath, Shield, Sparkles, 
  Flame, Car, Utensils, Heart, MessageCircle, Send,
  Settings
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
  
  // Admin state
  const [adminOpen, setAdminOpen] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0)

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

  // Auto-slide effect
  useEffect(() => {
    if (rooms.length === 0) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % rooms.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [rooms.length])

  // Admin login
  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdmin(true)
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
      <section className="min-h-screen flex items-center pt-16 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Side - Welcome Text */}
            <div className="space-y-8">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Trees className="w-3 h-3 mr-1" />
                Азербайджан, Габала
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Добро пожаловать в<br />
                <span className="text-primary">уголок спокойствия</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                Оставьте суету позади и окунитесь в атмосферу тепла и уюта. 
                Наш гостевой дом — место, где природа обнимает вас, а время замедляет свой бег.
              </p>
              <p className="text-muted-foreground max-w-lg">
                Проснитесь под пение птиц, вдохните свежий горный воздух и проведите незабываемые дни 
                в окружении величественных гор и густых лесов Габалы.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 px-8">
                  <a href="#rooms">
                    Посмотреть номера
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary/20">
                  <a href={`tel:${phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Связаться с нами
                  </a>
                </Button>
              </div>
            </div>
            
            {/* Right Side - Sliding Images */}
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
              <div className="absolute inset-0 flex items-center justify-center">
                {rooms.map((room, index) => (
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
                    <Card className="overflow-hidden shadow-2xl">
                      <div className="relative h-64 md:h-72">
                        <img 
                          src={JSON.parse(room.images)[0] || '/images/hero-bg.jpg'} 
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white text-xl font-semibold mb-1">{room.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary text-white">
                              {room.price} AZN / ночь
                            </Badge>
                            <Badge variant="secondary" className="bg-white/20 text-white border-0">
                              <Users className="w-3 h-3 mr-1" />
                              {room.capacity} гостей
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
                {rooms.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide 
                        ? 'bg-primary w-8' 
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>
            </div>
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
                  <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90 mt-auto">
                    <a href={`tel:${phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Узнать подробнее
                    </a>
                  </Button>
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
        <DialogContent className="sm:max-w-[500px]">
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
                <DialogTitle>Управление номерами</DialogTitle>
                <DialogDescription>Изменение цен на номера</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
