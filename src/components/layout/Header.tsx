import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, BarChart2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  activeSection: string;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'prices', label: 'Prices' },
    { id: 'chart', label: 'Chart' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'news', label: 'News' }
  ];
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-dark-700/90 shadow-md backdrop-blur-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2">
            <BarChart2 className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
              CryptoTracker
            </span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`transition-colors duration-200 hover:text-primary-500 ${
                  activeSection === link.id 
                    ? 'text-primary-500 font-medium' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={closeMenu}
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          {/* Theme Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white dark:bg-dark-700 rounded-lg shadow-lg animate-fade-in-up">
            <nav className="flex flex-col space-y-4 px-4">
              {navLinks.map(link => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`py-2 px-4 rounded-md transition-colors duration-200 ${
                    activeSection === link.id 
                      ? 'bg-primary-50 dark:bg-dark-600 text-primary-500 font-medium' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600'
                  }`}
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;