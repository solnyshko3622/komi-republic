#!/bin/bash

# Скрипт деплоя приложения Komi Republic на виртуальной машине (без домена)
# Использование: ./deploy-ip.sh

set -e  # Остановка при ошибке

echo "🚀 Начало деплоя Komi Republic (IP-based)..."

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Конфигурация
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"
FRONTEND_DIR="$PROJECT_DIR/komi-republic-frontend"
BACKEND_DIR="$PROJECT_DIR/komi-republic-strapi"
NGINX_CONFIG="/etc/nginx/sites-available/komi-republic"
SERVER_IP="158.160.167.43"  # Ваш IP адрес

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
    log_error "Запустите скрипт с правами root (sudo ./deploy-ip.sh)"
    exit 1
fi

# 1. Обновление системы
log_info "Обновление системы..."
apt-get update
apt-get upgrade -y

# 2. Установка необходимых пакетов
log_info "Установка необходимых пакетов..."
apt-get install -y curl git nginx

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

# 5. Проверка наличия проекта
log_info "Проверка структуры проекта..."
log_info "Текущая директория: $PROJECT_DIR"

if [ ! -d "$FRONTEND_DIR" ] || [ ! -d "$BACKEND_DIR" ]; then
    log_error "Не найдены директории frontend или backend"
    log_error "Убедитесь, что скрипт запущен из корня репозитория"
    log_error "Ожидаемые директории:"
    log_error "  - $FRONTEND_DIR"
    log_error "  - $BACKEND_DIR"
    exit 1
fi

log_info "✓ Структура проекта найдена"

# 6. Обновление репозитория (если это git)
if [ -d ".git" ]; then
    log_info "Обновление репозитория..."
    git pull origin main || log_warn "Не удалось обновить репозиторий (возможно, есть локальные изменения)"
fi

# 7. Деплой Backend (Strapi)
log_info "Деплой Backend (Strapi)..."
cd $BACKEND_DIR

# Очистка старых зависимостей для избежания конфликтов
if [ -d "node_modules" ]; then
    log_info "Очистка старых зависимостей Backend..."
    rm -rf node_modules package-lock.json
fi

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
    log_warn "⚠️  .env файл создан с случайными ключами"
fi

# Установка зависимостей и сборка
log_info "Установка зависимостей Backend (это может занять несколько минут)..."
npm install --omit=dev

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

# Очистка старых зависимостей для избежания конфликтов
if [ -d "node_modules" ]; then
    log_info "Очистка старых зависимостей Frontend..."
    rm -rf node_modules package-lock.json
fi

# Создание .env файла для production
log_info "Создание .env файла для Frontend..."
cat > .env << EOF
VITE_STRAPI_URL=http://$SERVER_IP:1337
EOF

# Установка зависимостей и сборка
log_info "Установка зависимостей Frontend (это может занять несколько минут)..."
npm install

log_info "Сборка Frontend..."
npm run build

# 9. Настройка Nginx для IP-адреса
log_info "Настройка Nginx..."
cat > $NGINX_CONFIG << EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name $SERVER_IP;

    # Frontend
    location / {
        root $FRONTEND_DIR/dist;
        try_files \$uri \$uri/ /index.html;
        
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
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Strapi Admin
    location /admin {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
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

# Удаление default конфига
rm -f /etc/nginx/sites-enabled/default

# Создание символической ссылки
ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/

# Проверка конфигурации Nginx
log_info "Проверка конфигурации Nginx..."
nginx -t

# Перезапуск Nginx
log_info "Перезапуск Nginx..."
systemctl restart nginx
systemctl enable nginx

# 10. Настройка автозапуска PM2
log_info "Настройка автозапуска PM2..."
pm2 startup systemd -u root --hp /root
pm2 save

# 11. Настройка firewall
log_info "Настройка firewall..."
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow OpenSSH
ufw --force enable

# Вывод статуса
log_info "================================"
log_info "✅ Деплой завершен успешно!"
log_info "================================"
log_info "Frontend: http://$SERVER_IP"
log_info "Backend API: http://$SERVER_IP/api"
log_info "Strapi Admin: http://$SERVER_IP/admin"
log_info ""
log_info "Полезные команды:"
log_info "  - Просмотр логов Strapi: pm2 logs strapi"
log_info "  - Перезапуск Strapi: pm2 restart strapi"
log_info "  - Статус PM2: pm2 status"
log_info "  - Логи Nginx: tail -f /var/log/nginx/error.log"
log_info ""
log_warn "⚠️  Следующие шаги:"
log_warn "  1. Откройте http://$SERVER_IP/admin"
log_warn "  2. Создайте первого администратора Strapi"
log_warn "  3. Добавьте контент через админ-панель"
log_warn ""
log_warn "⚠️  Для production рекомендуется:"
log_warn "  1. Получить доменное имя"
log_warn "  2. Настроить SSL сертификат"
log_warn "  3. Настроить регулярные бэкапы"
