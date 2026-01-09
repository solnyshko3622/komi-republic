#!/bin/bash

# Скрипт деплоя только Backend (Strapi) для Komi Republic
# Использование: sudo ./deploy-strapi-only.sh

set -e  # Остановка при ошибке

echo "🚀 Деплой Backend (Strapi) Komi Republic..."

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Конфигурация
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"
BACKEND_DIR="$PROJECT_DIR/komi-republic-strapi"
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
    log_error "Запустите скрипт с правами root: sudo ./deploy-strapi-only.sh"
    exit 1
fi

# Проверка наличия директории backend
log_info "Проверка структуры проекта..."
log_info "Текущая директория: $PROJECT_DIR"

if [ ! -d "$BACKEND_DIR" ]; then
    log_error "Не найдена директория backend: $BACKEND_DIR"
    exit 1
fi

log_info "✓ Директория backend найдена"

# Обновление репозитория (если это git)
if [ -d ".git" ]; then
    log_info "Обновление репозитория..."
    git pull origin main || log_warn "Не удалось обновить репозиторий (возможно, есть локальные изменения)"
fi

# Деплой Backend (Strapi)
log_info "Деплой Backend (Strapi)..."
cd $BACKEND_DIR

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

if [ -d "build" ]; then
    rm -rf build
fi

# Создание/обновление .env файла
if [ ! -f ".env" ]; then
    log_info "Создание .env файла для Strapi..."
    cat > .env << EOF
HOST=0.0.0.0
PORT=1337
PUBLIC_URL=http://$SERVER_IP
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
else
    log_info ".env файл уже существует"
    # Обновляем PUBLIC_URL если его нет
    if ! grep -q "PUBLIC_URL" .env; then
        log_info "Добавление PUBLIC_URL в .env..."
        echo "PUBLIC_URL=http://$SERVER_IP" >> .env
    else
        log_info "Обновление PUBLIC_URL в .env..."
        sed -i "s|PUBLIC_URL=.*|PUBLIC_URL=http://$SERVER_IP|g" .env
    fi
fi

log_info "✓ .env файл настроен"

# Установка зависимостей
log_info "Установка зависимостей (это может занять несколько минут)..."
npm install --omit=dev

# Сборка
log_info "Сборка Backend..."
npm run build

# Проверка успешности сборки
if [ ! -d "dist" ] && [ ! -d "build" ]; then
    log_error "Ошибка сборки! Директория dist/build не создана"
    exit 1
fi

log_info "✓ Backend собран успешно"

# Остановка старого процесса Strapi
log_info "Остановка старого процесса Strapi..."
su - maryayukhnina -c "pm2 delete strapi 2>/dev/null || true"

# Запуск Strapi через PM2 от имени пользователя
log_info "Запуск Strapi через PM2..."
su - maryayukhnina -c "cd $BACKEND_DIR && pm2 start npm --name strapi -- run start"
su - maryayukhnina -c "pm2 save"

log_info "✓ Strapi запущен"

# Ожидание запуска
log_info "Ожидание запуска Strapi (10 секунд)..."
sleep 10

# Проверка статуса
log_info ""
log_info "================================"
log_info "Проверка статуса"
log_info "================================"
echo ""

log_info "PM2 процессы:"
su - maryayukhnina -c "pm2 status"

echo ""
log_info "Проверка порта 1337:"
ss -tulpn | grep 1337 && log_info "✓ Strapi слушает порт 1337" || log_warn "⚠️  Порт 1337 не занят"

echo ""
log_info "Последние логи Strapi:"
su - maryayukhnina -c "pm2 logs strapi --lines 15 --nostream"

# Вывод итоговой информации
echo ""
log_info "================================"
log_info "✅ Деплой Backend завершен!"
log_info "================================"
log_info ""
log_info "📁 Директория backend: $BACKEND_DIR"
log_info "🌐 Strapi Admin: http://$SERVER_IP/admin"
log_info "🔌 API: http://$SERVER_IP/api"
log_info ""
log_info "Полезные команды:"
log_info "  - Логи Strapi: pm2 logs strapi"
log_info "  - Перезапуск Strapi: pm2 restart strapi"
log_info "  - Остановка Strapi: pm2 stop strapi"
log_info "  - Статус PM2: pm2 status"
log_info "  - Пересборка: cd $BACKEND_DIR && npm run build && pm2 restart strapi"
log_info ""
log_warn "⚠️  Следующие шаги:"
log_warn "  1. Откройте http://$SERVER_IP/admin"
log_warn "  2. Создайте первого администратора (если еще не создан)"
log_warn "  3. Настройте публичный доступ к API"
log_warn "  4. Добавьте контент"
