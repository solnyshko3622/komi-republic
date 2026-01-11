# Django Backend для Туристического портала Республики Коми

Это Django REST API backend для туристического портала Республики Коми, заменяющий Strapi.

## Быстрый старт (локальная разработка)

### 1. Создайте виртуальное окружение

```bash
cd komi-republic-django
python3 -m venv venv
```

### 2. Активируйте виртуальное окружение

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

### 3. Установите зависимости

```bash
pip install -r requirements.txt
```

### 4. Создайте файл .env

```bash
cp .env.example .env
```

Отредактируйте `.env` при необходимости (для локальной разработки можно оставить как есть).

### 5. Примените миграции

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Создайте суперпользователя

```bash
python manage.py createsuperuser
```

Введите:
- Username: `admin`
- Email: `admin@example.com`
- Password: (ваш пароль)

### 7. Загрузите тестовые данные

```bash
python manage.py seed_data
```

### 8. Запустите сервер разработки

```bash
python manage.py runserver
```

Сервер будет доступен по адресу: `http://localhost:8000`

### 9. Откройте админку

Перейдите в браузере: `http://localhost:8000/admin/`

Войдите используя учетные данные суперпользователя.

## API Endpoints

### Категории
- `GET http://localhost:8000/api/categories/` - Список категорий
- `GET http://localhost:8000/api/categories/{slug}/` - Детали категории

### Места (достопримечательности)
- `GET http://localhost:8000/api/places/` - Список мест
  - Параметры: `?category=nature`, `?search=музей`
- `GET http://localhost:8000/api/places/{id}/` - Детали места
- `GET http://localhost:8000/api/places/featured/?limit=4` - Топ места

### Отзывы
- `GET http://localhost:8000/api/reviews/` - Список отзывов
  - Параметры: `?place=1`
- `POST http://localhost:8000/api/reviews/` - Создать отзыв

## Структура проекта

```
komi-republic-django/
├── komi_backend/          # Основные настройки Django
│   ├── settings.py        # Настройки проекта
│   ├── urls.py           # Главные URL маршруты
│   └── wsgi.py           # WSGI конфигурация
├── places/               # Приложение для мест и достопримечательностей
│   ├── models.py         # Модели данных
│   ├── serializers.py    # DRF сериализаторы
│   ├── views.py          # API views
│   ├── admin.py          # Настройки админки
│   └── management/       # Команды управления
│       └── commands/
│           └── seed_data.py  # Загрузка тестовых данных
├── manage.py             # Django CLI
├── requirements.txt      # Python зависимости
├── .env.example         # Пример переменных окружения
├── README.md            # Этот файл
└── DEPLOYMENT.md        # Инструкция по развертыванию на VM
```

## Модели данных

### Category (Категория)
- `name` - Название (EN)
- `name_ru` - Название (RU)
- `slug` - URL slug
- `published` - Опубликовано

### Place (Место/Достопримечательность)
- `name` - Название (EN)
- `name_ru` - Название (RU)
- `description` - Описание (EN)
- `description_ru` - Описание (RU)
- `category` - Категория (FK)
- `rating` - Рейтинг (0-5)
- `image` - Главное изображение
- `address` - Адрес (EN)
- `address_ru` - Адрес (RU)
- `opening_hours` - Часы работы (EN)
- `opening_hours_ru` - Часы работы (RU)
- `entry_fee` - Стоимость входа (EN)
- `entry_fee_ru` - Стоимость входа (RU)
- `latitude` - Широта
- `longitude` - Долгота
- `amenities` - Удобства (JSON)
- `is_open` - Открыто
- `published` - Опубликовано

### PlaceImage (Изображение места)
- `place` - Место (FK)
- `image` - Изображение
- `caption` - Подпись
- `order` - Порядок

### Review (Отзыв)
- `place` - Место (FK)
- `author` - Автор
- `rating` - Оценка (1-5)
- `comment` - Комментарий
- `date` - Дата
- `published` - Опубликовано

## Команды управления

### Загрузка тестовых данных
```bash
python manage.py seed_data
```

### Создание миграций
```bash
python manage.py makemigrations
```

### Применение миграций
```bash
python manage.py migrate
```

### Сбор статических файлов
```bash
python manage.py collectstatic
```

### Создание суперпользователя
```bash
python manage.py createsuperuser
```

## Развертывание на виртуальной машине

Подробная инструкция по развертыванию на production сервере находится в файле [DEPLOYMENT.md](DEPLOYMENT.md).

## Технологии

- **Django 5.0** - Web framework
- **Django REST Framework 3.14** - REST API
- **django-cors-headers** - CORS поддержка
- **Pillow** - Обработка изображений
- **python-dotenv** - Управление переменными окружения
- **Gunicorn** - WSGI HTTP сервер (production)
- **PostgreSQL** - База данных (production)
- **SQLite** - База данных (development)

## Отличия от Strapi

### Преимущества Django:
1. ✅ Полный контроль над кодом
2. ✅ Мощная админка из коробки
3. ✅ Лучшая производительность
4. ✅ Более гибкая настройка
5. ✅ Богатая экосистема Python
6. ✅ Отличная документация
7. ✅ Проще в обслуживании

### API совместимость:
Django backend предоставляет те же данные, что и Strapi, но с немного другой структурой ответов. Фронтенд нужно будет адаптировать для работы с Django API.

## Адаптация фронтенда

Для работы с Django backend нужно обновить `api.ts` в фронтенде:

1. Изменить базовый URL с `/api` на `/api/`
2. Обновить структуру ответов (Django не использует `data.attributes`)
3. Обновить endpoints для изображений

Пример изменений будет предоставлен отдельно.

## Поддержка

Если возникли вопросы:
1. Проверьте логи: `python manage.py runserver` покажет ошибки
2. Убедитесь, что виртуальное окружение активировано
3. Проверьте, что все зависимости установлены
4. Проверьте файл `.env`

## Лицензия

MIT
