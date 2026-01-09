/**
 * Seed data for Komi Republic tourist attractions
 * Run this script to populate the database with initial data
 */

export const categories = [
  {
    name: "Nature",
    nameRu: "Природа",
    slug: "nature"
  },
  {
    name: "Museums",
    nameRu: "Музеи",
    slug: "museums"
  },
  {
    name: "Architecture",
    nameRu: "Архитектура",
    slug: "architecture"
  },
  {
    name: "Parks",
    nameRu: "Парки",
    slug: "parks"
  },
  {
    name: "Cultural Sites",
    nameRu: "Культурные объекты",
    slug: "cultural-sites"
  }
];

export const places = [
  {
    name: "Manpupuner Rock Formations",
    nameRu: "Маньпупунёр",
    description: "The Seven Strong Men rock formations are a set of seven stone pillars located west of the Ural mountains in the Troitsko-Pechorsky District. These natural monuments are considered one of the Seven Wonders of Russia.",
    descriptionRu: "Столбы выветривания Маньпупунёр — геологический памятник в Троицко-Печорском районе Республики Коми. Находятся на территории Печоро-Илычского заповедника на горе Мань-Пупу-нёр. Являются одним из семи чудес России.",
    category: "Nature",
    categoryRu: "Природа",
    rating: 4.9,
    address: "Troitsko-Pechorsky District, Komi Republic",
    addressRu: "Троицко-Печорский район, Республика Коми",
    openingHours: "24/7 (permit required)",
    openingHoursRu: "Круглосуточно (требуется разрешение)",
    entryFee: "Free (permit required)",
    entryFeeRu: "Бесплатно (требуется разрешение)",
    latitude: 62.2542,
    longitude: 59.4542,
    amenities: ["hiking", "photography", "camping"],
    isOpen: true
  },
  {
    name: "Pechora-Ilych Nature Reserve",
    nameRu: "Печоро-Илычский заповедник",
    description: "One of the oldest nature reserves in Russia, established in 1930. It protects virgin forests and is home to diverse wildlife including brown bears, wolves, and rare bird species.",
    descriptionRu: "Один из старейших заповедников России, основан в 1930 году. Охраняет девственные леса и является домом для разнообразной фауны, включая бурых медведей, волков и редких видов птиц.",
    category: "Nature",
    categoryRu: "Природа",
    rating: 4.8,
    address: "Troitsko-Pechorsky District, Komi Republic",
    addressRu: "Троицко-Печорский район, Республика Коми",
    openingHours: "By appointment",
    openingHoursRu: "По предварительной записи",
    entryFee: "Varies by tour",
    entryFeeRu: "Зависит от экскурсии",
    latitude: 62.0833,
    longitude: 57.1667,
    amenities: ["guided_tours", "wildlife_watching", "research_center"],
    isOpen: true
  },
  {
    name: "National Museum of Komi Republic",
    nameRu: "Национальный музей Республики Коми",
    description: "The main museum of the republic, featuring exhibitions on local history, culture, nature, and ethnography. Houses over 250,000 items including archaeological finds and traditional Komi artifacts.",
    descriptionRu: "Главный музей республики с экспозициями по истории, культуре, природе и этнографии региона. Хранит более 250 000 экспонатов, включая археологические находки и традиционные коми артефакты.",
    category: "Museums",
    categoryRu: "Музеи",
    rating: 4.6,
    address: "Green Street 1, Syktyvkar, Komi Republic, 167000",
    addressRu: "ул. Зеленая, 1, Сыктывкар, Республика Коми, 167000",
    openingHours: "Tue-Sun: 10:00-18:00",
    openingHoursRu: "Вт-Вс: 10:00-18:00",
    entryFee: "150-300 RUB",
    entryFeeRu: "150-300 руб",
    latitude: 61.6684,
    longitude: 50.8363,
    amenities: ["guided_tours", "gift_shop", "cafe", "wheelchair_accessible"],
    isOpen: true
  },
  {
    name: "Stephen of Perm Cathedral",
    nameRu: "Стефановский собор",
    description: "A beautiful Orthodox cathedral in Syktyvkar, named after Saint Stephen of Perm who Christianized the Komi people in the 14th century. The current building was constructed in the 1990s.",
    descriptionRu: "Красивый православный собор в Сыктывкаре, названный в честь святителя Стефана Пермского, крестившего народ коми в XIV веке. Современное здание построено в 1990-х годах.",
    category: "Architecture",
    categoryRu: "Архитектура",
    rating: 4.7,
    address: "Sovetskaya Street 44, Syktyvkar, Komi Republic, 167000",
    addressRu: "ул. Советская, 44, Сыктывкар, Республика Коми, 167000",
    openingHours: "Daily: 7:00-19:00",
    openingHoursRu: "Ежедневно: 7:00-19:00",
    entryFee: "Free",
    entryFeeRu: "Бесплатно",
    latitude: 61.6693,
    longitude: 50.8272,
    amenities: ["religious_services", "architecture", "photography"],
    isOpen: true
  },
  {
    name: "Syktyvkar City Park",
    nameRu: "Центральный парк культуры и отдыха",
    description: "The main recreational park in Syktyvkar, offering walking paths, playgrounds, and seasonal activities. A popular spot for locals and tourists to relax.",
    descriptionRu: "Главный парк отдыха в Сыктывкаре с пешеходными дорожками, детскими площадками и сезонными развлечениями. Популярное место отдыха для местных жителей и туристов.",
    category: "Parks",
    categoryRu: "Парки",
    rating: 4.4,
    address: "Kirov Street, Syktyvkar, Komi Republic, 167000",
    addressRu: "ул. Кирова, Сыктывкар, Республика Коми, 167000",
    openingHours: "Daily: 6:00-23:00",
    openingHoursRu: "Ежедневно: 6:00-23:00",
    entryFee: "Free",
    entryFeeRu: "Бесплатно",
    latitude: 61.6650,
    longitude: 50.8200,
    amenities: ["playground", "walking_paths", "benches", "seasonal_events"],
    isOpen: true
  },
  {
    name: "Komi Republican Drama Theatre",
    nameRu: "Коми республиканский театр драмы",
    description: "The main drama theatre of the republic, performing plays in both Russian and Komi languages. Features classical and contemporary productions.",
    descriptionRu: "Главный драматический театр республики, ставящий спектакли на русском и коми языках. В репертуаре классические и современные постановки.",
    category: "Cultural Sites",
    categoryRu: "Культурные объекты",
    rating: 4.5,
    address: "Pervomayskaya Street 57, Syktyvkar, Komi Republic, 167000",
    addressRu: "ул. Первомайская, 57, Сыктывкар, Республика Коми, 167000",
    openingHours: "Box office: Mon-Sun 10:00-19:00",
    openingHoursRu: "Касса: Пн-Вс 10:00-19:00",
    entryFee: "300-1500 RUB",
    entryFeeRu: "300-1500 руб",
    latitude: 61.6700,
    longitude: 50.8350,
    amenities: ["performances", "box_office", "cloakroom"],
    isOpen: true
  },
  {
    name: "Yugyd Va National Park",
    nameRu: "Национальный парк Югыд ва",
    description: "The largest national park in Russia, covering over 18,000 square kilometers. Part of the Virgin Komi Forests UNESCO World Heritage Site. Offers pristine wilderness and diverse ecosystems.",
    descriptionRu: "Крупнейший национальный парк России площадью более 18 000 квадратных километров. Входит в объект Всемирного наследия ЮНЕСКО «Девственные леса Коми». Предлагает нетронутую дикую природу и разнообразные экосистемы.",
    category: "Nature",
    categoryRu: "Природа",
    rating: 4.9,
    address: "Vuktyl District, Komi Republic",
    addressRu: "Вуктыльский район, Республика Коми",
    openingHours: "24/7 (registration required)",
    openingHoursRu: "Круглосуточно (требуется регистрация)",
    entryFee: "Varies by activity",
    entryFeeRu: "Зависит от вида деятельности",
    latitude: 64.5000,
    longitude: 59.0000,
    amenities: ["hiking", "camping", "fishing", "wildlife_watching", "rafting"],
    isOpen: true
  },
  {
    name: "Finno-Ugric Ethnopark",
    nameRu: "Финно-угорский этнопарк",
    description: "An open-air museum showcasing the traditional culture and lifestyle of Finno-Ugric peoples. Features authentic dwellings, workshops, and cultural demonstrations.",
    descriptionRu: "Музей под открытым небом, демонстрирующий традиционную культуру и быт финно-угорских народов. Представлены аутентичные жилища, мастерские и культурные демонстрации.",
    category: "Cultural Sites",
    categoryRu: "Культурные объекты",
    rating: 4.6,
    address: "Ыб village, Syktyvdinsky District, Komi Republic",
    addressRu: "село Ыб, Сыктывдинский район, Республика Коми",
    openingHours: "Daily: 10:00-18:00 (summer), 10:00-17:00 (winter)",
    openingHoursRu: "Ежедневно: 10:00-18:00 (лето), 10:00-17:00 (зима)",
    entryFee: "200-400 RUB",
    entryFeeRu: "200-400 руб",
    latitude: 61.7500,
    longitude: 50.7500,
    amenities: ["guided_tours", "workshops", "traditional_crafts", "gift_shop"],
    isOpen: true
  },
  {
    name: "Ust-Vym Historical and Cultural Complex",
    nameRu: "Историко-культурный комплекс Усть-Вымь",
    description: "The site of the ancient capital of the Komi people. Features archaeological remains and a museum dedicated to Saint Stephen of Perm and the early history of Christianity in the region.",
    descriptionRu: "Место древней столицы народа коми. Представлены археологические остатки и музей, посвященный святителю Стефану Пермскому и ранней истории христианства в регионе.",
    category: "Cultural Sites",
    categoryRu: "Культурные объекты",
    rating: 4.3,
    address: "Ust-Vym village, Ust-Vymsky District, Komi Republic",
    addressRu: "село Усть-Вымь, Усть-Вымский район, Республика Коми",
    openingHours: "Tue-Sun: 10:00-17:00",
    openingHoursRu: "Вт-Вс: 10:00-17:00",
    entryFee: "100-200 RUB",
    entryFeeRu: "100-200 руб",
    latitude: 61.8333,
    longitude: 50.1667,
    amenities: ["museum", "archaeological_site", "guided_tours"],
    isOpen: true
  },
  {
    name: "Syktyvkar Art Museum",
    nameRu: "Национальная галерея Республики Коми",
    description: "The main art museum of the republic, featuring Russian and Komi art from the 18th century to present. Includes paintings, sculptures, and decorative arts.",
    descriptionRu: "Главный художественный музей республики с коллекцией русского и коми искусства с XVIII века до наших дней. Включает живопись, скульптуру и декоративно-прикладное искусство.",
    category: "Museums",
    categoryRu: "Музеи",
    rating: 4.5,
    address: "Kirov Street 44, Syktyvkar, Komi Republic, 167000",
    addressRu: "ул. Кирова, 44, Сыктывкар, Республика Коми, 167000",
    openingHours: "Wed-Sun: 10:00-18:00",
    openingHoursRu: "Ср-Вс: 10:00-18:00",
    entryFee: "100-250 RUB",
    entryFeeRu: "100-250 руб",
    latitude: 61.6670,
    longitude: 50.8210,
    amenities: ["exhibitions", "guided_tours", "gift_shop", "wheelchair_accessible"],
    isOpen: true
  }
];

