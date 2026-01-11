# 🚀 Инструкция по деплою Komi Republic

Это руководство поможет вам развернуть приложение Komi Republic на виртуальной машине с Ubuntu/Debian.

## 📋 Требования

- Ubuntu 20.04+ или Debian 11+
- Минимум 2GB RAM
- 20GB свободного места на диске
- Доменное имя (опционально, для SSL)
- Root доступ к серверу

## 🔧 Подготовка сервера

### 1. Подключение к серверу

```bash
ssh your-user@your-server-ip
```

### 2. Клонирование репозитория

Клонируйте репозиторий в домашнюю директорию:

```bash
cd ~
git clone <your-repository-url> komi-republic
cd komi-republic
```

**Важно:** Скрипты деплоя работают из директории репозитория и автоматически определяют пути к frontend и backend.

### 3. Настройка прав доступа

```bash
chmod +x deploy.sh deploy-ip.sh
```

## 🚀 Автоматический деплой

### Выбор скрипта деплоя

Есть два варианта скрипта:

1. **`deploy-ip.sh`** - для деплоя по IP-адресу (без домена)
2. **`deploy.sh`** - для деплоя с доменом и SSL

### Деплой по IP-адресу (рекомендуется для начала)

```bash
cd ~/komi-republic
sudo ./deploy-ip.sh
```

Скрипт автоматически:
- Обновит систему
- Установит Node.js, Nginx, PM2
- Соберет Frontend и Backend из текущей директории
- Настроит Nginx для работы по IP
- Запустит приложение через PM2

### Деплой с доменом

Перед запуском отредактируйте `deploy.sh` и замените:
```bash
DOMAIN="your-domain.com"  # Замените на ваш домен
```

Затем запустите:
```bash
cd ~/komi-republic
sudo ./deploy.sh
```

Скрипт дополнительно настроит SSL сертификат через Let's Encrypt.

## ⚙️ Ручной деплой

Если вы предпочитаете ручную настройку:

### 1. Установка зависимостей

```bash
# Обновление системы
sudo apt-get update && sudo apt-get upgrade -y

# Установка Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка Nginx
sudo apt-get install -y nginx

# Установка PM2
sudo npm install -g pm2
```

### 2. Настройка Backend (Strapi)

```bash
cd /var/www/komi-republic/komi-republic-strapi

# Создание .env файла
cat > .env << EOF
HOST=0.0.0.0
PORT=1337
APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
NODE_ENV=production
EOF

# Установка зависимостей
npm ci --production

# Сборка
npm run build

# Запуск через PM2
pm2 start npm --name "strapi" -- run start
pm2 save
pm2 startup
```

### 3. Настройка Frontend (React)

```bash
cd /var/www/komi-republic/komi-republic-frontend

# Создание .env файла
cat > .env << EOF
VITE_STRAPI_URL=http://localhost:1337
EOF

# Установка зависимостей
npm ci

# Сборка
npm run build
```

### 4. Настройка Nginx

Создайте файл `/etc/nginx/sites-available/komi-republic`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /var/www/komi-republic/komi-republic-frontend/dist;
        try_files $uri $uri/ /index.html;
        
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

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

Активируйте конфигурацию:

```bash
sudo ln -s /etc/nginx/sites-available/komi-republic /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Настройка SSL (Let's Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 6. Настройка Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## 🔄 Обновление приложения

### Обновление скриптов деплоя

Если вы обновили скрипты деплоя в репозитории, обновите их на сервере:

```bash
cd ~/komi-republic
git pull origin main
chmod +x deploy.sh deploy-ip.sh
```

### Автоматическое обновление приложения

```bash
cd ~/komi-republic
git pull origin main
sudo ./deploy-ip.sh  # или sudo ./deploy.sh для версии с доменом
```

Скрипт автоматически:
- Обновит код из git-репозитория
- Переустановит зависимости
- Пересоберет приложение
- Перезапустит сервисы

### Ручное обновление

```bash
# Обновление кода
cd ~/komi-republic
git pull origin main

