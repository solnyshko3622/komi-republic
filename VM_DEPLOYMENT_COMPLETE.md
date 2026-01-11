# 🚀 Полная инструкция по развертыванию Strapi на VM

## ✅ Текущий статус

- [x] PostgreSQL установлен и настроен
- [x] База данных `strapi_db` создана
- [x] Пользователь `strapi_user` создан с паролем `Vfhbz-12`
- [x] Проект загружен в `~/repo/komi-republic/komi-republic-strapi`
- [x] PM2 установлен
- [ ] Зависимости установлены корректно
- [ ] Проект собран
- [ ] Strapi запущен

---

## 🔧 Исправление текущих проблем

### Проблема 1: Ошибка прав доступа при установке зависимостей

**Решение:**

```bash
# Очистка и переустановка с правильными правами
cd ~/repo/komi-republic/komi-republic-strapi

# Удаление старых node_modules
sudo rm -rf node_modules package-lock.json

# Установка зависимостей
npm install
```

### Проблема 2: "strapi: not found"

Это происходит потому что PM2 запускает `npm start`, который пытается запустить `strapi start`, но Strapi не установлен глобально.

**Решение - использовать правильную команду запуска:**

```bash
# Сначала остановите и удалите все процессы strapi
pm2 delete all

# Или конкретно strapi
pm2 delete strapi
```

---

## 📝 Пошаговая инструкция развертывания

### Шаг 1: Создание .env файла

```bash
cd ~/repo/komi-republic/komi-republic-strapi
nano .env
```

**Вставьте следующее содержимое (готовые ключи):**

```env
HOST=0.0.0.0
PORT=1337

# Security Keys (уже сгенерированы)
APP_KEYS=qbQtfcsO/y2g7U9If2WWWHgmd6/Uh3uKpC3Bh+SNXAE=,NgU4qZa+WIhLLHv+rIYYoA0hBpe8OwLy1V0Q/3dtrMM=,TyOJ6JX+ILBCIlUTfYljyeA/lf60mLQjGGKSAFUkzmc=,iJTbW9/uhtW5zKdlMVITh9aue/Dsrc1l1Si5nZYtEhM=
API_TOKEN_SALT=T9YpHURd8Q43kOd3gThQRAx9XvowKqWavwaw+dU2+sk=
ADMIN_JWT_SECRET=3jA65i1Mp8/6v2+4xkJ8lQDvZQumjB44Jl3+P1jCilo=
TRANSFER_TOKEN_SALT=azP69zrB2q5xS78LhAiMdw5hc1DeNs8kmOtYznJvprE=
JWT_SECRET=XQlV2qkElS+QnRXVFqZpXv2pVB+17QuZTL/LyKCzjmE=

# Database Configuration
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_db
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=Vfhbz-12
DATABASE_SSL=false

# URLs (замените на ваш IP)
PUBLIC_URL=http://YOUR_SERVER_IP:1337
ADMIN_PATH=/admin

# Environment
NODE_ENV=production
```

Сохраните файл: `Ctrl+O`, `Enter`, `Ctrl+X`

### Шаг 2: Очистка и установка зависимостей

```bash
cd ~/repo/komi-republic/komi-republic-strapi

# Удаление старых файлов
sudo rm -rf node_modules package-lock.json .tmp build

# Установка зависимостей
npm install

# Проверка установки
ls -la node_modules/.bin/strapi
```

### Шаг 3: Сборка проекта

```bash
NODE_ENV=production npm run build
```

Это займет несколько минут. Дождитесь завершения.

### Шаг 4: Создание ecosystem.config.js для PM2

```bash
cd ~/repo/komi-republic/komi-republic-strapi
nano ecosystem.config.js
```

**Вставьте следующее содержимое:**

```javascript
module.exports = {
  apps: [
    {
      name: 'strapi',
      cwd: '/home/maryayukhnina/repo/komi-republic/komi-republic-strapi',
      script: './node_modules/.bin/strapi',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/strapi-error.log',
      out_file: './logs/strapi-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
```

Сохраните файл.

### Шаг 5: Создание директории для логов

```bash
mkdir -p ~/repo/komi-republic/komi-republic-strapi/logs
```

### Шаг 6: Очистка PM2 и запуск

```bash
# Удаление всех старых процессов
pm2 delete all

# Запуск с новой конфигурацией
cd ~/repo/komi-republic/komi-republic-strapi
pm2 start ecosystem.config.js

# Проверка статуса
pm2 status

# Просмотр логов
pm2 logs strapi --lines 50
```

