import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CryptoTable from './components/crypto/CryptoTable';
import CryptoChart from './components/crypto/CryptoChart';
import Portfolio from './components/crypto/Portfolio';
import News from './components/crypto/News';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { CryptoDataProvider } from './context/CryptoDataContext';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      
      let currentSection = 'home';
      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          currentSection = section.getAttribute('id') || 'home';
        }
      });
      
      setActiveSection(currentSection);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <ThemeProvider>
      <PortfolioProvider>
        <CryptoDataProvider>
          <div className="flex flex-col min-h-screen">
            <Header activeSection={activeSection} />
            
            <main className="flex-grow">
              <section id="home" className="section bg-gradient-to-b from-gray-100 to-white dark:from-dark-700 dark:to-dark-800">
                <div className="container-custom">
                  <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
                      CryptoTracker
                    </h1>
                    <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300">
                      Track cryptocurrency prices, manage your portfolio, and stay updated with the latest crypto news.
                    </p>
                  </div>
                </div>
              </section>
              
              <section id="prices" className="section bg-white dark:bg-dark-800">
                <div className="container-custom">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Real-Time Prices</h2>
                  <CryptoTable />
                </div>
              </section>
              
              <section id="chart" className="section bg-gray-50 dark:bg-dark-700">
                <div className="container-custom">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Price Chart</h2>
                  <CryptoChart />
                </div>
              </section>
              
              <section id="portfolio" className="section bg-white dark:bg-dark-800">
                <div className="container-custom">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Your Portfolio</h2>
                  <Portfolio />
                </div>
              </section>
              
              <section id="news" className="section bg-gray-50 dark:bg-dark-700">
                <div className="container-custom">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Crypto News</h2>
                  <News />
                </div>
              </section>
            </main>
            
            <Footer />
            <Toaster position="bottom-right" />
          </div>
        </CryptoDataProvider>
      </PortfolioProvider>
    </ThemeProvider>
  );
}

export default App;