export const reviews = [
  {
    author: "Иван Петров",
    rating: 5,
    comment: "Невероятное место! Маньпупунёр - это действительно чудо природы. Путь туда непростой, но оно того стоит. Виды просто захватывающие!",
    date: "2025-08-15T10:00:00.000Z",
    placeIndex: 0 // Manpupuner
  },
  {
    author: "Elena Sokolova",
    rating: 5,
    comment: "Amazing natural monument! The rock formations are breathtaking. Make sure to get proper permits before visiting.",
    date: "2025-09-20T14:30:00.000Z",
    placeIndex: 0
  },
  {
    author: "Мария Иванова",
    rating: 5,
    comment: "Заповедник прекрасен! Видели медведей, множество птиц. Экскурсоводы очень знающие и дружелюбные.",
    date: "2025-07-10T11:00:00.000Z",
    placeIndex: 1 // Pechora-Ilych
  },
  {
    author: "Александр Смирнов",
    rating: 4,
    comment: "Отличный музей с богатой коллекцией. Узнал много нового о истории и культуре коми народа. Рекомендую!",
    date: "2025-10-05T15:20:00.000Z",
    placeIndex: 2 // National Museum
  },
  {
    author: "Anna Volkova",
    rating: 5,
    comment: "Beautiful cathedral with stunning architecture. A peaceful place for reflection and prayer.",
    date: "2025-09-12T09:00:00.000Z",
    placeIndex: 3 // Cathedral
  },
  {
    author: "Дмитрий Козлов",
    rating: 4,
    comment: "Хорошее место для прогулок с семьей. Чисто, ухоженно, есть детские площадки.",
    date: "2025-08-25T16:45:00.000Z",
    placeIndex: 4 // Park
  },
  {
    author: "Ольга Новикова",
    rating: 5,
    comment: "Смотрели спектакль на коми языке - очень интересный опыт! Актеры талантливые, постановка качественная.",
    date: "2025-10-18T20:00:00.000Z",
    placeIndex: 5 // Theatre
  },
  {
    author: "Sergey Morozov",
    rating: 5,
    comment: "The largest national park in Russia! Perfect for hiking and camping. Pristine nature and incredible landscapes.",
    date: "2025-07-28T12:00:00.000Z",
    placeIndex: 6 // Yugyd Va
  },
  {
    author: "Татьяна Лебедева",
    rating: 4,
    comment: "Очень познавательный этнопарк. Интересно узнать о традициях финно-угорских народов. Мастер-классы понравились!",
    date: "2025-09-05T13:30:00.000Z",
    placeIndex: 7 // Ethnopark
  },
  {
    author: "Павел Васильев",
    rating: 4,
    comment: "Историческое место с богатой историей. Музей небольшой, но информативный.",
    date: "2025-08-08T11:15:00.000Z",
    placeIndex: 8 // Ust-Vym
  },
  {
    author: "Екатерина Морозова",
    rating: 5,
    comment: "Прекрасная коллекция искусства! Особенно понравились работы местных художников.",
    date: "2025-10-22T14:00:00.000Z",
    placeIndex: 9 // Art Museum
  },
  {
    author: "Nikolai Petrov",
    rating: 4,
    comment: "Great museum with interesting exhibitions. The staff is very helpful and knowledgeable.",
    date: "2025-09-30T10:30:00.000Z",
    placeIndex: 9
  }
];
