import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Инициализация начальных данных
export async function POST() {
  try {
    // Проверяем, есть ли уже номера
    const existingRooms = await db.room.count()
    
    if (existingRooms > 0) {
      return NextResponse.json({ message: 'Данные уже инициализированы' })
    }

    // Создаем начальные номера
    const rooms = await db.room.createMany({
      data: [
        {
          name: 'Стандарт',
          description: 'Уютный номер с видом на горы. Идеально подходит для пар или одиночных путешественников. В номере: двуспальная кровать, кондиционер, телевизор, Wi-Fi.',
          price: 150,
          capacity: 2,
          amenities: JSON.stringify(['Wi-Fi', 'Кондиционер', 'ТВ', 'Душ', 'Вид на горы']),
          images: JSON.stringify(['/images/room-standard.jpg']),
          isAvailable: true
        },
        {
          name: 'Комфорт',
          description: 'Просторный номер с балконом и панорамным видом на лес и горы. Большая двуспальная кровать, зона отдыха, мини-бар.',
          price: 250,
          capacity: 2,
          amenities: JSON.stringify(['Wi-Fi', 'Кондиционер', 'ТВ', 'Мини-бар', 'Балкон', 'Вид на горы', 'Сейф']),
          images: JSON.stringify(['/images/room-comfort.jpg']),
          isAvailable: true
        },
        {
          name: 'Семейный люкс',
          description: 'Просторный семейный номер с двумя спальнями и гостиной. Идеален для семей с детьми. Полностью оборудованная кухня.',
          price: 400,
          capacity: 5,
          amenities: JSON.stringify(['Wi-Fi', 'Кондиционер', 'ТВ', 'Кухня', '2 спальни', 'Гостиная', 'Ванна', 'Вид на лес']),
          images: JSON.stringify(['/images/room-family.jpg']),
          isAvailable: true
        },
        {
          name: 'Премиум коттедж',
          description: 'Отдельный коттедж с камином, террасой и джакузи. Максимальная приватность в окружении природы. Идеально для романтического отдыха.',
          price: 600,
          capacity: 4,
          amenities: JSON.stringify(['Wi-Fi', 'Камин', 'Джакузи', 'Терраса', 'Кухня', 'Барбекю', 'Частный сад', 'Парковка']),
          images: JSON.stringify(['/images/room-cottage.jpg']),
          isAvailable: true
        }
      ]
    })

    // Создаем настройки сайта
    await db.siteSettings.create({
      data: {
        phone: '+994 50 123 45 67',
        email: 'info@guesthouse-gabala.az',
        address: 'Азербайджан, Габала, горно-лесная местность',
        description: 'Уютный гостевой дом в горах Габалы. Отдых в окружении величественных гор и густых лесов.'
      }
    })

    // Создаем начальные отзывы
    await db.review.createMany({
      data: [
        {
          guestName: 'Али Мамедов',
          rating: 5,
          comment: 'Потрясающее место! Горы, лес, тишина и покой. Обязательно вернёмся!',
          isApproved: true
        },
        {
          guestName: 'Елена Петрова',
          rating: 5,
          comment: 'Идеальный отдых для семьи. Дети были в восторге от природы. Персонал очень приветливый.',
          isApproved: true
        },
        {
          guestName: 'Мехмет Кязимов',
          rating: 4,
          comment: 'Отличное место для расслабления. Виды невероятные. Рекомендую семейный люкс.',
          isApproved: true
        }
      ]
    })

    return NextResponse.json({ 
      message: 'Данные успешно инициализированы',
      roomsCreated: rooms.count 
    })
  } catch (error) {
    console.error('Error initializing data:', error)
    return NextResponse.json({ error: 'Ошибка при инициализации данных' }, { status: 500 })
  }
}
