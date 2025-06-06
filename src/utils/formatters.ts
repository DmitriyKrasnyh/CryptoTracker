import { format } from 'date-fns';

// Format currency
export const formatCurrency = (value: number, currency: string = 'USD', maximumFractionDigits: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits
  }).format(value);
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

// Format large numbers (e.g., market cap)
export const formatLargeNumber = (value: number): string => {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  return value.toString();
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
};

// Format time
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'h:mm a');
};

// Format date and time
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy h:mm a');
};

// Get color based on value (for price changes)
export const getColorClass = (value: number): string => {
  if (value > 0) {
    return 'text-green-500';
  } else if (value < 0) {
    return 'text-red-500';
  }
  return 'text-gray-500';
};

// Generate sparkline data points
export const generateSparklineData = (prices: number[]): string => {
  if (!prices || prices.length === 0) {
    return '';
  }
  
  // Normalize prices to 0-1 range for sparkline
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min;
  
  // Prevent division by zero
  if (range === 0) {
    return '';
  }
  
  const normalized = prices.map(price => (price - min) / range);
  
  // Convert to SVG path
  const width = 100;
  const height = 30;
  const points = normalized.map((price, index) => {
    const x = (index / (normalized.length - 1)) * width;
    const y = height - (price * height);
    return `${x},${y}`;
  });
  
  return `M${points.join(' L')}`;
};