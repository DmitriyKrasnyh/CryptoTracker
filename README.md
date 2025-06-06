# CryptoTracker

**CryptoTracker** ― это одностраничное React-приложение для отслеживания актуальных цен криптовалют, управления портфелем и просмотра последних новостей из мира криптоиндустрии.  

В проекте используются:
- **React** (Vite)
- **TypeScript**
- **Tailwind CSS** для стилизации
- **Context API** для управления темой, данными портфеля и данными криптовалют
- **Axios** для HTTP-запросов к CoinGecko и CryptoPanic
- **Vite proxy** для обхода CORS при обращении к внешним API

---

## Содержание

1. [Функционал](#функционал)
2. [Технологии](#технологии)
3. [Структура проекта](#структура-проекта)
4. [Установка и настройка](#установка-и-настройка)
   - [1. Клонирование репозитория](#1-клонирование-репозитория)
   - [2. Установка зависимостей](#2-установка-зависимостей)
   - [3. Настройка окружения (API‐ключи)](#3-настройка-окружения-api‐ключи)
   - [4. Настройка прокси в Vite (CORS)](#4-настройка-прокси-в-vite-cors)
5. [Скрипты командной строки](#скрипты-командной-строки)
6. [Описание компонентов](#описание-компонентов)
7. [Context API](#context-api)
8. [Сборка и деплой](#сборка-и-деплой)
9. [Лицензия](#лицензия)

---

## Функционал

1. **Реальное время (Real-Time Prices)**  
   - Отображает список топ-50 криптовалют по капитализации (CoinGecko).  
   - Показаны: название, символ, текущая цена, изменение за 24h, рыночная капитализация, объём торгов, график за последние 7 дней.

2. **График цены (Price Chart)**  
   - При клике на криптовалюту (в таблице) отображается подробный график изменения цены за выбранный период (по умолчанию 7 дней).  
   - Исторические данные запрашиваются с CoinGecko (эндпоинт `/coins/{id}/market_chart`).

3. **Портфолио (Portfolio)**  
   - Пользователь может добавлять/удалять позиции (монеты + количество).  
   - Подсчитывается общая стоимость портфеля и отображается список позиций.  
   - Данные хранятся в `localStorage`, чтобы информация сохранялась между перезагрузками страницы.

4. **Новости (Crypto News)**  
   - В разделе «Crypto News» отображаются новости из CryptoPanic (если указан API-ключ), либо запасные «fallback»-статьи при отсутствии ключа или при ошибке.  
   - Отображаются: заголовок, источник, дата публикации, краткое описание (summary).

5. **Тёмная/светлая тема (Theme Switcher)**  
   - Переключение между светлой и тёмной темой оформления.  
   - Выбор темы сохраняется в `localStorage`.

6. **Навигация по секциям (Header)**  
   - Фиксированная шапка (`Header`) с меню-скроллом по разделам: Home, Prices, Chart, Portfolio, News.  
   - Активная секция подсвечивается при прокрутке страницы (скролл-spy).

---

## Технологии

- **React** + **TypeScript**  
- **Vite**  
- **Tailwind CSS**  
- **Axios** для HTTP-запросов  
- **Context API** (React) для управления состоянием:
  - `ThemeContext` ― тема светлая/тёмная
  - `PortfolioContext` ― данные портфеля
  - `CryptoDataContext` ― данные криптовалют (список, график)
- **react-hot-toast** для всплывающих уведомлений (добавление/удаление позиций)
- **Vite Proxy** для обхода CORS при запросах к CoinGecko/CryptoPanic
- **ESLint/Prettier** (рекомендуется) для форматирования и проверки кода

---

## Структура проекта

```text
crypto-tracker/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── api.ts                  # Логика работы с CoinGecko и CryptoPanic
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Шапка сайта, меню навигации
│   │   │   └── Footer.tsx          # Футер
│   │   ├── crypto/
│   │   │   ├── CryptoTable.tsx     # Таблица с топ‐50 криптовалютами
│   │   │   ├── CryptoChart.tsx     # Компонент с графиком (Recharts / Chart.js)
│   │   │   ├── Portfolio.tsx       # UI для управления портфелем
│   │   │   └── News.tsx            # Список новостей (CryptoPanic / fallback)
│   ├── context/
│   │   ├── ThemeContext.tsx        # Провайдер для темы (light/dark)
│   │   ├── PortfolioContext.tsx    # Провайдер данных портфеля
│   │   └── CryptoDataContext.tsx   # Провайдер данных криптовалют (fetch + cache)
│   ├── types/
│   │   └── index.ts                # Определения Typescript‐типов (CryptoCoin, NewsItem и т.д.)
│   ├── App.tsx                     # Главный компонент приложения
│   ├── main.tsx                    # Точка входа (рендер в DOM)
│   └── index.css                   # Tailwind CSS, глобальные стили
├── .env                            # Переменные окружения (API-ключи)
├── vite.config.ts                  # Конфиг Vite (proxy для CORS, плагины)
├── package.json
├── tsconfig.json
└── README.md                       # Вы сейчас читаете
```

---

## Установка и настройка

### 1. Клонирование репозитория

```bash
git clone https://github.com/ваш-логин/crypto-tracker.git
cd crypto-tracker
```

### 2. Установка зависимостей

```bash
npm install
# или
yarn install
```

### 3. Настройка окружения (API-ключи)

Создайте в корне проекта файл `.env` (обычно копируется от `.env.example`, если он есть) и пропишите туда:

```dotenv
# .env
# -----------------------------------------
# Если у вас есть Pro-ключ CoinGecko, его нужно передать в эту переменную.
# Без ключа можно работать в публичном режиме, но не все эндпоинты будут доступны (401, 429).
VITE_CG_API_KEY=ваш_CoinGecko_Pro_API_KEY

# (Опционально) Если хотите подтягивать новости из КryptoPanic, укажите ключ:
VITE_CP_API_KEY=ваш_CryptoPanic_API_KEY
# -----------------------------------------
```

> **Почему переменные называются `VITE_...`:**  
> Vite по умолчанию «подключает» в клиентскую часть только переменные окружения с префиксом `VITE_`.  
> При сборке они будут внедрены в код.

Если вы не собираетесь получать новости из CryptoPanic, можете оставить `VITE_CP_API_KEY` пустым ― будет использован «fallback» (запасные) новости.

### 4. Настройка прокси в Vite (CORS)

В файле `vite.config.ts` должны быть прописаны правила проксирования запросов:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // ====== CoinGecko (GET /coins/markets, GET /coins/{id}/market_chart) ======
      '/api/coins': {
        target: 'https://api.coingecko.com/api/v3',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/coins/, '/coins'),
      },
      // ====== CryptoPanic (GET /posts/) ======
      '/api/posts': {
        target: 'https://cryptopanic.com/api/v1',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/posts/, '/posts'),
      },
    },
  },
});
```

- Любой запрос к `/api/coins/...` автоматически будет перенаправляться на `https://api.coingecko.com/api/v3/coins/...`.
- Любой запрос к `/api/posts/...` будет идти на `https://cryptopanic.com/api/v1/posts/...`.

Благодаря этому в браузере не возникает ошибок CORS, поскольку все запросы «выглядят» как запросы на тот же origin (`localhost:5173`).

---

## Скрипты командной строки

В `package.json` прописаны стандартные команды:

```json
{
  "scripts": {
    "dev": "vite",               // Запуск dev-сервера (http://localhost:5173)
    "build": "vite build",       // Сборка приложения для продакшена
    "preview": "vite preview",   // Локальный режим «превью» собранного бандла
    "lint": "eslint src --ext .ts,.tsx",   // Запуск ESLint по коду (по желанию)
    "format": "prettier --write .",        // Форматирование кода (Prettier)
    ...
  }
}
```

- **`npm run dev`** (или `yarn dev`)  
  Запускает dev-сервер на `http://localhost:5173`. Автообновление при изменениях кода.

- **`npm run build`** (или `yarn build`)  
  Создаёт оптимизированный бандл в папке `dist/` (готовый к деплою).

- **`npm run preview`** (или `yarn preview`)  
  Локальный HTTP-сервер, раздающий содержимое `dist/`, чтобы проверить после сборки.

- **`npm run lint`**  
  Проверяет файлы в `src/` на соответствие правилам ESLint (если настроен).

- **`npm run format`**  
  Форматирует весь проект с помощью Prettier (если настроен).

---

## Описание компонентов

### 1. `Header.tsx`

- Фиксированная шапка (fixed-top), содержащая:
  - Логотип/название проекта.
  - Меню навигации по секциям: Home, Prices, Chart, Portfolio, News.
  - Кнопка переключения темы (светлая/тёмная).
- Получает пропс `activeSection: string` и подсвечивает текущую активную ссылку.

### 2. `Footer.tsx`

- Простой футер с авторскими правами, ссылками на репозиторий и контактами (опционально).

### 3. `CryptoTable.tsx`

- Отображает таблицу с топ-50 криптовалютами по капитализации:
  - Номер (rank), название (с иконкой), символ, текущая цена, изменение за 24 ч (с цветом), рыночная капитализация, объём торгов за 24 ч, мини-график за 7 дней (sparkline).
- При клике на строку таблицы ― выставляет выбранную монету в `CryptoDataContext`, чтобы `CryptoChart` мог отобразить её график.

### 4. `CryptoChart.tsx`

- Отображает линейный/свечной график (Recharts/Chart.js) для выбранной монеты:
  - Получает идентификатор выбранной монеты из `CryptoDataContext`.
  - Запрашивает исторические данные через `fetchCoinDetails(coinId, days)`.
  - Позволяет переключать период (7 дней, 30 дней, 90 дней, год, max).
  - При ошибке (401, 429) показывает сообщение о невозможности загрузить данные.

### 5. `Portfolio.tsx`

- Компонент для управления «виртуальным» портфелем:
  - Форма добавления новой позиции (выбор монеты, ввод количества).
  - Список текущих позиций (название, символ, количество, текущая стоимость, изменение стоимости).
  - Кнопка удаления позиции.
  - Итоговая стоимость портфеля.
- Данные хранятся в `localStorage` через `PortfolioContext`.

### 6. `News.tsx`

- Компонент для отображения списка новостей:
  - Если указан `VITE_CP_API_KEY`, делает запрос к CryptoPanic `/api/posts/?auth_token=...`.
  - Если нет ключа или пришла ошибка, рендерятся заранее заготовленные «fallback» статьи.
  - Для каждой новости показывается заголовок (ссылка), источник, дата публикации, и, если доступно, краткое описание (summary).

---

## Context API

### 1. `ThemeContext.tsx`

- Провайдер темы:
  - Хранит состояние `theme: 'light' | 'dark'`.
  - Функция `toggleTheme()` для переключения.
  - Текущая тема сохраняется в `localStorage` и подтягивается при загрузке.

### 2. `PortfolioContext.tsx`

- Провайдер портфеля:
  - Состояние `portfolio: Array<{ coinId: string; amount: number }>` (или более сложная структура).
  - Функции:
    - `addPosition(coinId: string, amount: number)`
    - `removePosition(coinId: string)`
    - `updatePosition(coinId: string, newAmount: number)`
  - Данные хранятся/читаются из `localStorage`, чтобы сохранялись при перезагрузке страницы.

### 3. `CryptoDataContext.tsx`

- Провайдер данных криптовалют:
  - Состояние:
    - `coins: CryptoCoin[]` ― массив с данными топ-50 монет.
    - `selectedCoinId: string | null` ― текущая монета для графика.
    - `historicalData: any` ― данные для графика (массива точек).
    - `isLoading: boolean` / `error: string | null`.
  - Функции:
    - `refreshData()` ― получить актуальный список `coins` через `fetchCryptoData()`.
    - `getHistoricalData(coinId: string, days: string)` ― получить через `fetchCoinDetails(coinId, days)`.
    - Автообновление списка монет в заданном интервале (например, каждые 30 с).
  - Подписка компонентов `CryptoTable` и `CryptoChart` на данные из этого контекста.

---

## Сборка и деплой

1. Убедитесь, что в `.env` прописаны ваши ключи (`VITE_CG_API_KEY`, `VITE_CP_API_KEY`) перед сборкой.
2. Запустите:
   ```bash
   npm run build
   # или
   yarn build
   ```
3. После успешной сборки всё содержимое будет лежать в папке `dist/`.  
   Деплой:  
   - Можно раздать `dist/` на любом статическом хостинге (Netlify, Vercel, GitHub Pages, Firebase Hosting и т.д.).  
   - Если деплойите на свой сервер (Nginx, Apache), убедитесь, что настроена корректная отдача `index.html` для всех путей (SPA).

> **Важно:**  
> - На продакшене proxy не работает так, как в режиме `dev`. Поэтому в продакшн-окружении обязательно нужно:
>   1. Либо выполнять запросы к внешним API с собственного бэкенда (например, node/express),  
>   2. Либо настраивать сервер (Nginx) на проксирование внешних запросов,  
>   3. Либо пользоваться публичными прокси/функциями (Serverless),  
>   4. Либо напрямую обращаться к API CoinGecko (если они поддерживают CORS для продакшена ― к сожалению, без Pro-ключа уже отказано CORS’ом).

---

## Лицензия

Этот проект распространяется под лицензией MIT. См. файл [LICENSE](LICENSE) для подробностей.

---

**Автор:**  
Дмитрий Красных  
Email: dimathedevoloper@gmail.com  
GitHub: [github.com/DmitriyKrasnyh](https://github.com/DmitriyKrasnyh)  

Спасибо за использование CryptoTracker! 🚀  Если у вас возникнут вопросы или предложения — создавайте issue в репозитории или пишите прямо в Pull Request.
