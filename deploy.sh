#!/bin/bash

# Скрипт деплоя приложения Komi Republic на виртуальной машине
# Использование: ./deploy.sh

set -e  # Остановка при ошибке

echo "🚀 Начало деплоя Komi Republic..."

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Конфигурация
PROJECT_DIR="/var/www/komi-republic"
FRONTEND_DIR="$PROJECT_DIR/komi-republic-frontend"
BACKEND_DIR="$PROJECT_DIR/komi-republic-strapi"
NGINX_CONFIG="/etc/nginx/sites-available/komi-republic"
DOMAIN="your-domain.com"  # Замените на ваш домен

# Функция для вывода сообщений
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка прав root
if [ "$EUID" -ne 0 ]; then 
    log_error "Запустите скрипт с правами root (sudo ./deploy.sh)"
    exit 1
fi

# 1. Обновление системы
log_info "Обновление системы..."
apt-get update
apt-get upgrade -y

# 2. Установка необходимых пакетов
log_info "Установка необходимых пакетов..."
apt-get install -y curl git nginx certbot python3-certbot-nginx

# 3. Установка Node.js (если не установлен)
if ! command -v node &> /dev/null; then
    log_info "Установка Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    log_info "Node.js уже установлен: $(node -v)"
fi

# 4. Установка PM2 (если не установлен)
if ! command -v pm2 &> /dev/null; then
    log_info "Установка PM2..."
    npm install -g pm2
else
    log_info "PM2 уже установлен: $(pm2 -v)"
fi

# 5. Создание директории проекта
log_info "Создание директории проекта..."
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# 6. Клонирование или обновление репозитория
if [ -d ".git" ]; then
    log_info "Обновление репозитория..."
    git pull origin main
else
    log_warn "Репозиторий не найден. Пожалуйста, клонируйте его вручную:"
    log_warn "git clone <your-repo-url> $PROJECT_DIR"
    exit 1
fi

# 7. Деплой Backend (Strapi)
log_info "Деплой Backend (Strapi)..."
cd $BACKEND_DIR

# Создание .env файла для production
if [ ! -f ".env" ]; then
    log_info "Создание .env файла для Strapi..."
    cat > .env << EOF
HOST=0.0.0.0
PORT=1337
APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
NODE_ENV=production
EOF
    log_warn "⚠️  .env файл создан. Пожалуйста, проверьте настройки!"
fi

# Установка зависимостей и сборка
log_info "Установка зависимостей Backend..."
npm ci --production

log_info "Сборка Backend..."
npm run build

# Запуск Strapi через PM2
log_info "Запуск Strapi через PM2..."
pm2 delete strapi 2>/dev/null || true
pm2 start npm --name "strapi" -- run start
pm2 save

# 8. Деплой Frontend (React + Vite)
log_info "Деплой Frontend..."
cd $FRONTEND_DIR

# Создание .env файла для production
if [ ! -f ".env" ]; then
    log_info "Создание .env файла для Frontend..."
    cat > .env << EOF
VITE_STRAPI_URL=http://localhost:1337
EOF
    log_warn "⚠️  .env файл создан. Обновите VITE_STRAPI_URL если нужно!"
fi

# Установка зависимостей и сборка
log_info "Установка зависимостей Frontend..."
npm ci

log_info "Сборка Frontend..."
npm run build

# 9. Настройка Nginx
log_info "Настройка Nginx..."
cat > $NGINX_CONFIG << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /var/www/komi-republic/komi-republic-frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Кэширование статических файлов
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Strapi Admin
    location /admin {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Загруженные файлы
    location /uploads {
        proxy_pass http://localhost:1337;
    }

    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
EOF

# Замена домена в конфиге
sed -i "s/your-domain.com/$DOMAIN/g" $NGINX_CONFIG

# Создание символической ссылки
ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/

# Проверка конфигурации Nginx
log_info "Проверка конфигурации Nginx..."
nginx -t

# Перезапуск Nginx
log_info "Перезапуск Nginx..."
systemctl restart nginx
systemctl enable nginx

# 10. Настройка SSL (опционально)
read -p "Хотите настроить SSL сертификат? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Настройка SSL сертификата..."
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
fi

# 11. Настройка автозапуска PM2
log_info "Настройка автозапуска PM2..."
pm2 startup systemd -u root --hp /root
pm2 save

# 12. Настройка firewall
log_info "Настройка firewall..."
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable

# Вывод статуса
log_info "================================"
log_info "✅ Деплой завершен успешно!"
log_info "================================"
log_info "Frontend: http://$DOMAIN"
log_info "Backend API: http://$DOMAIN/api"
log_info "Strapi Admin: http://$DOMAIN/admin"
log_info ""
log_info "Полезные команды:"
log_info "  - Просмотр логов Strapi: pm2 logs strapi"
log_info "  - Перезапуск Strapi: pm2 restart strapi"
log_info "  - Статус PM2: pm2 status"
log_info "  - Логи Nginx: tail -f /var/log/nginx/error.log"
log_info ""
log_warn "⚠️  Не забудьте:"
log_warn "  1. Обновить DNS записи для домена $DOMAIN"
log_warn "  2. Проверить .env файлы в обоих проектах"
log_warn "  3. Создать первого администратора в Strapi: http://$DOMAIN/admin"
