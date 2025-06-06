import React, { useState } from 'react';
import { Plus, Trash2, Download, Upload, Edit2, Save, X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useCryptoData } from '../../context/CryptoDataContext';
import { CryptoAsset } from '../../types';
import { formatCurrency, getColorClass } from '../../utils/formatters';
import toast from 'react-hot-toast';

const Portfolio: React.FC = () => {
  const { 
    portfolio, 
    addToPortfolio, 
    removeFromPortfolio, 
    updatePortfolio,
    exportPortfolio,
    importPortfolio
  } = usePortfolio();
  
  const { coins } = useCryptoData();
  
  const [selectedCoin, setSelectedCoin] = useState<string>('');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');
  const [editPrice, setEditPrice] = useState<string>('');
  const [showImport, setShowImport] = useState<boolean>(false);
  const [importData, setImportData] = useState<string>('');

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCoin || !purchasePrice || !amount) {
      toast.error('Please fill all fields');
      return;
    }
    
    const coin = coins.find(c => c.id === selectedCoin);
    if (!coin) {
      toast.error('Invalid coin selected');
      return;
    }
    
    const newAsset: CryptoAsset = {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      purchasePrice: parseFloat(purchasePrice),
      amount: parseFloat(amount),
      currentPrice: coin.current_price
    };
    
    addToPortfolio(newAsset);
    toast.success(`Added ${coin.name} to portfolio`);
    
    // Reset form
    setSelectedCoin('');
    setPurchasePrice('');
    setAmount('');
  };

  const handleRemoveAsset = (id: string) => {
    removeFromPortfolio(id);
    toast.success('Asset removed from portfolio');
  };

  const startEditing = (asset: CryptoAsset) => {
    setEditingId(asset.id);
    setEditAmount(asset.amount.toString());
    setEditPrice(asset.purchasePrice.toString());
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditAmount('');
    setEditPrice('');
  };

  const saveEditing = (asset: CryptoAsset) => {
    if (!editAmount || !editPrice) {
      toast.error('Please fill all fields');
      return;
    }
    
    const updatedAsset: CryptoAsset = {
      ...asset,
      amount: parseFloat(editAmount),
      purchasePrice: parseFloat(editPrice)
    };
    
    updatePortfolio(updatedAsset);
    toast.success('Portfolio updated');
    cancelEditing();
  };

  const handleImportClick = () => {
    setShowImport(!showImport);
    setImportData('');
  };

  const handleImport = () => {
    if (!importData) {
      toast.error('Please paste JSON data');
      return;
    }
    
    try {
      const success = importPortfolio(importData);
      if (success) {
        toast.success('Portfolio imported successfully');
        setShowImport(false);
        setImportData('');
      } else {
        toast.error('Failed to import portfolio');
      }
    } catch (error) {
      toast.error('Invalid JSON data');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  // Calculate total portfolio value
  const calculateTotalValue = () => {
    return portfolio.reduce((total, asset) => {
      const currentPrice = coins.find(c => c.id === asset.id)?.current_price || asset.purchasePrice;
      return total + (asset.amount * currentPrice);
    }, 0);
  };

  const calculateTotalInvestment = () => {
    return portfolio.reduce((total, asset) => {
      return total + (asset.amount * asset.purchasePrice);
    }, 0);
  };

  const totalValue = calculateTotalValue();
  const totalInvestment = calculateTotalInvestment();
  const profitLoss = totalValue - totalInvestment;
  const profitLossPercentage = totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Value</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
        </div>
        
        <div className="card p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Investment</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalInvestment)}</p>
        </div>
        
        <div className="card p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Profit/Loss</h3>
          <div className="flex items-end space-x-2">
            <p className={`text-2xl font-bold ${getColorClass(profitLoss)}`}>
              {formatCurrency(profitLoss)}
            </p>
            <p className={`${getColorClass(profitLossPercentage)}`}>
              {profitLossPercentage > 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
      
      {/* Add Asset Form */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Add to Portfolio</h3>
        <form onSubmit={handleAddAsset} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="coin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Coin
              </label>
              <select
                id="coin"
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="input"
                required
              >
                <option value="">Select a coin</option>
                {coins.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Purchase Price (USD)
              </label>
              <input
                type="number"
                id="price"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="Enter purchase price"
                className="input"
                min="0"
                step="0.00000001"
                required
              />
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="input"
                min="0"
                step="0.00000001"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button type="submit" className="btn-primary flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span>Add to Portfolio</span>
            </button>
          </div>
        </form>
      </div>
      
      {/* Portfolio List */}
      <div className="card">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-600">
          <h3 className="text-lg font-semibold">Your Assets</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleImportClick}
              className="btn-outline flex items-center space-x-1 text-sm py-1"
            >
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </button>
            <button
              onClick={exportPortfolio}
              className="btn-outline flex items-center space-x-1 text-sm py-1"
              disabled={portfolio.length === 0}
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        {/* Import UI */}
        {showImport && (
          <div className="p-4 border-b border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-600">
            <h4 className="font-medium mb-2">Import Portfolio</h4>
            <div className="space-y-3">
              <div>
                <label htmlFor="fileUpload" className="block text-sm mb-1">Upload JSON File</label>
                <input
                  type="file"
                  id="fileUpload"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="input text-sm py-1.5"
                />
              </div>
              <div>
                <label htmlFor="jsonData" className="block text-sm mb-1">Or Paste JSON Data</label>
                <textarea
                  id="jsonData"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder='[{"id": "bitcoin", "name": "Bitcoin", ...}]'
                  className="input min-h-24 text-sm"
                />
              </div>
              <div className="flex space-x-2">
                <button onClick={handleImport} className="btn-primary text-sm">Import</button>
                <button onClick={() => setShowImport(false)} className="btn-outline text-sm">Cancel</button>
              </div>
            </div>
          </div>
        )}
        
        {portfolio.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Your portfolio is empty. Add some assets to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="crypto-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Amount</th>
                  <th>Purchase Price</th>
                  <th>Current Price</th>
                  <th>Value</th>
                  <th>Profit/Loss</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((asset) => {
                  const currentPrice = coins.find(c => c.id === asset.id)?.current_price || asset.purchasePrice;
                  const value = asset.amount * currentPrice;
                  const cost = asset.amount * asset.purchasePrice;
                  const profitLoss = value - cost;
                  const profitLossPercentage = cost > 0 ? (profitLoss / cost) * 100 : 0;
                  
                  return (
                    <tr key={asset.id} className="animate-fade-in-up">
                      <td>
                        <div className="flex items-center space-x-2">
                          <img src={asset.image} alt={asset.name} className="w-6 h-6" />
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{asset.symbol.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {editingId === asset.id ? (
                          <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="input py-1 text-sm"
                            min="0"
                            step="0.00000001"
                          />
                        ) : (
                          asset.amount
                        )}
                      </td>
                      <td>
                        {editingId === asset.id ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="input py-1 text-sm"
                            min="0"
                            step="0.00000001"
                          />
                        ) : (
                          formatCurrency(asset.purchasePrice)
                        )}
                      </td>
                      <td>{formatCurrency(currentPrice)}</td>
                      <td>{formatCurrency(value)}</td>
                      <td>
                        <div className={getColorClass(profitLoss)}>
                          <div>{formatCurrency(profitLoss)}</div>
                          <div className="text-xs">
                            {profitLossPercentage > 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%
                          </div>
                        </div>
                      </td>
                      <td>
                        {editingId === asset.id ? (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => saveEditing(asset)}
                              className="p-1 text-green-500 hover:text-green-600"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-1 text-gray-500 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => startEditing(asset)}
                              className="p-1 text-gray-500 hover:text-gray-600"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveAsset(asset.id)}
                              className="p-1 text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;