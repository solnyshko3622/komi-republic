"""
Management command to seed the database with initial data
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime
from places.models import Category, Place, Review


class Command(BaseCommand):
    help = 'Seed database with initial data for Komi Republic attractions'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')
        
        # Clear existing data
        self.stdout.write('Clearing existing data...')
        Review.objects.all().delete()
        Place.objects.all().delete()
        Category.objects.all().delete()
        
        # Create categories
        self.stdout.write('Creating categories...')
        categories_data = [
            {"name": "Nature", "name_ru": "Природа", "slug": "nature"},
            {"name": "Museums", "name_ru": "Музеи", "slug": "museums"},
            {"name": "Architecture", "name_ru": "Архитектура", "slug": "architecture"},
            {"name": "Parks", "name_ru": "Парки", "slug": "parks"},
            {"name": "Cultural Sites", "name_ru": "Культурные объекты", "slug": "cultural-sites"},
        ]
        
        categories = {}
        for cat_data in categories_data:
            category = Category.objects.create(**cat_data)
            categories[cat_data['slug']] = category
            self.stdout.write(f'  Created category: {category.name_ru}')
        
        # Create places
        self.stdout.write('Creating places...')
        places_data = [
            {
                "name": "Manpupuner Rock Formations",
                "name_ru": "Маньпупунёр",
                "description": "The Seven Strong Men rock formations are a set of seven stone pillars located west of the Ural mountains in the Troitsko-Pechorsky District. These natural monuments are considered one of the Seven Wonders of Russia.",
                "description_ru": "Столбы выветривания Маньпупунёр — геологический памятник в Троицко-Печорском районе Республики Коми. Находятся на территории Печоро-Илычского заповедника на горе Мань-Пупу-нёр. Являются одним из семи чудес России.",
                "category": "nature",
                "rating": 4.9,
                "address": "Troitsko-Pechorsky District, Komi Republic",
                "address_ru": "Троицко-Печорский район, Республика Коми",
                "opening_hours": "24/7 (permit required)",
                "opening_hours_ru": "Круглосуточно (требуется разрешение)",
                "entry_fee": "Free (permit required)",
                "entry_fee_ru": "Бесплатно (требуется разрешение)",
                "latitude": 62.2542,
                "longitude": 59.4542,
                "amenities": ["hiking", "photography", "camping"],
            },
            {
                "name": "Pechora-Ilych Nature Reserve",
                "name_ru": "Печоро-Илычский заповедник",
                "description": "One of the oldest nature reserves in Russia, established in 1930. It protects virgin forests and is home to diverse wildlife including brown bears, wolves, and rare bird species.",
                "description_ru": "Один из старейших заповедников России, основан в 1930 году. Охраняет девственные леса и является домом для разнообразной фауны, включая бурых медведей, волков и редких видов птиц.",
                "category": "nature",
                "rating": 4.8,
                "address": "Troitsko-Pechorsky District, Komi Republic",
                "address_ru": "Троицко-Печорский район, Республика Коми",
                "opening_hours": "By appointment",
                "opening_hours_ru": "По предварительной записи",
                "entry_fee": "Varies by tour",
                "entry_fee_ru": "Зависит от экскурсии",
                "latitude": 62.0833,
                "longitude": 57.1667,
                "amenities": ["guided_tours", "wildlife_watching", "research_center"],
            },
            {
                "name": "National Museum of Komi Republic",
                "name_ru": "Национальный музей Республики Коми",
                "description": "The main museum of the republic, featuring exhibitions on local history, culture, nature, and ethnography. Houses over 250,000 items including archaeological finds and traditional Komi artifacts.",
                "description_ru": "Главный музей республики с экспозициями по истории, культуре, природе и этнографии региона. Хранит более 250 000 экспонатов, включая археологические находки и традиционные коми артефакты.",
                "category": "museums",
                "rating": 4.6,
                "address": "Green Street 1, Syktyvkar, Komi Republic, 167000",
                "address_ru": "ул. Зеленая, 1, Сыктывкар, Республика Коми, 167000",
                "opening_hours": "Tue-Sun: 10:00-18:00",
                "opening_hours_ru": "Вт-Вс: 10:00-18:00",
                "entry_fee": "150-300 RUB",
                "entry_fee_ru": "150-300 руб",
                "latitude": 61.6684,
                "longitude": 50.8363,
                "amenities": ["guided_tours", "gift_shop", "cafe", "wheelchair_accessible"],
            },
            {
                "name": "Stephen of Perm Cathedral",
                "name_ru": "Стефановский собор",
                "description": "A beautiful Orthodox cathedral in Syktyvkar, named after Saint Stephen of Perm who Christianized the Komi people in the 14th century. The current building was constructed in the 1990s.",
                "description_ru": "Красивый православный собор в Сыктывкаре, названный в честь святителя Стефана Пермского, крестившего народ коми в XIV веке. Современное здание построено в 1990-х годах.",
                "category": "architecture",
                "rating": 4.7,
                "address": "Sovetskaya Street 44, Syktyvkar, Komi Republic, 167000",
                "address_ru": "ул. Советская, 44, Сыктывкар, Республика Коми, 167000",
                "opening_hours": "Daily: 7:00-19:00",
                "opening_hours_ru": "Ежедневно: 7:00-19:00",
                "entry_fee": "Free",
                "entry_fee_ru": "Бесплатно",
                "latitude": 61.6693,
                "longitude": 50.8272,
                "amenities": ["religious_services", "architecture", "photography"],
            },
            {
                "name": "Syktyvkar City Park",
                "name_ru": "Центральный парк культуры и отдыха",
                "description": "The main recreational park in Syktyvkar, offering walking paths, playgrounds, and seasonal activities. A popular spot for locals and tourists to relax.",
                "description_ru": "Главный парк отдыха в Сыктывкаре с пешеходными дорожками, детскими площадками и сезонными развлечениями. Популярное место отдыха для местных жителей и туристов.",
                "category": "parks",
                "rating": 4.4,
                "address": "Kirov Street, Syktyvkar, Komi Republic, 167000",
                "address_ru": "ул. Кирова, Сыктывкар, Республика Коми, 167000",
                "opening_hours": "Daily: 6:00-23:00",
                "opening_hours_ru": "Ежедневно: 6:00-23:00",
                "entry_fee": "Free",
                "entry_fee_ru": "Бесплатно",
                "latitude": 61.6650,
                "longitude": 50.8200,
                "amenities": ["playground", "walking_paths", "benches", "seasonal_events"],
            },
            {
                "name": "Komi Republican Drama Theatre",
                "name_ru": "Коми республиканский театр драмы",
                "description": "The main drama theatre of the republic, performing plays in both Russian and Komi languages. Features classical and contemporary productions.",
                "description_ru": "Главный драматический театр республики, ставящий спектакли на русском и коми языках. В репертуаре классические и современные постановки.",
                "category": "cultural-sites",
                "rating": 4.5,
                "address": "Pervomayskaya Street 57, Syktyvkar, Komi Republic, 167000",
                "address_ru": "ул. Первомайская, 57, Сыктывкар, Республика Коми, 167000",
                "opening_hours": "Box office: Mon-Sun 10:00-19:00",
                "opening_hours_ru": "Касса: Пн-Вс 10:00-19:00",
                "entry_fee": "300-1500 RUB",
                "entry_fee_ru": "300-1500 руб",
                "latitude": 61.6700,
                "longitude": 50.8350,
                "amenities": ["performances", "box_office", "cloakroom"],
            },
            {
                "name": "Yugyd Va National Park",
                "name_ru": "Национальный парк Югыд ва",
                "description": "The largest national park in Russia, covering over 18,000 square kilometers. Part of the Virgin Komi Forests UNESCO World Heritage Site. Offers pristine wilderness and diverse ecosystems.",
                "description_ru": "Крупнейший национальный парк России площадью более 18 000 квадратных километров. Входит в объект Всемирного наследия ЮНЕСКО «Девственные леса Коми». Предлагает нетронутую дикую природу и разнообразные экосистемы.",
                "category": "nature",
                "rating": 4.9,
                "address": "Vuktyl District, Komi Republic",
                "address_ru": "Вуктыльский район, Республика Коми",
                "opening_hours": "24/7 (registration required)",
                "opening_hours_ru": "Круглосуточно (требуется регистрация)",
                "entry_fee": "Varies by activity",
                "entry_fee_ru": "Зависит от вида деятельности",
                "latitude": 64.5000,
                "longitude": 59.0000,
                "amenities": ["hiking", "camping", "fishing", "wildlife_watching", "rafting"],
            },
            {
                "name": "Finno-Ugric Ethnopark",
                "name_ru": "Финно-угорский этнопарк",
                "description": "An open-air museum showcasing the traditional culture and lifestyle of Finno-Ugric peoples. Features authentic dwellings, workshops, and cultural demonstrations.",
                "description_ru": "Музей под открытым небом, демонстрирующий традиционную культуру и быт финно-угорских народов. Представлены аутентичные жилища, мастерские и культурные демонстрации.",
                "category": "cultural-sites",
                "rating": 4.6,
                "address": "Ыб village, Syktyvdinsky District, Komi Republic",
                "address_ru": "село Ыб, Сыктывдинский район, Республика Коми",
                "opening_hours": "Daily: 10:00-18:00 (summer), 10:00-17:00 (winter)",
                "opening_hours_ru": "Ежедневно: 10:00-18:00 (лето), 10:00-17:00 (зима)",
                "entry_fee": "200-400 RUB",
                "entry_fee_ru": "200-400 руб",
                "latitude": 61.7500,
                "longitude": 50.7500,
                "amenities": ["guided_tours", "workshops", "traditional_crafts", "gift_shop"],
            },
            {
                "name": "Ust-Vym Historical and Cultural Complex",
                "name_ru": "Историко-культурный комплекс Усть-Вымь",
                "description": "The site of the ancient capital of the Komi people. Features archaeological remains and a museum dedicated to Saint Stephen of Perm and the early history of Christianity in the region.",
                "description_ru": "Место древней столицы народа коми. Представлены археологические остатки и музей, посвященный святителю Стефану Пермскому и ранней истории христианства в регионе.",
                "category": "cultural-sites",
                "rating": 4.3,
                "address": "Ust-Vym village, Ust-Vymsky District, Komi Republic",
                "address_ru": "село Усть-Вымь, Усть-Вымский район, Республика Коми",
                "opening_hours": "Tue-Sun: 10:00-17:00",
                "opening_hours_ru": "Вт-Вс: 10:00-17:00",
                "entry_fee": "100-200 RUB",
                "entry_fee_ru": "100-200 руб",
                "latitude": 61.8333,
                "longitude": 50.1667,
                "amenities": ["museum", "archaeological_site", "guided_tours"],
            },
            {
                "name": "Syktyvkar Art Museum",
                "name_ru": "Национальная галерея Республики Коми",
                "description": "The main art museum of the republic, featuring Russian and Komi art from the 18th century to present. Includes paintings, sculptures, and decorative arts.",
                "description_ru": "Главный художественный музей республики с коллекцией русского и коми искусства с XVIII века до наших дней. Включает живопись, скульптуру и декоративно-прикладное искусство.",
                "category": "museums",
                "rating": 4.5,
                "address": "Kirov Street 44, Syktyvkar, Komi Republic, 167000",
                "address_ru": "ул. Кирова, 44, Сыктывкар, Республика Коми, 167000",
                "opening_hours": "Wed-Sun: 10:00-18:00",
                "opening_hours_ru": "Ср-Вс: 10:00-18:00",
                "entry_fee": "100-250 RUB",
                "entry_fee_ru": "100-250 руб",
                "latitude": 61.6670,
                "longitude": 50.8210,
                "amenities": ["exhibitions", "guided_tours", "gift_shop", "wheelchair_accessible"],
            },
        ]
        
        places = []
        for place_data in places_data:
            category_slug = place_data.pop('category')
            place = Place.objects.create(
                category=categories[category_slug],
                **place_data
            )
            places.append(place)
            self.stdout.write(f'  Created place: {place.name_ru}')
        
        # Create reviews
        self.stdout.write('Creating reviews...')
        reviews_data = [
            {
                "author": "Иван Петров",
                "rating": 5,
                "comment": "Невероятное место! Маньпупунёр - это действительно чудо природы. Путь туда непростой, но оно того стоит. Виды просто захватывающие!",
                "date": "2025-08-15T10:00:00Z",
                "place_index": 0
            },
            {
                "author": "Elena Sokolova",
                "rating": 5,
                "comment": "Amazing natural monument! The rock formations are breathtaking. Make sure to get proper permits before visiting.",
                "date": "2025-09-20T14:30:00Z",
                "place_index": 0
            },
            {
                "author": "Мария Иванова",
                "rating": 5,
                "comment": "Заповедник прекрасен! Видели медведей, множество птиц. Экскурсоводы очень знающие и дружелюбные.",
                "date": "2025-07-10T11:00:00Z",
                "place_index": 1
            },
            {
                "author": "Александр Смирнов",
                "rating": 4,
                "comment": "Отличный музей с богатой коллекцией. Узнал много нового о истории и культуре коми народа. Рекомендую!",
                "date": "2025-10-05T15:20:00Z",
                "place_index": 2
            },
            {
                "author": "Anna Volkova",
                "rating": 5,
                "comment": "Beautiful cathedral with stunning architecture. A peaceful place for reflection and prayer.",
                "date": "2025-09-12T09:00:00Z",
                "place_index": 3
            },
            {
                "author": "Дмитрий Козлов",
                "rating": 4,
                "comment": "Хорошее место для прогулок с семьей. Чисто, ухоженно, есть детские площадки.",
                "date": "2025-08-25T16:45:00Z",
                "place_index": 4
            },
            {
                "author": "Ольга Новикова",
                "rating": 5,
                "comment": "Смотрели спектакль на коми языке - очень интересный опыт! Актеры талантливые, постановка качественная.",
                "date": "2025-10-18T20:00:00Z",
                "place_index": 5
            },
            {
                "author": "Sergey Morozov",
                "rating": 5,
                "comment": "The largest national park in Russia! Perfect for hiking and camping. Pristine nature and incredible landscapes.",
                "date": "2025-07-28T12:00:00Z",
                "place_index": 6
            },
            {
                "author": "Татьяна Лебедева",
                "rating": 4,
                "comment": "Очень познавательный этнопарк. Интересно узнать о традициях финно-угорских народов. Мастер-классы понравились!",
                "date": "2025-09-05T13:30:00Z",
                "place_index": 7
            },
            {
                "author": "Павел Васильев",
                "rating": 4,
                "comment": "Историческое место с богатой историей. Музей небольшой, но информативный.",
                "date": "2025-08-08T11:15:00Z",
                "place_index": 8
            },
            {
                "author": "Екатерина Морозова",
                "rating": 5,
                "comment": "Прекрасная коллекция искусства! Особенно понравились работы местных художников.",
                "date": "2025-10-22T14:00:00Z",
                "place_index": 9
            },
            {
                "author": "Nikolai Petrov",
                "rating": 4,
                "comment": "Great museum with interesting exhibitions. The staff is very helpful and knowledgeable.",
                "date": "2025-09-30T10:30:00Z",
                "place_index": 9
            },
        ]
        
        for review_data in reviews_data:
            place_index = review_data.pop('place_index')
            date_str = review_data.pop('date')
            date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            
            review = Review.objects.create(
                place=places[place_index],
                date=date_obj,
                **review_data
            )
            self.stdout.write(f'  Created review by {review.author} for {review.place.name_ru}')
        
        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
        self.stdout.write(f'Created {Category.objects.count()} categories')
        self.stdout.write(f'Created {Place.objects.count()} places')
        self.stdout.write(f'Created {Review.objects.count()} reviews')
