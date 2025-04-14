
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Home, 
  Image, 
  CreditCard, 
  User, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  ImagePlus,
  Heart,
  Settings,
  Sun,
  Moon,
  PanelRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const SideNavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isHighContrast, toggleHighContrast } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/galleries', label: 'Galleries', icon: <Image className="w-5 h-5" /> },
    { path: '/favorites', label: 'Favorites', icon: <Heart className="w-5 h-5" /> },
    { path: '/uploads', label: 'My Uploads', icon: <ImagePlus className="w-5 h-5" /> },
    { path: '/subscriptions', label: 'Subscriptions', icon: <CreditCard className="w-5 h-5" /> },
    { path: '/account', label: 'Account', icon: <User className="w-5 h-5" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside 
      className={`hidden md:flex flex-col transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-30 h-[calc(100vh-4rem)] sticky top-16 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        <div className="py-4">
          {navItems.map(item => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-3 py-3 mb-1 mx-2 rounded-md transition-colors duration-200
                    ${location.pathname === item.path 
                      ? 'bg-gallery-primary text-white dark:bg-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                  aria-label={item.label}
                >
                  {item.icon}
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
          
          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTheme}
                className={`
                  flex items-center px-3 py-3 mb-1 mx-2 rounded-md text-gray-600 hover:bg-gray-100 
                  dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
                {!isCollapsed && <span className="ml-3">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</p>
              </TooltipContent>
            )}
          </Tooltip>
          
          {/* High Contrast Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleHighContrast}
                className={`
                  flex items-center px-3 py-3 mb-1 mx-2 rounded-md hover:bg-gray-100 
                  dark:hover:bg-gray-800 transition-colors duration-200
                  ${isHighContrast ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                aria-label={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
              >
                <PanelRight className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">{isHighContrast ? 'Standard View' : 'High Contrast'}</span>}
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>{isHighContrast ? 'Standard View' : 'High Contrast'}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => logout()}
          className={`
            flex items-center px-3 py-3 w-full rounded-md text-red-500 hover:bg-red-50
            dark:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-200
            ${isCollapsed ? 'justify-center' : ''}
          `}
          aria-label="Log out"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Log out</span>}
        </button>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-white dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>
    </aside>
  );
};

export default SideNavBar;
