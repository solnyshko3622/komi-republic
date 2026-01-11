# Инструкция по развертыванию Strapi на виртуальной машине

## ✅ Статус: База данных PostgreSQL настроена успешно!

База данных `strapi_db` и пользователь `strapi_user` созданы и готовы к использованию.

---

## Содержание

1. [Быстрый старт](#быстрый-старт)
2. [Подробная инструкция](#подробная-инструкция)
3. [Настройка переменных окружения](#настройка-переменных-окружения)
4. [Запуск и мониторинг](#запуск-и-мониторинг)
5. [Устранение неполадок](#устранение-неполадок)

---

## Быстрый старт

### Шаг 1: Загрузка проекта на сервер

На **локальной машине** выполните:

```bash
# Перейдите в директорию проекта
cd ~/komi-republic

# Загрузите проект на сервер (замените IP и username)
scp -r komi-republic-strapi maryayukhnina@158.160.XXX.XXX:~/komi-republic/
```

### Шаг 2: Установка зависимостей на сервере

На **сервере** выполните:

```bash
cd ~/komi-republic/komi-republic-strapi
npm install --production
```

### Шаг 3: Создание .env файла

```bash
cd ~/komi-republic/komi-republic-strapi
nano .env
```

Вставьте следующее содержимое (замените значения):

```env
HOST=0.0.0.0
PORT=1337

# Сгенерируйте ключи командой: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_db
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=Vfhbz-12
DATABASE_SSL=false

# URLs
PUBLIC_URL=http://158.160.XXX.XXX:1337
ADMIN_PATH=/admin

# Environment
NODE_ENV=production
```

### Шаг 4: Генерация ключей безопасности

```bash
# Выполните 5 раз для генерации всех ключей
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Скопируйте сгенерированные ключи в `.env` файл.

### Шаг 5: Сборка проекта

```bash
NODE_ENV=production npm run build
```

### Шаг 6: Запуск через PM2

```bash
# Установка PM2 (если еще не установлен)
sudo npm install -g pm2

# Запуск Strapi
pm2 start npm --name "strapi" -- start

# Сохранение конфигурации PM2
pm2 save

# Настройка автозапуска
pm2 startup systemd
# Выполните команду, которую выведет PM2
```

### Шаг 7: Проверка работы

```bash
# Проверка статуса
pm2 status

# Просмотр логов
pm2 logs strapi

# Проверка API
curl http://localhost:1337/api/places
```

### Шаг 8: Доступ к админ-панели

Откройте в браузере:
```
http://158.160.XXX.XXX:1337/admin
```

Создайте первого администратора.

---

## Подробная инструкция

### 1. Подготовка сервера

#### 1.1 Обновление системы

```bash
sudo apt update
sudo apt upgrade -y
```

#### 1.2 Установка Node.js 20.x

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Должно быть v20.x.x
npm --version
```

#### 1.3 Установка Git

```bash
sudo apt install -y git
```

#### 1.4 Установка PM2

```bash
sudo npm install -g pm2
pm2 --version
```

### 2. База данных PostgreSQL (✅ Уже настроена)

База данных уже создана и настроена:
- **База данных**: `strapi_db`
- **Пользователь**: `strapi_user`
- **Пароль**: `Vfhbz-12`

Проверка подключения:
```bash
PGPASSWORD='Vfhbz-12' psql -h localhost -U strapi_user -d strapi_db -c "SELECT version();"
```

### 3. Развертывание Strapi

#### 3.1 Создание структуры директорий

```bash
mkdir -p ~/komi-republic
cd ~/komi-republic
```

#### 3.2 Загрузка проекта

**Вариант А: Через SCP с локальной машины**

На локальной машине:
```bash
cd ~/komi-republic
scp -r komi-republic-strapi maryayukhnina@158.160.XXX.XXX:~/komi-republic/
```

**Вариант Б: Через Git**

На сервере:
```bash
cd ~/komi-republic
git clone https://github.com/your-username/komi-republic-strapi.git
```

#### 3.3 Установка зависимостей

```bash
cd ~/komi-republic/komi-republic-strapi
npm install --production
```

---

## Настройка переменных окружения

### Создание .env файла

```bash
cd ~/komi-republic/komi-republic-strapi
nano .env
```

### Полный пример .env файла

```env
# Server Configuration
HOST=0.0.0.0
PORT=1337

# Security Keys (сгенерируйте свои!)
APP_KEYS=xK8mN2pQ5rT9vW3yZ6aC4eF7hJ0kL1mN,pQ5rT9vW3yZ6aC4eF7hJ0kL1mNxK8mN2,T9vW3yZ6aC4eF7hJ0kL1mNxK8mN2pQ5r,W3yZ6aC4eF7hJ0kL1mNxK8mN2pQ5rT9v
API_TOKEN_SALT=aB3cD5eF7gH9iJ1kL3mN5oP7qR9sT1uV
ADMIN_JWT_SECRET=wX2yZ4aB6cD8eF0gH2iJ4kL6mN8oP0qR
TRANSFER_TOKEN_SALT=sT1uV3wX5yZ7aB9cD1eF3gH5iJ7kL9mN
JWT_SECRET=oP0qR2sT4uV6wX8yZ0aB2cD4eF6gH8iJ

# Database Configuration
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_db
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=Vfhbz-12
DATABASE_SSL=false

# URLs (замените на ваш IP)
PUBLIC_URL=http://158.160.XXX.XXX:1337
ADMIN_PATH=/admin

# Environment
NODE_ENV=production
```

### Генерация безопасных ключей

```bash
# Выполните эту команду 5 раз
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Замените значения в `.env` файле на сгенерированные ключи.

---

## Запуск и мониторинг

### Сборка проекта

```bash
cd ~/komi-republic/komi-republic-strapi
NODE_ENV=production npm run build
```

### Создание ecosystem.config.js для PM2

```bash
nano ecosystem.config.js
```

Содержимое:

```javascript
module.exports = {
  apps: [
    {
      name: 'strapi',
      cwd: '/home/maryayukhnina/komi-republic/komi-republic-strapi',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
```

### Запуск через PM2

```bash
# Запуск
pm2 start ecosystem.config.js

# Или простой запуск
pm2 start npm --name "strapi" -- start

# Проверка статуса
pm2 status

# Просмотр логов
pm2 logs strapi

# Просмотр последних 100 строк
pm2 logs strapi --lines 100
```

### Настройка автозапуска

```bash
# Сохранение текущей конфигурации
pm2 save

# Настройка автозапуска при перезагрузке сервера
pm2 startup systemd

# Выполните команду, которую выведет PM2 (примерно такую):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u maryayukhnina --hp /home/maryayukhnina
```

### Полезные команды PM2

```bash
# Статус всех процессов
pm2 status

# Логи в реальном времени
pm2 logs strapi

# Только ошибки
pm2 logs strapi --err

# Перезапуск
pm2 restart strapi

# Остановка
pm2 stop strapi

# Удаление из PM2
pm2 delete strapi

# Мониторинг ресурсов
pm2 monit

# Детальная информация
pm2 info strapi

# Список всех процессов
pm2 list
```

---

## Настройка Nginx (опционально)

Если хотите использовать Nginx как reverse proxy:

### Установка Nginx

```bash
sudo apt install -y nginx
```

### Создание конфигурации

```bash
sudo nano /etc/nginx/sites-available/strapi
```

Содержимое:

```nginx
server {
    listen 80;
    server_name 158.160.XXX.XXX;

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

### Активация конфигурации

```bash
# Создание символической ссылки
sudo ln -s /etc/nginx/sites-available/strapi /etc/nginx/sites-enabled/

# Проверка конфигурации
sudo nginx -t

# Перезапуск Nginx
sudo systemctl restart nginx
```

Теперь Strapi будет доступен на порту 80:
```
http://158.160.XXX.XXX/admin
```

---

## Настройка Firewall

```bash
# Разрешение SSH (ВАЖНО: сделайте это первым!)
sudo ufw allow OpenSSH

# Разрешение HTTP
sudo ufw allow 80/tcp

# Разрешение HTTPS (если будете использовать SSL)
sudo ufw allow 443/tcp

# Разрешение прямого доступа к Strapi (если не используете Nginx)
sudo ufw allow 1337/tcp

# Включение firewall
sudo ufw enable

# Проверка статуса
sudo ufw status verbose
```

---

## Загрузка seed данных

После успешного запуска Strapi загрузите тестовые данные:

```bash
cd ~/komi-republic/komi-republic-strapi

# Запуск seed скрипта
npm run seed
```

---

## Устранение неполадок

### Проблема: Strapi не запускается

```bash
# Проверка логов
pm2 logs strapi --lines 200

# Проверка .env файла
cat .env

# Проверка подключения к БД
PGPASSWORD='Vfhbz-12' psql -h localhost -U strapi_user -d strapi_db -c "SELECT version();"

# Попытка запуска напрямую для диагностики
cd ~/komi-republic/komi-republic-strapi
NODE_ENV=production npm start
```

### Проблема: Ошибка подключения к БД

```bash
# Проверка статуса PostgreSQL
sudo systemctl status postgresql

# Проверка прав пользователя
sudo -u postgres psql -c "\du strapi_user"

# Проверка базы данных
sudo -u postgres psql -c "\l strapi_db"

# Переподключение прав (если нужно)
sudo -u postgres psql strapi_db -c "GRANT ALL ON SCHEMA public TO strapi_user;"
```

### Проблема: Порт 1337 занят

```bash
# Проверка, что использует порт
sudo netstat -tulpn | grep 1337

# Или
sudo lsof -i :1337

# Остановка процесса
pm2 stop strapi
# или
sudo kill -9 <PID>
```

### Проблема: Недостаточно памяти

```bash
# Проверка использования памяти
free -h

# Увеличение лимита памяти для PM2
pm2 delete strapi
pm2 start ecosystem.config.js --max-memory-restart 2G
```

### Проблема: Ошибки при сборке

```bash
# Очистка кэша и пересборка
cd ~/komi-republic/komi-republic-strapi
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --production
NODE_ENV=production npm run build
```

---

## Резервное копирование

### Создание скрипта бэкапа

```bash
nano ~/backup-strapi.sh
```

Содержимое:

```bash
#!/bin/bash

BACKUP_DIR="$HOME/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="strapi_db"
DB_USER="strapi_user"
DB_PASS="Vfhbz-12"

mkdir -p $BACKUP_DIR

# Бэкап базы данных
PGPASSWORD="$DB_PASS" pg_dump -h localhost -U $DB_USER $DB_NAME > "$BACKUP_DIR/strapi_db_$DATE.sql"

# Бэкап файлов
tar -czf "$BACKUP_DIR/strapi_files_$DATE.tar.gz" -C ~/komi-republic komi-republic-strapi/public/uploads

# Удаление старых бэкапов (старше 7 дней)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Права на выполнение
chmod +x ~/backup-strapi.sh

# Тестовый запуск
~/backup-strapi.sh

# Добавление в cron (ежедневно в 2:00)
crontab -e
# Добавьте строку:
0 2 * * * /home/maryayukhnina/backup-strapi.sh
```

### Восстановление из бэкапа

```bash
# Восстановление БД
PGPASSWORD='Vfhbz-12' psql -h localhost -U strapi_user -d strapi_db < ~/backups/strapi_db_YYYYMMDD_HHMMSS.sql

# Восстановление файлов
tar -xzf ~/backups/strapi_files_YYYYMMDD_HHMMSS.tar.gz -C ~/komi-republic/
```

---

## Обновление Strapi

```bash
# 1. Создание бэкапа
~/backup-strapi.sh

# 2. Остановка приложения
pm2 stop strapi

# 3. Обновление кода (если из Git)
cd ~/komi-republic/komi-republic-strapi
git pull origin main

# 4. Обновление зависимостей
npm install --production

# 5. Пересборка
NODE_ENV=production npm run build

# 6. Запуск
pm2 restart strapi

# 7. Проверка
pm2 logs strapi --lines 50
```

---

## Мониторинг

### Просмотр логов

```bash
# Логи Strapi
pm2 logs strapi
pm2 logs strapi --lines 100
pm2 logs strapi --err

# Системные ресурсы
htop
# или
top

# Использование диска
df -h

# Использование памяти
free -h

# Сетевые подключения
sudo netstat -tulpn | grep LISTEN
```

### Проверка работоспособности

```bash
# Проверка API
curl http://localhost:1337/api/places

# Проверка здоровья (если endpoint настроен)
curl http://localhost:1337/_health

# Проверка статуса PostgreSQL
sudo systemctl status postgresql

# Проверка PM2
pm2 status
```

---

## Контрольный список

### Перед запуском:
- [x] PostgreSQL установлен и запущен
- [x] База данных `strapi_db` создана
- [x] Пользователь `strapi_user` создан с правами
- [ ] Node.js 20.x установлен
- [ ] PM2 установлен глобально
- [ ] Проект загружен на сервер
- [ ] Зависимости установлены (`npm install`)
- [ ] Файл `.env` создан и настроен
- [ ] Безопасные ключи сгенерированы
- [ ] Проект собран (`npm run build`)

### После запуска:
- [ ] Strapi запущен через PM2
- [ ] PM2 автозапуск настроен
- [ ] Админ-панель доступна
- [ ] API endpoints работают
- [ ] Seed данные загружены (опционально)
- [ ] Nginx настроен (опционально)
- [ ] Firewall настроен
- [ ] Резервное копирование настроено

---

## Полезные ссылки

- **Админ-панель**: `http://158.160.XXX.XXX:1337/admin`
- **API**: `http://158.160.XXX.XXX:1337/api`
- **Документация Strapi**: https://docs.strapi.io
- **Документация PM2**: https://pm2.keymetrics.io

---

## Следующие шаги

1. ✅ База данных настроена
2. 📦 Загрузите проект на сервер
3. ⚙️ Создайте `.env` файл с правильными параметрами
4. 🔨 Соберите проект (`npm run build`)
5. 🚀 Запустите через PM2
6. 🔐 Создайте первого администратора
7. 📊 Загрузите seed данные
8. 🌐 Настройте Nginx (опционально)
9. 🔒 Настройте SSL (опционально)
10. 💾 Настройте резервное копирование

---

**Важно**: Замените `158.160.XXX.XXX` на реальный IP адрес вашего сервера во всех конфигурационных файлах!
