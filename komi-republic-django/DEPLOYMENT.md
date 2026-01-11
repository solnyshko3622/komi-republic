# Инструкция по развертыванию Django Backend на виртуальной машине

## Содержание
1. [Требования](#требования)
2. [Подготовка виртуальной машины](#подготовка-виртуальной-машины)
3. [Установка зависимостей](#установка-зависимостей)
4. [Настройка проекта](#настройка-проекта)
5. [Настройка базы данных](#настройка-базы-данных)
6. [Загрузка тестовых данных](#загрузка-тестовых-данных)
7. [Настройка Nginx](#настройка-nginx)
8. [Настройка Gunicorn и Systemd](#настройка-gunicorn-и-systemd)
9. [Вход в админку](#вход-в-админку)
10. [Обслуживание](#обслуживание)

---

## Требования

- Ubuntu 20.04 или выше (или другой Linux дистрибутив)
- Python 3.9 или выше
- Доступ по SSH к виртуальной машине
- Доменное имя или IP-адрес

---

## Подготовка виртуальной машины

### 1. Подключитесь к виртуальной машине по SSH

```bash
ssh user@your-server-ip
```

### 2. Обновите систему

```bash
sudo apt update
sudo apt upgrade -y
```

### 3. Установите необходимые пакеты

```bash
sudo apt install -y python3 python3-pip python3-venv nginx git
```

---

## Установка зависимостей

### 1. Создайте директорию для проекта

```bash
sudo mkdir -p /var/www/komi-backend
sudo chown $USER:$USER /var/www/komi-backend
cd /var/www/komi-backend
```

### 2. Клонируйте проект или загрузите файлы

Если используете Git:
```bash
git clone <your-repo-url> .
```

Или скопируйте файлы с локальной машины:
```bash
# На локальной машине
scp -r komi-republic-django/* user@your-server-ip:/var/www/komi-backend/
```

### 3. Создайте виртуальное окружение

```bash
cd /var/www/komi-backend
python3 -m venv venv
source venv/bin/activate
```

### 4. Установите Python зависимости

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

## Настройка проекта

### 1. Создайте файл .env

```bash
nano .env
```

Добавьте следующие настройки:

```env
SECRET_KEY=your-very-secret-key-change-this-in-production-12345678
DEBUG=False
ALLOWED_HOSTS=your-domain.com,your-server-ip,localhost

# Для production с PostgreSQL раскомментируйте:
# DB_NAME=komi_db
# DB_USER=komi_user
# DB_PASSWORD=your-secure-password
# DB_HOST=localhost
# DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://your-frontend-domain.com,https://your-frontend-domain.com
```

**Важно:** Сгенерируйте безопасный SECRET_KEY:
```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 2. Создайте директории для медиа и статики

```bash
mkdir -p media/places/images media/places/gallery
mkdir -p staticfiles
```

---

## Настройка базы данных

### Вариант 1: SQLite (для разработки и тестирования)

```bash
# Активируйте виртуальное окружение
source venv/bin/activate

# Примените миграции
python manage.py makemigrations
python manage.py migrate
```

### Вариант 2: PostgreSQL (рекомендуется для production)

#### 1. Установите PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
```

#### 2. Создайте базу данных и пользователя

```bash
sudo -u postgres psql
```

В консоли PostgreSQL:
```sql
CREATE DATABASE komi_db;
CREATE USER komi_user WITH PASSWORD 'your-secure-password';
ALTER ROLE komi_user SET client_encoding TO 'utf8';
ALTER ROLE komi_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE komi_user SET timezone TO 'Europe/Moscow';
GRANT ALL PRIVILEGES ON DATABASE komi_db TO komi_user;
\q
```

#### 3. Обновите настройки в .env

Раскомментируйте и настройте параметры базы данных в файле `.env`.

#### 4. Обновите settings.py для использования PostgreSQL

Откройте `komi_backend/settings.py` и раскомментируйте секцию PostgreSQL в DATABASES.

#### 5. Примените миграции

```bash
source venv/bin/activate
python manage.py makemigrations
python manage.py migrate
```

---

## Загрузка тестовых данных

### 1. Создайте суперпользователя (администратора)

```bash
python manage.py createsuperuser
```

Введите:
- **Username**: admin (или любое другое имя)
- **Email**: admin@example.com
- **Password**: (введите надежный пароль)

### 2. Загрузите тестовые данные

```bash
python manage.py seed_data
```

Эта команда создаст:
- 5 категорий
- 10 достопримечательностей
- 12 отзывов

### 3. Соберите статические файлы

```bash
python manage.py collectstatic --noinput
```

---

## Настройка Nginx

### 1. Создайте конфигурационный файл Nginx

```bash
sudo nano /etc/nginx/sites-available/komi-backend
```

Добавьте следующую конфигурацию:

```nginx
server {
    listen 80;
    server_name your-domain.com your-server-ip;

    client_max_body_size 10M;

    location /static/ {
        alias /var/www/komi-backend/staticfiles/;
    }

    location /media/ {
        alias /var/www/komi-backend/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. Активируйте конфигурацию

```bash
sudo ln -s /etc/nginx/sites-available/komi-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. Настройте firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## Настройка Gunicorn и Systemd

### 1. Создайте systemd service файл

```bash
sudo nano /etc/systemd/system/komi-backend.service
```

Добавьте:

```ini
[Unit]
Description=Komi Republic Django Backend
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/var/www/komi-backend
Environment="PATH=/var/www/komi-backend/venv/bin"
ExecStart=/var/www/komi-backend/venv/bin/gunicorn \
    --workers 3 \
    --bind 127.0.0.1:8000 \
    --timeout 120 \
    --access-logfile /var/log/komi-backend-access.log \
    --error-logfile /var/log/komi-backend-error.log \
    komi_backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

### 2. Настройте права доступа

```bash
sudo chown -R www-data:www-data /var/www/komi-backend
sudo chmod -R 755 /var/www/komi-backend
```

### 3. Запустите сервис

```bash
sudo systemctl daemon-reload
sudo systemctl start komi-backend
sudo systemctl enable komi-backend
sudo systemctl status komi-backend
```

---

## Вход в админку

### 1. Откройте браузер и перейдите по адресу:

```
http://your-domain.com/admin/
или
http://your-server-ip/admin/
```

### 2. Войдите используя учетные данные суперпользователя

- **Username**: admin (или то, что вы указали при создании)
- **Password**: ваш пароль

### 3. Управление контентом

В админке вы можете:
- **Категории**: Добавлять/редактировать категории мест
- **Места**: Управлять достопримечательностями
- **Изображения мест**: Добавлять дополнительные фотографии
- **Отзывы**: Модерировать отзывы пользователей

---

## API Endpoints

После развертывания доступны следующие endpoints:

### Категории
- `GET /api/categories/` - Список всех категорий
- `GET /api/categories/{slug}/` - Детали категории

### Места
- `GET /api/places/` - Список всех мест
  - Параметры: `?category=slug`, `?search=query`
- `GET /api/places/{id}/` - Детали места
- `GET /api/places/featured/` - Топ мест по рейтингу
  - Параметры: `?limit=4`

### Отзывы
- `GET /api/reviews/` - Список отзывов
  - Параметры: `?place=id`
- `POST /api/reviews/` - Создать отзыв

---

## Обслуживание

### Просмотр логов

```bash
# Логи Gunicorn
sudo tail -f /var/log/komi-backend-access.log
sudo tail -f /var/log/komi-backend-error.log

# Логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Логи systemd
sudo journalctl -u komi-backend -f
```

### Перезапуск сервисов

```bash
# Перезапуск Django
sudo systemctl restart komi-backend

# Перезапуск Nginx
sudo systemctl restart nginx
```

### Обновление кода

```bash
cd /var/www/komi-backend
source venv/bin/activate

# Получите новый код
git pull  # или загрузите файлы

# Обновите зависимости
pip install -r requirements.txt

# Примените миграции
python manage.py migrate

# Соберите статику
python manage.py collectstatic --noinput

# Перезапустите сервис
sudo systemctl restart komi-backend
```

### Резервное копирование базы данных

#### SQLite
```bash
cp /var/www/komi-backend/db.sqlite3 /var/www/komi-backend/backups/db_$(date +%Y%m%d_%H%M%S).sqlite3
```

#### PostgreSQL
```bash
sudo -u postgres pg_dump komi_db > /var/www/komi-backend/backups/komi_db_$(date +%Y%m%d_%H%M%S).sql
```

---

## Настройка SSL (опционально, но рекомендуется)

### Использование Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
sudo systemctl reload nginx
```

Certbot автоматически настроит SSL и будет обновлять сертификаты.

---

## Решение проблем

### Проблема: 502 Bad Gateway

```bash
# Проверьте статус Gunicorn
sudo systemctl status komi-backend

# Проверьте логи
sudo journalctl -u komi-backend -n 50
```

### Проблема: Статические файлы не загружаются

```bash
# Пересоберите статику
python manage.py collectstatic --noinput

# Проверьте права
sudo chown -R www-data:www-data /var/www/komi-backend/staticfiles
```

### Проблема: CORS ошибки

Убедитесь, что в `.env` правильно указаны домены фронтенда в `CORS_ALLOWED_ORIGINS`.

---

## Контакты и поддержка

Если возникли вопросы или проблемы, проверьте:
1. Логи сервисов
2. Настройки firewall
3. Права доступа к файлам
4. Переменные окружения в .env

---

## Готово! 🎉

Ваш Django backend для туристического портала Республики Коми успешно развернут!

Теперь вы можете:
- Управлять контентом через админку: `http://your-domain.com/admin/`
- Использовать API: `http://your-domain.com/api/`
- Подключить фронтенд приложение
