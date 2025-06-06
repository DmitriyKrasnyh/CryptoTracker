import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { useCryptoData } from '../../context/CryptoDataContext';
import { formatCurrency, formatPercentage, formatLargeNumber, getColorClass } from '../../utils/formatters';

interface CoinModalProps {
  onClose: () => void;
}

const CoinModal: React.FC<CoinModalProps> = ({ onClose }) => {
  const { selectedCoin } = useCryptoData();
  
  if (!selectedCoin) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white dark:bg-dark-700 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-dark-600 p-4">
          <div className="flex items-center space-x-3">
            <img src={selectedCoin.image} alt={selectedCoin.name} className="w-10 h-10" />
            <div>
              <h3 className="text-xl font-bold">{selectedCoin.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{selectedCoin.symbol.toUpperCase()}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Price information */}
          <div className="space-y-2">
            <div className="flex items-end space-x-2">
              <span className="text-2xl font-bold">{formatCurrency(selectedCoin.current_price)}</span>
              <span className={`${getColorClass(selectedCoin.price_change_percentage_24h)}`}>
                {formatPercentage(selectedCoin.price_change_percentage_24h)} (24h)
              </span>
            </div>
          </div>
          
          {/* Market information */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
              <p className="font-medium">{formatLargeNumber(selectedCoin.market_cap)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Volume (24h)</p>
              <p className="font-medium">{formatLargeNumber(selectedCoin.total_volume)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap Rank</p>
              <p className="font-medium">#{selectedCoin.market_cap_rank}</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex space-x-3 pt-2">
            <a 
              href={`https://www.coingecko.com/en/coins/${selectedCoin.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-outline flex items-center space-x-1 flex-1 justify-center"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View on CoinGecko</span>
            </a>
            <a 
              href="#portfolio" 
              onClick={(e) => {
                e.preventDefault();
                onClose();
                document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-primary flex-1"
            >
              Add to Portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinModal;