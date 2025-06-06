import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Loader } from 'lucide-react';
import { useCryptoData } from '../../context/CryptoDataContext';
import { formatCurrency, formatPercentage, formatLargeNumber, getColorClass } from '../../utils/formatters';
import Sparkline from './Sparkline';
import CoinModal from './CoinModal';

const CryptoTable: React.FC = () => {
  const { coins, loading, error, setSelectedCoin } = useCryptoData();
  const [sortBy, setSortBy] = useState<string>('market_cap_rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const sortedCoins = [...coins].filter(coin => {
    return coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());
  }).sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const handleCoinClick = (coin: any) => {
    setSelectedCoin(coin);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <p>Unable to load cryptocurrency data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          className="input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="crypto-table">
          <thead>
            <tr>
              <th 
                className="cursor-pointer hover:text-primary-500"
                onClick={() => handleSort('market_cap_rank')}
              >
                <div className="flex items-center space-x-1">
                  <span>#</span>
                  {sortBy === 'market_cap_rank' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th>Coin</th>
              <th 
                className="cursor-pointer hover:text-primary-500"
                onClick={() => handleSort('current_price')}
              >
                <div className="flex items-center space-x-1">
                  <span>Price</span>
                  {sortBy === 'current_price' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className="cursor-pointer hover:text-primary-500"
                onClick={() => handleSort('price_change_percentage_24h')}
              >
                <div className="flex items-center space-x-1">
                  <span>24h %</span>
                  {sortBy === 'price_change_percentage_24h' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className="cursor-pointer hover:text-primary-500 hidden md:table-cell"
                onClick={() => handleSort('market_cap')}
              >
                <div className="flex items-center space-x-1">
                  <span>Market Cap</span>
                  {sortBy === 'market_cap' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className="cursor-pointer hover:text-primary-500 hidden md:table-cell"
                onClick={() => handleSort('total_volume')}
              >
                <div className="flex items-center space-x-1">
                  <span>Volume (24h)</span>
                  {sortBy === 'total_volume' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th className="hidden lg:table-cell">Last 7d</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <div className="flex justify-center items-center space-x-2">
                    <Loader className="animate-spin h-5 w-5 text-primary-500" />
                    <span>Loading crypto data...</span>
                  </div>
                </td>
              </tr>
            ) : sortedCoins.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  No cryptocurrencies found matching your search criteria.
                </td>
              </tr>
            ) : (
              sortedCoins.map((coin) => (
                <tr 
                  key={coin.id} 
                  className="hover:bg-gray-100 dark:hover:bg-dark-600 cursor-pointer transition-colors duration-200 animate-fade-in-up"
                  onClick={() => handleCoinClick(coin)}
                >
                  <td>{coin.market_cap_rank}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-medium">{formatCurrency(coin.current_price)}</td>
                  <td className={`font-medium ${getColorClass(coin.price_change_percentage_24h)}`}>
                    <div className="flex items-center space-x-1">
                      {coin.price_change_percentage_24h > 0 ? (
                        <ArrowUp size={14} />
                      ) : coin.price_change_percentage_24h < 0 ? (
                        <ArrowDown size={14} />
                      ) : null}
                      <span>{formatPercentage(coin.price_change_percentage_24h)}</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">{formatLargeNumber(coin.market_cap)}</td>
                  <td className="hidden md:table-cell">{formatLargeNumber(coin.total_volume)}</td>
                  <td className="hidden lg:table-cell">
                    {coin.sparkline_in_7d?.price && (
                      <Sparkline 
                        data={coin.sparkline_in_7d.price} 
                        color={coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'} 
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && <CoinModal onClose={closeModal} />}
    </div>
  );
};

export default CryptoTable;