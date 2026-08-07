# Stardust — портфолио Хабарова Егора

Next.js-сайт: адаптивная вёрстка на 5 брейкпоинтах (360 / 768 / 1024 / 1440 / 1920), контент редактируется через Sanity Studio без кода.

## Локальный запуск

```bash
npm install
npm run dev
```

Открыть **http://localhost:3000**. Пока Sanity не настроен (см. ниже), сайт работает на «сид»-контенте из `src/lib/content.ts` — тех же реальных текстах/фото, что были в исходном дизайне.

## Настройка Sanity (редактирование контента без кода)

1. Зарегистрируйся на **sanity.io** (можно через тот же GitHub-аккаунт).
2. Создай новый проект (Create project) — запомни его **Project ID**.
3. Скопируй `.env.example` в `.env.local` и заполни:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=<твой project id>
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
4. Запусти `npm run dev` и открой **http://localhost:3000/studio** — это и есть админка. Сначала она будет пустая.

### Заполнить реальным контентом одной командой

Вместо того чтобы вручную вбивать все 9 проектов и 11 навыков заново, можно один раз перенести их из кода в Sanity:

1. В Sanity-проекте: **Settings → API → Tokens → Add API token**, права **Editor**, скопировать токен.
2. Добавить в `.env.local`: `SANITY_API_TOKEN=<токен>`
3. Запустить:
   ```bash
   npm run seed
   ```
   Это загрузит все фото и создаст 9 проектов, 11 навыков и настройки сайта в Sanity — дальше их можно редактировать через `/studio`. Команду безопасно запускать повторно (данные обновятся на месте, не задублируются).

## Деплой (Vercel)

1. **vercel.com → Sign Up → Continue with GitHub**.
2. **Add New → Project** → выбрать этот репозиторий → **Deploy**.
3. В настройках проекта на Vercel (**Settings → Environment Variables**) добавить те же переменные, что в `.env.local`, **кроме** `SANITY_API_TOKEN` (он нужен только для `npm run seed`, на самом сайте не используется) — добавить:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_REVALIDATE_SECRET` — придумать любую случайную строку.

### Мгновенное обновление после публикации

Чтобы изменения в Studio сразу появлялись на живом сайте (без пересборки):

1. В Sanity-проекте: **Settings → API → Webhooks → Create webhook**.
2. URL: `https://<твой-домен>.vercel.app/api/revalidate`
3. Dataset: `production`, Trigger on: **Create / Update / Delete**.
4. Secret: та же строка, что в `SANITY_REVALIDATE_SECRET` на Vercel.

## Структура

- `src/app/` — страницы (Next.js App Router)
- `src/components/` — компоненты дизайн-системы (core/navigation/typography/data/graphics/media) и экраны (screens/)
- `src/motion/` — анимации (прелоадер, переходы между страницами, реакции на скролл)
- `src/sanity/` — схема CMS, GROQ-запросы, клиент
- `src/lib/content.ts` — типы + сид-данные (резервный контент, пока Sanity не настроен)
- `scripts/` — `verify.mjs`/`screenshot.mjs` (проверка вёрстки на всех брейкпоинтах), `seed-sanity.mjs` (перенос контента в Sanity)