# Backend
cd ~/komi-republic/komi-republic-strapi
npm install --omit=dev
npm run build
pm2 restart strapi

# Frontend
cd ~/komi-republic/komi-republic-frontend
npm install
npm run build
```

## 📊 Мониторинг и логи

### PM2 команды

```bash
# Статус приложений
pm2 status

# Логи Strapi
pm2 logs strapi

# Перезапуск Strapi
pm2 restart strapi

# Остановка Strapi
pm2 stop strapi

# Удаление из PM2
pm2 delete strapi
```

### Nginx логи

```bash
# Логи ошибок
sudo tail -f /var/log/nginx/error.log

# Логи доступа
sudo tail -f /var/log/nginx/access.log
```

## 🔐 Безопасность

### Рекомендации:

1. **Измените пароли по умолчанию** в Strapi Admin
2. **Настройте firewall** (UFW)
3. **Используйте SSL сертификаты** (Let's Encrypt)
4. **Регулярно обновляйте** систему и зависимости
5. **Настройте резервное копирование** базы данных

### Резервное копирование

```bash
# Создание бэкапа базы данных Strapi
cd /var/www/komi-republic/komi-republic-strapi
tar -czf backup-$(date +%Y%m%d).tar.gz .tmp/data.db

# Создание бэкапа загруженных файлов
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz public/uploads/
```

## 🐛 Решение проблем

### Strapi не запускается

```bash
# Проверьте логи
pm2 logs strapi

# Проверьте .env файл
cat ~/komi-republic/komi-republic-strapi/.env

# Пересоберите приложение
cd ~/komi-republic/komi-republic-strapi
npm run build
pm2 restart strapi
```

### Nginx показывает 502 Bad Gateway

```bash
# Проверьте, запущен ли Strapi
pm2 status

# Проверьте порт
netstat -tulpn | grep 1337

# Перезапустите Nginx
sudo systemctl restart nginx
```

### Frontend не обновляется

```bash
# Очистите кэш браузера или используйте Ctrl+Shift+R
# Проверьте, что файлы собраны
ls -la ~/komi-republic/komi-republic-frontend/dist

# Пересоберите frontend
cd ~/komi-republic/komi-republic-frontend
npm run build
```

### Ошибка "Репозиторий не найден"

Если вы видите ошибку `[WARN] Репозиторий не найден`, это означает, что на сервере установлена старая версия скрипта деплоя. Обновите скрипты:

```bash
cd ~/komi-republic
git pull origin main
chmod +x deploy.sh deploy-ip.sh
sudo ./deploy-ip.sh
```

### Ошибка несоответствия package-lock.json

Если вы видите ошибку `npm ci can only install packages when your package.json and package-lock.json are in sync`, обновите скрипты деплоя:

```bash
cd ~/komi-republic
git pull origin main
chmod +x deploy.sh deploy-ip.sh
```

Обновленные скрипты используют `npm install` вместо `npm ci`, что автоматически обновит lock-файлы при необходимости.

Или обновите lock-файлы вручную:

```bash
# Backend
cd ~/komi-republic/komi-republic-strapi
npm install --package-lock-only
git add package-lock.json
git commit -m "Update package-lock.json"

# Frontend
cd ~/komi-republic/komi-republic-frontend
npm install --package-lock-only
git add package-lock.json
git commit -m "Update package-lock.json"
```

## 📞 Поддержка

Если у вас возникли проблемы:
1. Проверьте логи PM2 и Nginx
2. Убедитесь, что все зависимости установлены
3. Проверьте конфигурационные файлы (.env, nginx)

## 📝 Полезные ссылки

- [Документация Strapi](https://docs.strapi.io/)
- [Документация Vite](https://vitejs.dev/)
- [Документация PM2](https://pm2.keymetrics.io/)
- [Документация Nginx](https://nginx.org/ru/docs/)
