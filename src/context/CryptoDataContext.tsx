import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { fetchCryptoData, fetchCoinDetails } from '../utils/api';
import { CryptoCoin, TimeRange } from '../types';

interface CryptoDataContextType {
  coins: CryptoCoin[];
  loading: boolean;
  error: string | null;
  selectedCoin: CryptoCoin | null;
  timeRange: TimeRange;
  setSelectedCoin: (coin: CryptoCoin | null) => void;
  setTimeRange: (range: TimeRange) => void;
  refreshData: () => Promise<void>;
  getHistoricalData: (coinId: string, days: string) => Promise<any>;
}

const CryptoDataContext = createContext<CryptoDataContextType | undefined>(undefined);

export const useCryptoData = (): CryptoDataContextType => {
  const context = useContext(CryptoDataContext);
  if (!context) {
    throw new Error('useCryptoData must be used within a CryptoDataProvider');
  }
  return context;
};

interface CryptoDataProviderProps {
  children: ReactNode;
}

export const CryptoDataProvider: React.FC<CryptoDataProviderProps> = ({ children }) => {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [retryCount, setRetryCount] = useState<number>(0);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCryptoData();
      setCoins(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      toast.error('Failed to load cryptocurrency data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refreshData();
      } catch (err) {
        console.error('Error in initial data fetch:', err);
        // If we've retried less than 3 times, try again after 10 seconds
        if (retryCount < 3) {
          toast.error('Failed to load data, retrying in 10 seconds');
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 10000);
        }
      }
    };

    fetchData();

    // Set up interval for refreshing data every 30 seconds
    const intervalId = setInterval(() => {
      refreshData();
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [retryCount]);

  const getHistoricalData = async (coinId: string, days: string) => {
    try {
      const data = await fetchCoinDetails(coinId, days);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch historical data';
      toast.error(errorMessage);
      throw err;
    }
  };

  return (
    <CryptoDataContext.Provider
      value={{
        coins,
        loading,
        error,
        selectedCoin,
        timeRange,
        setSelectedCoin,
        setTimeRange,
        refreshData,
        getHistoricalData
      }}
    >
      {children}
    </CryptoDataContext.Provider>
  );
};