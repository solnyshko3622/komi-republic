dc#!/bin/bash

# Быстрое исправление проблемы с frontend

echo "🔧 Исправление проблемы с frontend..."

# Определяем пути
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/komi-republic-frontend"
NGINX_CONFIG="/etc/nginx/sites-available/komi-republic"
SERVER_IP="158.160.167.43"

# Проверка прав root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Запустите скрипт с правами root: sudo ./fix-frontend.sh"
    exit 1
fi

echo "📁 Frontend директория: $FRONTEND_DIR"

# Проверяем, собран ли frontend
if [ ! -d "$FRONTEND_DIR/dist" ]; then
    echo "⚠️  Директория dist не найдена. Собираем frontend..."
    cd $FRONTEND_DIR
    
    # Проверяем .env
    if [ ! -f ".env" ]; then
        echo "📝 Создание .env файла..."
        cat > .env << EOF
VITE_STRAPI_URL=http://$SERVER_IP:1337
EOF
    fi
    
    # Собираем
    echo "🔨 Установка зависимостей и сборка..."
    npm install
    npm run build
else
    echo "✅ Директория dist найдена"
fi

# Проверяем содержимое dist
echo "📋 Содержимое dist:"
ls -la "$FRONTEND_DIR/dist" | head -10

# Обновляем конфигурацию Nginx с абсолютными путями
echo "🔧 Обновление конфигурации Nginx..."
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

echo "📝 Конфигурация Nginx обновлена"
echo "📁 Root директория: $FRONTEND_DIR/dist"

# Проверяем конфигурацию
echo "🔍 Проверка конфигурации Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Конфигурация Nginx корректна"
    
    # Перезапускаем Nginx
    echo "🔄 Перезапуск Nginx..."
    systemctl restart nginx
    
    echo ""
    echo "================================"
    echo "✅ Исправление завершено!"
    echo "================================"
    echo "Откройте: http://$SERVER_IP"
    echo ""
    echo "Если проблема сохраняется, проверьте:"
    echo "  1. Логи Nginx: sudo tail -f /var/log/nginx/error.log"
    echo "  2. Содержимое dist: ls -la $FRONTEND_DIR/dist"
    echo "  3. Права доступа: ls -ld $FRONTEND_DIR/dist"
else
    echo "❌ Ошибка в конфигурации Nginx"
    exit 1
fi
