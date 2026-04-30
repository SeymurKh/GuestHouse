# GuestHouse Deployment Preparation

## Current Status
- `npm run build` — успешно
- `npm run lint` — успешно
- `npm run test` — успешно (21 passed)
- Админ-авторизация и API-защита внедрены
- Необходимые переменные окружения описаны в `.env.example`

## Required Environment Variables
### Core
```env
DATABASE_URL=                         # Database connection string
ADMIN_PASSWORD=                       # Strong admin password
ADMIN_TOKEN=                          # Secret token for admin API auth (required in production)
NODE_ENV=production|development
```

### Recommended for production
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com
LOG_LEVEL=info
SENTRY_DSN=                           # Optional error tracking
```

## Ready-to-Use Commands
### Local development
```bash
npm install
npm run dev
```

### Build and test
```bash
npm run lint
npm run test
npm run build
```

### Production start
```bash
npm run build
npm run start
```

## Deployment Options
### Option 1: Vercel (recommended)
1. Подключите репозиторий к Vercel
2. Укажите команду сборки: `npm run build`
3. Укажите папку выхода: `.`
4. Настройте переменные окружения в Vercel:
   - `DATABASE_URL`
   - `ADMIN_PASSWORD`
   - `ADMIN_TOKEN`
   - `NODE_ENV=production`
5. Деплойте

### Option 2: Docker
1. Используйте `Dockerfile` из репозитория
2. Соберите образ:
   ```bash
docker build -t guesthouse-app .
```
3. Запустите контейнер:
   ```bash
docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="your-db-url" \
  -e ADMIN_PASSWORD="your-password" \
  -e ADMIN_TOKEN="your-token" \
  guesthouse-app
```

## Post-Deployment Checklist
- [ ] Проверить, что сайт доступен по HTTPS
- [ ] Убедиться, что `ADMIN_TOKEN` и `ADMIN_PASSWORD` работают
- [ ] Проверить, что `/api/init` не выполняется повторно при пустой базе
- [ ] Проверить, что `public/uploads` доступна для загруженных файлов
- [ ] Запустить smoke test для основных API-эндпоинтов

## Notes
- В продакшене рекомендуется использовать PostgreSQL или MySQL вместо SQLite.
- Текущая логика админ-панели использует `x-admin-token` для всех защищённых API-запросов.
- Если вы хотите убрать upload в `public/uploads` из контейнера, используйте внешний volume.