### Шаг 7: Настройка автозапуска

```bash
# Сохранение конфигурации PM2
pm2 save

# Настройка автозапуска (выполните команду, которую выведет PM2)
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u maryayukhnina --hp /home/maryayukhnina
```

### Шаг 8: Проверка работы

```bash
# Проверка статуса
pm2 status

# Проверка логов
pm2 logs strapi

# Проверка API
curl http://localhost:1337/api/places

# Проверка подключения к БД
PGPASSWORD='Vfhbz-12' psql -h localhost -U strapi_user -d strapi_db -c "\dt"
```

### Шаг 9: Открытие порта в firewall

```bash
# Разрешение SSH (ВАЖНО!)
sudo ufw allow OpenSSH

# Разрешение порта Strapi
sudo ufw allow 1337/tcp

# Включение firewall
sudo ufw enable

# Проверка
sudo ufw status
```

### Шаг 10: Доступ к админ-панели

Откройте в браузере (замените IP на ваш):
```
http://YOUR_SERVER_IP:1337/admin
```

Создайте первого администратора.

---

## 🔍 Альтернативный способ запуска (если ecosystem.config.js не работает)

### Вариант 1: Прямой запуск через node

```bash
pm2 delete all

cd ~/repo/komi-republic/komi-republic-strapi

pm2 start node --name "strapi" -- ./node_modules/@strapi/strapi/bin/strapi.js start

pm2 save
```

### Вариант 2: Через npm с использованием interpreter

```bash
pm2 delete all

cd ~/repo/komi-republic/komi-republic-strapi

pm2 start npm --name "strapi" --interpreter bash -- run start

pm2 save
```

### Вариант 3: Создание start.sh скрипта

```bash
cd ~/repo/komi-republic/komi-republic-strapi
nano start.sh
```

Содержимое:

```bash
#!/bin/bash
cd /home/maryayukhnina/repo/komi-republic/komi-republic-strapi
NODE_ENV=production ./node_modules/.bin/strapi start
```

Сделайте исполняемым и запустите:

```bash
chmod +x start.sh
pm2 delete all
pm2 start ./start.sh --name "strapi"
pm2 save
```

---

## 📊 Мониторинг и управление

### Команды PM2

```bash
# Статус
pm2 status

# Логи в реальном времени
pm2 logs strapi

# Последние 100 строк логов
pm2 logs strapi --lines 100

# Только ошибки
pm2 logs strapi --err

# Перезапуск
pm2 restart strapi

# Остановка
pm2 stop strapi

# Удаление
pm2 delete strapi

# Мониторинг ресурсов
pm2 monit

# Детальная информация
pm2 info strapi
```

### Проверка работоспособности

```bash
# Проверка процесса
ps aux | grep strapi

# Проверка порта
sudo netstat -tulpn | grep 1337

# Проверка API
curl http://localhost:1337/api/places

# Проверка БД
PGPASSWORD='Vfhbz-12' psql -h localhost -U strapi_user -d strapi_db -c "SELECT COUNT(*) FROM strapi_database_schema;"
```

---

## 🐛 Устранение неполадок

### Проблема: "Cannot find module"

```bash
cd ~/repo/komi-republic/komi-republic-strapi
rm -rf node_modules package-lock.json
npm install
NODE_ENV=production npm run build
pm2 restart strapi
```

### Проблема: "Port 1337 already in use"

```bash
# Найти процесс
sudo lsof -i :1337

# Убить процесс
sudo kill -9 <PID>

# Или остановить через PM2
pm2 stop strapi
pm2 start strapi
```

### Проблема: "Database connection error"

```bash
# Проверка PostgreSQL
sudo systemctl status postgresql

# Проверка подключения
PGPASSWORD='Vfhbz-12' psql -h localhost -U strapi_user -d strapi_db

# Проверка .env файла
cat ~/repo/komi-republic/komi-republic-strapi/.env | grep DATABASE

# Перезапуск PostgreSQL
sudo systemctl restart postgresql
```

### Проблема: PM2 постоянно перезапускается

```bash
# Просмотр логов для диагностики
pm2 logs strapi --lines 200

# Проверка памяти
free -h

# Увеличение лимита памяти
pm2 delete strapi
pm2 start ecosystem.config.js --max-memory-restart 2G
```

### Проблема: "strapi: not found"

```bash
# Проверка установки Strapi
ls -la ~/repo/komi-republic/komi-republic-strapi/node_modules/.bin/strapi

# Если файла нет - переустановка
cd ~/repo/komi-republic/komi-republic-strapi
npm install @strapi/strapi

# Запуск напрямую
pm2 delete all
pm2 start ./node_modules/.bin/strapi --name "strapi" -- start
```

