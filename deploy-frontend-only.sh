#!/bin/bash

# Скрипт деплоя только Frontend для Komi Republic
# Использование: sudo ./deploy-frontend-only.sh

set -e  # Остановка при ошибке

echo "🚀 Деплой Frontend Komi Republic..."

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Конфигурация
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"
FRONTEND_DIR="$PROJECT_DIR/komi-republic-frontend"
NGINX_CONFIG="/etc/nginx/sites-available/komi-republic"
SERVER_IP="158.160.167.43"

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
    log_error "Запустите скрипт с правами root: sudo ./deploy-frontend-only.sh"
    exit 1
fi

# Проверка наличия директории frontend
log_info "Проверка структуры проекта..."
log_info "Текущая директория: $PROJECT_DIR"

if [ ! -d "$FRONTEND_DIR" ]; then
    log_error "Не найдена директория frontend: $FRONTEND_DIR"
    exit 1
fi

log_info "✓ Директория frontend найдена"

# Обновление репозитория (если это git)
if [ -d ".git" ]; then
    log_info "Обновление репозитория..."
    git pull origin main || log_warn "Не удалось обновить репозиторий (возможно, есть локальные изменения)"
fi

# Деплой Frontend
log_info "Деплой Frontend..."
cd $FRONTEND_DIR

# Очистка старых зависимостей
if [ -d "node_modules" ]; then
    log_info "Очистка старых зависимостей..."
    rm -rf node_modules package-lock.json
fi

# Очистка старой сборки
if [ -d "dist" ]; then
    log_info "Очистка старой сборки..."
    rm -rf dist
fi

# Создание/обновление .env файла
log_info "Создание .env файла..."
cat > .env << EOF
VITE_STRAPI_URL=http://$SERVER_IP:1337
EOF

log_info "✓ .env файл создан"

# Установка зависимостей
log_info "Установка зависимостей (это может занять несколько минут)..."
npm install

# Сборка
log_info "Сборка Frontend..."
npm run build

# Проверка успешности сборки
if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
    log_error "Ошибка сборки! Директория dist не создана или пуста"
    exit 1
fi

log_info "✓ Frontend собран успешно"

# Исправление прав доступа для Nginx
log_info "Настройка прав доступа..."
chmod 755 /home/maryayukhnina
chmod 755 /home/maryayukhnina/komi-republic
chmod 755 "$FRONTEND_DIR"
chmod 755 "$FRONTEND_DIR/dist"
chmod -R 755 "$FRONTEND_DIR/dist"/*

log_info "✓ Права доступа настроены"

# Настройка Nginx
log_info "Обновление конфигурации Nginx..."
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

log_info "✓ Конфигурация Nginx обновлена"

# Создание символической ссылки (если еще не создана)
if [ ! -L "/etc/nginx/sites-enabled/komi-republic" ]; then
    log_info "Создание символической ссылки..."
    rm -f /etc/nginx/sites-enabled/default
    ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/
fi

# Проверка конфигурации Nginx
log_info "Проверка конфигурации Nginx..."
nginx -t

if [ $? -ne 0 ]; then
    log_error "Ошибка в конфигурации Nginx!"
    exit 1
fi

# Перезапуск Nginx
log_info "Перезапуск Nginx..."
systemctl restart nginx

# Проверка статуса Nginx
if systemctl is-active --quiet nginx; then
    log_info "✓ Nginx запущен успешно"
else
    log_error "Nginx не запустился!"
    systemctl status nginx
    exit 1
fi

# Вывод информации о сборке
log_info ""
log_info "================================"
log_info "✅ Деплой Frontend завершен!"
log_info "================================"
log_info ""
log_info "📁 Директория сборки: $FRONTEND_DIR/dist"
log_info "📝 Конфигурация Nginx: $NGINX_CONFIG"
log_info "🌐 Frontend: http://$SERVER_IP"
log_info ""
log_info "Содержимое dist:"
ls -lh "$FRONTEND_DIR/dist"
log_info ""
log_info "Полезные команды:"
log_info "  - Логи Nginx: sudo tail -f /var/log/nginx/error.log"
log_info "  - Перезапуск Nginx: sudo systemctl restart nginx"
log_info "  - Пересборка Frontend: cd $FRONTEND_DIR && npm run build"
log_info ""
log_warn "⚠️  Не забудьте:"
log_warn "  1. Проверить работу сайта: http://$SERVER_IP"
log_warn "  2. Настроить Strapi API (если еще не настроено)"
log_warn "  3. Добавить контент в Strapi"
