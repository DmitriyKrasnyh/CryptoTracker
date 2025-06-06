// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Всё, что начинается с "/api/coins", проксировать на CoinGecko
      '/api/coins': {
        target: 'https://api.coingecko.com/api/v3', // реальный API‐сервер
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/coins/, '/coins'),
      },
      // Если вы хотите отдельно проксировать уже исторические данные (market_chart) и т.п.
      // Можно не дублировать, а просто все запросы к /api/coins/* будут уходить на target + /coins/*
      // Например:
      // '/api/coins': {
      //   target: 'https://api.coingecko.com/api/v3',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api\/coins/, '/coins'),
      // }
      //
      // При таком подходе:
      //  - запросы к axios.get('/api/coins/markets?vs_currency=usd&…')
      //    будут проксироваться на
      //    https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&…
      //
      //  - запросы к axios.get('/api/coins/<coinId>/market_chart?vs_currency=usd&days=1')
      //    будут проксироваться на
      //    https://api.coingecko.com/api/v3/coins/<coinId>/market_chart?vs_currency=usd&days=1
      //
      // Если нужен ещё какой‐то проксинг под Cryptopanic, его можно добавить по аналогии:
      '/api/posts': {
        target: 'https://cryptopanic.com/api/v1',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/posts/, '/posts'),
      },
    },
  },
});