---

## 📦 Загрузка seed данных

После успешного запуска Strapi:

```bash
cd ~/repo/komi-republic/komi-republic-strapi

# Проверка наличия seed скрипта
cat package.json | grep seed

# Запуск seed
npm run seed

# Или напрямую
node scripts/seed.js
```

---

## 🔒 Настройка Nginx (опционально)

Если хотите использовать Nginx как reverse proxy:

```bash
# Установка Nginx
sudo apt install -y nginx

# Создание конфигурации
sudo nano /etc/nginx/sites-available/strapi
```

Содержимое:

```nginx
server {
    listen 80;
    server_name YOUR_SERVER_IP;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активация:

```bash
sudo ln -s /etc/nginx/sites-available/strapi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Разрешение в firewall
sudo ufw allow 'Nginx Full'
```

Теперь доступ будет по:
```
http://YOUR_SERVER_IP/admin
```

---

## ✅ Контрольный список

- [x] PostgreSQL установлен и запущен
- [x] База данных создана
- [ ] Node.js зависимости установлены
- [ ] .env файл создан с правильными параметрами
- [ ] Проект собран (`npm run build`)
- [ ] ecosystem.config.js создан
- [ ] PM2 запущен успешно
- [ ] PM2 автозапуск настроен
- [ ] Firewall настроен
- [ ] Админ-панель доступна
- [ ] Seed данные загружены

---

## 📝 Быстрые команды для копирования

### Полная последовательность команд:

```bash
# 1. Переход в директорию
cd ~/repo/komi-republic/komi-republic-strapi

# 2. Создание .env (скопируйте содержимое из инструкции выше)
nano .env

# 3. Очистка и установка
sudo rm -rf node_modules package-lock.json .tmp build
npm install

# 4. Сборка
NODE_ENV=production npm run build

# 5. Создание ecosystem.config.js (скопируйте содержимое из инструкции)
nano ecosystem.config.js

# 6. Создание директории логов
mkdir -p logs

# 7. Запуск
pm2 delete all
pm2 start ecosystem.config.js

# 8. Проверка
pm2 status
pm2 logs strapi

# 9. Сохранение
pm2 save

# 10. Автозапуск
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u maryayukhnina --hp /home/maryayukhnina

# 11. Firewall
sudo ufw allow OpenSSH
sudo ufw allow 1337/tcp
sudo ufw enable
```

---

## 🎯 Готовые файлы

### .env файл (готовый к использованию)

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=qbQtfcsO/y2g7U9If2WWWHgmd6/Uh3uKpC3Bh+SNXAE=,NgU4qZa+WIhLLHv+rIYYoA0hBpe8OwLy1V0Q/3dtrMM=,TyOJ6JX+ILBCIlUTfYljyeA/lf60mLQjGGKSAFUkzmc=,iJTbW9/uhtW5zKdlMVITh9aue/Dsrc1l1Si5nZYtEhM=
API_TOKEN_SALT=T9YpHURd8Q43kOd3gThQRAx9XvowKqWavwaw+dU2+sk=
ADMIN_JWT_SECRET=3jA65i1Mp8/6v2+4xkJ8lQDvZQumjB44Jl3+P1jCilo=
TRANSFER_TOKEN_SALT=azP69zrB2q5xS78LhAiMdw5hc1DeNs8kmOtYznJvprE=
JWT_SECRET=XQlV2qkElS+QnRXVFqZpXv2pVB+17QuZTL/LyKCzjmE=
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_db
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=Vfhbz-12
DATABASE_SSL=false
PUBLIC_URL=http://YOUR_SERVER_IP:1337
ADMIN_PATH=/admin
NODE_ENV=production
```

### ecosystem.config.js (готовый к использованию)

```javascript
module.exports = {
  apps: [{
    name: 'strapi',
    cwd: '/home/maryayukhnina/repo/komi-republic/komi-republic-strapi',
    script: './node_modules/.bin/strapi',
    args: 'start',
    env: { NODE_ENV: 'production' },
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/strapi-error.log',
    out_file: './logs/strapi-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }],
};
```

---

**Важно**: Замените `YOUR_SERVER_IP` на реальный IP адрес вашего сервера во всех конфигурационных файлах!

**Следующий шаг**: После успешного запуска откройте `http://YOUR_SERVER_IP:1337/admin` и создайте первого администратора.
