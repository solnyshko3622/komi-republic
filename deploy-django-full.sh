#!/bin/bash

# Скрипт для развертывания Django Backend + React Frontend на VM
# Использование: ./deploy-django-full.sh <server-ip> <domain>

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Проверка аргументов
if [ "$#" -lt 1 ]; then
    echo -e "${RED}Использование: $0 <server-ip> [domain]${NC}"
    echo "Пример: $0 192.168.1.100 komi-tourism.ru"
    exit 1
fi

SERVER_IP=$1
DOMAIN=${2:-$SERVER_IP}

echo -e "${GREEN}=== Развертывание Django Backend + React Frontend ===${NC}"
echo "Server IP: $SERVER_IP"
echo "Domain: $DOMAIN"
echo ""

# Запрос подтверждения
read -p "Продолжить? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo -e "${YELLOW}Шаг 1: Подготовка файлов...${NC}"

# Создание временной директории
TMP_DIR=$(mktemp -d)
echo "Временная директория: $TMP_DIR"

# Копирование Django backend
echo "Копирование Django backend..."
cp -r komi-republic-django "$TMP_DIR/"

# Копирование React frontend
echo "Копирование React frontend..."
cp -r komi-republic-frontend "$TMP_DIR/"

echo -e "${YELLOW}Шаг 2: Загрузка файлов на сервер...${NC}"

# Загрузка на сервер
scp -r "$TMP_DIR/komi-republic-django" root@$SERVER_IP:/var/www/
scp -r "$TMP_DIR/komi-republic-frontend" root@$SERVER_IP:/var/www/

echo -e "${YELLOW}Шаг 3: Установка зависимостей на сервере...${NC}"

ssh root@$SERVER_IP << 'ENDSSH'
set -e

echo "=== Обновление системы ==="
apt update
apt upgrade -y

echo "=== Установка необходимых пакетов ==="
apt install -y python3 python3-pip python3-venv nginx nodejs npm git curl

echo "=== Настройка Django Backend ==="
cd /var/www/komi-republic-django

# Создание виртуального окружения
python3 -m venv venv
source venv/bin/activate

# Установка зависимостей
pip install --upgrade pip
pip install -r requirements.txt

# Создание .env файла
cat > .env << 'EOF'
SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
DEBUG=False
ALLOWED_HOSTS=DOMAIN_PLACEHOLDER,SERVER_IP_PLACEHOLDER,localhost
CORS_ALLOWED_ORIGINS=http://DOMAIN_PLACEHOLDER,https://DOMAIN_PLACEHOLDER,http://SERVER_IP_PLACEHOLDER
EOF

# Применение миграций
python3 manage.py makemigrations
python3 manage.py migrate

# Сбор статических файлов
python3 manage.py collectstatic --noinput

# Создание суперпользователя (интерактивно)
echo "Создайте суперпользователя для Django Admin:"
python3 manage.py createsuperuser

# Загрузка тестовых данных
python3 manage.py seed_data

echo "=== Настройка React Frontend ==="
cd /var/www/komi-republic-frontend

# Установка зависимостей
npm install

# Создание .env для production
cat > .env << 'EOF'
VITE_API_URL=http://DOMAIN_PLACEHOLDER
VITE_YANDEX_MAPS_API_KEY=your_yandex_maps_api_key_here
EOF

# Сборка фронтенда
npm run build

echo "=== Настройка Gunicorn ==="
cat > /etc/systemd/system/komi-django.service << 'EOF'
[Unit]
Description=Komi Republic Django Backend
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/var/www/komi-republic-django
Environment="PATH=/var/www/komi-republic-django/venv/bin"
ExecStart=/var/www/komi-republic-django/venv/bin/gunicorn \
    --workers 3 \
    --bind 127.0.0.1:8000 \
    --timeout 120 \
    --access-logfile /var/log/komi-django-access.log \
    --error-logfile /var/log/komi-django-error.log \
    komi_backend.wsgi:application

[Install]
WantedBy=multi-user.target
EOF

# Настройка прав
chown -R www-data:www-data /var/www/komi-republic-django
chown -R www-data:www-data /var/www/komi-republic-frontend
chmod -R 755 /var/www/komi-republic-django
chmod -R 755 /var/www/komi-republic-frontend

echo "=== Настройка Nginx ==="
cat > /etc/nginx/sites-available/komi-republic << 'EOF'
# Django Backend
server {
    listen 80;
    server_name api.DOMAIN_PLACEHOLDER;

    client_max_body_size 10M;

    location /static/ {
        alias /var/www/komi-republic-django/staticfiles/;
    }

    location /media/ {
        alias /var/www/komi-republic-django/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# React Frontend
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

    root /var/www/komi-republic-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Активация конфигурации
ln -sf /etc/nginx/sites-available/komi-republic /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Тестирование конфигурации Nginx
nginx -t

# Запуск сервисов
systemctl daemon-reload
systemctl start komi-django
systemctl enable komi-django
systemctl restart nginx

# Настройка firewall
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable

echo "=== Развертывание завершено! ==="
echo ""
echo "Django Backend: http://DOMAIN_PLACEHOLDER/api/"
echo "Django Admin: http://DOMAIN_PLACEHOLDER/admin/"
echo "React Frontend: http://DOMAIN_PLACEHOLDER/"
echo ""
echo "Для настройки SSL выполните:"
echo "apt install -y certbot python3-certbot-nginx"
echo "certbot --nginx -d DOMAIN_PLACEHOLDER -d www.DOMAIN_PLACEHOLDER -d api.DOMAIN_PLACEHOLDER"

ENDSSH

# Замена плейсхолдеров
echo -e "${YELLOW}Шаг 4: Настройка доменов и IP...${NC}"

ssh root@$SERVER_IP << ENDSSH
sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /var/www/komi-republic-django/.env
sed -i "s/SERVER_IP_PLACEHOLDER/$SERVER_IP/g" /var/www/komi-republic-django/.env
sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /var/www/komi-republic-frontend/.env
sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/komi-republic
systemctl restart komi-django
systemctl restart nginx
ENDSSH

# Очистка
rm -rf "$TMP_DIR"

echo -e "${GREEN}=== Развертывание успешно завершено! ===${NC}"
echo ""
echo -e "${GREEN}Доступ к приложению:${NC}"
echo "Frontend: http://$DOMAIN/"
echo "Backend API: http://$DOMAIN/api/"
echo "Django Admin: http://$DOMAIN/admin/"
echo ""
echo -e "${YELLOW}Следующие шаги:${NC}"
echo "1. Настройте DNS записи для вашего домена"
echo "2. Установите SSL сертификат:"
echo "   ssh root@$SERVER_IP"
echo "   apt install -y certbot python3-certbot-nginx"
echo "   certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "3. Обновите VITE_YANDEX_MAPS_API_KEY в /var/www/komi-republic-frontend/.env"
echo "4. Пересоберите фронтенд: cd /var/www/komi-republic-frontend && npm run build"
