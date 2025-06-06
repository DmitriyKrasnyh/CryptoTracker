import axios from 'axios';
import { CryptoCoin, NewsItem } from '../types';

// Base URLs
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const CRYPTOPANIC_API_URL = 'https://cryptopanic.com/api/v1';

// CoinGecko API Key (required for all requests as of recent changes)
const COINGECKO_API_KEY = 'CG-Placeholder'; // Replace with your actual API key

// Add your CryptoPanic API key here if you have one
const CRYPTOPANIC_API_KEY = '';

// Fetch list of coins
export const fetchCryptoData = async (): Promise<CryptoCoin[]> => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
        sparkline: true,
        price_change_percentage: '24h',
        x_cg_demo_api_key: COINGECKO_API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw new Error('Failed to fetch cryptocurrency data');
  }
};

// Fetch historical data for a specific coin
export const fetchCoinDetails = async (coinId: string, days: string = '7') => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
        x_cg_demo_api_key: COINGECKO_API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
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
        sort: 'hot'
      },
      timeout: 5000 // 5 second timeout
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
      summary: item.metadata?.summary
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
      publishedAt: new Date().toISOString()
    },
    {
      id: 'fallback-2',
      title: 'Ethereum 2.0 Upgrade: What You Need to Know',
      url: 'https://cointelegraph.com',
      source: 'CoinTelegraph',
      publishedAt: new Date().toISOString()
    },
    {
      id: 'fallback-3',
      title: 'Regulatory Developments in Cryptocurrency Markets',
      url: 'https://www.coindesk.com',
      source: 'CoinDesk',
      publishedAt: new Date().toISOString()
    },
    {
      id: 'fallback-4',
      title: 'NFT Market Continues to Expand Despite Crypto Volatility',
      url: 'https://cointelegraph.com',
      source: 'CoinTelegraph',
      publishedAt: new Date().toISOString()
    },
    {
      id: 'fallback-5',
      title: 'DeFi Protocols Face Security Challenges as TVL Grows',
      url: 'https://www.coindesk.com',
      source: 'CoinDesk',
      publishedAt: new Date().toISOString()
    }
  ];
};