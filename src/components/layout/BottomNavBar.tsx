
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Image, CreditCard, User, Sun, Moon, Settings } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/galleries', label: 'Galleries', icon: <Image className="w-5 h-5" /> },
    { path: '/subscriptions', label: 'Plans', icon: <CreditCard className="w-5 h-5" /> },
    { path: '/account', label: 'Account', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-2 px-4 z-30 transition-colors duration-300">
      <div className="flex justify-around">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center p-2 rounded-md transition-colors ${
              location.pathname === item.path 
                ? 'text-gallery-primary dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
            aria-label={item.label}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center p-2 rounded-md text-gray-600 dark:text-gray-400 transition-colors"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-5 h-5" />
              <span className="text-xs mt-1">Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-5 h-5" />
              <span className="text-xs mt-1">Light</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
};

export default BottomNavBar;
