import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CryptoAsset } from '../types';

interface PortfolioContextType {
  portfolio: CryptoAsset[];
  addToPortfolio: (asset: CryptoAsset) => void;
  removeFromPortfolio: (id: string) => void;
  updatePortfolio: (updatedAsset: CryptoAsset) => void;
  exportPortfolio: () => void;
  importPortfolio: (jsonData: string) => boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

interface PortfolioProviderProps {
  children: ReactNode;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<CryptoAsset[]>(() => {
    const savedPortfolio = localStorage.getItem('cryptoPortfolio');
    return savedPortfolio ? JSON.parse(savedPortfolio) : [];
  });

  useEffect(() => {
    localStorage.setItem('cryptoPortfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const addToPortfolio = (asset: CryptoAsset) => {
    // Check if asset already exists
    const existingAssetIndex = portfolio.findIndex(
      item => item.id === asset.id
    );

    if (existingAssetIndex >= 0) {
      // Update existing asset
      const updatedPortfolio = [...portfolio];
      const existingAsset = updatedPortfolio[existingAssetIndex];
      
      updatedPortfolio[existingAssetIndex] = {
        ...existingAsset,
        amount: existingAsset.amount + asset.amount,
      };
      
      setPortfolio(updatedPortfolio);
    } else {
      // Add new asset
      setPortfolio(prevPortfolio => [...prevPortfolio, asset]);
    }
  };

  const removeFromPortfolio = (id: string) => {
    setPortfolio(prevPortfolio => 
      prevPortfolio.filter(asset => asset.id !== id)
    );
  };

  const updatePortfolio = (updatedAsset: CryptoAsset) => {
    setPortfolio(prevPortfolio => 
      prevPortfolio.map(asset => 
        asset.id === updatedAsset.id ? updatedAsset : asset
      )
    );
  };

  const exportPortfolio = () => {
    const dataStr = JSON.stringify(portfolio, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `crypto-portfolio-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importPortfolio = (jsonData: string): boolean => {
    try {
      const parsedData = JSON.parse(jsonData);
      
      if (!Array.isArray(parsedData)) {
        throw new Error('Invalid portfolio data format');
      }
      
      // Validate each asset
      parsedData.forEach(asset => {
        if (!asset.id || !asset.name || !asset.symbol || !asset.purchasePrice || !asset.amount) {
          throw new Error('Invalid asset data');
        }
      });
      
      setPortfolio(parsedData);
      return true;
    } catch (error) {
      console.error('Error importing portfolio:', error);
      return false;
    }
  };

  return (
    <PortfolioContext.Provider 
      value={{ 
        portfolio, 
        addToPortfolio, 
        removeFromPortfolio, 
        updatePortfolio,
        exportPortfolio,
        importPortfolio
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};