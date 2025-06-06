import React, { useState, useEffect, useRef, useCallback } from 'react';
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

type SectionInfo = {
  id: string;
  title: string;
  bgClass: string;
  content: React.ReactNode;
};

function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const sectionsRef = useRef<HTMLElement[]>([]); // Будем хранить все секции сюда

  // Массив описаний секций (опционально, для удобства редактирования)
  const sections: SectionInfo[] = [
    {
      id: 'home',
      title: '',
      bgClass: 'bg-gradient-to-b from-gray-100 to-white dark:from-dark-700 dark:to-dark-800',
      content: (
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
            CryptoTracker
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300">
            Track cryptocurrency prices, manage your portfolio, and stay updated with the latest crypto news.
          </p>
        </div>
      ),
    },
    {
      id: 'prices',
      title: 'Real-Time Prices',
      bgClass: 'bg-white dark:bg-dark-800',
      content: <CryptoTable />,
    },
    {
      id: 'chart',
      title: 'Price Chart',
      bgClass: 'bg-gray-50 dark:bg-dark-700',
      content: <CryptoChart />,
    },
    {
      id: 'portfolio',
      title: 'Your Portfolio',
      bgClass: 'bg-white dark:bg-dark-800',
      content: <Portfolio />,
    },
    {
      id: 'news',
      title: 'Crypto News',
      bgClass: 'bg-gray-50 dark:bg-dark-700',
      content: <News />,
    },
  ];

  // Коллбек для определения активного раздела при скролле
  const handleScroll = useCallback(() => {
    if (sectionsRef.current.length === 0) return;

    let newActive = activeSection;
    const offsetMargin = 0.4 * window.innerHeight; 
    // определяем «точку интереса» примерно в 40% от верха экрана

    for (const sectionEl of sectionsRef.current) {
      const rect = sectionEl.getBoundingClientRect();
      if (rect.top <= offsetMargin && rect.bottom > offsetMargin) {
        newActive = sectionEl.id;
        break;
      }
    }

    if (newActive !== activeSection) {
      setActiveSection(newActive);
    }
  }, [activeSection]);

  useEffect(() => {
    // При монтировании сохраним все секции с атрибутом id в ref
    const els = Array.from(document.querySelectorAll('section[id]')) as HTMLElement[];
    sectionsRef.current = els;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    // Запустим один раз, чтобы сразу при загрузке выставить правильный activeSection
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [handleScroll]);

  return (
    <ThemeProvider>
      <PortfolioProvider>
        <CryptoDataProvider>
          <div className="flex flex-col min-h-screen">
            <Header activeSection={activeSection} />

            <main className="flex-grow">
              {sections.map(({ id, title, bgClass, content }) => (
                <section id={id} className={`section ${bgClass}`} key={id}>
                  <div className="container-custom">
                    {title && (
                      <h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>
                    )}
                    {content}
                  </div>
                </section>
              ))}
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
