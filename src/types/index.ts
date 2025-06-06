// Cryptocurrency types
export interface CryptoCoin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  purchasePrice: number;
  amount: number;
  currentPrice?: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[];
}

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  imageUrl?: string;
  source: string;
  publishedAt: string;
  summary?: string;
}

export type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y' | 'all';