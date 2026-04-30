// Internationalization - Translations
export type Language = 'ru' | 'az' | 'en'

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'az', name: 'Azərbaycan', flag: '/flags/az.png' },
  { code: 'ru', name: 'Русский', flag: '/flags/ru.svg' },
  { code: 'en', name: 'English', flag: '/flags/en.svg' },
]

export const translations = {
  ru: {
    // Header
    nav: {
      rooms: 'Домики',
      gallery: 'Галерея',
      contact: 'Контакты',
      call: 'Позвонить',
    },
    // Hero
    hero: {
      location: 'Азербайджан, Исмаиллы',
      title1: 'Добро пожаловать в',
      title2: 'уголок спокойствия',
      description: 'Оставьте суету позади и окунитесь в атмосферу тепла и уюта. Наш гостевой дом — место, где природа обнимает вас.',
      btnRooms: 'Наши домики',
      btnContact: 'Связаться',
      perNight: 'AZN / ночь',
      guests: 'гостей',
    },
    // Rooms
    rooms: {
      badge: 'Размещение',
      title: 'Наши домики',
      description: 'Два уникальных домика для вашего идеального отдыха',
      perNight: 'AZN / ночь',
      upTo: 'до',
      guests: 'гостей',
      details: 'Подробнее',
    },
    // Room Modal
    modal: {
      description: 'Описание',
      conditions: 'Условия проживания',
      advantages: 'Преимущества',
      amenities: 'Удобства',
      images: 'Изображения',
      book: 'Забронировать',
      bookPhone: 'Забронировать по телефону',
    },
    // Gallery
    gallery: {
      badge: 'Галерея',
      title: 'Окружающая природа',
      description: 'Горы, леса, водопады — всё это рядом с нами',
      forest: 'Лесные тропы',
      waterfall: 'Горный водопад',
      terrace: 'Отдых на террасе',
      cottage: 'Домик',
      landscape: 'Горный пейзаж',
      mountainView: 'Вид на горы',
    },
    // Contact
    contact: {
      badge: 'Контакты',
      title: 'Свяжитесь с нами',
      description: 'Готовы ответить на все ваши вопросы и помочь с выбором домика',
      phone: 'Телефон',
      email: 'Email',
      address: 'Адрес',
      addressValue: 'Азербайджан, Исмаиллы',
    },
    // Footer
    footer: {
      rights: 'Все права защищены',
    },
    // Loading
    loading: 'Загрузка...',
    // Admin
    admin: {
      title: 'Админ-панель',
      passwordPrompt: 'Введите пароль для доступа',
      password: 'Пароль',
      login: 'Войти',
      demoPassword: 'Демо пароль: admin123',
      manageTitle: 'Управление домиками',
      manageDesc: 'Редактирование информации (только 2 домика)',
      edit: 'Редактировать',
      save: 'Сохранить',
      cancel: 'Отмена',
      saved: 'Сохранено успешно!',
      name: 'Название',
      price: 'Цена (AZN)',
      capacity: 'Вместимость (гостей)',
      description: 'Описание',
      conditionsLabel: 'Условия проживания',
      advantagesLabel: 'Преимущества (каждое с новой строки)',
      amenitiesLabel: 'Удобства (через запятую)',
      images: 'Изображения',
      addPhoto: 'Добавить фото',
      wrongPassword: 'Неверный пароль',
    },
    // Amenities
    amenities: {
      wifi: 'Wi-Fi',
      ac: 'Кондиционер',
      tv: 'ТВ',
      minibar: 'Мини-бар',
      bath: 'Ванна',
      shower: 'Душ',
      fireplace: 'Камин',
      kitchen: 'Кухня',
      parking: 'Парковка',
      safe: 'Сейф',
    },
  },
  az: {
    // Header
    nav: {
      rooms: 'Eviklər',
      gallery: 'Qalereya',
      contact: 'Əlaqə',
      call: 'Zəng et',
    },
    // Hero
    hero: {
      location: 'Azərbaycan, İsmayıllı',
      title1: 'Xoş gəlmisiniz',
      title2: 'sakitlik guşəsinə',
      description: 'İstidirahanı arxada qoyun və istilik və rahatlıq atmosferinə dalın. Qonaq evimiz - təbiətin sizi qucaqladığı yer.',
      btnRooms: 'Eviklərimiz',
      btnContact: 'Əlaqə',
      perNight: 'AZN / gecə',
      guests: 'qonaq',
    },
    // Rooms
    rooms: {
      badge: 'Qalmaq',
      title: 'Eviklərimiz',
      description: 'Mükəmməl istirahətiniz üçün iki unikal evik',
      perNight: 'AZN / gecə',
      upTo: 'ədək',
      guests: 'qonaq',
      details: 'Ətraflı',
    },
    // Room Modal
    modal: {
      description: 'Təsvir',
      conditions: 'Qalma şərtləri',
      advantages: 'Üstünlüklər',
      amenities: 'Rahatlıqlar',
      images: 'Şəkillər',
      book: 'Rezervasiya',
      bookPhone: 'Telefonla rezervasiya',
    },
    // Gallery
    gallery: {
      badge: 'Qalereya',
      title: 'Ətraf təbiət',
      description: 'Dağlar, meşələr, şəlalələr — hamısı bizim yaxınlığımızda',
      forest: 'Meşə cığırları',
      waterfall: 'Dağ şəlaləsi',
      terrace: 'Terasada istirahət',
      cottage: 'Evik',
      landscape: 'Dağ mənzərəsi',
      mountainView: 'Dağlara baxış',
    },
    // Contact
    contact: {
      badge: 'Əlaqə',
      title: 'Bizimlə əlaqə saxlayın',
      description: 'Bütün suallarınıza cavab verməyə və evik seçməyə kömək etməyə hazırdıq',
      phone: 'Telefon',
      email: 'Email',
      address: 'Ünvan',
      addressValue: 'Azərbaycan, İsmayıllı',
    },
    // Footer
    footer: {
      rights: 'Bütün hüquqlar qorunur',
    },
    // Loading
    loading: 'Yüklənir...',
    // Admin
    admin: {
      title: 'Admin panel',
      passwordPrompt: 'Giriş üçün parol daxil edin',
      password: 'Parol',
      login: 'Daxil ol',
      demoPassword: 'Demo parol: admin123',
      manageTitle: 'Eviklərin idarə edilməsi',
      manageDesc: 'Məlumatların redaktə edilməsi (yalnız 2 evik)',
      edit: 'Redaktə et',
      save: 'Yadda saxla',
      cancel: 'Ləğv et',
      saved: 'Uğurla saxlanıldı!',
      name: 'Ad',
      price: 'Qiymət (AZN)',
      capacity: 'Tutum (qonaq)',
      description: 'Təsvir',
      conditionsLabel: 'Qalma şərtləri',
      advantagesLabel: 'Üstünlüklər (hər biri yeni sətirdə)',
      amenitiesLabel: 'Rahatlıqlar (vergül ilə)',
      images: 'Şəkillər',
      addPhoto: 'Şəkil əlavə et',
      wrongPassword: 'Yanlış parol',
    },
    // Amenities
    amenities: {
      wifi: 'Wi-Fi',
      ac: 'Kondisioner',
      tv: 'TV',
      minibar: 'Mini-bar',
      bath: 'Vanna',
      shower: 'Duş',
      fireplace: 'Möhtəşəm',
      kitchen: 'Mətbəx',
      parking: 'Parkovka',
      safe: 'Seyf',
    },
  },
  en: {
    // Header
    nav: {
      rooms: 'Cottages',
      gallery: 'Gallery',
      contact: 'Contact',
      call: 'Call',
    },
    // Hero
    hero: {
      location: 'Azerbaijan, Ismayilli',
      title1: 'Welcome to a',
      title2: 'corner of tranquility',
      description: 'Leave the hustle behind and immerse yourself in warmth and comfort. Our guest house is a place where nature embraces you.',
      btnRooms: 'Our Cottages',
      btnContact: 'Contact Us',
      perNight: 'AZN / night',
      guests: 'guests',
    },
    // Rooms
    rooms: {
      badge: 'Accommodation',
      title: 'Our Cottages',
      description: 'Two unique cottages for your perfect getaway',
      perNight: 'AZN / night',
      upTo: 'up to',
      guests: 'guests',
      details: 'Details',
    },
    // Room Modal
    modal: {
      description: 'Description',
      conditions: 'Accommodation Conditions',
      advantages: 'Advantages',
      amenities: 'Amenities',
      images: 'Images',
      book: 'Book Now',
      bookPhone: 'Book by phone',
    },
    // Gallery
    gallery: {
      badge: 'Gallery',
      title: 'Surrounding Nature',
      description: 'Mountains, forests, waterfalls — all nearby',
      forest: 'Forest Trails',
      waterfall: 'Mountain Waterfall',
      terrace: 'Terrace Relaxation',
      cottage: 'Cottage',
      landscape: 'Mountain Landscape',
      mountainView: 'Mountain View',
    },
    // Contact
    contact: {
      badge: 'Contact',
      title: 'Get in Touch',
      description: 'Ready to answer all your questions and help you choose a cottage',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      addressValue: 'Azerbaijan, Ismayilli',
    },
    // Footer
    footer: {
      rights: 'All rights reserved',
    },
    // Loading
    loading: 'Loading...',
    // Admin
    admin: {
      title: 'Admin Panel',
      passwordPrompt: 'Enter password to access',
      password: 'Password',
      login: 'Login',
      demoPassword: 'Demo password: admin123',
      manageTitle: 'Manage Cottages',
      manageDesc: 'Edit information (only 2 cottages)',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      saved: 'Saved successfully!',
      name: 'Name',
      price: 'Price (AZN)',
      capacity: 'Capacity (guests)',
      description: 'Description',
      conditionsLabel: 'Accommodation Conditions',
      advantagesLabel: 'Advantages (one per line)',
      amenitiesLabel: 'Amenities (comma separated)',
      images: 'Images',
      addPhoto: 'Add Photo',
      wrongPassword: 'Wrong password',
    },
    // Amenities
    amenities: {
      wifi: 'Wi-Fi',
      ac: 'Air Conditioning',
      tv: 'TV',
      minibar: 'Mini-bar',
      bath: 'Bath',
      shower: 'Shower',
      fireplace: 'Fireplace',
      kitchen: 'Kitchen',
      parking: 'Parking',
      safe: 'Safe',
    },
  },
}

export type Translations = typeof translations.ru
