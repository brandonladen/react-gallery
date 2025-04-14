
import React, { useEffect, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import TopNavBar from './TopNavBar';
import SideNavBar from './SideNavBar';
import BottomNavBar from './BottomNavBar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { theme, isHighContrast } = useTheme();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);

  // Update sidebar visibility based on authentication and route
  useEffect(() => {
    if (isAuthenticated && !['/login', '/register'].includes(location.pathname)) {
      setShowSidebar(true);
    } else {
      setShowSidebar(false);
    }
  }, [isAuthenticated, location]);

  return (
    <div className={`flex flex-col min-h-screen transition-all duration-300 animate-theme-fade ${
      theme === 'dark' ? 'bg-background text-foreground' : ''
    } ${isHighContrast ? 'high-contrast' : ''}`}>
      <TopNavBar />
      
      <div className="flex flex-1">
        {showSidebar && <SideNavBar />}
        
        <main className={`flex-1 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-background text-foreground' : ''
        } ${showSidebar ? 'md:ml-0' : ''}`}>
          <div className="container mx-auto px-4 py-4 pb-16 md:pb-4 min-h-[calc(100vh-4rem)]">
            <Outlet />
          </div>
        </main>
      </div>
      
      {isAuthenticated && <BottomNavBar />}
      
      {/* Toast notifications */}
      <Toaster />
      <SonnerToaster 
        position="top-right"
        toastOptions={{
          className: 'border border-border',
          style: { 
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)'
          }
        }} 
      />
    </div>
  );
};

export default MainLayout;
