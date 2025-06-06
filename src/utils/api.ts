import axios from 'axios';
import { CryptoCoin, NewsItem } from '../types';

// Base URLs
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const CRYPTOPANIC_API_URL = 'https://cryptopanic.com/api/v1';

// CoinGecko API Key (only needed if you have a Pro key; otherwise you can omit it)
const COINGECKO_API_KEY = 'CG-Placeholder'; // Замените на реальный ключ или оставьте пустым, если у вас нет Pro-ключа

// CryptoPanic API Key (оставьте пустым, если не используете)
const CRYPTOPANIC_API_KEY = '';

// Fetch list of coins
export const fetchCryptoData = async (): Promise<CryptoCoin[]> => {
  try {
    const config: any = {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
        sparkline: true,
        price_change_percentage: '24h',
      },
    };

    // Если у вас есть Pro-ключ CoinGecko, добавьте его в заголовки
    if (COINGECKO_API_KEY && COINGECKO_API_KEY !== 'CG-Placeholder') {
      config.headers = {
        'X-Cg-Pro-Api-Key': COINGECKO_API_KEY,
      };
    }

    const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, config);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching crypto data:', error);
    throw new Error('Failed to fetch cryptocurrency data');
  }
};

// Fetch historical data for a specific coin
export const fetchCoinDetails = async (coinId: string, days: string = '7') => {
  try {
    const config: any = {
      params: {
        vs_currency: 'usd',
        days: days,
      },
    };

    // Если у вас есть Pro-ключ CoinGecko, добавьте его в заголовки
    if (COINGECKO_API_KEY && COINGECKO_API_KEY !== 'CG-Placeholder') {
      config.headers = {
        'X-Cg-Pro-Api-Key': COINGECKO_API_KEY,
      };
    }

    const response = await axios.get(
      `${COINGECKO_API_URL}/coins/${coinId}/market_chart`,
      config
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching details for ${coinId}:`, error);
    throw new Error(`Failed to fetch details for ${coinId}`);
  }
};

// Fetch crypto news
export const fetchCryptoNews = async (): Promise<NewsItem[]> => {
  if (!CRYPTOPANIC_API_KEY) {
    console.log('No CryptoPanic API key provided, using fallback news');
    return getFallbackNews();
  }

  try {
    const response = await axios.get(`${CRYPTOPANIC_API_URL}/posts/`, {
      params: {
        auth_token: CRYPTOPANIC_API_KEY,
        public: true,
        sort: 'hot',
      },
      timeout: 5000, // 5 second timeout
    });

    if (!response.data || !response.data.results) {
      console.log('Invalid response from CryptoPanic API, using fallback news');
      return getFallbackNews();
    }

    return response.data.results.map((item: any, index: number) => ({
      id: `news-${index}`,
      title: item.title,
      url: item.url,
      source: item.source.title,
      publishedAt: item.published_at,
      summary: item.metadata?.summary,
    }));
  } catch (error) {
    console.log('Error fetching crypto news, using fallback news:', error);
    return getFallbackNews();
  }
};

// Fallback news when API fails
const getFallbackNews = (): NewsItem[] => {
  return [
    {
      id: 'fallback-1',
      title: 'Bitcoin Reaches New Heights as Institutional Adoption Grows',
      url: 'https://www.coindesk.com',
      source: 'CoinDesk',
      publishedAt: new Date().toISOString(),
    },
    {
      id: 'fallback-2',
      title: 'Ethereum 2.0 Upgrade: What You Need to Know',
      url: 'https://cointelegraph.com',
      source: 'CoinTelegraph',
      publishedAt: new Date().toISOString(),
    },
    {
      id: 'fallback-3',
      title: 'Regulatory Developments in Cryptocurrency Markets',
      url: 'https://www.coindesk.com',
      source: 'CoinDesk',
      publishedAt: new Date().toISOString(),
    },
    {
      id: 'fallback-4',
      title: 'NFT Market Continues to Expand Despite Crypto Volatility',
      url: 'https://cointelegraph.com',
      source: 'CoinTelegraph',
      publishedAt: new Date().toISOString(),
    },
    {
      id: 'fallback-5',
      title: 'DeFi Protocols Face Security Challenges as TVL Grows',
      url: 'https://www.coindesk.com',
      source: 'CoinDesk',
      publishedAt: new Date().toISOString(),
    },
  ];
};
