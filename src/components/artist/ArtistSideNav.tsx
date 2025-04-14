
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Upload, Image, Images, Settings, LogOut } from 'lucide-react';

const ArtistSideNav: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { 
      path: '/artist/dashboard', 
      label: 'Dashboard', 
      icon: <Image className="w-5 h-5" /> 
    },
    { 
      path: '/artist/upload', 
      label: 'Upload Images', 
      icon: <Upload className="w-5 h-5" /> 
    },
    { 
      path: '/artist/galleries', 
      label: 'Manage Galleries', 
      icon: <Images className="w-5 h-5" /> 
    },
    { 
      path: '/artist/settings', 
      label: 'Account Settings', 
      icon: <Settings className="w-5 h-5" /> 
    },
  ];
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="h-full flex flex-col bg-white border-r">
      <div className="p-4">
        <h2 className="font-semibold text-lg">Artist Portal</h2>
      </div>
      
      <Separator />
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className={`w-full justify-start ${
              location.pathname === item.path 
                ? 'bg-gallery-primary/10 text-gallery-primary' 
                : ''
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="ml-2">{item.label}</span>
          </Button>
        ))}
      </nav>
      
      <div className="p-4 mt-auto">
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ArtistSideNav;
