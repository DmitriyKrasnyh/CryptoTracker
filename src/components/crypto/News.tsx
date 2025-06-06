import React, { useState, useEffect } from 'react';
import { Clock, ExternalLink, Loader } from 'lucide-react';
import { fetchCryptoNews } from '../../utils/api';
import { formatDateTime } from '../../utils/formatters';
import { NewsItem } from '../../types';
import toast from 'react-hot-toast';

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const newsData = await fetchCryptoNews();
        setNews(newsData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch news:', err);
        setError('Failed to load news data');
        toast.error('Failed to load news data');
      } finally {
        setLoading(false);
      }
    };

    loadNews();

    // Refresh news every 15 minutes
    const intervalId = setInterval(loadNews, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="flex justify-center items-center space-x-2">
          <Loader className="animate-spin h-5 w-5 text-primary-500" />
          <span>Loading news...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-500 mb-2">{error}</p>
        <p className="text-gray-500">Unable to load crypto news. Please try again later.</p>
      </div>
    );
  }

  // Display only the first 5 news items
  const displayedNews = news.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {displayedNews.map((item) => (
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            key={item.id}
            className="card hover:shadow-lg transition-shadow duration-200 overflow-hidden block"
          >
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2 hover:text-primary-500 transition-colors duration-200">
                {item.title}
              </h3>
              
              {item.summary && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {item.summary}
                </p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDateTime(item.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>{item.source}</span>
                  <ExternalLink className="h-4 w-4" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
      
      <div className="text-center">
        <a 
          href="https://cointelegraph.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-outline inline-flex items-center space-x-1"
        >
          <span>Show More News</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default News;