import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { useCryptoData } from '../../context/CryptoDataContext';
import { Loader, Search } from 'lucide-react';
import { TimeRange } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const timeRangeOptions: { value: TimeRange; label: string; days: string }[] = [
  { value: '24h', label: '24h', days: '1' },
  { value: '7d', label: '7d', days: '7' },
  { value: '30d', label: '30d', days: '30' },
  { value: '90d', label: '3m', days: '90' },
  { value: '1y', label: '1y', days: '365' },
  { value: 'all', label: 'All', days: 'max' }
];

const CryptoChart: React.FC = () => {
  const { 
    coins, 
    selectedCoin, 
    setSelectedCoin, 
    timeRange, 
    setTimeRange, 
    getHistoricalData 
  } = useCryptoData();
  
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const [showMarketCap, setShowMarketCap] = useState<boolean>(false);
  
  useEffect(() => {
    if (!selectedCoin && coins.length > 0) {
      setSelectedCoin(coins[0]);
    }
  }, [coins, selectedCoin, setSelectedCoin]);
  
  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!selectedCoin) return;
      
      try {
        setLoading(true);
        const currentTimeRange = timeRangeOptions.find(option => option.value === timeRange);
        
        if (!currentTimeRange) return;
        
        const data = await getHistoricalData(selectedCoin.id, currentTimeRange.days);
        
        if (!data || !data.prices) return;
        
        // Format timestamps and prices for the chart
        const formattedData = {
          labels: data.prices.map((item: [number, number]) => {
            const date = new Date(item[0]);
            if (timeRange === '24h') {
              return format(date, 'HH:mm');
            } else if (timeRange === '7d') {
              return format(date, 'EEE');
            } else {
              return format(date, 'MMM dd');
            }
          }),
          datasets: [
            {
              label: 'Price',
              data: data.prices.map((item: [number, number]) => item[1]),
              borderColor: 'rgba(0, 115, 245, 1)',
              backgroundColor: 'rgba(0, 115, 245, 0.1)',
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 4
            }
          ]
        };
        
        // Add volume dataset if available and selected
        if (showVolume && data.total_volumes) {
          formattedData.datasets.push({
            label: 'Volume',
            data: data.total_volumes.map((item: [number, number]) => item[1]),
            borderColor: 'rgba(0, 255, 185, 1)',
            backgroundColor: 'rgba(0, 255, 185, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            yAxisID: 'y1'
          });
        }
        
        // Add market cap dataset if available and selected
        if (showMarketCap && data.market_caps) {
          formattedData.datasets.push({
            label: 'Market Cap',
            data: data.market_caps.map((item: [number, number]) => item[1]),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            yAxisID: 'y2'
          });
        }
        
        setChartData(formattedData);
      } catch (error) {
        console.error('Failed to fetch historical data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistoricalData();
  }, [selectedCoin, timeRange, getHistoricalData, showVolume, showMarketCap]);
  
  const handleCoinSelect = (coinId: string) => {
    const selected = coins.find(coin => coin.id === coinId);
    if (selected) {
      setSelectedCoin(selected);
      setShowSearch(false);
    }
  };
  
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };
  
  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        position: 'left' as const,
        grid: {
          color: 'rgba(200, 200, 200, 0.1)',
        },
        ticks: {
          callback: (value: any) => {
            return `$${Number(value).toFixed(2)}`;
          },
        },
      },
      ...(showVolume && {
        y1: {
          position: 'right' as const,
          grid: {
            display: false,
          },
          ticks: {
            callback: (value: any) => {
              if (value >= 1000000000) {
                return `$${(value / 1000000000).toFixed(1)}B`;
              } else if (value >= 1000000) {
                return `$${(value / 1000000).toFixed(1)}M`;
              } else if (value >= 1000) {
                return `$${(value / 1000).toFixed(1)}K`;
              }
              return `$${value}`;
            },
          },
        },
      }),
      ...(showMarketCap && {
        y2: {
          position: 'right' as const,
          grid: {
            display: false,
          },
          ticks: {
            callback: (value: any) => {
              if (value >= 1000000000) {
                return `$${(value / 1000000000).toFixed(1)}B`;
              } else if (value >= 1000000) {
                return `$${(value / 1000000).toFixed(1)}M`;
              }
              return `$${value}`;
            },
          },
        },
      }),
    },
  };
  
  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="card p-6">
      {/* Coin selection */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-64">
          {showSearch ? (
            <div className="relative">
              <input
                type="text"
                className="input pr-10"
                placeholder="Search coins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <button
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setShowSearch(false)}
              >
                <Search className="h-5 w-5" />
              </button>
              
              {searchTerm && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-dark-600 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredCoins.length === 0 ? (
                    <div className="p-2 text-gray-500">No coins found</div>
                  ) : (
                    filteredCoins.map(coin => (
                      <div
                        key={coin.id}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 cursor-pointer flex items-center space-x-2"
                        onClick={() => handleCoinSelect(coin.id)}
                      >
                        <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                        <span>{coin.name}</span>
                        <span className="text-gray-500 text-sm">({coin.symbol.toUpperCase()})</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : (
            <div 
              className="flex items-center space-x-2 p-2 border border-gray-300 dark:border-dark-500 rounded-md cursor-pointer hover:border-primary-500 dark:hover:border-primary-400"
              onClick={() => setShowSearch(true)}
            >
              {selectedCoin && (
                <>
                  <img src={selectedCoin.image} alt={selectedCoin.name} className="w-6 h-6" />
                  <span className="font-medium">{selectedCoin.name}</span>
                  <span className="text-gray-500">({selectedCoin.symbol.toUpperCase()})</span>
                </>
              )}
              <Search className="h-4 w-4 ml-auto text-gray-500" />
            </div>
          )}
        </div>
        
        {/* Time range selector */}
        <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto">
          {timeRangeOptions.map(option => (
            <button
              key={option.value}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                timeRange === option.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-500'
              }`}
              onClick={() => handleTimeRangeChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-80">
        {loading ? (
          <div className="h-full flex justify-center items-center">
            <Loader className="animate-spin h-8 w-8 text-primary-500" />
          </div>
        ) : chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="h-full flex justify-center items-center text-gray-500">
            No data available
          </div>
        )}
      </div>
      
      {/* Data options */}
      <div className="mt-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showVolume"
            checked={showVolume}
            onChange={() => setShowVolume(!showVolume)}
            className="rounded text-primary-500 focus:ring-primary-500"
          />
          <label htmlFor="showVolume" className="text-sm">Show Volume</label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showMarketCap"
            checked={showMarketCap}
            onChange={() => setShowMarketCap(!showMarketCap)}
            className="rounded text-primary-500 focus:ring-primary-500"
          />
          <label htmlFor="showMarketCap" className="text-sm">Show Market Cap</label>
        </div>
      </div>
    </div>
  );
};

export default CryptoChart;