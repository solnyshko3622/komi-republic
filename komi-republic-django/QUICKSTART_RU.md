# 🚀 Быстрый старт Django Backend

## Шаг 1: Создайте виртуальное окружение

```bash
cd komi-republic-django
python3 -m venv venv
```

## Шаг 2: Активируйте виртуальное окружение

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

## Шаг 3: Установите зависимости

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Примечание:** Если возникают проблемы с Pillow на Python 3.14, попробуйте:
```bash
pip install Pillow --no-binary :all:
```
или используйте Python 3.11-3.13.

## Шаг 4: Создайте файл .env

```bash
cp .env.example .env
```

## Шаг 5: Примените миграции

```bash
python manage.py makemigrations
python manage.py migrate
```

## Шаг 6: Создайте администратора

```bash
python manage.py createsuperuser
```

Введите:
- **Username**: `admin`
- **Email**: `admin@example.com`
- **Password**: (ваш пароль, минимум 8 символов)

## Шаг 7: Загрузите тестовые данные

```bash
python manage.py seed_data
```

Будет создано:
- ✅ 5 категорий
- ✅ 10 достопримечательностей
- ✅ 12 отзывов

## Шаг 8: Запустите сервер

```bash
python manage.py runserver
```

## ✨ Готово!

### Откройте в браузере:

- **API**: http://localhost:8000/api/
- **Админка**: http://localhost:8000/admin/
  - Username: `admin`
  - Password: (ваш пароль)

### Доступные API endpoints:

- `GET /api/categories/` - Список категорий
- `GET /api/places/` - Список мест
- `GET /api/places/featured/?limit=4` - Топ места
- `GET /api/places/{id}/` - Детали места
- `GET /api/reviews/?place={id}` - Отзывы для места
- `POST /api/reviews/` - Создать отзыв

---

## 🔧 Решение проблем

### Ошибка: "No module named 'django'"
```bash
# Убедитесь, что виртуальное окружение активировано
source venv/bin/activate  # macOS/Linux
# или
venv\Scripts\activate  # Windows

# Переустановите зависимости
pip install -r requirements.txt
```

### Ошибка при установке Pillow
```bash
# Вариант 1: Обновите pip
pip install --upgrade pip setuptools wheel

# Вариант 2: Установите системные зависимости (macOS)
brew install libjpeg zlib

# Вариант 3: Используйте Python 3.11-3.13 вместо 3.14
```

### Ошибка: "Port 8000 already in use"
```bash
# Используйте другой порт
python manage.py runserver 8001
```

---

## 📚 Дополнительная документация

- [README.md](README.md) - Полная документация
- [DEPLOYMENT.md](DEPLOYMENT.md) - Развертывание на VM

---

## 🎯 Следующие шаги

1. Изучите админку: http://localhost:8000/admin/
2. Протестируйте API endpoints
3. Адаптируйте фронтенд для работы с Django API
4. Разверните на production сервере (см. DEPLOYMENT.md)
